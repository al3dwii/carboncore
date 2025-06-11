# tests/test_carbon.py
import pytest

HDR = {"x-project-token": "demo"}

@pytest.mark.asyncio
async def test_carbon_ok(client):
    r = await client.get("/carbon?zone=AE", headers=HDR)
    j = r.json()
    assert r.status_code == 200
    assert "gco2_per_kwh" in j and j["gco2_per_kwh"] > 0

@pytest.mark.asyncio
async def test_carbon_bad_zone(client):
    r = await client.get("/carbon?zone=ZZZ", headers=HDR)
    assert r.status_code == 400
