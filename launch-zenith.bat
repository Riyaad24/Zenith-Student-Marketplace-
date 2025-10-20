@echo off
echo Starting Zenith Student Marketplace...
echo.
echo This will start both the backend and frontend servers.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Starting backend...
start "Zenith Backend" cmd /k "cd /d C:\Users\riyaa\Zenith-Student-Marketplace-\Zenith-Student-Marketplace-\backend && node index.js"

timeout /t 3 /nobreak > nul

echo Starting frontend...
start "Zenith Frontend" cmd /k "cd /d C:\Users\riyaa\Zenith-Student-Marketplace-\Zenith-Student-Marketplace-\Zenith-OG && npm run dev"

timeout /t 5 /nobreak > nul

echo Opening website...
start http://localhost:3000

echo.
echo Zenith Student Marketplace is starting up!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001
echo.
pause