#!/usr/bin/env bash
set -euo pipefail

poetry run alembic upgrade head      # run once
exec "$@"                            # hand off to gunicorn/uvicorn
