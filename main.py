import asyncio

from core.config_loader import ConfigLoader
from core.engine import AsyncTestEngine
from core.metrics import MetricsCollector
from core.reporter import Reporter


async def main():
    config = ConfigLoader("config/test_plan.json").load()

    engine = AsyncTestEngine(config)

    output = await engine.run()

    metrics = MetricsCollector(
        output["results"],
        output["total_duration"],
    ).compute()

    Reporter.print_terminal_summary(metrics, config)

    Reporter.generate_markdown_report(
        metrics,
        config,
        "reports/report.md",
    )

    print("\nReport generated successfully!")


if __name__ == "__main__":
    asyncio.run(main())