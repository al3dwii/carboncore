from __future__ import annotations

import datetime as dt
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from sqlmodel import SQLModel


class Ledger(SQLModel, table=True):
    __tablename__ = "ledger"
    project_id: Mapped[UUID] = mapped_column(ForeignKey("projects.id"), primary_key=True)
    ts: Mapped[dt.datetime] = mapped_column(primary_key=True)
    delta_co2: Mapped[float]
    delta_cost: Mapped[float]
    checksum: Mapped[bytes]

    def __setattr__(self, key, value):
        if key == "checksum" and hasattr(self, "checksum"):
            raise AttributeError("Ledger rows are immutable")
        super().__setattr__(key, value)
