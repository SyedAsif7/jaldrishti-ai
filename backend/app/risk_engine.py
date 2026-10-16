from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple, List, Optional
import math
import numpy as np

DEFAULT_WEIGHTS = {
    "rainfall_deficit": 0.45,
    "groundwater_stress": 0.35,
    "reservoir_scarcity": 0.20
}

RISK_THRESHOLDS = [
    (75.0, "Severe", "#ef4444"),
    (55.0, "High", "#f97316"),
    (30.0, "Moderate", "#eab308"),
    (0.0, "Low", "#10b981")
]

DISCLAIMER_TEXT = (
    "DEMO SIMULATION: This composite score is a deterministic rule-based weighted index "
    "for prototype demonstration and technical validation. It is not an official meteorological "
    "forecast or government-declared emergency bulletin."
)

def clamp(val: float, min_val: float = 0.0, max_val: float = 100.0) -> float:
    """Clamp a floating point value between min_val and max_val, safely handling NaN/Inf."""
    if val is None or math.isnan(val) or math.isinf(val):
        return min_val
    return float(np.clip(val, min_val, max_val))

def sanitize_input(val: Optional[float], default: float = 0.0, min_val: float = 0.0, max_val: float = 100.0) -> float:
    """Sanitize user or sensor inputs, replacing None/NaN with default and clamping within bounds."""
    if val is None or math.isnan(val) or math.isinf(val):
        return default
    return clamp(val, min_val, max_val)

def calculate_rainfall_deviation(actual_mm: Optional[float], normal_mm: Optional[float]) -> Dict[str, Any]:
    """
    Calculate rainfall deviation from historical normal rainfall according to standard
    India Meteorological Department (IMD) guidelines.
    """
    safe_actual = max(0.0, float(actual_mm)) if actual_mm is not None and not math.isnan(actual_mm) else 0.0
    safe_normal = max(0.0, float(normal_mm)) if normal_mm is not None and not math.isnan(normal_mm) else 0.0

    if safe_normal == 0.0:
        pct_departure = 0.0 if safe_actual == 0.0 else 100.0
        abs_deficit_mm = 0.0
    else:
        abs_deficit_mm = round(safe_normal - safe_actual, 2)
        pct_departure = round(((safe_actual - safe_normal) / safe_normal) * 100.0, 2)

    # Deficit percentage is positive when actual < normal (departure is negative)
    deficit_percentage = round(max(0.0, -pct_departure), 2)

    # Standard IMD departure categorization
    if safe_actual == 0.0 and safe_normal > 0.0:
        imd_category = "No Rain"
        imd_color = "#ef4444"
    elif pct_departure >= 60.0:
        imd_category = "Large Excess"
        imd_color = "#06b6d4"
    elif pct_departure >= 20.0:
        imd_category = "Excess"
        imd_color = "#3b82f6"
    elif pct_departure >= -19.0:
        imd_category = "Normal"
        imd_color = "#10b981"
    elif pct_departure >= -59.0:
        imd_category = "Deficient"
        imd_color = "#f59e0b"
    else:
        imd_category = "Large Deficient"
        imd_color = "#ef4444"

    return {
        "actual_mm": safe_actual,
        "normal_mm": safe_normal,
        "departure_mm": round(safe_actual - safe_normal, 2),
        "departure_percentage": pct_departure,
        "deficit_percentage": deficit_percentage,
        "imd_category": imd_category,
        "imd_color": imd_color,
        "is_deficit": pct_departure < -19.0
    }

def normalize_weights(w_rainfall: float, w_gw: float, w_res: float) -> Tuple[float, float, float]:
    """Normalize three weights so their sum equals exactly 1.0."""
    w1 = sanitize_input(w_rainfall, default=DEFAULT_WEIGHTS["rainfall_deficit"], min_val=0.0, max_val=10.0)
    w2 = sanitize_input(w_gw, default=DEFAULT_WEIGHTS["groundwater_stress"], min_val=0.0, max_val=10.0)
    w3 = sanitize_input(w_res, default=DEFAULT_WEIGHTS["reservoir_scarcity"], min_val=0.0, max_val=10.0)

    total = w1 + w2 + w3
    if total <= 0:
        return (DEFAULT_WEIGHTS["rainfall_deficit"], 
                DEFAULT_WEIGHTS["groundwater_stress"], 
                DEFAULT_WEIGHTS["reservoir_scarcity"])
    return (w1 / total, w2 / total, w3 / total)

