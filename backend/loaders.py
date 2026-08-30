from pathlib import Path
from pypdf import PdfReader
from docx import Document


SUPPORTED_EXTENSIONS = {
    ".txt",
    ".md",
    ".pdf",
    ".docx"
}


def extract_text(file_path: Path) -> str:

    extension = file_path.suffix.lower()

    if extension in {".txt", ".md"}:
        return file_path.read_text(
            encoding="utf-8",
            errors="ignore"
        )

    if extension == ".pdf":

        reader = PdfReader(str(file_path))

        pages = []

        for page in reader.pages:

            text = page.extract_text()

            if text:
                pages.append(text)

        return "\n\n".join(pages)

    if extension == ".docx":

        document = Document(str(file_path))

        paragraphs = []

        for paragraph in document.paragraphs:

            text = paragraph.text.strip()

            if text:
                paragraphs.append(text)

        return "\n\n".join(paragraphs)

    raise ValueError(
        "Unsupported file type."
    )