import json
import yaml

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.models import RunTestRequest
from core.config_loader import ConfigLoader
from core.reporter import Reporter
from core.benchmark_service import run_benchmark

app = FastAPI(
    title="Production REST API Testing Framework",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/config")
async def get_config():
    config_path = "config/test_plan.json"

    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    yaml_content = yaml.dump(
        config,
        sort_keys=False,
        allow_unicode=True,
    )

    return {
        "success": True,
        "configYaml": yaml_content,
    }


@app.get("/")
async def health():
    return {
        "status": "ok",
        "message": "REST API Testing Framework is running",
    }


@app.post("/api/run-test")
async def run_test(request: RunTestRequest):
    try:
        config = ConfigLoader(request.config_path).load()

        benchmark = await run_benchmark(
            config,
            request.output_path,
            )

        return {
            "success": True,
            "metrics": benchmark["metrics"],
            "results": benchmark["results"],
            "report_path": request.output_path,
}


    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )