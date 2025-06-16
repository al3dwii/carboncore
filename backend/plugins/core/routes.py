from fastapi import FastAPI
from app.routers import skus, carbon, events, tokens


def register_routes(app: FastAPI) -> None:
    app.include_router(skus.router)
    app.include_router(carbon.router)
    app.include_router(events.router)
    app.include_router(tokens.router)
