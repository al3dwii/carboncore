dev:
	docker compose up --build

web:
	pnpm --dir web dev

api:
	poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:
	poetry run pytest -q
	pnpm --dir web test
