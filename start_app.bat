@echo off
echo ========================================
echo    🌿 EcoLearn - Starting Application
echo ========================================
echo.

:: Check if MongoDB is running
echo [1/3] Checking MongoDB...
tasklist /fi "imagename eq mongod.exe" 2>nul | find /i "mongod.exe" >nul
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB is not running. Starting without database...
    echo    The app will work but some features need MongoDB.
    echo    Install MongoDB from: https://www.mongodb.com/try/download/community
    echo.
) else (
    echo ✅ MongoDB is running!
)

:: Start Backend Server
echo [2/3] Starting Backend Server (port 5000)...
start "EcoLearn-Backend" cmd /k "cd /d C:\Users\sabar\OneDrive\Desktop\gamified\backend && node server.js"
timeout /t 3 /nobreak >nul

:: Start Frontend Server
echo [3/3] Starting Frontend Server (port 3000)...
start "EcoLearn-Frontend" cmd /k "cd /d C:\Users\sabar\OneDrive\Desktop\gamified\frontend && npx react-scripts start"

echo.
echo ========================================
echo    ✅ Both servers are starting!
echo.
echo    🌐 Frontend: http://localhost:3000
echo    ⚙️  Backend:  http://localhost:5000/api
echo.
echo    📝 Demo Accounts:
echo    Admin: admin@ecolearn.com / admin123
echo    Kid:   kid@ecolearn.com / kid123
echo.
echo    ⏳ Wait 10 seconds for frontend to compile...
echo ========================================
timeout /t 10 /nobreak >nul
start http://localhost:3000
echo.
echo ✅ Browser opened! Close this window to stop the servers.
pause