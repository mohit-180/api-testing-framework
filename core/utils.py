import math
import os
from typing import List


def calculate_percentile(data: List[float], percentile: float) -> float:
    if not data:
        return 0.0

    sorted_data = sorted(data)
    n = len(sorted_data)

    if n == 1:
        return sorted_data[0]

    index = (percentile / 100.0) * (n - 1)
    lower = math.floor(index)
    upper = math.ceil(index)

    if lower == upper:
        return sorted_data[int(index)]

    weight = index - lower
    return sorted_data[lower] * (1 - weight) + sorted_data[upper] * weight


def build_full_url(base_url: str, path: str) -> str:
    base = base_url.rstrip("/")
    endpoint = path.lstrip("/")
    return f"{base}/{endpoint}"


def format_ms(val: float) -> str:
    return f"{val:.2f} ms"


def ensure_directory_exists(file_path: str) -> None:
    directory = os.path.dirname(file_path)
    if directory and not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)
