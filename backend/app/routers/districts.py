from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from app.data_loader import data_loader
from app.models import DistrictFull, RegionalSummary

router = APIRouter(prefix="/api/districts", tags=["Districts"])

@router.get("", response_model=List[Dict[str, Any]])
def get_all_districts():
    """Retrieve all 8 Marathwada districts with key metrics and risk classification."""
    return data_loader.get_all_districts()

@router.get("/summary", response_model=RegionalSummary)
def get_regional_summary():
    """Retrieve aggregated regional summary statistics across Marathwada."""
    return data_loader.get_regional_summary()

@router.get("/{district_id}", response_model=Dict[str, Any])
def get_district_by_id(district_id: str):
    """Retrieve complete indicators and details for a specific district."""
    district = data_loader.get_district(district_id)
    if not district:
        raise HTTPException(status_code=404, detail=f"District '{district_id}' not found.")
    return district

@router.get("/{district_id}/rainfall")
def get_district_rainfall(district_id: str):
    """Retrieve rainfall normal vs observed history and deficit for a district."""
    district = data_loader.get_district(district_id)
    if not district:
        raise HTTPException(status_code=404, detail=f"District '{district_id}' not found.")
    return {
        "district_id": district["id"],
        "name": district["name"],
        "name_mr": district["name_mr"],
        "rainfall": district["rainfall"],
        "disclaimer": "DEMONSTRATION DATA ONLY"
    }

@router.get("/{district_id}/groundwater")
def get_district_groundwater(district_id: str):
    """Retrieve groundwater depth trends, water table fall, and well depletion stats."""
    district = data_loader.get_district(district_id)
    if not district:
        raise HTTPException(status_code=404, detail=f"District '{district_id}' not found.")
    return {
        "district_id": district["id"],
        "name": district["name"],
        "name_mr": district["name_mr"],
        "groundwater": district["groundwater"],
        "disclaimer": "DEMONSTRATION DATA ONLY"
    }

@router.get("/{district_id}/reservoirs")
def get_district_reservoirs(district_id: str):
    """Retrieve major dam capacities, live storage %, and critical alert thresholds."""
    district = data_loader.get_district(district_id)
    if not district:
        raise HTTPException(status_code=404, detail=f"District '{district_id}' not found.")
    return {
        "district_id": district["id"],
        "name": district["name"],
        "name_mr": district["name_mr"],
        "reservoirs": district["reservoirs"],
        "disclaimer": "DEMONSTRATION DATA ONLY"
    }
