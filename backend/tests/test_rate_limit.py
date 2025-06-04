import pytest
pytestmark = pytest.mark.anyio

async def test_rate_limit(client):
    for _ in range(30):
        r = await client.get("/carbon?zone=DE", headers={"x-project-token": "demo"})
        assert r.status_code in (200, 307, 502)
    overflow = await client.get("/carbon?zone=DE", headers={"x-project-token": "demo"})
    assert overflow.status_code == 429
