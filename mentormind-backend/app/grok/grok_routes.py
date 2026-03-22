"""
grok_routes.py – Placeholder Grok/AI router.
Replace with your actual AI routes when ready.
"""
from fastapi import APIRouter

router = APIRouter(tags=["AI"])


@router.get("/status")
async def ai_status():
    return {"status": "Grok AI module ready"}
