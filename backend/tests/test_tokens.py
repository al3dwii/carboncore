import pytest, uuid
pytestmark = pytest.mark.anyio

async def test_token_crud(client):
    name = "ci-" + uuid.uuid4().hex[:6]
    # create
    new = await client.post(f"/tokens/?name={name}")
    assert new.status_code == 201
    # list
    got = await client.get("/tokens")
    token_rows = got.json()
    assert any(t["name"] == name for t in token_rows)
    # delete
    tid = next(t["id"] for t in token_rows if t["name"] == name)
    assert (await client.delete(f"/tokens/{tid}")).status_code == 204
