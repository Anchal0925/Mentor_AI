mentormind-backend/
├── main.py                  # FastAPI app entry point
├── database.py              # PostgreSQL connection (asyncpg pool)
├── models.py                # Pydantic request/response models
├── routers/
│   ├── auth.py              # /api/auth  (register, login - no JWT but hashed passwords)
│   ├── user.py              # /api/user  (profile, stats)
│   ├── progress.py          # /api/progress (streak, questions, sessions)
│   ├── analytics.py         # /api/analytics (weak_areas, gap_analysis, bugs, flags)
│   └── leaderboard.py       # /api/leaderboard
├── schema.sql               # Full PostgreSQL schema
├── requirements.txt
└── .env.example
