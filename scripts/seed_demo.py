"""Insert demo data so the dashboard isn’t empty on first run."""
import asyncio, uuid
from app.db.session import get_async_session
from app.models import Project, SavingEvent

async def main():
    async with get_async_session() as session:
        proj = Project(id=uuid.uuid4(), name="Demo Project")
        session.add(proj)
        session.add(SavingEvent(project_id=proj.id, co2_saved=42.0, usd_saved=13.37))
        await session.commit()

if __name__ == "__main__":
    asyncio.run(main())
