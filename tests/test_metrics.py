import pytest
from core.metrics import MetricsCollector


def test_empty_metrics():
    collector = MetricsCollector([], 5.0)
    metrics = collector.compute()

    assert metrics["total_requests"] == 0
    assert metrics["successful_requests"] == 0
    assert metrics["rps"] == 0.0
    assert metrics["avg_latency_ms"] == 0.0


def test_successful_metrics_calculation():
    raw_results = [
        {"status_code": 200, "latency_ms": 10.0, "is_success": True, "is_timeout": False, "error": None},
        {"status_code": 200, "latency_ms": 20.0, "is_success": True, "is_timeout": False, "error": None},
        {"status_code": 200, "latency_ms": 30.0, "is_success": True, "is_timeout": False, "error": None},
        {"status_code": 500, "latency_ms": 40.0, "is_success": False, "is_timeout": False, "error": "Server error"},
        {"status_code": None, "latency_ms": 100.0, "is_success": False, "is_timeout": True, "error": "Timeout"},
    ]

    collector = MetricsCollector(raw_results, 2.0)
    metrics = collector.compute()

    assert metrics["total_requests"] == 5
    assert metrics["successful_requests"] == 3
    assert metrics["failed_requests"] == 2
    assert metrics["timeout_requests"] == 1
    assert metrics["success_rate_pct"] == 60.0
    assert metrics["error_rate_pct"] == 40.0
    assert metrics["rps"] == 2.5
    assert metrics["min_latency_ms"] == 10.0
    assert metrics["max_latency_ms"] == 100.0
    assert metrics["avg_latency_ms"] == 40.0
    assert metrics["p50_latency_ms"] == 30.0


def test_percentile_sorting():
    latencies = [float(x) for x in range(1, 101)]
    raw_results = [
        {"status_code": 200, "latency_ms": lat, "is_success": True, "is_timeout": False, "error": None}
        for lat in latencies
    ]

    collector = MetricsCollector(raw_results, 1.0)
    metrics = collector.compute()

    assert metrics["p50_latency_ms"] == pytest.approx(50.5, abs=0.5)
    assert metrics["p90_latency_ms"] == pytest.approx(90.1, abs=0.5)
    assert metrics["p95_latency_ms"] == pytest.approx(95.05, abs=0.5)
    assert metrics["p99_latency_ms"] == pytest.approx(99.01, abs=0.5)
