import asyncio, random

async def fetch_intensity(zone: str) -> int:
    """Light-weight stub used during local tests."""
    await asyncio.sleep(0.01)           # simulate network latency
    if zone.upper() == "ZZZ":
        raise ValueError("unknown zone")
    return 406                          # constant fake value
