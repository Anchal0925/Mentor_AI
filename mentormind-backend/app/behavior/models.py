"""
models.py – SQLAlchemy ORM models for the Thinking Pattern feature.
Compatible with SQLAlchemy 2.x (async) + asyncpg.
"""
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, String, Text, Index, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class UserBehavior(Base):
    """
    One row per batched event payload from the Monaco editor.
    raw events are stored in the JSONB `metadata_` column.
    """
    __tablename__ = "user_behavior"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id    = Column(String(128), nullable=False, index=True)
    session_id = Column(String(128), nullable=False, index=True)
    timestamp  = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    event_type = Column(String(64),  nullable=False)
    metadata_  = Column("metadata", JSONB, nullable=False, default=dict)

    __table_args__ = (
        Index("ix_user_session", "user_id", "session_id"),
        Index("ix_session_ts",   "session_id", "timestamp"),
    )

    def __repr__(self) -> str:
        return (
            f"<UserBehavior id={self.id} user={self.user_id} "
            f"session={self.session_id} type={self.event_type}>"
        )


class ThinkingReport(Base):
    """
    Caches the latest computed Thinking Style for a (user, session) pair.
    """
    __tablename__ = "thinking_reports"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id        = Column(String(128), nullable=False, index=True)
    session_id     = Column(String(128), nullable=False, unique=True)
    thinking_style = Column(String(64),  nullable=False)
    metrics        = Column(JSONB, nullable=False, default=dict)
    generated_at   = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    def __repr__(self) -> str:
        return f"<ThinkingReport session={self.session_id} style={self.thinking_style}>"
