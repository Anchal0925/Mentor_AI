"""
embeddings.py – CodeBERT embeddings with a hash-based fallback.
"""
from typing import Optional
import numpy as np

_tokenizer = None
_model     = None


def _load_model() -> None:
    global _tokenizer, _model
    if _tokenizer is not None:
        return
    try:
        from transformers import AutoTokenizer, AutoModel
        import torch

        print("[embeddings] Loading CodeBERT model… (first time only)")
        _tokenizer = AutoTokenizer.from_pretrained("microsoft/codebert-base")
        _model     = AutoModel.from_pretrained("microsoft/codebert-base")
        _model.eval()
        print("[embeddings] CodeBERT loaded successfully.")
    except Exception as e:
        print(f"[embeddings] WARNING: Could not load CodeBERT: {e}")
        print("[embeddings] Falling back to hash-based embeddings.")
        _tokenizer = "fallback"
        _model     = "fallback"


def get_embedding(code: str, error: str) -> Optional[list]:
    """
    Generate a 768-dim embedding for (code + error).
    Returns None on hard failure; uses hash fallback if transformers unavailable.
    """
    _load_model()

    if _tokenizer == "fallback":
        return _hash_embedding(code + " " + error)

    try:
        import torch

        combined = f"{code.strip()} [SEP] {error.strip()}"
        inputs   = _tokenizer(
            combined, return_tensors="pt",
            max_length=512, truncation=True, padding=True,
        )
        with torch.no_grad():
            outputs = _model(**inputs)

        embedding = outputs.last_hidden_state.mean(dim=1)
        return embedding[0].tolist()

    except Exception as e:
        print(f"[embeddings] Error generating embedding: {e}")
        return None


def cosine_similarity(vec_a: list, vec_b: list) -> float:
    a      = np.array(vec_a)
    b      = np.array(vec_b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))


def _hash_embedding(text: str, dims: int = 768) -> list:
    import hashlib
    result = []
    for i in range(dims):
        h   = hashlib.md5(f"{text}:{i}".encode()).hexdigest()
        val = (int(h[:8], 16) / 0xFFFFFFFF) * 2 - 1
        result.append(val)
    return result
