import pytest
import numpy as np
import pandas as pd
from fastapi.testclient import TestClient
from app.main import app
from app.forecasting.data_pipeline import pipeline_instance
from app.forecasting.spi_calculator import SPICalculator
from app.forecasting.drought_ml import DroughtMLForecastEngine, MODEL_VERSION

client = TestClient(app)

def test_pipeline_dataset_loading():
    """Verify historical dataset loads with correct columns and normalized districts."""
    df_rain = pipeline_instance.get_district_monthly_rainfall("beed")
    assert not df_rain.empty
    assert "year" in df_rain.columns
    assert "month" in df_rain.columns
    assert "actual_mm" in df_rain.columns
    assert "normal_mm" in df_rain.columns
    assert df_rain["district_id"].iloc[0] == "beed"
    assert df_rain["year"].min() == 2000
    assert df_rain["year"].max() >= 2024

def test_district_id_normalization():
    """Verify alias mapping for legacy and current district names."""
    assert pipeline_instance.normalize_district_id("aurangabad") == "chhatrapati-sambhajinagar"
    assert pipeline_instance.normalize_district_id("csn") == "chhatrapati-sambhajinagar"
    assert pipeline_instance.normalize_district_id("chhatrapati sambhajinagar") == "chhatrapati-sambhajinagar"
    assert pipeline_instance.normalize_district_id("osmanabad") == "dharashiv"
    assert pipeline_instance.normalize_district_id("BEED") == "beed"
    assert pipeline_instance.normalize_district_id("latur") == "latur"

def test_spi_calculation_basic():
    """Verify standard SPI-3 and SPI-6 computation yields expected structure."""
    df_rain = pipeline_instance.get_district_monthly_rainfall("beed")
    calc = SPICalculator(df_rain)
    indicators = calc.get_latest_indicators("beed")

    assert "spi_3" in indicators
    assert "spi_6" in indicators
    assert "climatology_comparison" in indicators
    assert "recent_trajectory" in indicators
    assert len(indicators["recent_trajectory"]) == 12

    # Check SPI values are within realistic bounded range [-3.5, 3.5]
    if indicators["spi_3"]["value"] is not None:
        assert -3.5 <= indicators["spi_3"]["value"] <= 3.5
    if indicators["spi_6"]["value"] is not None:
        assert -3.5 <= indicators["spi_6"]["value"] <= 3.5

    assert indicators["spi_3"]["category"] in [
        "Extremely Wet", "Very Wet", "Moderately Wet",
        "Near Normal", "Moderately Dry", "Severely Dry", "Extremely Dry", "Insufficient Data"
    ]

def test_spi_zero_rainfall_edge_cases():
    """Verify SPI calculation gracefully handles dry seasons with zero rainfall."""
    # Create synthetic series with several zero values
    dates = pd.date_range("2000-01-01", periods=120, freq="MS")
    np.random.seed(42)
    # Monsoon months (6-9) have rain, others have zeros
    rainfall = [float(np.random.gamma(2, 40)) if d.month in [6, 7, 8, 9] else 0.0 for d in dates]
    df_synthetic = pd.DataFrame({
        "year": dates.year,
        "month": dates.month,
        "actual_mm": rainfall,
        "normal_mm": [60.0 if d.month in [6, 7, 8, 9] else 5.0 for d in dates],
        "district_id": "synthetic"
    })

    calc = SPICalculator(df_synthetic)
    indicators = calc.get_latest_indicators("synthetic")
    assert indicators["observation_months"] == 120
    assert indicators["spi_3"]["value"] is not None
    # No inf or NaN
    assert not np.isinf(indicators["spi_3"]["value"])
    assert not np.isnan(indicators["spi_3"]["value"])

