from typing import Any, Dict, List


def build_terminal_output(
    config: Dict[str, Any],
    metrics: Dict[str, Any],
    report_path: str,
) -> List[str]:
    return [
        "$ python main.py",
        "",
        f"[INFO] Loading configuration...",
        f"[INFO] Target: {config['base_url']}",
        f"[INFO] Concurrency: {config['concurrent_users']}",
        f"[INFO] Requests: {config['number_of_requests']}",
        "",
        "[INFO] Starting benchmark...",
        "[INFO] Benchmark completed successfully.",
        "",
        "===================================================",
        "                 BENCHMARK SUMMARY",
        "===================================================",
        f"Total Requests : {metrics['total_requests']}",
        f"Successful     : {metrics['successful_requests']}",
        f"Failed         : {metrics['failed_requests']}",
        f"Success Rate   : {metrics['success_rate_pct']:.2f}%",
        f"Average Latency: {metrics['avg_latency_ms']:.2f} ms",
        f"Throughput     : {metrics['rps']:.2f} req/sec",
        f"Duration       : {metrics['total_duration_sec']:.2f} sec",
        "===================================================",
        "",
        f"Markdown report written to: {report_path}",
    ]