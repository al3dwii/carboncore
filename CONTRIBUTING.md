# Contributing to CarbonCore

## Quick start

1. Install dependencies

```bash
pnpm install --filter ./web
```

2. Copy environment variables and run the dev server

```bash
cp env.example .env
pnpm --filter ./web dev
```

Open http://localhost:3000 to view the app.

## Testing

Run lint and unit tests before committing:

```bash
pnpm --filter ./web lint
pnpm --filter ./web test
```

Pre-commit hooks run automatically via Husky.
