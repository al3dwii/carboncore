#!/usr/bin/env bash
set -euo pipefail

echo "▶ backend health"
curl -sf http://localhost:8000/healthz | jq .

echo "▶ Redis"
docker compose exec -T redis redis-cli ping

echo "▶ Postgres"
docker compose exec -T db psql -U postgres -c "SELECT version();" | head -3

echo "▶ Celery"
docker compose exec -T celery celery -A app.tasks.worker inspect ping

echo "▶ Unit tests"
docker compose exec -T backend \
  bash -lc 'DATABASE_URL="sqlite+aiosqlite:///./test.db" \
            ANYIO_BACKEND=asyncio \
            pytest -q'
