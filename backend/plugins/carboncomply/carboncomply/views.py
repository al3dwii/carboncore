from fastapi import Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import text
from app.core.deps import SessionLocal
import pandas as pd, io

def export_xlsx(year: int, db=Depends(SessionLocal)):
    q = db.execute(
        text("SELECT * FROM vw_esrs WHERE date_part('year', ts)=:y"),
        dict(y=year),
    )
    df = pd.DataFrame(q.fetchall(), columns=q.keys())
    buf = io.BytesIO()
    df.to_excel(buf, index=False)
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/vnd.ms-excel",
        headers={"Content-Disposition": f'attachment; filename=esrs_{year}.xlsx'}
    )
