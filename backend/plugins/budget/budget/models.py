from sqlmodel import SQLModel, Field
class CarbonBudget(SQLModel, table=True):
    id: int|None = Field(default=None, primary_key=True)
    cap_tco2: float
    start: str
    end: str
