"""
Root Entrypoint for JalDrishti AI FastAPI Application.
Enables running uvicorn directly from root directory in cloud platforms like Render.
"""

import sys
from pathlib import Path

# Add backend directory to sys.path so app packages are resolvable
_backend_dir = Path(__file__).resolve().parent / "backend"
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from app.main import app  # noqa: E402

__all__ = ["app"]
