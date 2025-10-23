# PowerShell script to set up Zenith Marketplace for login functionality

Write-Host "🚀 Setting up Zenith Marketplace for Login..." -ForegroundColor Green

# Navigate to Zenith-OG directory
cd Zenith-OG

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.local" ".env"
    Write-Host "✅ .env file created! Please edit it with your MySQL credentials." -ForegroundColor Green
    Write-Host "Edit the DATABASE_URL line with your actual MySQL username and password." -ForegroundColor Cyan
} else {
    Write-Host "✅ .env file already exists." -ForegroundColor Green
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npm run db:generate

# Check if we can connect to database
Write-Host "🔌 Testing database connection..." -ForegroundColor Yellow
try {
    npm run db:studio -- --browser none
    Write-Host "✅ Database connection successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Database connection failed. Please check your DATABASE_URL in .env" -ForegroundColor Red
    Write-Host "Make sure MySQL is running and credentials are correct." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file with your MySQL credentials" -ForegroundColor White
Write-Host "2. Run the realistic_sample_data.sql script in MySQL Workbench" -ForegroundColor White
Write-Host "3. Start the development server: npm run dev" -ForegroundColor White
Write-Host "4. Test login at http://localhost:3000/login" -ForegroundColor White
Write-Host ""
Write-Host "Test user credentials:" -ForegroundColor Yellow
Write-Host "Email: john.smith@uct.ac.za" -ForegroundColor White
Write-Host "Password: StudentPass123!" -ForegroundColor White