"""
Nightly job – grabs price & energy curves from AWS, GCP, Azure.
Only the AWS part is shown in full; GCP/Azure follow the same pattern.
"""
import os, json, asyncio, aiohttp, asyncpg, datetime as dt

PG_DSN = os.getenv("PG_DSN", "postgresql://core:core@db/core")
AWS_PRICE_URL = "https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.json"

async def save(conn, sku, price, watts):
    sql = """
    INSERT INTO cloud_skus(sku, price_usd_hr, watts, updated_at)
    VALUES($1,$2,$3,$4)
    ON CONFLICT (sku) DO UPDATE
    SET price_usd_hr=EXCLUDED.price_usd_hr,
        watts=EXCLUDED.watts,
        updated_at=EXCLUDED.updated_at;
    """
    await conn.execute(sql, sku, price, watts, dt.datetime.utcnow())

async def fetch_aws():
    async with aiohttp.ClientSession() as sess:
        async with sess.get(AWS_PRICE_URL, timeout=60) as r:
            data = await r.text()
    doc = json.loads(data)
    for sku, item in doc["products"].items():
        attrs = item["attributes"]
        if attrs.get("instanceType") and attrs["operatingSystem"] == "Linux":
            ondemand_code = next(iter(doc["terms"]["OnDemand"][sku]))
            price = float(
                doc["terms"]["OnDemand"][sku][ondemand_code]["priceDimensions"]
                [next(iter(doc["terms"]["OnDemand"][sku][ondemand_code]["priceDimensions"]))]
                ["pricePerUnit"]["USD"]
            )
            watts = 8 * int(attrs["vcpu"])
            yield sku, price, watts

async def main():
    pool = await asyncpg.create_pool(PG_DSN)
    async with pool.acquire() as conn:
        async for sku, price, watts in fetch_aws():
            await save(conn, sku, price, watts)
            print("✓ upsert", sku)
    await pool.close()

if __name__ == "__main__":
    asyncio.run(main())
