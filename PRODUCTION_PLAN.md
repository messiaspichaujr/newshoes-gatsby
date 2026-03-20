# Production Readiness Plan

## Current State

- Gatsby 5 frontend running in `develop` mode (not production build)
- Strapi 5 CMS running in `develop` mode with SQLite
- No HTTPS, no reverse proxy
- Secrets hardcoded in `docker-compose.yml` with weak defaults
- No tests, no CI/CD, no monitoring
- No mechanism to rebuild Gatsby when Strapi content changes
- Strapi admin panel publicly accessible
- Legacy WordPress/MariaDB code still in `services/backend/`

---

## Phase 1: Critical — Must-Have Before Deploy

### 1.1 Secrets Management

**Problem:** `STRAPI_TOKEN` is in plaintext in `docker-compose.yml`. Strapi secrets use weak defaults like `strapiTokenSalt123`.

**Action:**
- Create `.env` at project root with all secrets (git-ignored)
- Generate strong values: `openssl rand -base64 32` for each
- Update `docker-compose.yml` to use `${VAR}` without default fallbacks
- Create `.env.example` with placeholder values for documentation
- Add `.env` to `.gitignore`
- Rotate the currently exposed `STRAPI_TOKEN` — it is in git history

**Variables to move to `.env`:**
```
STRAPI_TOKEN=
STRAPI_APP_KEYS=
STRAPI_API_TOKEN_SALT=
STRAPI_ADMIN_JWT_SECRET=
STRAPI_TRANSFER_TOKEN_SALT=
STRAPI_JWT_SECRET=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
```

**Files affected:** `docker-compose.yml`, new `.env`, new `.env.example`, `.gitignore`

---

### 1.2 SQLite to PostgreSQL

**Problem:** SQLite is file-based, doesn't handle concurrent writes, has no replication, and lives in a Docker volume that is easily lost.

**Action:**
- Add `postgres:16-alpine` service to `docker-compose.yml` with named volume
- Add environment variables to strapi service: `DATABASE_CLIENT=postgres`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- Strapi's `config/database.ts` already supports postgres via env vars — no code change needed
- Replace `better-sqlite3` with `pg` in `services/strapi/package.json`
- Add health check: `pg_isready -U ${POSTGRES_USER}`
- Add `depends_on` with `condition: service_healthy` on strapi service
- Seed script (`src/seed.ts`) is idempotent (checks count before inserting) — it will auto-populate the new database

**Files affected:** `docker-compose.yml`, `services/strapi/package.json`

---

### 1.3 Strapi Production Mode

**Problem:** Strapi runs `npm run develop` which enables hot reload, admin panel rebuilding, and development endpoints.

**Action:**
- Change CMD in `services/strapi/Dockerfile` from `npm run develop` to `npm run start`
- The Dockerfile already runs `npm run build` during image build, so the admin panel is pre-built
- Set `NODE_ENV=production` in the strapi environment in `docker-compose.yml`
- Rename current Dockerfile to `Dockerfile.dev` for local development
- Create `docker-compose.dev.yml` override that uses `Dockerfile.dev` and volume mounts for hot reload

**Files affected:** `services/strapi/Dockerfile`, new `services/strapi/Dockerfile.dev`, `docker-compose.yml`, new `docker-compose.dev.yml`

---

### 1.4 Gatsby Production Build

**Problem:** Frontend Dockerfile runs `gatsby develop` (slow, unoptimized, exposes dev tools). Gatsby is a static site generator — production should serve pre-built HTML/CSS/JS from nginx.

**Action:**
- Create multi-stage production Dockerfile for frontend:
  ```
  Stage 1 (builder): node:18-alpine
    - npm ci --legacy-peer-deps
    - Receive STRAPI_API_URL and STRAPI_TOKEN as build args
    - Run gatsby build (fetches from Strapi at build time via gatsby-node.js)

  Stage 2 (server): nginx:alpine
    - Copy public/ from builder into /usr/share/nginx/html
    - Add nginx.conf with SPA routing, gzip, cache headers
  ```
- Rename current Dockerfile to `Dockerfile.dev`
- Add `services/frontend/nginx.conf` with:
  - `try_files $uri $uri/ /index.html` for client-side routing
  - Gzip compression for HTML/CSS/JS/JSON
  - Long cache TTL for `/static/*` (content-hashed by Gatsby)
  - Short cache TTL for HTML files
- **Build dependency:** Gatsby build needs Strapi running and seeded. Options:
  - Build frontend image separately after Strapi is up (recommended)
  - Use a builder service in docker-compose that waits for Strapi health check

**Files affected:** `services/frontend/Dockerfile`, new `services/frontend/Dockerfile.dev`, new `services/frontend/nginx.conf`, `docker-compose.yml`

---

### 1.5 HTTPS / Reverse Proxy

**Problem:** No SSL. Strapi admin credentials and API tokens travel in plaintext.

