from fastapi import APIRouter, HTTPException
from uuid import UUID
from database import get_pool
from models import (
    WeakAreaUpsert, WeakAreaResponse, WeakAreasBulkRequest,
    GapAnalysisCreate, GapAnalysisResponse,
    BehavioralFlagCreate, BehavioralFlagResponse,
    FrequentBugUpsert, FrequentBugResponse,
)

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


# ── Weak Areas ────────────────────────────────────────────────────────────────

@router.get("/weak-areas/{user_id}", response_model=list[WeakAreaResponse])
async def get_weak_areas(user_id: UUID):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT * FROM weak_areas WHERE user_id=$1 ORDER BY score ASC", user_id,
        )
    return [dict(r) for r in rows]


@router.post("/weak-areas", response_model=WeakAreaResponse, status_code=201)
async def upsert_weak_area(body: WeakAreaUpsert):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """INSERT INTO weak_areas (user_id, topic, score, attempts, last_seen)
               VALUES ($1,$2,$3,$4,NOW())
               ON CONFLICT (user_id, topic)
               DO UPDATE SET score=EXCLUDED.score,
                             attempts=weak_areas.attempts+EXCLUDED.attempts,
                             last_seen=NOW()
               RETURNING *""",
            body.user_id, body.topic, body.score, body.attempts,
        )
    return dict(row)


@router.post("/weak-areas/bulk", response_model=list[WeakAreaResponse])
async def upsert_weak_areas_bulk(body: WeakAreasBulkRequest):
    pool   = await get_pool()
    result = []
    async with pool.acquire() as conn:
        async with conn.transaction():
            for area in body.areas:
                row = await conn.fetchrow(
                    """INSERT INTO weak_areas (user_id, topic, score, attempts, last_seen)
                       VALUES ($1,$2,$3,$4,NOW())
                       ON CONFLICT (user_id, topic)
                       DO UPDATE SET score=EXCLUDED.score,
                                     attempts=weak_areas.attempts+EXCLUDED.attempts,
                                     last_seen=NOW()
                       RETURNING *""",
                    body.user_id, area.topic, area.score, area.attempts,
                )
                result.append(dict(row))
    return result


@router.delete("/weak-areas/{user_id}/{topic}", status_code=204)
async def delete_weak_area(user_id: UUID, topic: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "DELETE FROM weak_areas WHERE user_id=$1 AND topic=$2", user_id, topic,
        )


# ── Gap Analysis ──────────────────────────────────────────────────────────────

@router.get("/gap-analysis/{user_id}", response_model=GapAnalysisResponse)
async def get_active_gap_analysis(user_id: UUID):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM gap_analysis WHERE user_id=$1 AND is_active=TRUE ORDER BY generated_at DESC LIMIT 1",
            user_id,
        )
    if not row:
        raise HTTPException(status_code=404, detail="No active gap analysis found")
    return dict(row)


@router.post("/gap-analysis", response_model=GapAnalysisResponse, status_code=201)
async def create_gap_analysis(body: GapAnalysisCreate):
    pool = await get_pool()
    async with pool.acquire() as conn:
        async with conn.transaction():
            await conn.execute(
                "UPDATE gap_analysis SET is_active=FALSE WHERE user_id=$1", body.user_id,
            )
            row = await conn.fetchrow(
                """INSERT INTO gap_analysis (user_id, insight, recommended_topics, is_active)
                   VALUES ($1,$2,$3,TRUE) RETURNING *""",
                body.user_id, body.insight, body.recommended_topics,
            )
    return dict(row)


@router.get("/gap-analysis/{user_id}/history", response_model=list[GapAnalysisResponse])
async def get_gap_analysis_history(user_id: UUID):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT * FROM gap_analysis WHERE user_id=$1 ORDER BY generated_at DESC", user_id,
        )
    return [dict(r) for r in rows]


# ── Behavioral Flags ──────────────────────────────────────────────────────────

@router.get("/flags/{user_id}", response_model=list[BehavioralFlagResponse])
async def get_flags(user_id: UUID):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT * FROM behavioral_flags WHERE user_id=$1 ORDER BY flagged_at DESC", user_id,
        )
    return [dict(r) for r in rows]


@router.post("/flags", response_model=BehavioralFlagResponse, status_code=201)
async def add_flag(body: BehavioralFlagCreate):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "INSERT INTO behavioral_flags (user_id, flag, severity) VALUES ($1,$2,$3) RETURNING *",
            body.user_id, body.flag, body.severity,
        )
    return dict(row)


@router.delete("/flags/{flag_id}", status_code=204)
async def delete_flag(flag_id: int):
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute("DELETE FROM behavioral_flags WHERE id=$1", flag_id)


# ── Frequent Bugs ─────────────────────────────────────────────────────────────

@router.get("/bugs/{user_id}", response_model=list[FrequentBugResponse])
async def get_bugs(user_id: UUID):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT * FROM frequent_bugs WHERE user_id=$1 ORDER BY occurrences DESC", user_id,
        )
    return [dict(r) for r in rows]


@router.post("/bugs", response_model=FrequentBugResponse, status_code=201)
async def upsert_bug(body: FrequentBugUpsert):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """INSERT INTO frequent_bugs (user_id, bug_type, occurrences, last_seen)
               VALUES ($1,$2,1,NOW())
               ON CONFLICT (user_id, bug_type)
               DO UPDATE SET occurrences=frequent_bugs.occurrences+1, last_seen=NOW()
               RETURNING *""",
            body.user_id, body.bug_type,
        )
    return dict(row)


@router.delete("/bugs/{user_id}/{bug_type}", status_code=204)
async def delete_bug(user_id: UUID, bug_type: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "DELETE FROM frequent_bugs WHERE user_id=$1 AND bug_type=$2", user_id, bug_type,
        )


# ── Hint Score ────────────────────────────────────────────────────────────────

@router.post("/hint-score/{user_id}")
async def update_hint_score(user_id: UUID, score: float):
    if not 0.0 <= score <= 1.0:
        raise HTTPException(status_code=400, detail="Score must be between 0.0 and 1.0")
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "UPDATE user_stats SET hint_dependency_score=$2, updated_at=NOW() WHERE user_id=$1",
            user_id, score,
        )
    return {"user_id": user_id, "hint_dependency_score": score}
