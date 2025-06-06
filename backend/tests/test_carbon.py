# tests/test_carbon.py
import httpx, pytest, asyncio

BASE = "http://localhost:8000"
HDR  = {"x-project-token": "demo"}

@pytest.mark.asyncio
async def test_carbon_ok():
    async with httpx.AsyncClient() as c:
        r = await c.get(f"{BASE}/carbon?zone=AE", headers=HDR)
    j = r.json()
    assert r.status_code == 200
    assert "gco2_per_kwh" in j and j["gco2_per_kwh"] > 0

@pytest.mark.asyncio
async def test_carbon_bad_zone():
    async with httpx.AsyncClient() as c:
        r = await c.get(f"{BASE}/carbon?zone=ZZZ", headers=HDR)
    assert r.status_code == 400
