import re
import uuid

from pathlib import Path

from .loaders import extract_text

from .rag import create_embedding

from .storage import (
    load_index,
    save_index
)


def clean_text(text):

    text = text.replace(
        "\x00",
        " "
    )

    text = re.sub(
        r"\r\n?",
        "\n",
        text
    )

    text = re.sub(
        r"[ \t]+",
        " ",
        text
    )

    text = re.sub(
        r"\n{3,}",
        "\n\n",
        text
    )

    return text.strip()


def chunk_text(
    text,
    chunk_size=900,
    overlap=150
):

    words = text.split()

    chunks = []

    start = 0


    while start < len(words):

        end = min(
            start + chunk_size,
            len(words)
        )

        chunk = " ".join(
            words[start:end]
        )

        if chunk.strip():

            chunks.append(
                chunk
            )


        if end >= len(words):
            break


        start = end - overlap


    return chunks


def ingest_document(
    file_path: Path,
    source_name: str
):

    text = extract_text(
        file_path
    )

    text = clean_text(
        text
    )


    if len(text) < 50:

        raise ValueError(
            "The document does not contain enough readable text."
        )


    chunks = chunk_text(
        text
    )


    index = load_index()


    # Replace old version of same source

    index = [
        item
        for item in index
        if item["source"] != source_name
    ]


    for number, chunk in enumerate(chunks):

        embedding = create_embedding(
            chunk
        )


        index.append({

            "chunk_id":
                str(uuid.uuid4()),

            "source":
                source_name,

            "chunk_number":
                number,

            "text":
                chunk,

            "embedding":
                embedding

        })


    save_index(
        index
    )


    return {
        "source": source_name,
        "chunks": len(chunks)
    }