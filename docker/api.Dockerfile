FROM python:3.12-slim
WORKDIR /opt
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y gcc build-essential && rm -rf /var/lib/apt/lists/*
RUN pip install poetry && poetry config virtualenvs.create false
COPY backend/pyproject.toml backend/poetry.lock* ./
RUN poetry install --no-interaction --no-root
COPY backend ./backend
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
