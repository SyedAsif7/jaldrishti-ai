from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "JalDrishti" in data["system"]
    assert data["data_status"] == "DEMONSTRATION DATA ONLY"

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_districts():
    response = client.get("/api/districts")
    assert response.status_code == 200
    districts = response.json()
    assert len(districts) == 8
    names = [d["name"] for d in districts]
    assert "Beed" in names
    assert "Chhatrapati Sambhajinagar" in names
    assert "Dharashiv" in names

def test_get_district_detail():
    response = client.get("/api/districts/beed")
    assert response.status_code == 200
    beed = response.json()
    assert beed["id"] == "beed"
    assert beed["risk"]["risk_level"] == "Severe"
    assert len(beed["rainfall"]["monthly_comparison"]) == 12

def test_get_regional_summary():
    response = client.get("/api/districts/summary")
    assert response.status_code == 200
    summary = response.json()
    assert summary["total_districts"] == 8
    assert summary["average_risk_score"] > 0

def test_calculate_risk_endpoint():
    payload = {
        "deficit_percentage": 47.0,
        "groundwater_stress": 85.0,
        "reservoir_storage_pct": 25.0
    }
    response = client.post("/api/risk/calculate", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["risk_level"] == "Severe"
    assert res["composite_score"] >= 75.0

def test_calculate_risk_missing_fields_defaults():
    # Calling calculate with partial/missing fields should not crash
    payload = {}
    response = client.post("/api/risk/calculate", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "composite_score" in res

def test_rainfall_deviation_endpoint():
    payload = {
        "actual_mm": 350.0,
        "normal_mm": 574.0
    }
    response = client.post("/api/risk/rainfall-deviation", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["departure_percentage"] < 0
    assert res["deficit_percentage"] > 0
    assert res["imd_category"] in ["Deficient", "Large Deficient"]

def test_recommendations_endpoint():
    payload = {
        "district_id": "beed"
    }
    response = client.post("/api/risk/recommendations", json=payload)
    assert response.status_code == 200
    recs = response.json()
    assert len(recs) >= 1
    assert recs[0]["source_type"] == "Technical Guidance"

def test_geojson_endpoint():
    response = client.get("/api/geojson")
    assert response.status_code == 200
    geojson = response.json()
    assert geojson["type"] == "FeatureCollection"
    assert len(geojson["features"]) == 8

def test_csv_report_endpoint():
    response = client.get("/api/reports/csv")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert "District ID,District Name" in response.text
    assert "Beed" in response.text
