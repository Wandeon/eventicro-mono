# PowerShell script to start the EventiCRO application with database connection

# Set environment variable for database connection
$env:POSTGRES_URL = "postgresql://eventicro:eventicro123@localhost:5432/eventicro"
$env:NODE_ENV = "development"
$env:GIT_SHA = "unknown"

Write-Host "Starting EventiCRO application with database connection..." -ForegroundColor Green
Write-Host "Database URL: $env:POSTGRES_URL" -ForegroundColor Yellow

# Navigate to the UI directory and start the application
Set-Location "apps/ui"
npm run dev
