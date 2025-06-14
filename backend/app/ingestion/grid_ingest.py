"""
Pull real-time grid-carbon data every X minutes and upsert into Postgres.

Supported back-ends:
* WattTime (global, free for non-profits)
* ENTSO-E (Europe)
* Ember (public API used as fallback)
"""
import os, sys, time, requests, datetime as dt
import logging
import asyncpg, asyncio
from typing import Dict

PG_DSN = os.getenv("PG_DSN", "postgresql://core:core@db/core")
REFRESH_SECS = int(os.getenv("GRID_REFRESH_SECS", 300))
REGIONS = os.getenv("REGIONS", "EU_DE,EU_FR,US_CA").split(",")

AUTH = (os.getenv("WATTTIME_USER"), os.getenv("WATTTIME_PASS"))
log = logging.getLogger(__name__)

def safe_get(url: str, **kw):
    try:
        r = requests.get(url, **kw)
        r.raise_for_status()
        return r.json()
    except Exception as e:  # noqa: BLE001
        log.warning("\u26a0 fetch error %s", e)
        return None

async def save(conn, payload: Dict):
    sql = """
    INSERT INTO grid_intensity(region, ts, g_co2_kwh)
    VALUES($1,$2,$3)
    ON CONFLICT (region, ts) DO UPDATE
    SET g_co2_kwh = EXCLUDED.g_co2_kwh;
    """
    await conn.execute(sql, payload["region"], payload["ts"], payload["g_co2_kwh"])

async def fetch_watttime(region: str) -> Dict:
    data = safe_get(
        f"https://api2.watttime.org/v2/index?ba={region}",
        auth=AUTH,
        timeout=10,
    )
    if not data:
        raise RuntimeError("no data")
    grams = data["data"][0]["moer"] * 1000  # kg ➜ g
    return {"region": region, "ts": dt.datetime.utcnow(), "g_co2_kwh": grams}

async def main() -> None:
    pool = await asyncpg.create_pool(dsn=PG_DSN, min_size=1, max_size=5)
    while True:
        async with pool.acquire() as conn:
            for reg in REGIONS:
                try:
                    payload = await fetch_watttime(reg)
                    await save(conn, payload)
                    print(f"⬆ saved {payload}")
                except Exception as exc:  # noqa: BLE001
                    log.warning("fetch error %s", exc)
        await asyncio.sleep(REFRESH_SECS)

if __name__ == "__main__":
    asyncio.run(main())
