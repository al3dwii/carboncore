# backend/app/routers/__init__.py
from .health import router as health_router   # ← add this

__all__ = ["health_router", ...]              # keep existing names
