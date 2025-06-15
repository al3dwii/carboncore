from fastapi import APIRouter, Request
import httpx, os
router = APIRouter(prefix='/analytics')
POSTHOG = os.getenv('POSTHOG_HOST')
@router.post('/')
async def relay(req: Request):
    async with httpx.AsyncClient() as c:
        r = await c.post(f'{POSTHOG}/e', json=await req.json())
    return {'status': r.status_code}
