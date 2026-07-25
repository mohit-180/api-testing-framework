import asyncio

from core.config_loader import ConfigLoader
from core.engine import AsyncTestEngine
from core.metrics import MetricsCollector


async def main():
    config = ConfigLoader("config/test_plan.json").load()

    engine = AsyncTestEngine(config)

    output = await engine.run()

    metrics = MetricsCollector(
        output["results"],
        output["total_duration"],
    ).compute()

    print(metrics)


if __name__ == "__main__":
    asyncio.run(main())