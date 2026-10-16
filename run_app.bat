@echo off
echo =========================================================================
echo    JalDrishti AI - Marathwada Water Intelligence System
echo    Seva First Innovation Challenge 2026, Government of Maharashtra
echo =========================================================================
echo.
echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "JalDrishti Backend API" cmd /k "cd backend && python run.py"

timeout /t 3 /nobreak >nul

echo Starting Vite Frontend Dashboard on http://localhost:3000 ...
start "JalDrishti Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo Opening Browser...
start http://localhost:3000

echo.
echo Both services are running in separate windows.
echo - Backend API:  http://127.0.0.1:8000
echo - API Docs:     http://127.0.0.1:8000/docs
echo - Frontend:     http://localhost:3000
echo =========================================================================
