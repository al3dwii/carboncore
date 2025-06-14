FROM python:3.12-slim AS builder
WORKDIR /opt
COPY backend/pyproject.toml backend/poetry.lock ./
RUN pip install poetry && poetry config virtualenvs.create false && poetry install --no-interaction --no-root

FROM python:3.12-slim
WORKDIR /opt
COPY --from=builder /usr/local /usr/local
COPY backend/app/ingestion ./ingestion
ENTRYPOINT ["python", "-m", "ingestion.grid_ingest"]
