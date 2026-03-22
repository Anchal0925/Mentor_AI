from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio

# ── MentorMind core (asyncpg pool) ───────────────────────────────────────────
from database import get_pool, close_pool
from routers import auth, user, progress, analytics, leaderboard

# ── Debug / Postgre module (asyncpg + pgvector) ───────────────────────────────
from app.postgre.routes import router as debug_router, log_router
from app.postgre.database import init_db as init_postgre_db

# ── Behavior module (SQLAlchemy async) ───────────────────────────────────────
from app.behavior.routes import router as behavior_router
from app.behavior.database import create_all_tables as create_behavior_tables
from app.behavior.database import engine as behavior_engine

# ── Onboarding module (sync SQLAlchemy / SQLite) ──────────────────────────────
from app.onboarding.routes import router as onboarding_router
from app.onboarding.seed import seed_db as seed_onboarding_db

# ── Grok / AI module ──────────────────────────────────────────────────────────
from sqlalchemy import text
from app.grok.grok_routes import router as ai_router
from app.grok.grok_models import Base as GrokBase, ADD_COLUMNS_SQL


# ── Lifespan ───────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Pre-warm asyncpg pool (MentorMind core)
    await get_pool()

    # 2. pgvector extension + mistakes table
    try:
        await asyncio.wait_for(init_postgre_db(), timeout=2.0)
    except asyncio.TimeoutError:
        print("Warning: Timed out initialising pgvector/mistakes table.")
    except Exception as e:
        print(f"Warning: pgvector init failed: {e}")

    # 3. SQLAlchemy async tables — behavior + grok (2-second timeout each)
    try:
        await asyncio.wait_for(create_behavior_tables(), timeout=2.0)

        async def _create_grok():
            async with behavior_engine.begin() as conn:
                await conn.run_sync(GrokBase.metadata.create_all)
                if ADD_COLUMNS_SQL:
                    try:
                        await conn.execute(text(ADD_COLUMNS_SQL))
                    except Exception:
                        pass  # columns already exist — safe to ignore

        await asyncio.wait_for(_create_grok(), timeout=2.0)

    except asyncio.TimeoutError:
        print("Warning: Timed out connecting to Postgres for behavior/grok tables.")
    except Exception as e:
        print(f"Warning: behavior/grok table init failed: {e}")

    # 4. Seed sync onboarding tables (creates SQLite file + inserts questions)
    seed_onboarding_db()

    yield

    # 5. Teardown — close asyncpg pool
    await close_pool()


# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="MentorMind AI — Backend API",
    version="1.0.0",
    description="Adaptive DSA learning platform API",
    lifespan=lifespan,
)

# ── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # tighten to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── MentorMind core routers  (/api/...) ───────────────────────────────────────
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(progress.router)
app.include_router(analytics.router)
app.include_router(leaderboard.router)

# ── Debug / Mistakes  (/debug/... and /mistakes/...) ─────────────────────────
app.include_router(debug_router)
app.include_router(log_router)

# ── Modular feature routers ───────────────────────────────────────────────────
app.include_router(onboarding_router, prefix="/api/onboarding")
app.include_router(behavior_router,   prefix="/behavior")
app.include_router(ai_router,         prefix="/ai")


# ── Health ─────────────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health():
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.fetchval("SELECT 1")
    return {"status": "ok", "db": "connected"}
