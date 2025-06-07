#!/usr/bin/env bash
# ------------------------------------------------------------------
#  One-shot fixer for the issues you hit:
#   • installs pytest-asyncio in the local venv
#   • rebuilds images (assumes you already added `USER appuser`
#     to both Dockerfiles and switched Alembic env.py to the
#     sync version pasted earlier)
#   • runs migrations & smoke-tests the stack
# ------------------------------------------------------------------
set -euo pipefail

echo "🔧  Installing missing dev dependency …"
cd backend
poetry add --group dev pytest-asyncio==0.23.6        # Py3.12-compatible
poetry lock                                          # regenerate lockfile
poetry sync --with dev                               # ⎈ same as old --sync
pytest -q                                            # => should be silent
cd ..

echo "🐳  Rebuilding & starting fresh containers …"
docker compose down -v
docker compose build --no-cache
docker compose up -d

echo "🗄️   Applying database migrations …"
docker compose exec backend alembic upgrade head

echo "✅  Quick smoke checks …"
# Wait briefly for Celery to come up, then confirm it’s ready
sleep 3
docker compose logs --tail=20 celery | grep -q "ready" \
  && echo "Celery worker is up ✅" \
  || (echo "Celery not ready ❌" && exit 1)

# Hit the FastAPI health probe
curl -fsSL http://localhost:8000/healthz && echo -e "\nAPI healthy ✅"

echo "🎉  All set – terminal should be all green now!"
