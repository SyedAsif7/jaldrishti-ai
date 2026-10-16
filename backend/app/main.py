from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import districts, risk, geo, reports, forecasts

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for JalDrishti AI – Marathwada Drought Prediction & Water Intelligence System. Prototype demo for Seva First Innovation Challenge 2026."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(districts.router)
app.include_router(risk.router)
app.include_router(geo.router)
app.include_router(reports.router)
app.include_router(forecasts.router)

@app.get("/")
def root():
    return {
        "system": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "data_status": "DEMONSTRATION DATA ONLY",
        "endpoints": {
            "districts": "/api/districts",
            "regional_summary": "/api/districts/summary",
            "risk_calculation": "/api/risk/calculate",
            "risk_simulation": "/api/risk/simulate-all",
            "forecast_status": "/api/forecasts/model-status",
            "forecast_indicators": "/api/forecasts/indicators",
            "forecast_evaluation": "/api/forecasts/evaluation",
            "geojson": "/api/geojson",
            "csv_report": "/api/reports/csv",
            "metadata": "/api/reports/metadata",
            "docs": "/docs"
        }
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "JalDrishti AI API"}
