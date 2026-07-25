from pathlib import Path
from typing import List, Dict

PROJECT_ROOT = Path(__file__).resolve().parent.parent

ALLOWED_DIRS = [
    "api",
    "config",
    "core",
    "tests",
    "reports",
    "frontend/src",
]

ALLOWED_ROOT_FILES = {
    "main.py",
    "requirements.txt",
    "README.md",
}

ALLOWED_EXTENSIONS = {
    ".py",
    ".json",
    ".yaml",
    ".yml",
    ".md",
    ".ts",
    ".tsx",
    ".css",
}


def load_repository_files() -> List[Dict[str, str]]:
    files: List[Dict[str, str]] = []

    # Root files
    for filename in ALLOWED_ROOT_FILES:
        path = PROJECT_ROOT / filename

        if path.exists():
            files.append(
                {
                    "path": filename,
                    "label": path.name,
                    "content": path.read_text(encoding="utf-8"),
                }
            )

    # Allowed directories
    for directory in ALLOWED_DIRS:
        base = PROJECT_ROOT / directory

        if not base.exists():
            continue

        for file in base.rglob("*"):
            if (
                file.is_file()
                and file.suffix.lower() in ALLOWED_EXTENSIONS
            ):
                relative = file.relative_to(PROJECT_ROOT)

                files.append(
                    {
                        "path": relative.as_posix(),
                        "label": file.name,
                        "content": file.read_text(
                            encoding="utf-8",
                            errors="ignore",
                        ),
                    }
                )

    files.sort(key=lambda f: f["path"])

    return files