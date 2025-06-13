from fastapi import APIRouter, Query, Depends
from sqlalchemy import text
from app.database import SessionLocal
router=APIRouter()

@router.get("/ecolabel")
def ecolabel(route:str=Query(...), db=Depends(SessionLocal)):
    q=db.execute(text("""
       SELECT AVG((meta->>'g_co2')::numeric) FROM event
       WHERE event_type_id='ecolabel_view' AND meta->>'route'= :r
    """),dict(r=route)).scalar()
    return {"route":route,"g_co2": round(q or 0, 2)}

from reportlab.pdfgen import canvas
import io, qrcode
from fastapi.responses import StreamingResponse
@router.get("/dpp/{sku}")
def dpp_pdf(sku:str):
    buf=io.BytesIO()
    c=canvas.Canvas(buf)
    qr=qrcode.make(f"https://example.com/dpp/{sku}")
    qr.save("tmp.png"); c.drawImage("tmp.png",100,700,width=100,height=100)
    c.drawString(100,650,f"DPP for {sku}"); c.save(); buf.seek(0)
    return StreamingResponse(buf,media_type="application/pdf",
      headers={"Content-Disposition":f'attachment; filename=dpp_{sku}.pdf'})
