import asyncio
import datetime as dt
import asyncpg
import pytest

from app.ingestion import grid_ingest, sku_crawler


@pytest.mark.asyncio
async def test_feeders_cycle():
    dsn = "postgresql://core:core@localhost/core"
    pool = await asyncpg.create_pool(dsn)
    async with pool.acquire() as conn:
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS grid_intensity(
                region TEXT,
                ts TIMESTAMP,
                g_co2_kwh NUMERIC,
                PRIMARY KEY(region, ts)
            )
            """
        )
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS cloud_skus(
                sku TEXT PRIMARY KEY,
                price_usd_hr NUMERIC,
                watts INTEGER,
                updated_at TIMESTAMP
            )
            """
        )
        await grid_ingest.save(
            conn,
            {"region": "EU_DE", "ts": dt.datetime.utcnow(), "g_co2_kwh": 100.0},
        )
        cnt1 = await conn.fetchval("SELECT count(*) FROM grid_intensity")
        await sku_crawler.save(conn, "test.sku", 0.1, 10)
        cnt2 = await conn.fetchval("SELECT count(*) FROM cloud_skus")
    await pool.close()
    assert cnt1 > 0 and cnt2 > 0
