FROM python:3.12-slim

WORKDIR /code

# copy dependency manifests
COPY pyproject.toml poetry.lock* ./

# install runtime deps
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir poetry \
 && poetry config virtualenvs.create false \
 && poetry install --no-root --no-interaction --no-ansi

# copy application source
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]