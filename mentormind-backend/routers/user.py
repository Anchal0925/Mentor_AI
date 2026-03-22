from fastapi import APIRouter, HTTPException
from uuid import UUID
from database import get_pool
from models import (
    UserStatsResponse, UpdateStatsRequest,
    WeakAreaResponse, GapAnalysisResponse,
    BehavioralFlagResponse, FrequentBugResponse,
    SessionResponse, DashboardResponse,
)

router = APIRouter(prefix="/api/user", tags=["User"])


async def _fetch_user_stats(conn, user_id: UUID) -> dict:
    row = await conn.fetchrow(
        """SELECT u.user_id, u.email,
                  s.ques_attempted, s.ques_mastered, s.completed_sessions,
                  s.current_streak, s.hint_dependency_score,
                  s.avg_delete_ratio, s.leaderboard_rank
           FROM users u
           LEFT JOIN user_stats s USING (user_id)
           WHERE u.user_id = $1""",
        user_id,
    )
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    return dict(row)


@router.get("/{user_id}", response_model=UserStatsResponse)
async def get_user(user_id: UUID):
    pool = await get_pool()
    async with pool.acquire() as conn:
        return await _fetch_user_stats(conn, user_id)


@router.put("/{user_id}/stats", response_model=UserStatsResponse)
async def update_stats(user_id: UUID, body: UpdateStatsRequest):
    pool    = await get_pool()
    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    set_clauses = ", ".join(f"{col} = ${i+2}" for i, col in enumerate(updates))
    values      = list(updates.values())

    async with pool.acquire() as conn:
        await conn.execute(
            f"UPDATE user_stats SET {set_clauses}, updated_at = NOW() WHERE user_id = $1",
            user_id, *values,
        )
        return await _fetch_user_stats(conn, user_id)


@router.get("/{user_id}/dashboard", response_model=DashboardResponse)
async def get_dashboard(user_id: UUID):
    pool = await get_pool()
    async with pool.acquire() as conn:
        user = await _fetch_user_stats(conn, user_id)

        weak_areas = [dict(r) for r in await conn.fetch(
            "SELECT * FROM weak_areas WHERE user_id=$1 ORDER BY score ASC", user_id,
        )]

        gap_row = await conn.fetchrow(
            "SELECT * FROM gap_analysis WHERE user_id=$1 AND is_active=TRUE ORDER BY generated_at DESC LIMIT 1",
            user_id,
        )
        gap = dict(gap_row) if gap_row else None

        flags = [dict(r) for r in await conn.fetch(
            "SELECT * FROM behavioral_flags WHERE user_id=$1 ORDER BY flagged_at DESC", user_id,
        )]

        bug_row = await conn.fetchrow(
            "SELECT * FROM frequent_bugs WHERE user_id=$1 ORDER BY occurrences DESC LIMIT 1", user_id,
        )
        top_bug = dict(bug_row) if bug_row else None

        recent_sessions = [dict(r) for r in await conn.fetch(
            "SELECT * FROM sessions WHERE user_id=$1 ORDER BY started_at DESC LIMIT 7", user_id,
        )]

    return DashboardResponse(
        user=user, weak_areas=weak_areas, gap_analysis=gap,
        behavioral_flags=flags, most_frequent_bug=top_bug, recent_sessions=recent_sessions,
    )
