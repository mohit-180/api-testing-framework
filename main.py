import asyncio
import aiohttp

from core.config_loader import ConfigLoader
from core.engine import AsyncTestEngine


async def main():
    config = ConfigLoader("config/test_plan.json").load()

    engine = AsyncTestEngine(config)

    semaphore = asyncio.Semaphore(1)

    async with aiohttp.ClientSession() as session:
        result = await engine.execute_request(
            session,
            semaphore,
            config["endpoints"][0],
        )

    print(result)


if __name__ == "__main__":
    asyncio.run(main())