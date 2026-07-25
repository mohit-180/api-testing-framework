import asyncio

from core.config_loader import ConfigLoader
from core.engine import AsyncTestEngine


async def main():
    config = ConfigLoader("config/test_plan.json").load()

    engine = AsyncTestEngine(config)

    output = await engine.run()

    results = output["results"]

    print(f"Total requests: {len(results)}")

    successful = sum(1 for r in results if r["is_success"])

    print(f"Successful requests: {successful}")

    print(f"Total duration: {output['total_duration']:.2f} seconds")


if __name__ == "__main__":
    asyncio.run(main())