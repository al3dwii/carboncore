# CarbonCore

This repository contains a FastAPI backend and a Next.js web console.

## Smoke build

Run the smoke build script to verify that both the backend and the web console build correctly:

```bash
scripts/smoke-build.sh
```

The script starts the backend with `uvicorn` and builds the web console using `pnpm`. It fails if either process exits with a non-zero status.

## Quick start

```bash
docker compose up -d  # brings up DB/Redis/Tempo/backend
cd frontend && pnpm install && pnpm dev
# open http://localhost:3000
```

### Auth setup

Copy `.env.example` to `.env` and provide `GITHUB_ID`, `GITHUB_SECRET`,
`NEXTAUTH_URL` and `NEXTAUTH_SECRET` values. Start the dev server and visit
`/api/auth/signin` to sign in via GitHub.

### Install SDKs

```bash
pip install carboncore-sdk
pnpm add @carboncore/sdk
```

## Opt-out & privacy
Analytics require consent via the banner. Set `NEXT_PUBLIC_PH_ENABLED=false` to disable globally.

## Seed demo data

```bash
poetry run python scripts/seed_demo.py
pnpm --filter ./frontend dlx ts-node scripts/seed_demo.ts
```
