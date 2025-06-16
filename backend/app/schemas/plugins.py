from __future__ import annotations
from pydantic import BaseModel, Field
from typing import List, Literal

class Route(BaseModel):
    handler: str
    path: str | None = None
    method: Literal["GET", "POST", "PUT", "DELETE"] = "GET"
    prefix: str | None = None

class Schedule(BaseModel):
    name: str
    task: str
    every: int | None = None
    cron: str | None = None

class PluginManifest(BaseModel):
    id: str = Field(pattern=r"^[a-z0-9-]+$")
    event_types: List[str] = []
    routes: List[Route] = []
    mount_point: str | None = None
    schedules: List[Schedule] = []
