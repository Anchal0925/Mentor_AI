"""
classifier.py – Feature engineering + heuristic thinking-style classifier.
"""
from __future__ import annotations

import statistics
from dataclasses import dataclass, field, asdict
from typing import List, Optional


# ── Data containers ───────────────────────────────────────────────────────────

@dataclass
class RawEvent:
    timestamp: float            # epoch-ms
    type:      str              # "keydown" | "keyup" | "pause" | "content_change" | "first_edit"
    key:       Optional[str]   = None
    duration:  Optional[float] = None   # for pause events (ms)
    delta_ms:  Optional[float] = None   # for first_edit events


@dataclass
class BehaviorFeatures:
    avg_pause_duration: float = 0.0
    total_keystrokes:   int   = 0
    deletion_ratio:     float = 0.0
    time_to_first_edit: float = 0.0
    error_density:      float = 0.0
    run_attempt_count:  int   = 0
    typing_burst_cv:    float = 0.0


@dataclass
class ClassificationResult:
    thinking_style: str
    confidence:     str
    features:       dict = field(default_factory=dict)
    rationale:      str  = ""


# ── Feature engineering ───────────────────────────────────────────────────────

DELETE_KEYS   = {"Backspace", "Delete"}
MODIFIER_KEYS = {"Shift", "Control", "Alt", "Meta", "CapsLock", "Tab", "Escape", "Enter"}


def extract_features(events: List[RawEvent], error_count: int = 0) -> BehaviorFeatures:
    pause_durations: List[float] = []
    deletion_count   = 0
    total_keystrokes = 0
    time_to_first    = 0.0
    run_attempts     = 0
    key_timestamps:  List[float] = []

    for evt in events:
        if evt.type == "keydown":
            total_keystrokes += 1
            key_timestamps.append(evt.timestamp)
            if evt.key in DELETE_KEYS:
                deletion_count += 1
            if evt.key in ("F5", "F9"):
                run_attempts += 1
        elif evt.type == "pause":
            if evt.duration and evt.duration >= 3000:
                pause_durations.append(evt.duration)
        elif evt.type == "first_edit":
            if evt.delta_ms is not None:
                time_to_first = evt.delta_ms

    avg_pause      = statistics.mean(pause_durations) if pause_durations else 0.0
    deletion_ratio = deletion_count / total_keystrokes if total_keystrokes else 0.0

    burst_cv = 0.0
    if len(key_timestamps) >= 3:
        intervals = [
            key_timestamps[i + 1] - key_timestamps[i]
            for i in range(len(key_timestamps) - 1)
            if key_timestamps[i + 1] - key_timestamps[i] < 3000
        ]
        if len(intervals) >= 2:
            mean_i = statistics.mean(intervals)
            sd_i   = statistics.stdev(intervals)
            burst_cv = sd_i / mean_i if mean_i else 0.0

    error_density = (error_count / total_keystrokes * 100) if total_keystrokes else 0.0

    return BehaviorFeatures(
        avg_pause_duration = round(avg_pause, 2),
        total_keystrokes   = total_keystrokes,
        deletion_ratio     = round(deletion_ratio, 4),
        time_to_first_edit = round(time_to_first, 2),
        error_density      = round(error_density, 4),
        run_attempt_count  = run_attempts,
        typing_burst_cv    = round(burst_cv, 4),
    )


# ── Heuristic classifier ──────────────────────────────────────────────────────

THRESHOLDS = {
    "systematic_min_pause":         4000,
    "systematic_max_deletion":      0.12,
    "systematic_max_error_density": 3.0,
    "trial_min_deletion":           0.20,
    "trial_min_run_attempts":       3,
    "trial_max_pause":              2500,
    "anxious_min_first_edit_ms":    8000,
    "anxious_min_deletion":         0.15,
    "anxious_max_pause":            2000,
    "anxious_min_burst_cv":         0.60,
}


def classify(features: BehaviorFeatures) -> ClassificationResult:
    scores: dict[str, int] = {"Systematic": 0, "Trial-and-Error": 0, "Anxious": 0}
    t = THRESHOLDS

    if features.avg_pause_duration >= t["systematic_min_pause"]:     scores["Systematic"]      += 2
    if features.deletion_ratio     <= t["systematic_max_deletion"]:   scores["Systematic"]      += 1
    if features.error_density      <= t["systematic_max_error_density"]: scores["Systematic"]   += 1

    if features.deletion_ratio     >= t["trial_min_deletion"]:        scores["Trial-and-Error"] += 2
    if features.run_attempt_count  >= t["trial_min_run_attempts"]:    scores["Trial-and-Error"] += 2
    if features.avg_pause_duration <= t["trial_max_pause"]:           scores["Trial-and-Error"] += 1

    if features.time_to_first_edit >= t["anxious_min_first_edit_ms"]: scores["Anxious"]         += 2
    if features.deletion_ratio     >= t["anxious_min_deletion"]:      scores["Anxious"]         += 1
    if features.avg_pause_duration <= t["anxious_max_pause"]:         scores["Anxious"]         += 1
    if features.typing_burst_cv    >= t["anxious_min_burst_cv"]:      scores["Anxious"]         += 1

    best_style = max(scores, key=lambda k: scores[k])
    top_score  = scores[best_style]
    total      = sum(scores.values())

    if total == 0:
        confidence = "low"
    else:
        ratio      = top_score / total
        confidence = "high" if ratio >= 0.60 else ("medium" if ratio >= 0.40 else "low")

    rationale_map = {
        "Systematic":      f"avg_pause={features.avg_pause_duration:.0f}ms, deletion_ratio={features.deletion_ratio:.1%}, error_density={features.error_density:.2f}",
        "Trial-and-Error": f"deletion_ratio={features.deletion_ratio:.1%}, run_attempts={features.run_attempt_count}, avg_pause={features.avg_pause_duration:.0f}ms",
        "Anxious":         f"time_to_first={features.time_to_first_edit:.0f}ms, burst_cv={features.typing_burst_cv:.2f}, deletion_ratio={features.deletion_ratio:.1%}",
    }

    return ClassificationResult(
        thinking_style = best_style,
        confidence     = confidence,
        features       = asdict(features),
        rationale      = rationale_map[best_style],
    )
