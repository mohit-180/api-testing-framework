import json
import yaml
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.models import RunTestRequest
from core.config_loader import ConfigLoader
from core.reporter import Reporter
from core.benchmark_service import run_benchmark
from core.file_browser import load_repository_files
from core.terminal_formatter import build_terminal_output

app = FastAPI(
    title="Production REST API Testing Framework",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
         "https://api-testing-framework-wheat.vercel.app",
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


@app.get("/api/report")
async def get_report():
    report_path = "reports/report.md"

    if not os.path.exists(report_path):
        raise HTTPException(
            status_code=404,
            detail="No report has been generated yet.",
        )

    with open(report_path, "r", encoding="utf-8") as f:
        report = f.read()

    return {
        "success": True,
        "report": report,
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
        if request.config_yaml is not None and request.config_yaml.strip():
            config = ConfigLoader.from_yaml_string(
                request.config_yaml
                )
        else:
            config = ConfigLoader(
                request.config_path
                ).load()

        benchmark = await run_benchmark(
            config,
            request.output_path,
            )

        terminal_output = build_terminal_output(
            config=config,
            metrics=benchmark["metrics"],
            report_path=request.output_path,
)
         
        return {
            "success": True,
            "metrics": benchmark["metrics"],
            "results": benchmark["results"],
            "report_path": request.output_path,
            "terminal_output": terminal_output,
}


    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )

@app.get("/api/files")
async def get_repository_files():
    return {
        "success": True,
        "files": load_repository_files(),
    }