# worker.Dockerfile  – Celery worker / scheduler
FROM python:3.12-slim AS builder
WORKDIR /app
COPY backend/pyproject.toml backend/poetry.lock ./
RUN pip install poetry==1.8.* && poetry config virtualenvs.create false && poetry install --no-dev

FROM python:3.12-slim
RUN adduser --disabled-password --uid 10001 app
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY backend /app
USER app
CMD ["celery", "-A", "app.tasks", "worker", "-B", "--loglevel=info"]
