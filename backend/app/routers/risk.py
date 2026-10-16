from fastapi import APIRouter
from typing import Dict, Any, List
from app.models import (
    RiskCalculationRequest,
    RiskCalculationResult,
    DistrictSimulateAllRequest,
    RainfallDeviationRequest,
    RainfallDeviationResponse,
    RecommendationRequest,
    RecommendationResponseItem
)
from app.risk_engine import (
    calculate_composite_risk,
    calculate_rainfall_deviation,
    generate_water_recommendations,
    DEFAULT_WEIGHTS,
    RISK_THRESHOLDS,
    DISCLAIMER_TEXT
)
from app.data_loader import data_loader

router = APIRouter(prefix="/api/risk", tags=["Risk Analysis"])

@router.post("/calculate", response_model=RiskCalculationResult)
def calculate_single_risk(request: RiskCalculationRequest):
    """
    Calculate explainable composite drought risk index given rainfall deficit,
    groundwater stress, and reservoir storage percentage with optional custom weights.
    Safely handles missing inputs and out-of-bound values.
    """
    weights_dict = request.weights.model_dump() if request.weights else None
    result = calculate_composite_risk(
        deficit_pct=request.deficit_percentage,
        gw_stress=request.groundwater_stress,
        res_storage_pct=request.reservoir_storage_pct,
        weights=weights_dict
    )
    return result

@router.post("/rainfall-deviation", response_model=RainfallDeviationResponse)
def evaluate_rainfall_deviation(request: RainfallDeviationRequest):
    """
    Calculate rainfall deviation from normal LPA and return standard IMD categorization.
    """
    return calculate_rainfall_deviation(request.actual_mm, request.normal_mm)

@router.post("/recommendations", response_model=List[RecommendationResponseItem])
def get_recommendations(request: RecommendationRequest):
    """
    Generate actionable water conservation recommendations based on multi-indicator thresholds.
    Distinguishes technical guidance from official government notifications.
    """
    if request.district_id:
        d = data_loader.get_district(request.district_id)
        if d:
            deficit_pct = d["rainfall"]["deficit_percentage"]
            gw_stress = d["groundwater"]["stress_index"]
            res_storage = d["reservoirs"]["aggregate_storage_pct"]
            risk_level = d["risk"]["risk_level"]
            return generate_water_recommendations(deficit_pct, gw_stress, res_storage, risk_level)

    def_val = request.deficit_percentage if request.deficit_percentage is not None else 35.0
    gw_val = request.groundwater_stress if request.groundwater_stress is not None else 70.0
    res_val = request.reservoir_storage_pct if request.reservoir_storage_pct is not None else 35.0
    calc = calculate_composite_risk(def_val, gw_val, res_val)
    return generate_water_recommendations(def_val, gw_val, res_val, calc["risk_level"])

@router.post("/simulate-all", response_model=List[Dict[str, Any]])
def simulate_all_districts_risk(request: DistrictSimulateAllRequest):
    """
    Simulate composite risk recalculation across all 8 Marathwada districts
    under custom sensitivity weight parameters.
    """
    weights_dict = request.weights.model_dump()
    return data_loader.simulate_all_districts(weights_dict)

@router.get("/formula")
def get_formula_specification():
    """Retrieve the mathematical formula, default weights, and threshold brackets."""
    return {
        "formula_title": "Multi-Criteria Decision Analysis Composite Drought Risk Index (CRI)",
        "formula_expression": "CRI = w1 * min(100, 1.5 * Deficit%) + w2 * GW_Stress + w3 * (100 - Live_Storage%)",
        "default_weights": DEFAULT_WEIGHTS,
        "risk_thresholds": [
            {"min": t[0], "label": t[1], "color": t[2]} for t in RISK_THRESHOLDS
        ],
        "methodology": "Deterministic Rule-Based MCDA (Not trained Machine Learning Model)",
        "disclaimer": DISCLAIMER_TEXT
    }
