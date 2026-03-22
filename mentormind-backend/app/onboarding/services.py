import math


def irt_p(theta: float, a: float, b: float, c: float) -> float:
    """3-parameter IRT probability of a correct response."""
    return c + (1 - c) / (1 + math.exp(-a * (theta - b)))


def fisher_info(theta: float, a: float, b: float, c: float) -> float:
    """Fisher information for item selection (maximise information at current theta)."""
    p = irt_p(theta, a, b, c)
    q = 1 - p
    if p <= 0 or q <= 0:
        return 0.0
    return (a ** 2 * q * (p - c) ** 2) / (p * (1 - c) ** 2 + 1e-9)


def bayesian_update(theta: float, a: float, b: float, c: float, correct: bool) -> float:
    """Simple gradient step that moves theta toward the ability estimate."""
    p = irt_p(theta, a, b, c)
    delta = 0.3 * (1 - p) if correct else -0.3 * p
    return max(-4.0, min(4.0, theta + delta))


def theta_label(t: float) -> str:
    if t < -1.5: return "Beginner"
    if t < -0.5: return "Elementary"
    if t <  0.5: return "Intermediate"
    if t <  1.5: return "Advanced"
    return "Expert"


def select_next(theta: float, answered_ids: list, questions: list):
    """Choose the question that maximises Fisher information at current theta."""
    candidates = [q for q in questions if q.id not in answered_ids]
    if not candidates:
        return None
    return max(candidates, key=lambda q: fisher_info(theta, q.irt_a, q.irt_b, q.irt_c))
