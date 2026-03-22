from __future__ import annotations
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email:    EmailStr
    password: str = Field(min_length=6)

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str

class AuthResponse(BaseModel):
    user_id: UUID
    email:   str
    message: str


# ── User / Stats ──────────────────────────────────────────────────────────────

class UserStatsResponse(BaseModel):
    user_id:               UUID
    email:                 str
    ques_attempted:        int
    ques_mastered:         int
    completed_sessions:    int
    current_streak:        int
    hint_dependency_score: float
    avg_delete_ratio:      float
    leaderboard_rank:      Optional[int]

class UpdateStatsRequest(BaseModel):
    ques_attempted:        Optional[int]   = None
    ques_mastered:         Optional[int]   = None
    completed_sessions:    Optional[int]   = None
    current_streak:        Optional[int]   = None
    hint_dependency_score: Optional[float] = None
    avg_delete_ratio:      Optional[float] = None
    leaderboard_rank:      Optional[int]   = None


# ── Sessions ──────────────────────────────────────────────────────────────────

class CreateSessionRequest(BaseModel):
    user_id: UUID
    topic:   Optional[str] = None

class EndSessionRequest(BaseModel):
    problems_done: int   = 0
    hints_used:    int   = 0
    deletes_made:  int   = 0

class SessionResponse(BaseModel):
    session_id:    UUID
    user_id:       UUID
    started_at:    datetime
    ended_at:      Optional[datetime]
    problems_done: int
    hints_used:    int
    deletes_made:  int
    topic:         Optional[str]


# ── Weak Areas ────────────────────────────────────────────────────────────────

class WeakAreaUpsert(BaseModel):
    user_id:  UUID
    topic:    str
    score:    float = Field(ge=0.0, le=100.0)
    attempts: int   = Field(ge=0)

class WeakAreaResponse(BaseModel):
    id:        int
    user_id:   UUID
    topic:     str
    score:     float
    attempts:  int
    last_seen: datetime

class WeakAreasBulkRequest(BaseModel):
    user_id: UUID
    areas:   List[WeakAreaUpsert]


# ── Gap Analysis ──────────────────────────────────────────────────────────────

class GapAnalysisCreate(BaseModel):
    user_id:            UUID
    insight:            str
    recommended_topics: List[str] = []

class GapAnalysisResponse(BaseModel):
    id:                 int
    user_id:            UUID
    generated_at:       datetime
    insight:            str
    recommended_topics: List[str]
    is_active:          bool


# ── Behavioral Flags ──────────────────────────────────────────────────────────

class BehavioralFlagCreate(BaseModel):
    user_id:  UUID
    flag:     str
    severity: str = "low"

    @field_validator("severity")
    @classmethod
    def check_severity(cls, v: str) -> str:
        if v not in ("low", "medium", "high"):
            raise ValueError("severity must be low | medium | high")
        return v

class BehavioralFlagResponse(BaseModel):
    id:         int
    user_id:    UUID
    flag:       str
    severity:   str
    flagged_at: datetime


# ── Frequent Bugs ─────────────────────────────────────────────────────────────

class FrequentBugUpsert(BaseModel):
    user_id:  UUID
    bug_type: str

class FrequentBugResponse(BaseModel):
    id:          int
    user_id:     UUID
    bug_type:    str
    occurrences: int
    last_seen:   datetime


# ── Leaderboard ───────────────────────────────────────────────────────────────

class LeaderboardEntry(BaseModel):
    rank:           int
    user_id:        UUID
    email:          str
    ques_mastered:  int
    current_streak: int


# ── Dashboard ─────────────────────────────────────────────────────────────────

class DashboardResponse(BaseModel):
    user:              UserStatsResponse
    weak_areas:        List[WeakAreaResponse]
    gap_analysis:      Optional[GapAnalysisResponse]
    behavioral_flags:  List[BehavioralFlagResponse]
    most_frequent_bug: Optional[FrequentBugResponse]
    recent_sessions:   List[SessionResponse]