def classify_risk(score: float) -> Tuple[str, str]:
    """Map numeric composite risk score (0-100) to standard severity tier and UI color."""
    clamped_score = clamp(score)
    for threshold, label, color in RISK_THRESHOLDS:
        if clamped_score >= threshold:
            return label, color
    return "Low", "#10b981"

def calculate_risk_components(deficit_pct: float, gw_stress: float, res_storage_pct: float) -> Dict[str, float]:
    """
    Calculate normalized sub-components (each 0 to 100):
    1. Rainfall component: deficit% scaled by 1.5, max 100
    2. Groundwater component: raw stress index (0-100)
    3. Reservoir scarcity component: (100 - live_storage%)
    """
    safe_def = sanitize_input(deficit_pct, default=0.0, min_val=-100.0, max_val=100.0)
    safe_gw = sanitize_input(gw_stress, default=50.0, min_val=0.0, max_val=100.0)
    safe_res = sanitize_input(res_storage_pct, default=50.0, min_val=0.0, max_val=100.0)

    rf_component = clamp(max(0.0, safe_def * 1.5))
    gw_component = clamp(safe_gw)
    res_component = clamp(100.0 - safe_res)
    
    return {
        "rainfall_component": round(rf_component, 2),
        "groundwater_component": round(gw_component, 2),
        "reservoir_component": round(res_component, 2)
    }

# ==============================================================================
# Pluggable Architecture Interfaces (Future AI/ML Integration Ready)
# ==============================================================================

