import uvicorn
from fastapi import Depends, FastAPI, Header, HTTPException, status
from sqlmodel import SQLModel
from .core.settings import get_settings
from .core.deps import engine
from .routers import skus, carbon, events

settings = get_settings()
app = FastAPI(title="CarbonCore v0.1")

# Simple token auth
async def auth(token: str = Header(..., alias=settings.project_token_header)):
    if token != "demo":  # TODO: replace with DB lookup
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

app.include_router(skus.router, dependencies=[Depends(auth)])
app.include_router(carbon.router)           # public
app.include_router(events.router, dependencies=[Depends(auth)])

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
