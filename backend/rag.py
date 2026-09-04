import os
import numpy as np

from google import genai
from google.genai import types

from .storage import load_index


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured.")

client = genai.Client(api_key=GEMINI_API_KEY)

EMBEDDING_MODEL = "gemini-embedding-001"


def create_embedding(text, task_type="RETRIEVAL_QUERY"):
    result = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(
            task_type=task_type,
            output_dimensionality=768
        )
    )

    return result.embeddings[0].values


def cosine_similarity(a, b):
    a = np.array(a, dtype=np.float32)
    b = np.array(b, dtype=np.float32)

    if len(a) != len(b):
        return 0.0

    denominator = (
        np.linalg.norm(a)
        *
        np.linalg.norm(b)
    )

    if denominator == 0:
        return 0.0

    return float(
        np.dot(a, b)
        / denominator
    )


def search(
    query,
    top_k=5,
    threshold=0.45
):
    index = load_index()

    if not index:
        return []

    query_embedding = create_embedding(
        query,
        "RETRIEVAL_QUERY"
    )

    results = []

    for item in index:

        score = cosine_similarity(
            query_embedding,
            item["embedding"]
        )

        if score >= threshold:

            results.append({
                "score": round(score, 4),
                "source": item["source"],
                "chunk_id": item["chunk_id"],
                "text": item["text"]
            })

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return results[:top_k]
