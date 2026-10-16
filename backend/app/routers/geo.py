from fastapi import APIRouter
from typing import Dict, Any
from app.data_loader import data_loader

router = APIRouter(prefix="/api/geojson", tags=["GIS & Spatial"])

@router.get("", response_model=Dict[str, Any])
def get_marathwada_geojson():
    """Retrieve GeoJSON polygons and attributes for all 8 Marathwada districts."""
    return data_loader.get_geojson()
