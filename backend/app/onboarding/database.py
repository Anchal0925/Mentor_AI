import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

_RAW_URL = os.getenv("ONBOARDING_DATABASE_URL", "sqlite:///./hindsight.db")

# Strip asyncpg driver if accidentally pointed at postgres asyncpg URL
if "postgresql+asyncpg" in _RAW_URL:
    DATABASE_URL = _RAW_URL.replace("postgresql+asyncpg", "postgresql")
else:
    DATABASE_URL = _RAW_URL

_connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine       = create_engine(DATABASE_URL, connect_args=_connect_args)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base         = declarative_base()


def get_db():
    """FastAPI sync dependency — yields a DB session and closes on exit."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
