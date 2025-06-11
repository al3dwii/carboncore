# backend/app/plugin_manifest.py
from pydantic import BaseModel
from typing import List, Literal, Optional

class Route(BaseModel):
    handler: str                         # dotted path  "backend.app.routers.skus:router"
    path: Optional[str] = None           # only for single-function routes
    method: Literal["GET","POST","PUT","DELETE"] = "GET"
    prefix: Optional[str] = None         # only for APIRouter include_router

class PluginManifest(BaseModel):
    id: str
    version: str = "0.1.0"
    tasks: List[str] = []
    routes: List[Route] = []            # ← new
