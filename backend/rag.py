import requests
import numpy as np

from .storage import load_index


OLLAMA_URL = "http://localhost:11434"

EMBEDDING_MODEL = "nomic-embed-text"


def create_embedding(text):

    response = requests.post(

        f"{OLLAMA_URL}/api/embeddings",

        json={
            "model": EMBEDDING_MODEL,
            "prompt": text
        },

        timeout=120
    )

    response.raise_for_status()

    return response.json()["embedding"]


def cosine_similarity(a, b):

    a = np.array(
        a,
        dtype=np.float32
    )

    b = np.array(
        b,
        dtype=np.float32
    )

    denominator = (
        np.linalg.norm(a)
        *
        np.linalg.norm(b)
    )

    if denominator == 0:
        return 0.0

    return float(
        np.dot(a, b)
        /
        denominator
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
        query
    )


    results = []


    for item in index:

        score = cosine_similarity(
            query_embedding,
            item["embedding"]
        )

        if score >= threshold:

            results.append({

                "score": round(
                    score,
                    4
                ),

                "source":
                    item["source"],

                "chunk_id":
                    item["chunk_id"],

                "text":
                    item["text"]

            })


    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )


    return results[:top_k]