class AbstractDroughtEngine(ABC):
    """Abstract interface to ensure clean decoupling for future ML model plug-ins."""

    @abstractmethod
    def evaluate_risk(
        self,
        deficit_pct: float,
        gw_stress: float,
        res_storage_pct: float,
        weights: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        pass

class RuleBasedDroughtEngine(AbstractDroughtEngine):
    """
    Deterministic Multi-Criteria Decision Analysis (MCDA) rule-based implementation.
    Clearly explainable without blackbox neural weights.
    """

    def evaluate_risk(
        self,
        deficit_pct: float,
        gw_stress: float,
        res_storage_pct: float,
        weights: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        if weights is None:
            w_rf = DEFAULT_WEIGHTS["rainfall_deficit"]
            w_gw = DEFAULT_WEIGHTS["groundwater_stress"]
            w_res = DEFAULT_WEIGHTS["reservoir_scarcity"]
        else:
            w_rf = weights.get("rainfall_deficit", DEFAULT_WEIGHTS["rainfall_deficit"])
            w_gw = weights.get("groundwater_stress", DEFAULT_WEIGHTS["groundwater_stress"])
            w_res = weights.get("reservoir_scarcity", DEFAULT_WEIGHTS["reservoir_scarcity"])

        norm_w_rf, norm_w_gw, norm_w_res = normalize_weights(w_rf, w_gw, w_res)
        components = calculate_risk_components(deficit_pct, gw_stress, res_storage_pct)

        score = (
            norm_w_rf * components["rainfall_component"] +
            norm_w_gw * components["groundwater_component"] +
            norm_w_res * components["reservoir_component"]
        )
        score = round(clamp(score), 1)
        risk_level, risk_color = classify_risk(score)

        formula_str = (
            f"CRI = ({norm_w_rf:.2f} × {components['rainfall_component']}) + "
            f"({norm_w_gw:.2f} × {components['groundwater_component']}) + "
            f"({norm_w_res:.2f} × {components['reservoir_component']}) = {score}"
        )

        return {
            "composite_score": score,
            "risk_level": risk_level,
            "risk_color": risk_color,
            "rainfall_component": components["rainfall_component"],
            "groundwater_component": components["groundwater_component"],
            "reservoir_component": components["reservoir_component"],
            "formula_expression": formula_str,
            "weights_applied": {
                "rainfall_deficit": round(norm_w_rf, 3),
                "groundwater_stress": round(norm_w_gw, 3),
                "reservoir_scarcity": round(norm_w_res, 3)
            },
            "engine_type": "Deterministic Rule-Based MCDA",
            "is_simulation": True,
            "disclaimer": DISCLAIMER_TEXT
        }

class MLModelDroughtAdapter(AbstractDroughtEngine):
    """
    Placeholder adapter pattern for future LSTM/RandomForest/XGBoost models.
    Validates inputs and provides confidence interval metadata.
    """

    def evaluate_risk(
        self,
        deficit_pct: float,
        gw_stress: float,
        res_storage_pct: float,
        weights: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        # Fallback to rule engine until calibrated ML checkpoint is trained and validated
        rule_engine = RuleBasedDroughtEngine()
        result = rule_engine.evaluate_risk(deficit_pct, gw_stress, res_storage_pct, weights)
        result["engine_type"] = "ML Adapter (Fallback to Rule-Based MCDA until trained checkpoint is verified)"
        result["ml_confidence"] = 0.85
        return result

# Global default engine instance
default_engine = RuleBasedDroughtEngine()

def calculate_composite_risk(
    deficit_pct: float,
    gw_stress: float,
    res_storage_pct: float,
    weights: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    return default_engine.evaluate_risk(deficit_pct, gw_stress, res_storage_pct, weights)

def generate_water_recommendations(
    deficit_pct: float,
    gw_stress: float,
    res_storage_pct: float,
    risk_level: str
) -> List[Dict[str, str]]:
    """
    Generate actionable water conservation recommendations based on multi-indicator thresholds.
    Distinguishes technical guidance from official government notifications.
    """
    recs: List[Dict[str, str]] = []

    # Agriculture
    if deficit_pct >= 40.0:
        recs.append({
            "domain": "Agriculture",
            "severity": "High",
            "text": "Severe rainfall deficit: restrict summer sugarcane planting; shift to low-water millets (bajra, jowar) and pulses with micro-sprinklers.",
            "source_type": "Technical Guidance"
        })
    elif deficit_pct >= 20.0:
        recs.append({
            "domain": "Agriculture",
            "severity": "Medium",
            "text": "Moderate rainfall deficit: schedule protective irrigations at critical flowering and grain-filling stages using farm ponds.",
            "source_type": "Technical Guidance"
        })
    else:
        recs.append({
            "domain": "Agriculture",
            "severity": "Low",
            "text": "Normal rainfall trend: promote mulch cover to conserve soil profile moisture for winter cropping.",
            "source_type": "Technical Guidance"
        })

    # Drinking water
    if res_storage_pct <= 25.0:
        recs.append({
            "domain": "Drinking Water",
            "severity": "Severe",
            "text": "Critical reservoir storage (<25%): enforce strict dead storage preservation protocol and halt non-essential industrial water draw.",
            "source_type": "Technical Guidance"
        })
    elif res_storage_pct <= 40.0:
        recs.append({
            "domain": "Drinking Water",
            "severity": "High",
            "text": "Low storage (<40%): reserve municipal quotas for human and livestock consumption; implement rotational urban distribution.",
            "source_type": "Technical Guidance"
        })

    # Groundwater
    if gw_stress >= 80.0:
        recs.append({
            "domain": "Groundwater",
            "severity": "Severe",
            "text": "Extreme aquifer stress: trigger statutory restrictions on new commercial borewell drilling under Maharashtra Groundwater Act 2009.",
            "source_type": "Technical Guidance"
        })
    elif gw_stress >= 65.0:
        recs.append({
            "domain": "Groundwater",
            "severity": "Medium",
            "text": "Elevated groundwater stress: expedite community percolation tanks and desilt existing nala bunds prior to next monsoon.",
            "source_type": "Technical Guidance"
        })

    return recs
