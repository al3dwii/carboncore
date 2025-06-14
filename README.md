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
cd web && pnpm i && pnpm dev
# open http://localhost:3000
```
