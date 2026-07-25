from typing import Any, Dict, List
from core.utils import calculate_percentile


class MetricsCollector:
    def __init__(self, raw_results: List[Dict[str, Any]], total_duration_sec: float):
        self.raw_results = raw_results
        self.total_duration_sec = total_duration_sec

    def compute(self) -> Dict[str, Any]:
        total_requests = len(self.raw_results)
        if total_requests == 0:
            return {
                "total_requests": 0,
                "successful_requests": 0,
                "failed_requests": 0,
                "timeout_requests": 0,
                "success_rate_pct": 0.0,
                "error_rate_pct": 0.0,
                "rps": 0.0,
                "avg_latency_ms": 0.0,
                "min_latency_ms": 0.0,
                "max_latency_ms": 0.0,
                "p50_latency_ms": 0.0,
                "p90_latency_ms": 0.0,
                "p95_latency_ms": 0.0,
                "p99_latency_ms": 0.0,
                "status_code_distribution": {},
                "total_duration_sec": self.total_duration_sec,
            }

        latencies = [r["latency_ms"] for r in self.raw_results]
        successful_requests = sum(1 for r in self.raw_results if r["is_success"])
        timeout_requests = sum(1 for r in self.raw_results if r["is_timeout"])
        failed_requests = total_requests - successful_requests

        success_rate_pct = (successful_requests / total_requests) * 100.0
        error_rate_pct = (failed_requests / total_requests) * 100.0

        duration = max(self.total_duration_sec, 0.001)
        rps = total_requests / duration

        avg_latency = sum(latencies) / total_requests
        min_latency = min(latencies)
        max_latency = max(latencies)

        p50 = calculate_percentile(latencies, 50.0)
        p90 = calculate_percentile(latencies, 90.0)
        p95 = calculate_percentile(latencies, 95.0)
        p99 = calculate_percentile(latencies, 99.0)

        status_distribution: Dict[str, int] = {}
        for r in self.raw_results:
            status = r.get("status_code")
            key = str(status) if status is not None else "ERROR/TIMEOUT"
            status_distribution[key] = status_distribution.get(key, 0) + 1

        return {
            "total_requests": total_requests,
            "successful_requests": successful_requests,
            "failed_requests": failed_requests,
            "timeout_requests": timeout_requests,
            "success_rate_pct": round(success_rate_pct, 2),
            "error_rate_pct": round(error_rate_pct, 2),
            "rps": round(rps, 2),
            "avg_latency_ms": round(avg_latency, 2),
            "min_latency_ms": round(min_latency, 2),
            "max_latency_ms": round(max_latency, 2),
            "p50_latency_ms": round(p50, 2),
            "p90_latency_ms": round(p90, 2),
            "p95_latency_ms": round(p95, 2),
            "p99_latency_ms": round(p99, 2),
            "status_code_distribution": status_distribution,
            "total_duration_sec": round(self.total_duration_sec, 3),
        }
