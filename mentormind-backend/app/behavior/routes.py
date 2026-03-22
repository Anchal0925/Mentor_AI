"""
routes.py – FastAPI router for the Thinking Pattern Report feature.
Mounted at prefix="/behavior" in main.py.
"""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .database import get_db
from .models import UserBehavior, ThinkingReport
from .classifier import RawEvent, BehaviorFeatures, extract_features, classify

router = APIRouter(tags=["behavior"])


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class EventPayload(BaseModel):
    timestamp: datetime
    type:      str
    key:       Optional[str]   = None
    duration:  Optional[float] = None
    delta_ms:  Optional[float] = None


class BehaviorLogRequest(BaseModel):
    user_id:       str
    session_id:    str
    events:        List[EventPayload]
    code_snapshot: Optional[str] = None


class BehaviorLogResponse(BaseModel):
    accepted: int
    batch_id: str


class AnalyzeResponse(BaseModel):
    session_id:     str
    thinking_style: str
    confidence:     str
    features:       Dict[str, Any]
    rationale:      str
    cached:         bool = False


# ── Background helper ─────────────────────────────────────────────────────────

async def _persist_batch(
    db:       AsyncSession,
    payload:  BehaviorLogRequest,
    batch_id: str,
) -> None:
    rows = [
        UserBehavior(
            id         = uuid.uuid4(),
            user_id    = payload.user_id,
            session_id = payload.session_id,
            timestamp  = evt.timestamp,
            event_type = evt.type,
            metadata_  = evt.model_dump(exclude={"timestamp", "type"}),
        )
        for evt in payload.events
    ]
    db.add_all(rows)
    await db.commit()


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post(
    "/log",
    response_model = BehaviorLogResponse,
    status_code    = status.HTTP_202_ACCEPTED,
    summary        = "Receive a batched event payload from the Monaco editor",
)
async def log_behavior(
    payload:          BehaviorLogRequest,
    background_tasks: BackgroundTasks,
    db:               AsyncSession = Depends(get_db),
):
    if not payload.events:
        raise HTTPException(status_code=400, detail="events list is empty")

    batch_id = str(uuid.uuid4())
    background_tasks.add_task(_persist_batch, db, payload, batch_id)
    return BehaviorLogResponse(accepted=len(payload.events), batch_id=batch_id)


@router.get(
    "/analyze/{session_id}",
    response_model = AnalyzeResponse,
    summary        = "Run feature engineering + classifier for a session",
)
async def analyze_session(
    session_id: str,
    db:         AsyncSession = Depends(get_db),
    refresh:    bool         = False,
):
    # 1. Check cache
    if not refresh:
        cached = (await db.execute(
            select(ThinkingReport).where(ThinkingReport.session_id == session_id)
        )).scalar_one_or_none()
        if cached:
            return AnalyzeResponse(
                session_id     = session_id,
                thinking_style = cached.thinking_style,
                confidence     = cached.metrics.get("confidence", "unknown"),
                features       = cached.metrics.get("features", {}),
                rationale      = cached.metrics.get("rationale", ""),
                cached         = True,
            )

    # 2. Load raw events
    rows = (await db.execute(
        select(UserBehavior)
        .where(UserBehavior.session_id == session_id)
        .order_by(UserBehavior.timestamp)
    )).scalars().all()

    if not rows:
        raise HTTPException(status_code=404, detail="No events found for session")

    raw_events: List[RawEvent] = [
        RawEvent(
            timestamp = row.timestamp.timestamp() * 1000,
            type      = row.event_type,
            key       = (row.metadata_ or {}).get("key"),
            duration  = (row.metadata_ or {}).get("duration"),
            delta_ms  = (row.metadata_ or {}).get("delta_ms"),
        )
        for row in rows
    ]

    # 3. Feature engineering + classification
    features: BehaviorFeatures = extract_features(raw_events, error_count=0)
    result                      = classify(features)

    # 4. Upsert cache
    user_id = rows[0].user_id
    report  = (await db.execute(
        select(ThinkingReport).where(ThinkingReport.session_id == session_id)
    )).scalar_one_or_none()

    metrics_blob = {
        "confidence": result.confidence,
        "features":   result.features,
        "rationale":  result.rationale,
    }

    if report:
        report.thinking_style = result.thinking_style
        report.metrics        = metrics_blob
    else:
        report = ThinkingReport(
            user_id        = user_id,
            session_id     = session_id,
            thinking_style = result.thinking_style,
            metrics        = metrics_blob,
        )
        db.add(report)

    await db.commit()

    return AnalyzeResponse(
        session_id     = session_id,
        thinking_style = result.thinking_style,
        confidence     = result.confidence,
        features       = result.features,
        rationale      = result.rationale,
        cached         = False,
    )
