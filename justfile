# New Shoes - Gatsby + Strapi

# Start all services
up:
    docker compose up -d

# Start all services and rebuild
up-build:
    docker compose up -d --build

# Stop all services
down:
    docker compose down

# Stop all services and remove volumes
down-clean:
    docker compose down -v

# View logs for all services
logs:
    docker compose logs -f

# View logs for a specific service
logs-service service:
    docker compose logs -f {{service}}

# View logs for Strapi
logs-strapi:
    docker compose logs -f strapi

# View logs for the frontend
logs-frontend:
    docker compose logs -f frontend

# Rebuild a specific service
rebuild service:
    docker compose up -d --build {{service}}

# Open a shell in the frontend container
frontend-shell:
    docker compose exec frontend sh

# Open a shell in the Strapi container
strapi-shell:
    docker compose exec strapi sh

# Run gatsby build inside the frontend container
build-frontend:
    docker compose exec frontend npm run build

# Clean gatsby cache
clean-frontend:
    docker compose exec frontend rm -rf /app/.cache /app/public
    docker compose restart frontend

# Show running containers
ps:
    docker compose ps
