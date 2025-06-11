"""
SQLModel table definitions – locked for Sprints 3-5.

Column aliases keep backward-compat with the original DB seed; field names
match the public API used by /skus, /tokens, etc.
"""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

from passlib.hash import bcrypt
from sqlalchemy import Column, DateTime, Float, Numeric, JSON, text
from sqlmodel import Field, SQLModel


# ───────────────────── Cloud SKU catalogue ─────────────────────
class Sku(SQLModel, table=True):
    """
    Cloud SKU catalogue (PK = <provider>_<instance>).

    Field names = API; column names keep legacy seed compatibility.
    """

    id: str = Field(primary_key=True)
    provider: str
    vcpu: int

    memory_gb: float = Field(sa_column=Column("ram_gb", Float))
    watts_per_cpu: float = Field(sa_column=Column("watts_per_vcpu", Float))
    price_per_hour: Decimal = Field(
        sa_column=Column("price_hour_usd", Numeric(10, 4))
    )

    # NOTE: index removed; SQLModel disallows index + sa_column together
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(
            "updated_at",
            DateTime,
            server_default=text("now()"),
            nullable=False,
        ),
    )

    # legacy alias expected by dashboards/tests
    @property
    def created_at(self) -> datetime:  # noqa: D401
        return self.updated_at


# ─────────────────── Carbon snapshot cache ────────────────────
class CarbonSnapshot(SQLModel, table=True):
    id: int | None = Field(primary_key=True)
    region: str
    gco2_per_kwh: float
    captured_at: datetime = Field(default_factory=datetime.utcnow, index=True)


# ─────────────────── Plugin event types ────────────────────
class EventType(SQLModel, table=True):
    """Lookup table for saving event types with JSON schema."""

    id: str = Field(primary_key=True, max_length=32)
    json_schema: dict = Field(
        default_factory=dict,
        sa_column=Column(JSON, server_default="{}", nullable=False),
    )


# ─────────────────── Savings events log ───────────────────────
class SavingEvent(SQLModel, table=True):
    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    project_id: UUID = Field(index=True)
    feature: str
    event_type_id: str = Field(foreign_key="eventtype.id", nullable=False, default="default")
    kwh: float
    co2: float
    usd: Decimal
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)


# ─────────────────── API Token storage ────────────────────────
class ProjectToken(SQLModel, table=True):
    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    name: str
    token_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)

    # bcrypt helpers (used in routers.tokens)
    @staticmethod
    def hash(raw: str) -> str:  # noqa: D401
        return bcrypt.hash(raw)

    @staticmethod
    def verify(raw: str, hashed: str) -> bool:  # noqa: D401
        return bcrypt.verify(raw, hashed)


# ─────────────────── Model rebuilds ───────────────────────────
for _model in (Sku, CarbonSnapshot, EventType, SavingEvent, ProjectToken):
    try:  # Pydantic v2
        _model.model_rebuild()
    except AttributeError:  # v1 fallback
        _model.update_forward_refs()
