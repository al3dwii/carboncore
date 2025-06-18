######################## builder ########################
FROM python:3.12-slim AS builder

# OS build deps *only* for this stage
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend/pyproject.toml backend/poetry.lock ./
RUN pip install "poetry==1.8.*" && poetry config virtualenvs.create false
RUN poetry lock --no-update
RUN poetry install --only main --no-interaction --no-root
RUN pip install gunicorn

######################## runtime ########################
FROM python:3.12-slim

# curl is needed by the HEALTHCHECK
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    apt-get purge -y build-essential libpq-dev && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# non-root user
RUN adduser --disabled-password --uid 10001 app
USER app
WORKDIR /app

# copy installed deps
COPY --from=builder /usr/local/lib/python3.12/site-packages \
                    /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# copy source
COPY backend/ .  
COPY backend/entrypoint.sh /usr/local/bin/entrypoint.sh

ENV PYTHONPATH="/app"

# expose + health
EXPOSE 8000
HEALTHCHECK CMD curl -fs http://localhost:8000/health || exit 1

# production server
ENTRYPOINT ["gunicorn"]
CMD ["app.main:app", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
