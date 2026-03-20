# New Shoes - Gatsby + WordPress

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

# Rebuild a specific service
rebuild service:
    docker compose up -d --build {{service}}

# Open a shell in the backend container
backend-shell:
    docker compose exec backend bash

# Open a shell in the frontend container
frontend-shell:
    docker compose exec frontend sh

# Install WP CLI in backend and activate WPGraphQL
wp-setup:
    docker compose exec backend bash -c "wp plugin activate wp-graphql --allow-root"

# Run gatsby build inside the frontend container
build-frontend:
    docker compose exec frontend npm run build

# Clean gatsby cache
clean-frontend:
    docker compose exec frontend npm run clean

# Show running containers
ps:
    docker compose ps
