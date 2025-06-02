FROM python:3.12-slim
WORKDIR /code
COPY pyproject.toml .
RUN pip install --upgrade pip \
 && pip install poetry \
 && poetry config virtualenvs.create false \
 && poetry install --without dev --no-root
COPY . .
CMD ["uvicorn","app.main:app","--host","0.0.0.0","--port","8000","--reload"]
