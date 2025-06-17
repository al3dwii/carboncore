################### builder ###################
FROM python:3.12-slim AS builder

WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential libpq-dev curl && \
    rm -rf /var/lib/apt/lists/*

# 1. Poetry itself
RUN pip install "poetry==1.8.*" && \
    poetry config virtualenvs.create false

# 2. Only the files needed to resolve deps
COPY backend/pyproject.toml backend/poetry.lock ./

# 3. Sync lockfile (optional but future-proof)
RUN poetry lock --no-update

# 4. Install **main** (prod) deps only
RUN poetry install --only main --no-interaction --no-root


################### runtime ###################
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1
RUN adduser --disabled-password --uid 10001 app

WORKDIR /app

# copy site-packages and scripts
COPY --from=builder /usr/local/lib/python3.12/site-packages \
                    /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# copy application source
COPY backend ./backend
COPY backend/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER app
EXPOSE 8000
HEALTHCHECK CMD curl -f http://localhost:8000/health || exit 1

ENTRYPOINT ["entrypoint.sh"]
# keep CMD purely for the web server; entrypoint handles migrations only
CMD ["gunicorn", "--workers=3", "--bind=0.0.0.0:8000", "backend.app.main:app"]
