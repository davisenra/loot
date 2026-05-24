# Loot

Loot is a self-hosted order tracking/management webapp designed for customers.

## Architecture

Loot follows a simple architecture.

- API:
  - Pocketbase (under `/pocketbase`)
  - Sqlite
- Webapp:
  - SvelteKit SPA (under `/webapp`)
  - pnpm, TailwindCSS, Vite

## Self-Hosting

A Docker image that bundles the project into a single container is available.

### Usage

```bash
docker run -d \
  --name loot:latest \
  -p 80:80 \
  -v loot-data:/pb_data \
  loot:latest
```

### Volumes

| Volume | Description |
|--------|-------------|
| `/pb_data` | **required for persistence** |

Without mounting a volume for `/pb_data`, all data is lost when the container is removed.

## Contributions

- Use conventional commits
  - feat: yolo
  - feat(something): else
  - fix(auth): foo

## License

MIT
