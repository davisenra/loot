# Loot

Loot is a self-hosted order tracking/management webapp designed for customers.

## Architecture

Loot follows a simple architecture.

- API powered by Pocketbase (under `/pocketbase`)
- Webapp powered by SvelteKit (under `/webapp`)
  - Please use `pnpm`
  - The webpapp is a traditional SPA

## Design System

Please refer to `DESIGN.md` for all things UI-related.

## Contributions

- Use conventional commits
  - feat: yolo
  - feat(something): else
  - fix(auth): foo