**Action:**
- Add Caddy as reverse proxy service (auto-provisions Let's Encrypt)
- Routing:
  - `newshoes.com` → frontend (nginx static)
  - `cms.newshoes.com` → Strapi
- Create `Caddyfile` at project root:
  ```
  newshoes.com {
    reverse_proxy frontend:80
  }
  cms.newshoes.com {
    reverse_proxy strapi:1337
  }
  ```
- Remove direct port exposures for strapi and frontend from docker-compose
- Only Caddy exposes ports 80 and 443

**Files affected:** `docker-compose.yml`, new `Caddyfile`

---

### 1.6 Restrict Strapi Admin

**Problem:** Strapi admin panel is an attack surface if publicly accessible.

**Action:**
- Do not expose Strapi port to host — access only through reverse proxy
- IP-restrict `/admin` in Caddyfile to known admin IPs or VPN
- Alternatively, use Caddy's `basicauth` directive as an extra layer on the admin path

**Files affected:** `Caddyfile`

---

## Phase 2: Important — Should Have Soon After Deploy

### 2.1 Strapi Content Change → Gatsby Rebuild (Webhook)

**Problem:** When franchise locations are added/edited in Strapi, the Gatsby static site is stale until manually rebuilt.

**Action — Option A (Simple, recommended for this project):**
- Create a `services/rebuild` lightweight service (Node or shell script) that:
  - Listens on an HTTP endpoint (e.g., port 9000)
  - On POST request, runs `gatsby build` inside the frontend builder image
  - Copies the built `public/` directory to a shared volume that nginx serves
  - Implements a 30-second debounce to avoid build storms from rapid edits
- Configure Strapi webhook (Admin → Settings → Webhooks):
  - URL: `http://rebuild:9000/rebuild`
  - Events: `entry.create`, `entry.update`, `entry.delete`, `entry.publish`, `entry.unpublish`
  - Content types: Unidade
- The rebuild works because `gatsby-node.js` `sourceNodes` fetches fresh data from Strapi REST API at build time

**Action — Option B (CI/CD-based, better for scale):**
- Strapi webhook calls GitHub Actions API to trigger a workflow
- Workflow builds Gatsby, pushes new Docker image, deploys
- Better audit trail but more infrastructure

**Shared volume approach for Option A:**
```
volumes:
  frontend_build:/usr/share/nginx/html
```
Both the rebuild service and the nginx frontend mount this volume.

**Files affected:** new `services/rebuild/`, `docker-compose.yml`, Strapi admin config

---

### 2.2 Docker Health Checks

**Action:**
- Add to all services in `docker-compose.yml`:
  ```yaml
  postgres:
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  strapi:
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:1337/_health"]
      interval: 10s
      timeout: 5s
      retries: 5
    depends_on:
      postgres:
        condition: service_healthy

  frontend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/"]
      interval: 10s
      timeout: 5s
      retries: 3
  ```

**Files affected:** `docker-compose.yml`

---

### 2.3 Testing Strategy

**Priority 1 — Build smoke test (highest value, lowest effort):**
- Running `gatsby build` validates all pages generate, all GraphQL queries resolve, and no SSR errors occur
- Add as first CI step

**Priority 2 — Component tests:**
- Framework: `@testing-library/react` + `jest` (Gatsby has official jest setup)
- Install: `jest`, `babel-jest`, `@testing-library/react`, `@testing-library/jest-dom`, `react-test-renderer`, `identity-obj-proxy` (for CSS modules)
- Add `jest.config.js` and `jest.setup.js` to `services/frontend/`
- Components to test first:
  - `FranchiseLocator.jsx` — renders franchise data, filters by state, shows correct count
  - `FranchiseForm.jsx` — form validation, required fields
  - `LanguageSwitcher.jsx` — renders language options, switching works
- Mock `useTranslation` from `react-i18next` and `useStaticQuery`/`graphql` from `gatsby`

**Priority 3 — Strapi API tests:**
- Simple integration tests hitting `/api/unidades` endpoint
- Validate response shape, pagination, locale filtering
- Run against a Strapi test instance with SQLite (fast, disposable)

**Priority 4 — E2E tests:**
- Framework: Playwright (better multi-browser support than Cypress)
- Critical flows:
  - Homepage loads, all sections render
  - Franchise locator shows locations, state filter works
  - Language switcher changes content
  - Individual unidade page loads at `/unidades/{slug}`
  - 3D shoe viewer doesn't crash (WebGL fallback)

**Files affected:** `services/frontend/package.json`, new `services/frontend/jest.config.js`, new `services/frontend/jest.setup.js`, new `services/frontend/src/__tests__/`

---

### 2.4 CI/CD Pipeline

**Action:**
- Create `.github/workflows/deploy.yml`:
  ```
  On push to master:
    1. Lint (prettier --check)
    2. Start Strapi with SQLite (for build-time data fetching)
    3. Run jest tests
    4. Run gatsby build (validates SSR + queries)
    5. Build Docker images
    6. Push to container registry
    7. Deploy: SSH into server, pull images, docker compose up -d
  ```
- For Gatsby build in CI: run Strapi with SQLite as a service container, seed data populates automatically
- Add branch protection: require CI pass before merge to master

**Files affected:** new `.github/workflows/deploy.yml`

---

### 2.5 Error Tracking

**Action:**
- Frontend: Install `@sentry/gatsby`, configure in `gatsby-config.js`
  - Catches client-side JS errors
  - Critical for Three.js/WebGL components (`Hero.jsx`, `Shoe3D.jsx`) that can fail on devices without GPU/WebGL support
  - Also catches i18n missing key errors
- Strapi: Install `@sentry/node`, configure in `src/index.ts` bootstrap
  - Catches API errors, database errors, webhook failures

**Files affected:** `services/frontend/package.json`, `services/frontend/gatsby-config.js`, `services/strapi/package.json`, `services/strapi/src/index.ts`

---

### 2.6 Backup Strategy

**PostgreSQL:**
- Schedule daily `pg_dump` via cron in a sidecar container or host crontab
- Store backups in S3-compatible storage or a mounted backup volume
- Retain 7 daily + 4 weekly backups

**Strapi uploads:**
- If media uploads are added later, `/app/public/uploads` needs a persistent volume and backup
- Currently not applicable (no media in Unidade content type)

**Git as partial backup:**
- Seed data in `src/seed.ts` can recreate initial 40 locations
- But edits made through Strapi admin exist only in the database — backups are essential

---

### 2.7 Logging

**Action:**
- Strapi: Configure logger in `config/middlewares.ts` to output structured JSON in production
- nginx (frontend): Use standard access/error log format, pipe to stdout/stderr (Docker collects these)
- Consider log aggregation (Loki + Grafana, or Papertrail) once traffic warrants it
- Add request ID middleware to Strapi for tracing requests across logs

**Files affected:** `services/strapi/config/middlewares.ts`

---

## Phase 3: Nice-to-Have — Quality of Life

### 3.1 CDN

- Cloudflare free tier in front of the site
- Gatsby outputs content-hashed assets (`/static/*`), so cache invalidation is automatic on rebuild
- Configure `Cache-Control` headers in nginx:
  - `/static/*`: `max-age=31536000, immutable`
  - `*.html`: `max-age=0, must-revalidate`
  - `page-data/*.json`: `max-age=0, must-revalidate`

### 3.2 Security Headers

Add to nginx/Caddy config:
- `Content-Security-Policy` — restrict scripts/styles to self. Note: Three.js may need `worker-src blob:` and `script-src 'unsafe-eval'`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains`

For Strapi, configure `strapi::security` middleware in `config/middlewares.ts` for CSP and CORS.

### 3.3 Rate Limiting

- Rate-limit Strapi public API (`/api/*`): 100 req/min per IP
- Rate-limit Strapi admin login (`/admin/login`): 5 req/min per IP
- Configure in nginx/Caddy reverse proxy

### 3.4 Monitoring & Uptime

- UptimeRobot or Better Stack (free tier) monitoring production URL and Strapi health endpoint
- For resource monitoring: `docker stats` alerting or Prometheus + node-exporter if self-hosting

### 3.5 Multi-Stage Strapi Dockerfile

Current Dockerfile installs build tools (`build-base`, `gcc`, `automake`, `vips-dev`) and keeps them in the final image. Optimize with multi-stage:
- Stage 1: Install all deps, `npm run build`
- Stage 2: Clean `node:20-alpine` with only runtime deps (`vips`), copy `node_modules`, `dist/`, `config/`, `src/`, `public/`
- Reduces image size significantly

### 3.6 Code Cleanup

- Remove unused Gatsby starter pages: `page-2.js`, `using-ssr.js`, `using-typescript.tsx`, `using-dsg.js` from `services/frontend/src/pages/` and `services/frontend/src/templates/`
- Remove `gatsby-source-strapi` from `services/frontend/package.json` (data sourcing is manual in `gatsby-node.js`)
- Archive or delete `services/backend/` (legacy WordPress)
- Remove `frontend-demo` service from `docker-compose.yml` if no longer needed
- Update `siteMetadata.siteUrl` in `gatsby-config.js` to actual production URL

### 3.7 Data Quality

- Normalize `whatsapp_sem_tracos` values in `src/seed.ts` to digits-only (currently inconsistent: some have `+55`, some have parentheses)
- Add a Strapi lifecycle hook or custom field validation to enforce the format on new entries

---

## Implementation Order

Accounting for dependencies between tasks:

```
Week 1:  1.1 Secrets → 1.2 PostgreSQL → 1.3 Strapi prod mode
Week 2:  1.4 Gatsby prod build → 1.5 Reverse proxy + HTTPS → 1.6 Admin restriction
Week 3:  2.2 Health checks → 2.1 Webhook rebuild trigger
Week 4:  2.3 Testing → 2.4 CI/CD
Week 5:  2.5 Error tracking → 2.6 Backups → 2.7 Logging
Ongoing: Phase 3 items as time permits
```

---

## Architecture: Current vs Target

**Current:**
```
Browser → :8889 Gatsby develop (Node) → :1337 Strapi develop (SQLite)
```

**Target:**
```
Browser → Caddy (:443 HTTPS)
            ├── newshoes.com → nginx (static Gatsby build)
            └── cms.newshoes.com → Strapi production (PostgreSQL)
                                      ↓ webhook on content change
                                   Rebuild service → gatsby build → nginx volume
```
