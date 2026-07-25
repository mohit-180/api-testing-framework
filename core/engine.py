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

    async def execute_request(
        self, session: aiohttp.ClientSession, semaphore: asyncio.Semaphore, endpoint: Dict[str, Any]
    ) -> Dict[str, Any]:
        url = build_full_url(self.base_url, endpoint["path"])
        method = endpoint.get("method", "GET").upper()

        headers = {**self.global_headers, **endpoint.get("headers", {})}
        body = endpoint.get("body")

        timeout = aiohttp.ClientTimeout(total=self.timeout)

        async with semaphore:
            start_time = time.perf_counter()
            status_code = None
            is_success = False
            is_timeout = False
            error_msg = None

            try:
                kwargs: Dict[str, Any] = {"headers": headers, "timeout": timeout}
                if body is not None and method in ["POST", "PUT", "PATCH"]:
                    if isinstance(body, (dict, list)):
                        kwargs["json"] = body
                    else:
                        kwargs["data"] = str(body)

                async with session.request(method, url, **kwargs) as response:
                    await response.read()
                    elapsed_ms = (time.perf_counter() - start_time) * 1000.0
                    status_code = response.status
                    is_success = 200 <= status_code < 400

            except asyncio.TimeoutError:
                elapsed_ms = (time.perf_counter() - start_time) * 1000.0
                is_timeout = True
                error_msg = "Request Timeout"

            except aiohttp.ClientConnectorError as e:
                elapsed_ms = (time.perf_counter() - start_time) * 1000.0
                error_msg = f"Connection Refused / Failed: {e}"

            except aiohttp.ClientError as e:
                elapsed_ms = (time.perf_counter() - start_time) * 1000.0
                error_msg = f"Client Error: {e}"

            except Exception as e:
                elapsed_ms = (time.perf_counter() - start_time) * 1000.0
                error_msg = f"Unexpected Error: {e}"

            return {
                "endpoint_path": endpoint["path"],
                "method": method,
                "status_code": status_code,
                "latency_ms": elapsed_ms,
                "is_success": is_success,
                "is_timeout": is_timeout,
                "error": error_msg,
            }

    async def run(self) -> Dict[str, Any]:
        semaphore = asyncio.Semaphore(self.concurrency)
        results: List[Dict[str, Any]] = []

        start_time = time.perf_counter()

        async with aiohttp.ClientSession() as session:
            tasks = []
            for i in range(self.total_requests):
                endpoint = self.endpoints[i % len(self.endpoints)]
                tasks.append(self.execute_request(session, semaphore, endpoint))

            results = await asyncio.gather(*tasks)

        total_duration = time.perf_counter() - start_time

        return {
            "results": results,
            "total_duration": total_duration,
        }        