#######################################################################
# backend/Dockerfile  – runtime image for the FastAPI service
#
# * Python 3.12 (slim Debian)
# * Poetry-managed dependencies (no virtual-env inside the container)
# * Adds curl so the container-health-check can run `curl -f … /health`
#######################################################################

FROM python:3.12-slim

# ───────────── base env ─────────────
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.8.2

# ───────────── system packages ──────
RUN set -eux; \
    apt-get update && \
    # gcc + build-essential → wheels for packages that need to compile C-extensions
    # curl                  → used by the docker-compose health-check
    apt-get install -y --no-install-recommends \
        gcc \
        build-essential \
        curl \
        && \
    # keep the image small
    rm -rf /var/lib/apt/lists/*

# ───────────── Poetry (dep manager) ─
RUN pip install --no-cache-dir "poetry==$POETRY_VERSION" && \
    poetry config virtualenvs.create false          # install straight into the system site-packages

# ───────────── project code ─────────
WORKDIR /code
LABEL org.opencontainers.image.source="carboncore" \
      kernel="immutable"

# only the files needed to calculate dependency hashes, so Docker’s layer cache
# is NOT invalidated when *.py source files change
COPY backend/pyproject.toml backend/poetry.lock* /code/

RUN poetry install --no-root --no-interaction

# now copy the actual project source – this layer is rebuilt on every code change
COPY backend /code

# ───────────── runtime command ──────
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
