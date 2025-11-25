#!/usr/bin/env pwsh
Param()

Write-Host "Starting Zenith-OG dev server..."
Push-Location "$(Split-Path -Parent $MyInvocation.MyCommand.Definition)\..\Zenith-OG"
if (Test-Path -Path "node_modules") {
    Write-Host "node_modules found"
} else {
    Write-Host "Installing dependencies..."
    npm ci
}

npm run dev
Pop-Location