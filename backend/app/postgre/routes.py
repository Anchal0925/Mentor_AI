"""
routes.py – Context-Aware Debugging endpoints.
  POST /debug/context   → similarity search over past mistakes
  POST /mistakes/log    → store a new mistake + embedding
"""
from fastapi import APIRouter, HTTPException

from .models import (
    DebugContextRequest, DebugContextResponse,
    LogMistakeRequest, SimilarMistake,
)
from .database import get_connection, insert_mistake, find_similar_mistakes
from .embeddings import get_embedding

router     = APIRouter(prefix="/debug",    tags=["Context-Aware Debugging"])
log_router = APIRouter(prefix="/mistakes", tags=["Mistake Logging"])


# ── POST /debug/context ───────────────────────────────────────────────────────

@router.post("/context", response_model=DebugContextResponse)
async def get_debug_context(request: DebugContextRequest):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty.")
    if not request.error.strip():
        raise HTTPException(status_code=400, detail="Error message cannot be empty.")

    current_embedding = get_embedding(request.code, request.error)
    if current_embedding is None:
        return DebugContextResponse(
            user_id          = request.user_id,
            current_error    = request.error,
            similar_mistakes = [],
            message          = "Could not analyse error for similarity. Try again later.",
        )

    conn = await get_connection()
    try:
        raw_results = await find_similar_mistakes(
            conn             = conn,
            user_id          = request.user_id,
            query_embedding  = current_embedding,
            top_k            = 3,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        await conn.close()

    similar_mistakes = [
        SimilarMistake(
            mistake_id       = str(row["id"]),
            mistake_type     = row["mistake_type"] or "unknown",
            code_snippet     = row["code_snippet"],
            error_message    = row["error_message"],
            similarity_score = round(row["similarity"], 3),
            timestamp        = row["created_at"],
            language         = row["language"],
        )
        for row in raw_results
        if row["similarity"] >= 0.5
    ]

    if not similar_mistakes:
        message = "No similar past mistakes found — this might be a new type of error for you."
    elif len(similar_mistakes) == 1:
        message = f"You've encountered a similar error before ({similar_mistakes[0].mistake_type})."
    else:
        types   = list({m.mistake_type for m in similar_mistakes})
        message = f"You've seen similar errors {len(similar_mistakes)} times — often related to {types[0]}."

    return DebugContextResponse(
        user_id          = request.user_id,
        current_error    = request.error,
        similar_mistakes = similar_mistakes,
        message          = message,
    )


# ── POST /mistakes/log ────────────────────────────────────────────────────────

@log_router.post("/log")
async def log_mistake(request: LogMistakeRequest):
    embedding = get_embedding(request.code, request.error)

    conn = await get_connection()
    try:
        mistake_id = await insert_mistake(
            conn         = conn,
            user_id      = request.user_id,
            code         = request.code,
            error        = request.error,
            mistake_type = request.mistake_type or "unclassified",
            language     = request.language or "python",
            embedding    = embedding,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to log mistake: {str(e)}")
    finally:
        await conn.close()

    return {
        "status":           "logged",
        "mistake_id":       mistake_id,
        "embedding_stored": embedding is not None,
    }
