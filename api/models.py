from pydantic import BaseModel


class RunTestRequest(BaseModel):
    config_path: str = "config/test_plan.json"
    output_path: str = "reports/report.md"