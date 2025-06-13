from fastapi import APIRouter, Query
import ipaddress, hashlib

router = APIRouter()

POPS = ["FRA1", "LHR1", "ORD1", "SIN1"]  # hard-coded demo PoPs

@router.get("/edge-route")
def edge_route(ip: str = Query(..., examples=["8.8.8.8"])):
    # very rough hash-to-PoP demo
    pop = POPS[int(hashlib.md5(ip.encode()).hexdigest(), 16) % len(POPS)]
    return {"pop": pop}
