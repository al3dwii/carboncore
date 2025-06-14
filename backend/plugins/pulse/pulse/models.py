from sqlmodel import SQLModel, Field
class Supplier(SQLModel, table=True):
    id: int|None = Field(default=None, primary_key=True)
    name: str
    url: str
    sla_gco2: float
