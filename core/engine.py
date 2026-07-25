import asyncio
import time
from typing import Any, Dict, List

import aiohttp

from core.utils import build_full_url


class AsyncTestEngine:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.base_url = config["base_url"]
        self.endpoints = config["endpoints"]
        self.concurrency = config.get("concurrent_users", 5)
        self.total_requests = config.get("number_of_requests", 50)
        self.timeout = config.get("timeout", 10.0)
        self.global_headers = config.get("headers", {})