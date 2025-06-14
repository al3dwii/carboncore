from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy import text

from app.core.deps import SessionLocal
from app.models import DSARLog

router = APIRouter()

@router.delete("/user/{id}")
async def gdpr_delete(id: int, db=Depends(SessionLocal)):
    await db.execute(text("DELETE FROM event WHERE meta->>'user_id'=:id"), {"id": str(id)})
    await db.execute(text("DELETE FROM users WHERE id=:id"), {"id": id})
    dsar_log = DSARLog(user_id=id, ts=datetime.utcnow())
    db.add(dsar_log)
    await db.commit()
    return {"status": "deleted"}
