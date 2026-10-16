import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

DISTRICTS_DATA_PATH = DATA_DIR / "districts_data.json"
GEOJSON_PATH = DATA_DIR / "marathwada_districts.geojson"

class Settings(BaseModel):
    APP_NAME: str = "JalDrishti AI API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")
    IS_DEMO_DATA: bool = True
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "https://jaldrishti.vercel.app",
        "https://jaldrishti-frontend.onrender.com",
        "*"
    ]

settings = Settings()
