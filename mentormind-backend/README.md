# MentorMind AI — Backend API

FastAPI + PostgreSQL backend for the MentorMind adaptive DSA learning platform.

---

## Quick Start

### 1. Clone & install

```bash
pip install -r requirements.txt
```

### 2. Create the database

```bash
psql -U postgres -c "CREATE DATABASE mentormind;"
psql -U postgres -d mentormind -f schema.sql
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your DB credentials
```

### 4. Run

```bash
uvicorn main:app --reload --port 4000
```

Interactive docs available at: **http://localhost:4000/docs**

---

## Project Structure

```
mentormind-backend/
├── main.py                  # FastAPI app + CORS + lifespan
├── database.py              # asyncpg connection pool
├── models.py                # All Pydantic request/response schemas
├── schema.sql               # PostgreSQL DDL (run once)
├── requirements.txt
├── .env.example
└── routers/
    ├── auth.py              # Register / Login
    ├── user.py              # Profile, stats, full dashboard
    ├── progress.py          # Sessions, streak
    ├── analytics.py         # Weak areas, gap analysis, bugs, flags
    └── leaderboard.py       # Rankings
```

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login (returns user info) |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/{user_id}` | Profile + all stats |
| PUT | `/api/user/{user_id}/stats` | Update any stat field |
| GET | `/api/user/{user_id}/dashboard` | **Full dashboard in one call** |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/progress/sessions/start` | Start a session |
| PUT | `/api/progress/sessions/{session_id}/end` | End session, auto-update stats |
| GET | `/api/progress/sessions/{user_id}` | All sessions |
| GET | `/api/progress/sessions/{user_id}/recent?days=7` | Last N days |
| POST | `/api/progress/streak/{user_id}?streak=12` | Set streak |

### Analytics — Weak Areas
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/weak-areas/{user_id}` | List weak areas (sorted worst-first) |
| POST | `/api/analytics/weak-areas` | Upsert one topic |
| POST | `/api/analytics/weak-areas/bulk` | Upsert many topics at once |
| DELETE | `/api/analytics/weak-areas/{user_id}/{topic}` | Remove a topic |

### Analytics — Gap Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/gap-analysis/{user_id}` | Active AI tutor insight |
| POST | `/api/analytics/gap-analysis` | Create new insight (auto-deactivates old) |
| GET | `/api/analytics/gap-analysis/{user_id}/history` | All past insights |

### Analytics — Behavioral Flags
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/flags/{user_id}` | List all flags |
| POST | `/api/analytics/flags` | Add a flag |
| DELETE | `/api/analytics/flags/{flag_id}` | Remove a flag |

### Analytics — Frequent Bugs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/bugs/{user_id}` | List bugs (most frequent first) |
| POST | `/api/analytics/bugs` | Record a bug (auto-increments count) |
| DELETE | `/api/analytics/bugs/{user_id}/{bug_type}` | Remove bug entry |

### Analytics — Hint Score
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analytics/hint-score/{user_id}?score=0.4` | Update hint dependency score |

### Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard/?limit=50` | Top N users |
| POST | `/api/leaderboard/recalculate` | Recompute all ranks |

---

## Example Payloads

### Register
```json
POST /api/auth/register
{
  "email": "lakshay@example.com",
  "password": "secure123"
}
```

### Upsert Weak Areas (bulk)
```json
POST /api/analytics/weak-areas/bulk
{
  "user_id": "uuid-here",
  "areas": [
    { "user_id": "uuid-here", "topic": "Recursion",    "score": 32.5, "attempts": 5 },
    { "user_id": "uuid-here", "topic": "Memoization",  "score": 41.0, "attempts": 3 },
    { "user_id": "uuid-here", "topic": "Tree Traversal","score": 55.0, "attempts": 8 }
  ]
}
```

### Create Gap Analysis
```json
POST /api/analytics/gap-analysis
{
  "user_id": "uuid-here",
  "insight": "In your last 3 sessions, you consistently struggled with identifying overlapping subproblems. I've queued up a specialized set of Memoization tasks tailored to how you process tree traversals.",
  "recommended_topics": ["Memoization", "Tree Traversal", "Overlapping Subproblems"]
}
```

### End Session
```json
PUT /api/progress/sessions/{session_id}/end
{
  "problems_done": 4,
  "hints_used": 6,
  "deletes_made": 120
}
```

---

## Notes

- **No auth middleware** on routes as requested — add `requireAuth` later by passing user_id in the path/body.
- `avg_delete_ratio` is automatically recalculated on session end.
- `leaderboard_rank` is stored in `user_stats` for fast reads; call `/api/leaderboard/recalculate` nightly.
- Gap analysis deactivates all previous entries when a new one is posted, ensuring only one active insight per user.
