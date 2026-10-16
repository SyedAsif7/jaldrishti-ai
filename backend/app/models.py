from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class WeightConfig(BaseModel):
    rainfall_deficit: float = Field(0.45, ge=0.0, le=10.0, description="Weight for rainfall deficit component")
    groundwater_stress: float = Field(0.35, ge=0.0, le=10.0, description="Weight for groundwater stress component")
    reservoir_scarcity: float = Field(0.20, ge=0.0, le=10.0, description="Weight for reservoir storage scarcity component")

class RiskCalculationRequest(BaseModel):
    # Optional with default to gracefully handle missing values or partial sensor telemetry
    deficit_percentage: Optional[float] = Field(0.0, description="Monsoon rainfall deficit percentage")
    groundwater_stress: Optional[float] = Field(50.0, description="Groundwater stress index (0-100)")
    reservoir_storage_pct: Optional[float] = Field(50.0, description="Reservoir live storage percentage (0-100)")
    weights: Optional[WeightConfig] = None

class RiskCalculationResult(BaseModel):
    composite_score: float
    risk_level: str
    risk_color: str
    rainfall_component: float
    groundwater_component: float
    reservoir_component: float
    formula_expression: str
    weights_applied: Dict[str, float]
    engine_type: str = "Deterministic Rule-Based MCDA"
    is_simulation: bool = True
    disclaimer: str

class DistrictSimulateAllRequest(BaseModel):
    weights: WeightConfig

class RainfallDeviationRequest(BaseModel):
    actual_mm: Optional[float] = Field(..., description="Observed rainfall in millimeters")
    normal_mm: Optional[float] = Field(..., description="Historical LPA normal rainfall in millimeters")

class RainfallDeviationResponse(BaseModel):
    actual_mm: float
    normal_mm: float
    departure_mm: float
    departure_percentage: float
    deficit_percentage: float
    imd_category: str
    imd_color: str
    is_deficit: bool

class RecommendationRequest(BaseModel):
    district_id: Optional[str] = None
    deficit_percentage: Optional[float] = None
    groundwater_stress: Optional[float] = None
    reservoir_storage_pct: Optional[float] = None

class RecommendationResponseItem(BaseModel):
    domain: str
    severity: str
    text: str
    source_type: str = "Technical Guidance"

class Coordinates(BaseModel):
    lat: float
    lng: float

class MonthlyRainfall(BaseModel):
    month: str
    normal_mm: float
    actual_mm: float
    deficit_pct: float

class RainfallDetails(BaseModel):
    annual_normal_mm: float
    monsoon_normal_mm: float
    monsoon_actual_mm: float
    deficit_percentage: float
    spi_3month_estimate: float
    dry_spell_days_max: int
    monthly_comparison: List[MonthlyRainfall]

class MonthlyGroundwater(BaseModel):
    month: str
    depth_m: float

class GroundwaterDetails(BaseModel):
    avg_depth_pre_monsoon_m: float
    avg_depth_post_monsoon_m: float
    water_table_fall_m: float
    depleted_wells_pct: float
    stress_index: float
    stage_of_extraction_pct: float
    critical_talukas_count: int
    monthly_trend: List[MonthlyGroundwater]

class DamDetail(BaseModel):
    name: str
    river: str
    capacity_mcft: float
    live_storage_pct: float
    dead_storage_alert: bool
    status: str

class ReservoirDetails(BaseModel):
    aggregate_storage_pct: float
    drinking_water_security_days: int
    dams: List[DamDetail]

class AdvisoryItem(BaseModel):
    domain: str
    severity: str
    text: str

class DistrictRisk(BaseModel):
    rainfall_component: float
    groundwater_component: float
    reservoir_component: float
    composite_score: float
    risk_level: str

class DistrictFull(BaseModel):
    id: str
    name: str
    name_mr: str
    talukas_count: int
    talukas: List[str]
    area_sq_km: float
    population: int
    coordinates: Coordinates
    rainfall: RainfallDetails
    groundwater: GroundwaterDetails
    reservoirs: ReservoirDetails
    risk: DistrictRisk
    advisories: List[AdvisoryItem]

class RegionalSummary(BaseModel):
    total_districts: int
    total_area_sq_km: float
    total_population: int
    overall_risk_level: str
    average_risk_score: float
    average_rainfall_deficit_pct: float
    average_groundwater_stress: float
    average_reservoir_storage_pct: float
    districts_in_severe_risk: int
    districts_in_high_risk: int
    districts_in_moderate_risk: int
    districts_in_low_risk: int
    active_tanker_demand_talukas: int
    total_talukas: int
