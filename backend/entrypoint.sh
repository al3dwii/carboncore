#!/usr/bin/env bash
set -euo pipefail

cd /app/backend               # ← this makes alembic.ini discoverable

echo "Running Alembic migrations…"
alembic upgrade head

exec "$@"
