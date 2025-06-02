"""Resilient CO₂-intensity fetch with ElectrictyMaps ↔ WattTime fallback."""
import asyncio

from httpx import AsyncClient
from tenacity import retry, stop_after_attempt, wait_exponential

_EM = "https://api.electricitymaps.com/v3/zone"
_WT = "https://api.watttime.org/v2"
_TIMEOUT = 10


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=0.3))
async def _em_intensity(zone: str) -> float:
    async with AsyncClient(timeout=_TIMEOUT) as http:
        r = await http.get(f"{_EM}/{zone}")
        r.raise_for_status()
        return r.json()["zone_data"]["co2intensity"]


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=0.3))
async def _wt_intensity(zone: str) -> float:
    async with AsyncClient(timeout=_TIMEOUT) as http:
        r = await http.get(f"{_WT}/intensity/{zone}")
        r.raise_for_status()
        return r.json()["data"]["avg_co2"]


async def fetch_intensity(zone: str) -> float:
    t1 = asyncio.create_task(_em_intensity(zone))
    t2 = asyncio.create_task(_wt_intensity(zone))
    done, _ = await asyncio.wait({t1, t2}, return_when=asyncio.FIRST_COMPLETED)
    return done.pop().result()

# ───── backwards-compat (old code imports this) ────────────────
get_intensity = fetch_intensity
