import pytest
from fastapi import FastAPI
from httpx import AsyncClient, ASGITransport

from app.middleware.secure_headers import SecureHeadersMiddleware

pytestmark = pytest.mark.anyio

async def test_secure_headers_applied():
    app = FastAPI()
    app.add_middleware(SecureHeadersMiddleware)

    @app.get("/")
    async def root():
        return {"msg": "ok"}

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        r = await ac.get("/")

    assert r.status_code == 200
    assert "X-Frame-Options" in r.headers
    assert r.headers["X-Content-Type-Options"] == "nosniff"
