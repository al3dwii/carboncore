# tests/test_api.py
import pytest, asyncio

HDR = {"x-project-token": "demo"}

@pytest.mark.asyncio
async def test_ae_ok(client):
    r = await client.get("/carbon?zone=AE", headers=HDR)
    assert r.status_code == 200
    j = r.json()
    assert j["zone"] == "AE" and j["gco2_per_kwh"] > 0

@pytest.mark.asyncio
async def test_missing_zone(client):
    r = await client.get("/carbon", headers=HDR)
    assert r.status_code == 422

@pytest.mark.asyncio
async def test_rate_limit(client):
    tasks = [client.get("/healthz", headers=HDR) for _ in range(40)]
    rs = await asyncio.gather(*tasks)
    assert any(r.status_code == 429 for r in rs)
