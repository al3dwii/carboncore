# backend/app/routers/__init__.py
from .health import router as health_router
from .gdpr import router as gdpr_router

__all__ = ["health_router", "gdpr_router"]
