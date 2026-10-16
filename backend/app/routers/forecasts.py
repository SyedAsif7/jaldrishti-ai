from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List, Optional
from app.forecasting.data_pipeline import pipeline_instance
from app.forecasting.spi_calculator import SPICalculator
from app.forecasting.drought_ml import DroughtMLForecastEngine, MODEL_VERSION
from app.data_loader import data_loader

router = APIRouter(prefix="/api/forecasts", tags=["Drought Forecasting & ML"])

# Cache engine instances per district to avoid re-training on every request
FORECAST_ENGINES: Dict[str, DroughtMLForecastEngine] = {}

def get_engine(district_id: str) -> DroughtMLForecastEngine:
    clean_id = pipeline_instance.normalize_district_id(district_id)
    if clean_id not in FORECAST_ENGINES:
        FORECAST_ENGINES[clean_id] = DroughtMLForecastEngine(clean_id)
    return FORECAST_ENGINES[clean_id]

@router.get("/model-status")
def get_model_status():
    """
    Retrieve current Machine Learning forecasting model architecture, version,
    training period, and pipeline dataset coverage.
    """
    sample_engine = get_engine("beed")
    return {
        "model_version": MODEL_VERSION,
        "framework": "Scikit-Learn Gradient Boosting & Ridge Regressors",
        "training_methodology": "Strict Chronological Split (Train: 2000-2018, Holdout Test: 2019-2024)",
        "pipeline_metadata": pipeline_instance.get_pipeline_metadata(),
        "is_model_operational": sample_engine.trained_successfully,
        "supported_horizons": ["1-Month Ahead (SPI-3)", "3-Month Ahead (SPI-3)"],
        "transparency_notice": (
            "Machine learning forecasts are trained on historical observation datasets. "
            "Evaluations reflect real test set metrics without lookahead leakage. "
            "Clearly demarcated from rule-based composite risk indices."
        )
    }

@router.get("/indicators")
def get_all_district_indicators():
    """
    Retrieve latest SPI-3 and SPI-6 drought indicators and climatology percentiles
    across all 8 Marathwada districts.
    """
    results = []
    districts = data_loader.get_all_districts()
    for d in districts:
        dist_id = d["id"]
        df_rain = pipeline_instance.get_district_monthly_rainfall(dist_id)
        calc = SPICalculator(df_rain)
        ind = calc.get_latest_indicators(dist_id)
        ind["district_name"] = d["name"]
        ind["district_name_mr"] = d["name_mr"]
        results.append(ind)
    return results

@router.get("/evaluation")
def get_evaluation_metrics():
    """
    Retrieve hold-out test set evaluation metrics (MAE, RMSE, R2, F1-Score)
    comparing the ML forecasting model against the historical persistence baseline.
    """
    district_metrics = []
    districts = data_loader.get_all_districts()
    for d in districts:
        engine = get_engine(d["id"])
        if engine.evaluation_results:
            district_metrics.append({
                "district_id": d["id"],
                "district_name": d["name"],
                "evaluation": engine.evaluation_results
            })
    return {
        "model_version": MODEL_VERSION,
        "evaluation_summary": district_metrics
    }

@router.get("/{district_id}")
def get_district_forecast(district_id: str):
    """
    Retrieve 1-month and 3-month drought outlooks, 95% confidence intervals,
    and historical SPI trajectory for a specific district.
    """
    clean_id = pipeline_instance.normalize_district_id(district_id)
    district_obj = data_loader.get_district(clean_id)
    if not district_obj:
        raise HTTPException(status_code=404, detail=f"District '{district_id}' not found.")

    engine = get_engine(clean_id)
    forecast = engine.generate_forecast_outlook()

    # Get latest SPI indicators and recent trajectory
    df_rain = pipeline_instance.get_district_monthly_rainfall(clean_id)
    calc = SPICalculator(df_rain)
    indicators = calc.get_latest_indicators(clean_id)

    return {
        "district_id": clean_id,
        "district_name": district_obj["name"],
        "district_name_mr": district_obj["name_mr"],
        "forecast": forecast,
        "indicators": indicators
    }
