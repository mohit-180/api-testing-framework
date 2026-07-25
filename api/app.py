from fastapi import FastAPI

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