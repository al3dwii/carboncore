from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from datetime import datetime
from app.core.deps import get_db, get_project_from_token
from app.models import Sku, SavingEvent
from .plan_parser import resources_from_tf

router = APIRouter()

HIGH_INTENSITY = {"us-east-1", "ap-south-1"}  # example
OLD_GEN = ("t1", "t2", "m1", "m2", "m3", "m4", "c3", "c4")

def greener_alt(inst: str) -> str | None:
    if inst.startswith(("t1", "t2")):
        return inst.replace("t2", "t3", 1)
    if inst.startswith(("m3", "m4")):
        return inst.replace("m4", "m6g", 1)
    if ".large" in inst and "g." not in inst:
        fam, sz = inst.split(".")
        return f"{fam}g.{sz}"
    return None

@router.post("/analyze")
async def analyze(plan: dict,
                  project=Depends(get_project_from_token),
                  db: AsyncSession = Depends(get_db)):
    if not plan:
        raise HTTPException(400, "empty plan")

    suggestions = []

    for addr, inst, region in resources_from_tf(plan):
        if not inst:
            continue
        heavy = inst.startswith(OLD_GEN) or region in HIGH_INTENSITY
        if not heavy:
            continue

        alt = greener_alt(inst) or inst
        sku_cur = await db.scalar(select(Sku).where(Sku.id == f"aws_{inst}"))
        sku_alt = await db.scalar(select(Sku).where(Sku.id == f"aws_{alt}"))
        if not sku_cur or not sku_alt:
            continue

        watts_diff = (sku_cur.vcpu * sku_cur.watts_per_cpu) - (sku_alt.vcpu * sku_alt.watts_per_cpu)
        co2_day = round(max(watts_diff, 0) / 1_000 * 0.45 * 24, 2)
        usd_day = round((sku_cur.price_per_hour - sku_alt.price_per_hour) * 24, 2)

        suggestions.append(dict(resource=addr, current=inst, suggestion=alt,
                                co2_saved_kg_per_day=co2_day, cost_saved_usd_per_day=usd_day))

        db.add(SavingEvent(
            project_id=project.id,
            feature="iac-advisor",
            event_type_id="iac_advice",
            kwh=0,
            co2=co2_day,
            usd=usd_day,
            created_at=datetime.utcnow(),
        ))

    await db.commit()
    return {"suggestions": suggestions}

@router.get("/recent")
async def recent(limit: int = 20,
                 project=Depends(get_project_from_token),
                 db: AsyncSession = Depends(get_db)):
    q = await db.execute(
        select(SavingEvent)
        .where(SavingEvent.project_id == project.id,
               SavingEvent.event_type_id == "iac_advice")
        .order_by(SavingEvent.created_at.desc())
        .limit(limit)
    )
    return q.scalars().all()
