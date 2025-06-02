from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import create_engine, sessionmaker
from .settings import get_settings

settings = get_settings()
engine = create_engine(settings.database_url, echo=False, future=True)
AsyncSessionLocal = sessionmaker(engine, AsyncSession, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
