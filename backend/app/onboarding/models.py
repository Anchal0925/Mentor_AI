from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    JSON, Text, DateTime, ForeignKey,
)
from sqlalchemy.sql import func
from .database import Base


class Question(Base):
    __tablename__ = "questions"

    id               = Column(Integer, primary_key=True, index=True)
    text             = Column(Text,   nullable=False)
    question_type    = Column(String, default="mcq")
    options          = Column(JSON,   nullable=True)
    correct_answer   = Column(String, nullable=True)
    sample_answer    = Column(Text,   nullable=True)
    concept          = Column(String, nullable=False)
    difficulty_level = Column(String, nullable=False)
    irt_a            = Column(Float,  default=1.0)
    irt_b            = Column(Float,  default=0.0)
    irt_c            = Column(Float,  default=0.25)
    follow_up_prompt = Column(Text,   nullable=True)


class OnboardingSession(Base):
    __tablename__ = "onboarding_sessions"

    id            = Column(Integer,  primary_key=True, index=True)
    user_id       = Column(String,   nullable=False, index=True)
    started_at    = Column(DateTime, server_default=func.now())
    completed_at  = Column(DateTime, nullable=True)
    finalized     = Column(Boolean,  default=False)
    theta         = Column(Float,    default=0.0)
    theta_se      = Column(Float,    default=1.0)
    ability_label = Column(String,   default="Intermediate")
    responses     = Column(JSON,     default=list)
    skill_profile = Column(JSON,     default=dict)
    groq_profile  = Column(JSON,     default=dict)


class UserBaseline(Base):
    __tablename__ = "user_baselines"

    id                    = Column(Integer,  primary_key=True, index=True)
    user_id               = Column(String,   unique=True, nullable=False, index=True)
    session_id            = Column(Integer,  ForeignKey("onboarding_sessions.id"))
    created_at            = Column(DateTime, server_default=func.now())
    baseline_theta        = Column(Float,    nullable=False)
    baseline_label        = Column(String,   nullable=False)
    baseline_profile      = Column(JSON,     nullable=False)
    baseline_gaps         = Column(JSON,     nullable=False)
    persistent_weaknesses = Column(JSON,     default=dict)
