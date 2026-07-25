import argparse
import asyncio

from core.config_loader import ConfigLoader
from core.engine import AsyncTestEngine
from core.metrics import MetricsCollector
from core.reporter import Reporter


def parse_args():
    parser = argparse.ArgumentParser(
        description="Production-Grade REST API Testing Framework"
    )

    parser.add_argument(
        "--config",
        default="config/test_plan.json",
        help="Path to the JSON or YAML configuration file.",
    )

    parser.add_argument(
        "--output",
        default="reports/report.md",
        help="Path where the markdown report will be generated.",
    )

    return parser.parse_args()


async def run(config_path: str, output_path: str):
    config = ConfigLoader(config_path).load()

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
        output_path,
    )

    print(f"\nReport generated: {output_path}")


def main():
    args = parse_args()
    asyncio.run(run(args.config, args.output))


if __name__ == "__main__":
    main()