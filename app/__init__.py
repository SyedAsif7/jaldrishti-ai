import sys
from pathlib import Path

# Add backend directory to sys.path so app submodules resolve
_backend_dir = Path(__file__).resolve().parent.parent / "backend"
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

# Add backend/app to the app package search path
_backend_app = _backend_dir / "app"
if _backend_app.is_dir() and str(_backend_app) not in __path__:
    __path__.append(str(_backend_app))
