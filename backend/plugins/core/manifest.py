from app.schemas.plugins import PluginManifest
from app.routers.skus import router as skus_router
from app.routers.carbon import router as carbon_router
from app.routers.events import router as events_router
from app.routers.tokens import router as tokens_router

manifest = PluginManifest(
    id="core",
    routes=[
        skus_router,
        carbon_router,
        events_router,
        tokens_router,
    ],
)
