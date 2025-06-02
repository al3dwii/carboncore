"""
Carbon-intensity feed with 5-minute in-memory cache
(works with aiocache ≥ 1.0).
"""
from aiocache import cached, SimpleMemoryCache
import httpx

from ..core.settings import get_settings

settings = get_settings()


async def _fetch_intensity(region: str) -> float:
    url = (
        "https://api.electricitymaps.com/v3/co2-intensity/latest"
        f"?zone={region}"
    )
    headers = {"auth-token": settings.electricitymaps_api_key}
    async with httpx.AsyncClient(timeout=5) as client:
        resp = await client.get(url, headers=headers)
        resp.raise_for_status()
    return resp.json()["data"]["carbonIntensity"]


@cached(ttl=300, cache=SimpleMemoryCache)  # 5 min
async def get_intensity(region: str) -> float:
    return await _fetch_intensity(region)
