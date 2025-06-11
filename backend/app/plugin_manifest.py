from pydantic import BaseModel
from typing import List

class PluginManifest(BaseModel):
    """Schema for plugin metadata."""
    id: str
    version: str = "0.1"
    tasks: List[str] = []
