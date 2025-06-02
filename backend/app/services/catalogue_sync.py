import csv, httpx
from sqlmodel.ext.asyncio.session import AsyncSession
from ..models import Sku

CSV_URL = "https://public-sku-dataset.s3.amazonaws.com/aws_skus.csv"

async def sync_skus(db: AsyncSession):
    async with httpx.AsyncClient() as client:
        resp = await client.get(CSV_URL)
        resp.raise_for_status()
    reader = csv.DictReader(resp.text.splitlines())
    for row in reader:
        sku = await db.get(Sku, row["SKU"])
        attrs = dict(
            provider="aws",
            vcpu=int(row["vCPU"]),
            ram_gb=float(row["MemoryGiB"]),
            watts_per_vcpu=float(row["WattsPervCPU"]),
            price_hour_usd=float(row["OnDemandUSD"]),
        )
        if sku:
            for k, v in attrs.items():
                setattr(sku, k, v)
        else:
            sku = Sku(id=row["SKU"], **attrs)
            db.add(sku)
    await db.commit()
