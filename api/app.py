from fastapi import FastAPI, HTTPException

from api.models import RunTestRequest
from core.config_loader import ConfigLoader
from core.engine import AsyncTestEngine
from core.metrics import MetricsCollector
from core.reporter import Reporter

app = FastAPI(
    title="Production REST API Testing Framework",
    version="1.0.0",
)


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

        engine = AsyncTestEngine(config)
        output = await engine.run()

        metrics = MetricsCollector(
            output["results"],
            output["total_duration"],
        ).compute()

        Reporter.generate_markdown_report(
            metrics,
            config,
            request.output_path,
        )

        return {
            "success": True,
            "metrics": metrics,
            "report_path": request.output_path,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )