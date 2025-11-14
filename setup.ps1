# MicroMadness Setup Script
# Run this after cloning the repository

Write-Host "🎮 Setting up MicroMadness..." -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "`n📦 Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Setup environment file
Write-Host "`n🔧 Setting up environment variables..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file from .env.example" -ForegroundColor Green
    Write-Host "⚠️  Please edit .env and add your Google Analytics ID if needed" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️  .env file already exists" -ForegroundColor Cyan
}

# Setup database
Write-Host "`n🗄️  Setting up database..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma client generated" -ForegroundColor Green

npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Database migration may have failed, but this might be okay if it already exists" -ForegroundColor Yellow
}

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`n🚀 To start the development server, run:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "`n📖 Then open http://localhost:3000 in your browser" -ForegroundColor Cyan
