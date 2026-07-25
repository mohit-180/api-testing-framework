from core.config_loader import ConfigLoader
from core.engine import AsyncTestEngine


def main():
    config = ConfigLoader("config/test_plan.json").load()

    engine = AsyncTestEngine(config)

    print("Engine initialized successfully!")
    print(f"Base URL: {engine.base_url}")
    print(f"Concurrency: {engine.concurrency}")
    print(f"Requests: {engine.total_requests}")


if __name__ == "__main__":
    main()