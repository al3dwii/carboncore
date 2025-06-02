from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import Column, Float, Numeric, DateTime, text
from sqlmodel import Field, SQLModel
from passlib.hash import bcrypt


class Sku(SQLModel, table=True):
    id: str = Field(primary_key=True)
    provider: str
    vcpu: int

    memory_gb: float = Field(sa_column=Column("ram_gb", Float))
    watts_per_cpu: float = Field(sa_column=Column("watts_per_vcpu", Float))
    price_per_hour: Decimal = Field(sa_column=Column("price_hour_usd", Numeric(10, 4)))

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,                 # ← NEW: python-side default
        sa_column=Column(
            "updated_at",
            DateTime,
            server_default=text("now()"),                # still useful for fresh DBs
            nullable=False,
        ),
    )

    @property
    def created_at(self) -> datetime:  # legacy alias
        return self.updated_at


# remaining tables unchanged … ---------------------------------
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


class ProjectToken(SQLModel, table=True):
    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    name: str
    token_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @staticmethod
    def hash(raw: str) -> str:
        return bcrypt.hash(raw)

    @staticmethod
    def verify(raw: str, hashed: str) -> bool:
        return bcrypt.verify(raw, hashed)
