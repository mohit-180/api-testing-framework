import os
from typing import Any, Dict
from core.utils import ensure_directory_exists, format_ms


class Reporter:
    @staticmethod
    def print_terminal_summary(metrics: Dict[str, Any], config: Dict[str, Any]) -> None:
        print("\n" + "=" * 60)
        print("          API BENCHMARK & LOAD GENERATION REPORT          ")
        print("=" * 60)
        print(f" Target Base URL    : {config.get('base_url')}")
        print(f" Total Duration     : {metrics['total_duration_sec']:.3f} seconds")
        print(f" Concurrency Level  : {config.get('concurrent_users')} concurrent users")
        print(f" Total Requests     : {metrics['total_requests']}")
        print(f" Successful (2xx/3xx): {metrics['successful_requests']} ({metrics['success_rate_pct']}%)")
        print(f" Failed / Errors    : {metrics['failed_requests']} ({metrics['error_rate_pct']}%)")
        print(f" Timeouts           : {metrics['timeout_requests']}")
        print(f" Throughput (RPS)   : {metrics['rps']} req/sec")
        print("-" * 60)
        print(" LATENCY DISTRIBUTION:")
        print(f"   Min Latency       : {format_ms(metrics['min_latency_ms'])}")
        print(f"   Avg Latency       : {format_ms(metrics['avg_latency_ms'])}")
        print(f"   Max Latency       : {format_ms(metrics['max_latency_ms'])}")
        print(f"   p50 Percentile    : {format_ms(metrics['p50_latency_ms'])}")
        print(f"   p90 Percentile    : {format_ms(metrics['p90_latency_ms'])}")
        print(f"   p95 Percentile    : {format_ms(metrics['p95_latency_ms'])}")
        print(f"   p99 Percentile    : {format_ms(metrics['p99_latency_ms'])}")
        print("-" * 60)
        print(" HTTP STATUS CODE BREAKDOWN:")
        for code, count in metrics["status_code_distribution"].items():
            pct = round((count / metrics["total_requests"]) * 100, 1) if metrics["total_requests"] > 0 else 0
            print(f"   HTTP {code:<10} : {count:>5} requests ({pct:>5.1f}%)")
        print("=" * 60 + "\n")

    @staticmethod
    def generate_markdown_report(metrics: Dict[str, Any], config: Dict[str, Any], output_file: str) -> str:
        ensure_directory_exists(output_file)

        status_rows = []
        for code, count in metrics["status_code_distribution"].items():
            pct = round((count / metrics["total_requests"]) * 100, 1) if metrics["total_requests"] > 0 else 0
            status_rows.append(f"| `{code}` | {count} | {pct}% |")
        status_table = "\n".join(status_rows) if status_rows else "| None | 0 | 0.0% |"

        endpoint_rows = []
        for ep in config.get("endpoints", []):
            method = ep.get("method", "GET").upper()
            path = ep.get("path", "/")
            name = ep.get("name", "Unnamed")
            endpoint_rows.append(f"| `{method}` | `{path}` | {name} |")
        endpoint_table = "\n".join(endpoint_rows)

        content = f"""# API Load Generation & Benchmark Report

## 1. Executive Summary

| Parameter | Value |
| :--- | :--- |
| **Test Target Base URL** | `{config.get('base_url')}` |
| **Execution Duration** | `{metrics['total_duration_sec']} seconds` |
| **Concurrent Virtual Users** | `{config.get('concurrent_users')}` |
| **Total Requests Executed** | `{metrics['total_requests']}` |
| **Requests Per Second (RPS)** | **`{metrics['rps']} req/s`** |
| **Success Rate** | **`{metrics['success_rate_pct']}%`** |
| **Error Rate** | `{metrics['error_rate_pct']}%` |

---

## 2. Latency Metrics Summary

| Metric | Latency (ms) | Description |
| :--- | :--- | :--- |
| **Minimum Latency** | `{metrics['min_latency_ms']} ms` | Fastest recorded response time |
| **Average Latency** | `{metrics['avg_latency_ms']} ms` | Mean response duration across all requests |
| **Maximum Latency** | `{metrics['max_latency_ms']} ms` | Slowest recorded response time |
| **p50 Percentile** | `{metrics['p50_latency_ms']} ms` | 50% of requests completed faster than this |
| **p90 Percentile** | `{metrics['p90_latency_ms']} ms` | 90% of requests completed faster than this |
| **p95 Percentile** | `{metrics['p95_latency_ms']} ms` | 95% of requests completed faster than this |
| **p99 Percentile** | `{metrics['p99_latency_ms']} ms` | 99% of requests completed faster than this |

---

## 3. Status Code Breakdown

| HTTP Status Code | Count | Share |
| :--- | :--- | :--- |
{status_table}

---

## 4. Tested Endpoints

| Method | Endpoint Path | Description / Name |
| :--- | :--- | :--- |
{endpoint_table}

---

## 5. Environment & Execution Configuration

- **Framework**: Production-Grade Asynchronous REST API Load Generation Framework (Python Asyncio + aiohttp)
- **Timeout Threshold**: `{config.get('timeout')} seconds`
- **Session Strategy**: Single persistent `aiohttp.ClientSession` with connection pooling and semaphore concurrency limiting.

*Report automatically generated on test completion.*
"""

        with open(output_file, "w", encoding="utf-8") as f:
            f.write(content)

        return content