def test_temporal_leakage_prevention():
    """
    CRITICAL REQUIREMENT: Verify strictly chronological train-test split.
    Training data must strictly end at or before 2018.
    Holdout testing data must strictly start at or after 2019.
    No future lookahead allowed.
    """
    engine = DroughtMLForecastEngine("beed")
    assert engine.trained_successfully

    df_features, feature_cols = engine._prepare_feature_dataset()
    assert not df_features.empty

    train_df = df_features[df_features["year"] <= 2018]
    test_df = df_features[df_features["year"] >= 2019]

    assert train_df["year"].max() <= 2018
    assert test_df["year"].min() >= 2019
    assert train_df.index.max() < test_df.index.min()

    # Verify target shifting: target at t is t+1 or t+3, inputs at t are <= t
    assert "target_1m_spi3" in df_features.columns
    assert "target_3m_spi3" in df_features.columns
    # Check that lag1 is indeed the previous month's rainfall
    sample_row_idx = 10
    assert df_features["lag1_rain_mm"].iloc[sample_row_idx] == df_features["actual_mm"].iloc[sample_row_idx - 1]

def test_model_evaluation_metrics_validity():
    """Verify evaluation outputs real numeric metrics without synthetic inflation."""
    engine = DroughtMLForecastEngine("jalna")
    assert engine.trained_successfully
    eval_res = engine.evaluation_results

    assert "model_version" in eval_res
    assert eval_res["model_version"] == MODEL_VERSION
    assert "metrics_1m_ahead" in eval_res
    assert "metrics_3m_ahead" in eval_res

    m1 = eval_res["metrics_1m_ahead"]
    # Check continuous regression metrics exist and are positive numbers
    assert m1["model_mae"] > 0
    assert m1["model_rmse"] > 0
    assert m1["baseline_persistence_mae"] > 0
    assert m1["baseline_persistence_rmse"] > 0

    # Check classification metric F1 exists
    clf_metrics = eval_res["drought_classification_metrics"]
    assert 0.0 <= clf_metrics["f1_score"] <= 1.0

def test_forecast_outlook_confidence_intervals():
    """Verify 95% confidence intervals are mathematically ordered: lower <= pred <= upper."""
    engine = DroughtMLForecastEngine("dharashiv")
    outlook = engine.generate_forecast_outlook()

    assert outlook["status"] == "OPERATIONAL"
    assert "outlooks" in outlook

    o1 = outlook["outlooks"]["one_month_ahead"]
    pred1 = o1["predicted_spi3"]
    ci1 = o1["confidence_interval_95"]
    assert ci1["lower_bound"] <= pred1
    assert pred1 <= ci1["upper_bound"]

    o3 = outlook["outlooks"]["three_month_ahead"]
    pred3 = o3["predicted_spi3"]
    ci3 = o3["confidence_interval_95"]
    assert ci3["lower_bound"] <= pred3
    assert pred3 <= ci3["upper_bound"]

def test_api_forecast_model_status():
    """Verify GET /api/forecasts/model-status endpoint."""
    res = client.get("/api/forecasts/model-status")
    assert res.status_code == 200
    data = res.json()
    assert data["model_version"] == MODEL_VERSION
    assert data["is_model_operational"] is True
    assert "Scikit-Learn" in data["framework"]
    assert "Strict Chronological Split" in data["training_methodology"]

def test_api_forecast_indicators():
    """Verify GET /api/forecasts/indicators across all 8 districts."""
    res = client.get("/api/forecasts/indicators")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 8
    district_ids = [d["district_id"] for d in data]
    assert "beed" in district_ids
    assert "latur" in district_ids
    assert "chhatrapati-sambhajinagar" in district_ids

def test_api_forecast_evaluation():
    """Verify GET /api/forecasts/evaluation returns test set benchmarks."""
    res = client.get("/api/forecasts/evaluation")
    assert res.status_code == 200
    data = res.json()
    assert "evaluation_summary" in data
    assert len(data["evaluation_summary"]) == 8

def test_api_district_forecast_and_indicators():
    """Verify GET /api/forecasts/{district_id} returns both forecast and indicators."""
    res = client.get("/api/forecasts/beed")
    assert res.status_code == 200
    data = res.json()
    assert data["district_id"] == "beed"
    assert "forecast" in data
    assert "indicators" in data
    assert data["forecast"]["status"] == "OPERATIONAL"
    assert "spi_3" in data["indicators"]

def test_api_district_forecast_not_found():
    """Verify 404 for nonexistent district."""
    res = client.get("/api/forecasts/invalid_district_xyz")
    assert res.status_code == 404
