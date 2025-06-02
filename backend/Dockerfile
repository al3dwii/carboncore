FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y gcc build-essential && rm -rf /var/lib/apt/lists/*

# Poetry
ENV POETRY_VERSION=1.8.2
RUN pip install --no-cache-dir poetry==$POETRY_VERSION

# ⬇️ NEW: install deps **without** a venv
RUN poetry config virtualenvs.create false

WORKDIR /code
COPY backend/pyproject.toml backend/poetry.lock* /code/
RUN poetry install --no-root --no-interaction

COPY backend /code

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
