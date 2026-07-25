from core.config_loader import ConfigLoader


def main():
    config = ConfigLoader("config/test_plan.yaml").load()

    print("Configuration loaded successfully!")
    print(f"Base URL: {config['base_url']}")
    print(f"Endpoints: {len(config['endpoints'])}")


if __name__ == "__main__":
    main()