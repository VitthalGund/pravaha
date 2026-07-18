from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.exceptions import PravahaServiceError
from app.db.indexes import ensure_time_series_collections, ensure_indexes
from app.db.mongo import close_client
from app.api.v1.routes import (
    auth, enterprises, admin, cash_flow, forecasts, risk, obligations,
    officer, visits, hq, fpo, reports, translate
)

from app.core.middleware import CorrelationIdMiddleware

app = FastAPI(title="Pravaha Backend")

app.add_middleware(CorrelationIdMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db():
    await ensure_time_series_collections()
    await ensure_indexes()

@app.on_event("shutdown")
async def shutdown_db():
    close_client()

@app.exception_handler(PravahaServiceError)
async def service_error_handler(request, exc: PravahaServiceError):
    return JSONResponse(
        status_code=400,
        content={"success": False, "error": str(exc)}
    )

app.include_router(auth.router, prefix="/api/v1")
app.include_router(enterprises.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(cash_flow.router, prefix="/api/v1")
app.include_router(forecasts.router, prefix="/api/v1")
app.include_router(risk.router, prefix="/api/v1")
app.include_router(obligations.router, prefix="/api/v1")
app.include_router(officer.router, prefix="/api/v1")
app.include_router(visits.router, prefix="/api/v1")
app.include_router(hq.router, prefix="/api/v1")
app.include_router(fpo.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
app.include_router(translate.router, prefix="/api/v1")







@app.get("/health")
async def health_check():
    mongo_status = "healthy"
    try:
        from app.db.mongo import get_client
        client = get_client()
        await client.admin.command("ping")
    except Exception:
        mongo_status = "unreachable"

    return {
        "success": True,
        "data": {
            "status": "healthy" if mongo_status == "healthy" else "degraded",
            "version": "0.1.0",
            "components": {
                "mongodb": mongo_status,
                "ollama": "healthy",
                "redis": "healthy",
            }
        }
    }

