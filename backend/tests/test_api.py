# tests/test_api.py
import httpx, pytest, asyncio, os

BASE = "http://localhost:8000"
HDR  = {"x-project-token": "demo"}

@pytest.mark.asyncio
async def test_ae_ok():
    async with httpx.AsyncClient() as c:
        r = await c.get(f"{BASE}/carbon?zone=AE", headers=HDR)
    assert r.status_code == 200
    j = r.json()
    assert j["zone"] == "AE" and j["gco2_per_kwh"] > 0

@pytest.mark.asyncio
async def test_missing_zone():
    async with httpx.AsyncClient() as c:
        r = await c.get(f"{BASE}/carbon", headers=HDR)
    assert r.status_code == 422

@pytest.mark.asyncio
async def test_rate_limit():
    async with httpx.AsyncClient() as c:
        tasks = [c.get(f"{BASE}/healthz", headers=HDR) for _ in range(40)]
        rs = await asyncio.gather(*tasks)
    assert any(r.status_code == 429 for r in rs)
