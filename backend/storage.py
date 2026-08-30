from pathlib import Path
import json


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

DATA_DIR.mkdir(exist_ok=True)

INDEX_FILE = DATA_DIR / "index.json"


def load_index():

    if not INDEX_FILE.exists():
        return []

    try:
        with open(
            INDEX_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            return json.load(file)

    except Exception:
        return []


def save_index(index):

    temporary_file = INDEX_FILE.with_suffix(".tmp")

    with open(
        temporary_file,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            index,
            file,
            ensure_ascii=False,
            indent=2
        )

    temporary_file.replace(INDEX_FILE)


def remove_source(source_name):

    index = load_index()

    filtered_index = [
        item
        for item in index
        if item.get("source") != source_name
    ]

    removed = len(index) - len(filtered_index)

    save_index(filtered_index)

    return removed


def get_sources():

    index = load_index()

    return sorted(
        set(
            item.get("source")
            for item in index
            if item.get("source")
        )
    )