from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from .database import get_db
from .models import Question, OnboardingSession, UserBaseline
from .services import select_next, bayesian_update, theta_label

router = APIRouter(tags=["onboarding"])


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class StartReq(BaseModel):
    user_id: str


class AnswerReq(BaseModel):
    user_id:     str
    question_id: int
    answer:      str
    session_id:  Optional[int] = None


# ── Helpers ───────────────────────────────────────────────────────────────────

def _question_out(q: Question, number: int, total: int) -> dict:
    return {
        "id":              q.id,
        "text":            q.text,
        "question_type":   q.question_type,
        "options":         q.options,
        "concept":         q.concept,
        "difficulty_level": q.difficulty_level,
        "question_number": number,
        "total_questions": total,
    }


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/start")
def start(req: StartReq, db: Session = Depends(get_db)):
    """
    Begin an adaptive onboarding session for a user.
    Returns early if the user already has a baseline.
    """
    baseline = db.query(UserBaseline).filter_by(user_id=req.user_id).first()
    if baseline:
        return {"already_onboarded": True, "message": "User already has a baseline."}

    session = OnboardingSession(user_id=req.user_id, responses=[])
    db.add(session)
    db.commit()
    db.refresh(session)

    questions = db.query(Question).all()
    first_q   = select_next(0.0, [], questions)

    return {
        "already_onboarded": False,
        "session_id":        session.id,
        "question":          _question_out(first_q, 1, 3),
        "theta":             0.0,
        "se":                1.0,
    }


@router.post("/answer")
def answer(req: AnswerReq, db: Session = Depends(get_db)):
    """
    Submit an answer, update the IRT theta estimate, and return the next question.
    Finalises the session and creates a UserBaseline after 3 answers.
    """
    session  = db.query(OnboardingSession).filter_by(user_id=req.user_id, finalized=False).first()
    question = db.query(Question).filter_by(id=req.question_id).first()

    if not session or not question:
        raise HTTPException(status_code=404, detail="Session or Question not found")

    # Determine correctness
    qtype   = question.question_type or "mcq"
    correct = (
        req.answer.upper() == (question.correct_answer or "A").upper()
        if qtype == "mcq"
        else len(req.answer.strip()) > 10   # simple length heuristic for open questions
    )

    new_theta = bayesian_update(session.theta, question.irt_a, question.irt_b, question.irt_c, correct)

    responses = list(session.responses or [])
    responses.append({
        "question_id": req.question_id,
        "answer":      req.answer,
        "correct":     correct,
        "theta_after": new_theta,
    })

    session.theta    = new_theta
    session.responses = responses
    db.commit()

    # Finalise after 3 answers
    if len(responses) >= 3:
        session.finalized     = True
        session.ability_label = theta_label(session.theta)
        db.add(UserBaseline(
            user_id          = req.user_id,
            session_id       = session.id,
            baseline_theta   = session.theta,
            baseline_label   = session.ability_label,
            baseline_profile = {},
            baseline_gaps    = {},
        ))
        db.commit()
        return {
            "question":   None,
            "theta":      round(session.theta, 3),
            "is_finished": True,
            "message":    f"Complete! Baseline: {session.ability_label}",
        }

    all_qs      = db.query(Question).all()
    answered_ids = [r["question_id"] for r in responses]
    next_q       = select_next(new_theta, answered_ids, all_qs)

    return {
        "question":   _question_out(next_q, len(responses) + 1, 3),
        "theta":      round(new_theta, 3),
        "is_finished": False,
    }
