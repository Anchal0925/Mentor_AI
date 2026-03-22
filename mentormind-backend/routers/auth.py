from fastapi import APIRouter, HTTPException
from passlib.hash import bcrypt
from database import get_pool
from models import RegisterRequest, LoginRequest, AuthResponse

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register", response_model=AuthResponse, status_code=201)
async def register(body: RegisterRequest):
    pool  = await get_pool()
    email = body.email.lower().strip()
    hashed = bcrypt.hash(body.password)

    async with pool.acquire() as conn:
        existing = await conn.fetchrow("SELECT user_id FROM users WHERE email=$1", email)
        if existing:
            raise HTTPException(status_code=409, detail="Email already registered")

        user = await conn.fetchrow(
            "INSERT INTO users (email, password_hash) VALUES ($1,$2) RETURNING user_id, email",
            email, hashed,
        )
        await conn.execute(
            "INSERT INTO user_stats (user_id) VALUES ($1) ON CONFLICT DO NOTHING",
            user["user_id"],
        )

    return AuthResponse(user_id=user["user_id"], email=user["email"], message="Account created successfully")


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest):
    pool  = await get_pool()
    email = body.email.lower().strip()

    async with pool.acquire() as conn:
        user = await conn.fetchrow(
            "SELECT user_id, email, password_hash FROM users WHERE email=$1", email
        )

    if not user or not bcrypt.verify(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return AuthResponse(user_id=user["user_id"], email=user["email"], message="Login successful")
