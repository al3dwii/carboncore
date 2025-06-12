from fastapi.testclient import TestClient
import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[2] / "backend"))
from app.main import app

def test_suggest():
    c = TestClient(app)
    r = c.post("/suggest", json={"vcpu_hours":1,
      "earliest":"2025-06-20T00:00:00Z","latest":"2025-06-20T04:00:00Z",
      "preferred_region":"DE"})
    assert r.status_code==200 and "start" in r.json()
