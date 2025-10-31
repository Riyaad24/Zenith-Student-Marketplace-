# Zenith Marketplace - Start Both Servers
Write-Host "Starting Zenith Student Marketplace Servers..." -ForegroundColor Cyan
Write-Host ""

# Navigate to Zenith-OG directory
Set-Location "C:\Users\riyaa\Zenith-Student-Marketplace-\Zenith-Student-Marketplace-\Zenith-OG"

# Start Backend in new window
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\riyaa\Zenith-Student-Marketplace-\Zenith-Student-Marketplace-\backend'; Write-Host 'Backend Server' -ForegroundColor Green; node index.js"

# Wait a moment
Start-Sleep -Seconds 2

# Start Frontend in new window  
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\riyaa\Zenith-Student-Marketplace-\Zenith-Student-Marketplace-\Zenith-OG'; Write-Host 'Frontend Server' -ForegroundColor Green; npm run dev"

# Wait for servers to start
Write-Host ""
Write-Host "Waiting for servers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check status
Write-Host ""
Write-Host "=== SERVER STATUS ===" -ForegroundColor Cyan
$backend = netstat -ano | findstr ":3001" | findstr "LISTENING"
$frontend = netstat -ano | findstr ":3000" | findstr "LISTENING"

if ($backend) {
    Write-Host "✅ Backend: Running on port 3001" -ForegroundColor Green
} else {
    Write-Host "❌ Backend: Not running" -ForegroundColor Red
}

if ($frontend) {
    Write-Host "✅ Frontend: Running on port 3000" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend: Not running" -ForegroundColor Red
}

Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Website: http://localhost:3000" -ForegroundColor Green
Write-Host "API: http://localhost:3001" -ForegroundColor Green
Write-Host ""
