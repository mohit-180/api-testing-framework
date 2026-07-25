import json
import os
from io import StringIO
from typing import Any, Dict

import yaml


class ConfigLoader:
    def __init__(self, file_path: str):
        self.file_path = file_path

    def load(self) -> Dict[str, Any]:
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(f"Config file not found: {self.file_path}")

        _, ext = os.path.splitext(self.file_path)
        ext = ext.lower()

        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                if ext in [".yaml", ".yml"]:
                    config_data = yaml.safe_load(f)
                elif ext == ".json":
                    config_data = json.load(f)
                else:
                    raise ValueError(
                        f"Unsupported config format '{ext}'. Use JSON or YAML."
                    )

        except json.JSONDecodeError as e:
            raise ValueError(f"Malformed JSON in config file: {e}")

        except yaml.YAMLError as e:
            raise ValueError(f"Malformed YAML in config file: {e}")

        if not isinstance(config_data, dict):
            raise ValueError("Config root must be a JSON/YAML object.")

        self._validate(config_data)

        return config_data

    @classmethod
    def from_yaml_string(cls, yaml_content: str) -> Dict[str, Any]:
        """
        Parse and validate configuration from a YAML string.
        """
        try:
            config_data = yaml.safe_load(StringIO(yaml_content))
        except yaml.YAMLError as e:
            raise ValueError(f"Malformed YAML: {e}")

        if not isinstance(config_data, dict):
            raise ValueError("Config root must be a YAML object.")

        loader = cls("")
        loader._validate(config_data)

        return config_data

    def _validate(self, data: Dict[str, Any]) -> None:
        required_fields = ["base_url", "endpoints"]

        for field in required_fields:
            if field not in data:
                raise ValueError(
                    f"Missing required configuration field: '{field}'"
                )

        if not isinstance(data["base_url"], str) or not data["base_url"].strip():
            raise ValueError(
                "Config field 'base_url' must be a non-empty string."
            )

        if not isinstance(data["endpoints"], list) or len(data["endpoints"]) == 0:
            raise ValueError(
                "Config field 'endpoints' must be a non-empty list."
            )

        valid_methods = {
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "PATCH",
            "HEAD",
            "OPTIONS",
        }

        for idx, ep in enumerate(data["endpoints"]):
            if not isinstance(ep, dict):
                raise ValueError(
                    f"Endpoint at index {idx} must be an object."
                )

            if "path" not in ep or not isinstance(ep["path"], str):
                raise ValueError(
                    f"Endpoint at index {idx} missing valid 'path'."
                )

            method = ep.get("method", "GET").upper()

            if method not in valid_methods:
                raise ValueError(
                    f"Unsupported HTTP method '{method}' for endpoint '{ep.get('path')}'."
                )

            ep["method"] = method

        data.setdefault("timeout", 10.0)
        data.setdefault("concurrent_users", 5)
        data.setdefault("number_of_requests", 50)
        data.setdefault("headers", {})

        if data["concurrent_users"] <= 0:
            raise ValueError(
                "'concurrent_users' must be greater than 0."
            )

        if data["number_of_requests"] <= 0:
            raise ValueError(
                "'number_of_requests' must be greater than 0."
            )