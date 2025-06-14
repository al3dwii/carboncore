from fastapi import APIRouter
from sqlmodel import Session, select
from app.database import engine
from .models import Supplier
router = APIRouter()
@router.post("/suppliers")            # create
def add(s: Supplier):
    with Session(engine) as sess:
        sess.add(s)
        sess.commit()
        return s
@router.get("/suppliers")             # list
def lst():
    with Session(engine) as s:
        return s.exec(select(Supplier)).all()
@router.delete("/suppliers/{id}")     # delete
def drop(id:int):
    with Session(engine) as s:
        s.exec(select(Supplier).where(Supplier.id==id)).delete()
        s.commit()
