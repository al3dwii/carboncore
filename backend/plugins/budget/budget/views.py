from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import engine
from .models import CarbonBudget
router = APIRouter()
@router.post("/budget")          # create
def add(b: CarbonBudget):
    with Session(engine) as s:
        s.add(b); s.commit(); return b
@router.get("/budget")           # list
def lst():
    with Session(engine) as s:
        return s.exec(select(CarbonBudget)).all()
