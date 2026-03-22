from fastapi import APIRouter
from database import get_pool
from models import LeaderboardEntry

router = APIRouter(prefix="/api/leaderboard", tags=["Leaderboard"])


@router.get("/", response_model=list[LeaderboardEntry])
async def get_leaderboard(limit: int = 50):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """SELECT ROW_NUMBER() OVER (ORDER BY s.ques_mastered DESC, s.current_streak DESC) AS rank,
                      u.user_id, u.email, s.ques_mastered, s.current_streak
               FROM user_stats s JOIN users u USING (user_id)
               ORDER BY rank LIMIT $1""",
            limit,
        )
    return [dict(r) for r in rows]


@router.post("/recalculate")
async def recalculate_ranks():
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            """UPDATE user_stats AS s
               SET leaderboard_rank = ranked.rank
               FROM (
                 SELECT user_id,
                        ROW_NUMBER() OVER (ORDER BY ques_mastered DESC, current_streak DESC) AS rank
                 FROM user_stats
               ) ranked
               WHERE s.user_id = ranked.user_id"""
        )
    return {"message": "Leaderboard ranks recalculated"}
