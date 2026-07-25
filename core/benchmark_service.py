from typing import Any, Dict, Optional

from core.engine import AsyncTestEngine
from core.metrics import MetricsCollector
from core.reporter import Reporter


async def run_benchmark(
    config: Dict[str, Any],
    output_path: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Execute a benchmark using the provided configuration.

    Returns:
        {
            "metrics": ...,
            "results": ...,
            "total_duration": ...
        }
    """

    engine = AsyncTestEngine(config)

    output = await engine.run()

    metrics = MetricsCollector(
        output["results"],
        output["total_duration"],
    ).compute()

    if output_path:
        Reporter.generate_markdown_report(
            metrics,
            config,
            output_path,
        )

    return {
        "metrics": metrics,
        "results": output["results"],
        "total_duration": output["total_duration"],
    }