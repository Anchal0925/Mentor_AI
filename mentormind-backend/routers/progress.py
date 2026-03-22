from fastapi import APIRouter, HTTPException
from uuid import UUID
from database import get_pool
from models import CreateSessionRequest, EndSessionRequest, SessionResponse

router = APIRouter(prefix="/api/progress", tags=["Progress"])


@router.post("/sessions/start", response_model=SessionResponse, status_code=201)
async def start_session(body: CreateSessionRequest):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "INSERT INTO sessions (user_id, topic) VALUES ($1,$2) RETURNING *",
            body.user_id, body.topic,
        )
    return dict(row)


@router.put("/sessions/{session_id}/end", response_model=SessionResponse)
async def end_session(session_id: UUID, body: EndSessionRequest):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """UPDATE sessions
               SET ended_at=$2, problems_done=$3, hints_used=$4, deletes_made=$5
               WHERE session_id=$1 RETURNING *""",
            session_id, __import__('datetime').datetime.utcnow(),
            body.problems_done, body.hints_used, body.deletes_made,
        )
        if not row:
            raise HTTPException(status_code=404, detail="Session not found")

        user_id = row["user_id"]
        await conn.execute(
            "UPDATE user_stats SET completed_sessions=completed_sessions+1, updated_at=NOW() WHERE user_id=$1",
            user_id,
        )
        avg = await conn.fetchval(
            """SELECT AVG(CASE WHEN problems_done>0 THEN deletes_made::FLOAT/problems_done ELSE 0 END)
               FROM sessions WHERE user_id=$1 AND ended_at IS NOT NULL""",
            user_id,
        )
        await conn.execute(
            "UPDATE user_stats SET avg_delete_ratio=$2 WHERE user_id=$1",
            user_id, float(avg or 0),
        )
    return dict(row)


@router.get("/sessions/{user_id}", response_model=list[SessionResponse])
async def get_sessions(user_id: UUID):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT * FROM sessions WHERE user_id=$1 ORDER BY started_at DESC", user_id,
        )
    return [dict(r) for r in rows]


@router.get("/sessions/{user_id}/recent", response_model=list[SessionResponse])
async def get_recent_sessions(user_id: UUID, days: int = 7):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """SELECT * FROM sessions
               WHERE user_id=$1 AND started_at >= NOW() - INTERVAL '1 day' * $2
               ORDER BY started_at DESC""",
            user_id, days,
        )
    return [dict(r) for r in rows]


@router.post("/streak/{user_id}")
async def update_streak(user_id: UUID, streak: int):
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "UPDATE user_stats SET current_streak=$2, updated_at=NOW() WHERE user_id=$1",
            user_id, streak,
        )
    return {"user_id": user_id, "current_streak": streak}
