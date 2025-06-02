import httpx, aiocache
from ..core.settings import get_settings

cache = aiocache.Cache(aiocache.SimpleMemoryCache)
settings = get_settings()

async def fetch_intensity(region: str) -> float:
    url = f"https://api.electricitymaps.com/v3/co2-intensity/latest?zone={region}"
    headers = {"auth-token": settings.electricitymaps_api_key}
    async with httpx.AsyncClient(timeout=5) as client:
        resp = await client.get(url, headers=headers)
        resp.raise_for_status()
    return resp.json()["data"]["carbonIntensity"]

@cache.ttl(ttl=300)
async def get_intensity(region: str) -> float:
    return await fetch_intensity(region)
