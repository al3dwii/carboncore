# backend/app/plugin_manifest.py
from pydantic import BaseModel
from typing import List, Literal, Optional, Union
from fastapi import APIRouter

class Route(BaseModel):
    handler: str                         # dotted path  "backend.app.routers.skus:router"
    path: Optional[str] = None           # only for single-function routes
    method: Literal["GET","POST","PUT","DELETE"] = "GET"
    prefix: Optional[str] = None         # only for APIRouter include_router

class PluginManifest(BaseModel):
    id: str
    version: str = "0.1.0"
    tasks: List[str] = []
    routes: List[Union[APIRouter, Route]] = []            # ← new

    class Config:
        arbitrary_types_allowed = True
