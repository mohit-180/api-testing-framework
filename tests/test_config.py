import os
import pytest
from core.config_loader import ConfigLoader


def test_missing_config_file():
    loader = ConfigLoader("non_existent_file.yaml")
    with pytest.raises(FileNotFoundError):
        loader.load()


def test_valid_json_loader(tmp_path):
    file_p = tmp_path / "plan.json"
    file_p.write_text(
        '{"base_url": "https://api.example.com", "endpoints": [{"path": "/health", "method": "GET"}]}'
    )

    loader = ConfigLoader(str(file_p))
    config = loader.load()

    assert config["base_url"] == "https://api.example.com"
    assert len(config["endpoints"]) == 1
    assert config["concurrent_users"] == 5


def test_valid_yaml_loader(tmp_path):
    file_p = tmp_path / "plan.yaml"
    file_p.write_text(
        """
base_url: "https://api.example.com"
concurrent_users: 10
endpoints:
  - path: "/users"
    method: "POST"
"""
    )

    loader = ConfigLoader(str(file_p))
    config = loader.load()

    assert config["base_url"] == "https://api.example.com"
    assert config["concurrent_users"] == 10
    assert config["endpoints"][0]["method"] == "POST"


def test_invalid_missing_base_url(tmp_path):
    file_p = tmp_path / "bad.yaml"
    file_p.write_text("endpoints: [{path: '/test'}]")

    loader = ConfigLoader(str(file_p))
    with pytest.raises(ValueError, match="Missing required configuration field: 'base_url'"):
        loader.load()


def test_unsupported_http_method(tmp_path):
    file_p = tmp_path / "bad_method.json"
    file_p.write_text(
        '{"base_url": "https://api.com", "endpoints": [{"path": "/test", "method": "INVALID"}]}'
    )

    loader = ConfigLoader(str(file_p))
    with pytest.raises(ValueError, match="Unsupported HTTP method"):
        loader.load()
