# backend/app/routers/health.py
from fastapi import APIRouter

router = APIRouter(tags=["infra"])

@router.get("/health", summary="Container health-check")
async def health():
    """
    Very small route that returns 200 immediately.
    Docker’s health-check just needs the 200 status code.
    """
    return {"status": "ok"}
