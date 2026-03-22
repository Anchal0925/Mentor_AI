"""
models.py – Pydantic request/response schemas for Context-Aware Debugging.
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── Request models ────────────────────────────────────────────────────────────

class DebugContextRequest(BaseModel):
    user_id: str
    code:    str
    error:   str


class LogMistakeRequest(BaseModel):
    user_id:      str
    code:         str
    error:        str
    mistake_type: Optional[str] = None
    language:     Optional[str] = "python"


# ── Response models ───────────────────────────────────────────────────────────

class SimilarMistake(BaseModel):
    mistake_id:       str
    mistake_type:     str
    code_snippet:     str
    error_message:    str
    similarity_score: float
    timestamp:        datetime
    language:         str


class DebugContextResponse(BaseModel):
    user_id:          str
    current_error:    str
    similar_mistakes: List[SimilarMistake]
    message:          str
