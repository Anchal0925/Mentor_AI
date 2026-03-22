"""
database.py – asyncpg connection + pgvector setup for the Debug/Mistakes module.
"""
import os
from typing import Optional

import asyncpg

DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/hindsight",
)

# Strip asyncpg driver prefix if present (asyncpg.connect needs plain postgres://)
if DATABASE_URL.startswith("postgresql+asyncpg://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")


async def get_connection() -> asyncpg.Connection:
    """Returns a single asyncpg connection. Use a pool in production."""
    return await asyncpg.connect(DATABASE_URL)


async def init_db() -> None:
    """
    Create the pgvector extension and the mistakes table.
    Call once on startup inside the lifespan event.
    """
    conn = await get_connection()
    try:
        await conn.execute("""
            CREATE EXTENSION IF NOT EXISTS vector;

            CREATE TABLE IF NOT EXISTS mistakes (
                id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id       TEXT NOT NULL,
                code_snippet  TEXT NOT NULL,
                error_message TEXT NOT NULL,
                mistake_type  TEXT,
                language      TEXT DEFAULT 'python',
                embedding     vector(768),
                created_at    TIMESTAMP DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS mistakes_embedding_idx
                ON mistakes
                USING ivfflat (embedding vector_cosine_ops)
                WITH (lists = 100);

            CREATE INDEX IF NOT EXISTS mistakes_user_idx
                ON mistakes (user_id, created_at DESC);
        """)
    finally:
        await conn.close()


async def insert_mistake(
    conn:         asyncpg.Connection,
    user_id:      str,
    code:         str,
    error:        str,
    mistake_type: str,
    language:     str,
    embedding:    Optional[list] = None,
) -> str:
    embedding_str = f"[{','.join(map(str, embedding))}]" if embedding else None
    row = await conn.fetchrow(
        """
        INSERT INTO mistakes
            (user_id, code_snippet, error_message, mistake_type, language, embedding)
        VALUES ($1, $2, $3, $4, $5, $6::vector)
        RETURNING id
        """,
        user_id, code, error, mistake_type, language, embedding_str,
    )
    return str(row["id"])


async def find_similar_mistakes(
    conn:            asyncpg.Connection,
    user_id:         str,
    query_embedding: list,
    top_k:           int = 3,
) -> list:
    embedding_str = f"[{','.join(map(str, query_embedding))}]"
    rows = await conn.fetch(
        """
        SELECT
            id,
            code_snippet,
            error_message,
            mistake_type,
            language,
            created_at,
            1 - (embedding <-> $1::vector) AS similarity
        FROM mistakes
        WHERE user_id = $2
          AND embedding IS NOT NULL
        ORDER BY embedding <-> $1::vector
        LIMIT $3
        """,
        embedding_str, user_id, top_k,
    )
    return [dict(r) for r in rows]
