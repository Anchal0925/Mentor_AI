-- ══════════════════════════════════════════════════════════════
--  MentorMind AI — PostgreSQL Schema
--  Run once: psql -U postgres -d mentormind -f schema.sql
-- ══════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";      -- for pgvector (mistakes table)

-- ── Users ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  user_id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT        UNIQUE NOT NULL,
  password_hash  TEXT        NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── User Stats ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_stats (
  user_id               UUID  PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  ques_attempted        INT   DEFAULT 0,
  ques_mastered         INT   DEFAULT 0,
  completed_sessions    INT   DEFAULT 0,
  current_streak        INT   DEFAULT 0,
  hint_dependency_score FLOAT DEFAULT 0.0,
  avg_delete_ratio      FLOAT DEFAULT 0.0,
  leaderboard_rank      INT   DEFAULT NULL,
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ── Sessions ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  session_id     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  started_at     TIMESTAMPTZ DEFAULT NOW(),
  ended_at       TIMESTAMPTZ,
  problems_done  INT         DEFAULT 0,
  hints_used     INT         DEFAULT 0,
  deletes_made   INT         DEFAULT 0,
  topic          TEXT        DEFAULT NULL
);

-- ── Weak Areas ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weak_areas (
  id          SERIAL      PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  topic       TEXT        NOT NULL,
  score       FLOAT       DEFAULT 0.0,
  attempts    INT         DEFAULT 0,
  last_seen   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, topic)
);

-- ── Gap Analysis ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gap_analysis (
  id                  SERIAL      PRIMARY KEY,
  user_id             UUID        NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  generated_at        TIMESTAMPTZ DEFAULT NOW(),
  insight             TEXT        NOT NULL,
  recommended_topics  TEXT[]      DEFAULT '{}',
  is_active           BOOLEAN     DEFAULT TRUE
);

-- ── Behavioral Flags ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS behavioral_flags (
  id          SERIAL      PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  flag        TEXT        NOT NULL,
  severity    TEXT        DEFAULT 'low',
  flagged_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Frequent Bugs ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS frequent_bugs (
  id          SERIAL      PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  bug_type    TEXT        NOT NULL,
  occurrences INT         DEFAULT 1,
  last_seen   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, bug_type)
);

-- ── Mistakes (pgvector — debug module) ───────────────────────
CREATE TABLE IF NOT EXISTS mistakes (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT    NOT NULL,
  code_snippet  TEXT    NOT NULL,
  error_message TEXT    NOT NULL,
  mistake_type  TEXT,
  language      TEXT    DEFAULT 'python',
  embedding     vector(768),
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_sessions_user        ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started     ON sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_weak_areas_user      ON weak_areas(user_id);
CREATE INDEX IF NOT EXISTS idx_gap_analysis_user    ON gap_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_bugs_user            ON frequent_bugs(user_id);
CREATE INDEX IF NOT EXISTS idx_flags_user           ON behavioral_flags(user_id);
CREATE INDEX IF NOT EXISTS mistakes_user_idx        ON mistakes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS mistakes_embedding_idx
    ON mistakes USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
