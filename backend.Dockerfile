# ---------- builder ----------
FROM python:3.12-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y build-essential libpq-dev
COPY backend/pyproject.toml backend/poetry.lock .
RUN pip install poetry==1.8.*
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev

# ---------- runtime ----------
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1
RUN adduser --disabled-password --uid 10001 app
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY backend .
COPY backend/entrypoint.sh /usr/local/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
USER app
EXPOSE 8000
HEALTHCHECK CMD curl -f http://localhost:8000/health || exit 1
CMD ["gunicorn", "--workers=3", "--bind=0.0.0.0:8000", "app.main:app"]
