from fastapi import APIRouter, Query
from app.database import SessionLocal
from sqlalchemy import text

router = APIRouter()

@router.get("/advice/sku")
def advice(sku: str = Query(...)):
    # naive greener-SKU: same family, one size smaller, ARM if possible
    family = sku.split(".")[0]
    if family.startswith("t"): 
        alt = sku.replace("t3", "t4g").replace("large", "medium")
    else:
        alt = sku
    return {"current": sku, "suggested": alt}

@router.get("/advice/leaderboard")
def leaderboard():
    with SessionLocal() as db:
        q = db.execute(text("""
            SELECT meta->>'author' AS dev,
                   COUNT(*) AS tips,
                   SUM((meta->>'kg_co2')::numeric) AS kg_saved
            FROM event WHERE event_type_id='dev_advice'
            GROUP BY 1 ORDER BY kg_saved DESC LIMIT 10
        """))
        return [dict(r) for r in q]
