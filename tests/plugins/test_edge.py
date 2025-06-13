import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[2] / "backend"))
from app.main import app
from fastapi.testclient import TestClient

def test_edge():
    c=TestClient(app); assert c.get("/edge-route?ip=8.8.8.8").status_code==200
