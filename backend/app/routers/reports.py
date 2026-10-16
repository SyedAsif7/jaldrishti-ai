from fastapi import APIRouter, Response, Query
from typing import Optional, Dict, Any
from app.data_loader import data_loader

router = APIRouter(prefix="/api/reports", tags=["Reports & Metadata"])

@router.get("/csv")
def export_csv_report(district_id: Optional[str] = Query(None, description="Optional district ID to filter")):
    """
    Generate and stream a downloadable CSV report for all or a specific district.
    """
    csv_content = data_loader.generate_csv_report(district_id)
    filename = f"JalDrishti_Marathwada_{district_id or 'All_Districts'}_DEMO.csv"
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.get("/summary")
def get_dossier_summary():
    """Retrieve full regional water dossier summary."""
    return data_loader.get_regional_summary()

@router.get("/metadata")
def get_metadata():
    """Retrieve data sources, indicators dictionary, and simulation status."""
    return data_loader.get_metadata()
