import pytest
import math
from app.risk_engine import (
    clamp,
    sanitize_input,
    normalize_weights,
    classify_risk,
    calculate_risk_components,
    calculate_composite_risk,
    calculate_rainfall_deviation,
    generate_water_recommendations,
    RuleBasedDroughtEngine,
    MLModelDroughtAdapter
)

def test_clamp_bounds():
    assert clamp(-10.0) == 0.0
    assert clamp(150.0) == 100.0
    assert clamp(50.0) == 50.0
    assert clamp(float('nan')) == 0.0
    assert clamp(float('inf')) == 0.0

def test_sanitize_input():
    assert sanitize_input(None, default=45.0) == 45.0
    assert sanitize_input(float('nan'), default=30.0) == 30.0
    assert sanitize_input(75.0) == 75.0
    assert sanitize_input(150.0) == 100.0

def test_rainfall_deviation_normal():
    # 600 actual vs 600 normal -> 0% departure -> Normal
    res = calculate_rainfall_deviation(actual_mm=600.0, normal_mm=600.0)
    assert res["departure_percentage"] == 0.0
    assert res["deficit_percentage"] == 0.0
    assert res["imd_category"] == "Normal"
    assert res["is_deficit"] is False

def test_rainfall_deviation_deficit():
    # 300 actual vs 600 normal -> -50% departure -> Deficient
    res = calculate_rainfall_deviation(actual_mm=300.0, normal_mm=600.0)
    assert res["departure_percentage"] == -50.0
    assert res["deficit_percentage"] == 50.0
    assert res["imd_category"] == "Deficient"
    assert res["is_deficit"] is True

def test_rainfall_deviation_zero_rain():
    # 0 actual vs 600 normal -> -100% departure -> No Rain
    res = calculate_rainfall_deviation(actual_mm=0.0, normal_mm=600.0)
    assert res["departure_percentage"] == -100.0
    assert res["deficit_percentage"] == 100.0
    assert res["imd_category"] == "No Rain"
    assert res["is_deficit"] is True

def test_rainfall_deviation_excess():
    # 750 actual vs 500 normal -> +50% departure -> Excess
    res = calculate_rainfall_deviation(actual_mm=750.0, normal_mm=500.0)
    assert res["departure_percentage"] == 50.0
    assert res["deficit_percentage"] == 0.0
    assert res["imd_category"] == "Excess"
    assert res["is_deficit"] is False

def test_rainfall_deviation_zero_normal():
    # Normal is 0 -> avoids ZeroDivisionError safely
    res = calculate_rainfall_deviation(actual_mm=100.0, normal_mm=0.0)
    assert res["departure_percentage"] == 100.0
    assert res["deficit_percentage"] == 0.0

def test_rainfall_deviation_missing_inputs():
    # None or NaN handled safely
    res = calculate_rainfall_deviation(actual_mm=None, normal_mm=None)
    assert res["actual_mm"] == 0.0
    assert res["normal_mm"] == 0.0

def test_normalize_weights():
    w_rf, w_gw, w_res = normalize_weights(0.45, 0.35, 0.20)
    assert pytest.approx(w_rf + w_gw + w_res, 0.001) == 1.0
    assert pytest.approx(w_rf, 0.001) == 0.45

def test_normalize_weights_custom():
    w_rf, w_gw, w_res = normalize_weights(2, 2, 6)
    assert pytest.approx(w_rf + w_gw + w_res, 0.001) == 1.0
    assert pytest.approx(w_rf, 0.001) == 0.2
    assert pytest.approx(w_gw, 0.001) == 0.2
    assert pytest.approx(w_res, 0.001) == 0.6

def test_normalize_weights_zero_or_invalid():
    # All zero weights fallback to default weights
    w_rf, w_gw, w_res = normalize_weights(0, 0, 0)
    assert pytest.approx(w_rf, 0.001) == 0.45
    assert pytest.approx(w_gw, 0.001) == 0.35
    assert pytest.approx(w_res, 0.001) == 0.20

def test_classify_risk_tiers():
    assert classify_risk(80.0)[0] == "Severe"
    assert classify_risk(75.0)[0] == "Severe"
    assert classify_risk(65.0)[0] == "High"
    assert classify_risk(55.0)[0] == "High"
    assert classify_risk(40.0)[0] == "Moderate"
    assert classify_risk(30.0)[0] == "Moderate"
    assert classify_risk(25.0)[0] == "Low"
    assert classify_risk(0.0)[0] == "Low"

def test_calculate_risk_components():
    comps = calculate_risk_components(deficit_pct=50.0, gw_stress=80.0, res_storage_pct=20.0)
    assert comps["rainfall_component"] == 75.0
    assert comps["groundwater_component"] == 80.0
    assert comps["reservoir_component"] == 80.0

def test_calculate_risk_components_with_missing_inputs():
    comps = calculate_risk_components(deficit_pct=None, gw_stress=None, res_storage_pct=None)
    assert comps["rainfall_component"] == 0.0
    assert comps["groundwater_component"] == 50.0
    assert comps["reservoir_component"] == 50.0

def test_calculate_composite_risk_severe():
    res = calculate_composite_risk(deficit_pct=51.0, gw_stress=89.0, res_storage_pct=21.0)
    assert res["composite_score"] >= 75.0
    assert res["risk_level"] == "Severe"
    assert "CRI =" in res["formula_expression"]
    assert res["is_simulation"] is True

def test_calculate_composite_risk_zero_condition():
    res = calculate_composite_risk(deficit_pct=-10.0, gw_stress=10.0, res_storage_pct=100.0)
    assert res["composite_score"] < 30.0
    assert res["risk_level"] == "Low"

def test_pluggable_engines():
    rule_engine = RuleBasedDroughtEngine()
    ml_adapter = MLModelDroughtAdapter()

    res_rule = rule_engine.evaluate_risk(40.0, 70.0, 30.0)
    res_ml = ml_adapter.evaluate_risk(40.0, 70.0, 30.0)

    assert res_rule["composite_score"] == res_ml["composite_score"]
    assert "ML Adapter" in res_ml["engine_type"]

def test_generate_water_recommendations():
    recs = generate_water_recommendations(deficit_pct=45.0, gw_stress=85.0, res_storage_pct=20.0, risk_level="Severe")
    assert len(recs) >= 3
    domains = [r["domain"] for r in recs]
    assert "Agriculture" in domains
    assert "Drinking Water" in domains
    assert "Groundwater" in domains
    assert all(r["source_type"] == "Technical Guidance" for r in recs)
