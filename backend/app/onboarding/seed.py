from .database import SessionLocal, Base, engine
from .models import Question


def seed_db() -> None:
    """Create tables and insert seed questions if the table is empty."""
    Base.metadata.create_all(bind=engine)

    QUESTIONS = [
        dict(
            text="What does a `for` loop do in Python?",
            question_type="mcq",
            options={"A": "Repeats code a fixed number of times", "B": "Defines a function", "C": "Creates a variable"},
            correct_answer="A",
            concept="loops",
            difficulty_level="easy",
            irt_a=1.2, irt_b=-1.5, irt_c=0.25,
        ),
        dict(
            text="Time complexity of a nested loop each running n iterations?",
            question_type="mcq",
            options={"A": "O(n²)", "B": "O(n)", "C": "O(log n)"},
            correct_answer="A",
            concept="loops",
            difficulty_level="hard",
            irt_a=1.5, irt_b=1.5, irt_c=0.25,
        ),
        dict(
            text="Explain recursion in your own words.",
            question_type="open",
            options=None,
            correct_answer=None,
            sample_answer="A function calling itself with a base case to terminate.",
            concept="recursion",
            difficulty_level="medium",
            irt_a=1.3, irt_b=0.2, irt_c=0.0,
        ),
    ]

    db = SessionLocal()
    try:
        if db.query(Question).count() == 0:
            for q in QUESTIONS:
                db.add(Question(**q))
            db.commit()
    finally:
        db.close()
