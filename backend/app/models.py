from datetime import datetime
from decimal import Decimal
from sqlmodel import Field, SQLModel
from uuid import UUID, uuid4

class Sku(SQLModel, table=True):
    id: str = Field(primary_key=True)
    provider: str
    vcpu: int
    ram_gb: float
    watts_per_vcpu: float
    price_hour_usd: Decimal
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CarbonSnapshot(SQLModel, table=True):
    id: int | None = Field(primary_key=True)
    region: str
    gco2_per_kwh: float
    captured_at: datetime = Field(default_factory=datetime.utcnow, index=True)

class SavingEvent(SQLModel, table=True):
    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    project_id: UUID = Field(index=True)
    feature: str
    kwh: float
    co2: float
    usd: Decimal
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
