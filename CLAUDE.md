# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

New Shoes is a headless CMS website for a Brazilian shoe cleaning franchise (primary language: pt-BR). Strapi serves as the CMS backend, Gatsby 5 renders the frontend.

## Architecture

```
docker-compose.yml
├── strapi    → Strapi 5 CMS, Node 20, SQLite (port: 1337)
└── frontend  → Gatsby 5 + React 18, Node 18 (port: 8889)
```

## Data Flow

1. Strapi stores content (Unidade collection = franchise locations) in SQLite at `.tmp/data.db`
2. Strapi exposes REST API at `/api/unidades?locale=pt-BR` (authenticated via Bearer token)
3. `gatsby-node.js` fetches from Strapi REST API at build/dev time, creates `StrapiUnidade` GraphQL nodes via `sourceNodes`, and generates pages at `/unidades/{slug}`
4. The index page queries `allStrapiUnidade` and passes data to `FranchiseLocator` as props
5. **No gatsby-source-strapi plugin** — data sourcing is done manually in `gatsby-node.js` because the plugin requires admin API access

## Common Commands (justfile)

```sh
just up              # Start all services
just up-build        # Start and rebuild containers
just down            # Stop all services
just down-clean      # Stop and remove volumes (deletes Strapi data)
just logs            # Follow all logs
just logs-strapi     # Follow Strapi logs
just logs-frontend   # Follow frontend logs
just rebuild <svc>   # Rebuild a specific service (e.g. just rebuild frontend)
just strapi-shell    # Shell into Strapi container
just frontend-shell  # Shell into Gatsby container
just build-frontend  # Run gatsby build
just clean-frontend  # Clear gatsby cache (.cache + public) and restart
just ps              # Show running containers
```

When the frontend fails to start after config/schema changes, clear the Gatsby cache:
```sh
docker compose exec frontend rm -rf /app/.cache /app/public
docker compose restart frontend
```

## Key Technologies

**Frontend (Gatsby):** React 18, Three.js (`@react-three/fiber` + `drei`) for 3D shoe viewer, Framer Motion + GSAP for animations, Lucide React icons.

**CMS (Strapi):** Strapi 5.40.0, SQLite, TypeScript. Seed script at `src/seed.ts` auto-imports 40 franchise locations and sets public API permissions on first boot.

**i18n:** `gatsby-plugin-react-i18next` with 3 locales: `pt-BR` (default), `en-US`, `es-ES`. Translation files at `src/locales/{locale}/translation.json`. Strapi content type has i18n enabled (locale field on unidades).

## i18n Locale Convention

**All locales must use the `ll-CC` pattern** (ISO 639-1 language + ISO 3166-1 country): `pt-BR`, `en-US`, `es-ES`, `es-GT`, etc. Never use bare language codes like `en`, `pt`, or `es`.

This applies to:
- **Strapi**: locale config in `config/plugins.ts`, seed locale creation in `src/seed.ts`, and content `locale` field values
- **Gatsby frontend**: `languages` array in `gatsby-plugin-react-i18next` config (`gatsby-config.js`), locale directory names under `src/locales/`, and `locale` param in Strapi API queries in `gatsby-node.js`

When adding a new locale:
1. Add to `config/plugins.ts` `locales` array in Strapi
2. Add to `src/seed.ts` `requiredLocales` array (with `code` and `name`)
3. Add to `gatsby-config.js` `languages` array
4. Create `src/locales/{ll-CC}/translation.json` with all translation keys

## Strapi Content Model

**Unidade** (collection type): `nome` (required), `slug` (UID), `endereco`, `whatsapp`, `whatsapp_sem_tracos`, `instagram`, `facebook`, `tiktok`, `estado`, `cidade`. Schema at `services/strapi/src/api/unidade/content-types/unidade/schema.json`.

## Styling

- CSS variables in `src/css/global.css`: `--bg-color`, `--text-main`, `--footer-bg`, `--radius-lg`
- Brand color: `#1CAAD9`
- Fonts: Inter (body), Space Grotesk (headings)
- Inline styles are used extensively in components (not CSS modules)

## Environment Variables

Frontend container receives `STRAPI_API_URL` and `STRAPI_TOKEN` from docker-compose.yml. Strapi container needs `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET` (defaults provided in compose).

## SSR Considerations

Three.js components (Hero, Shoe3D) and canvas-based components (CleaningGame) use client-only rendering guards (`useState` + `useEffect` mounted check) because `window`, `document`, and Canvas API don't exist during Gatsby's SSR build. Any new component using browser APIs must follow the same pattern.

## Volume Mounts

Frontend mounts `src/`, `gatsby-config.js`, and `gatsby-node.js` for hot reload. Strapi mounts `src/` for hot reload. Changes to these files trigger automatic dev server restarts. Changes to `package.json` or `Dockerfile` require a container rebuild (`just rebuild <service>`).
