import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination

from .core.ratelimit import attach
from .core.deps import init_db
from .routers import skus, tokens, carbon

app = FastAPI(title="CarbonCore API", version="0.1.0-beta.1", docs_url="/")

# CORS (wide-open for now)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(skus.router)
app.include_router(tokens.router)
app.include_router(carbon.router)

# Rate-limit & pagination
attach(app)
add_pagination(app)


@app.on_event("startup")
async def _startup() -> None:  # noqa: D401
    await init_db()


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
