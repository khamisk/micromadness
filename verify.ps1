# Project Verification Script
# Run this to check if everything is set up correctly

Write-Host "🔍 Verifying MicroMadness Project Setup..." -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    $errors++
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ npm: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm not found" -ForegroundColor Red
    $errors++
}

# Check node_modules
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules folder exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  node_modules not found - run 'npm install'" -ForegroundColor Yellow
    $warnings++
}

# Check .env file
Write-Host "Checking environment..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "DATABASE_URL") {
        Write-Host "  ✓ DATABASE_URL configured" -ForegroundColor Gray
    } else {
        Write-Host "  ⚠️  DATABASE_URL not found in .env" -ForegroundColor Yellow
        $warnings++
    }
    
    if ($envContent -match "NEXT_PUBLIC_GA_MEASUREMENT_ID") {
        Write-Host "  ✓ GA_MEASUREMENT_ID present (optional)" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠️  .env file not found - run setup.ps1" -ForegroundColor Yellow
    $warnings++
}

# Check Prisma
Write-Host "Checking database..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma") {
    Write-Host "✅ Prisma client generated" -ForegroundColor Green
} else {
    Write-Host "⚠️  Prisma client not generated - run 'npx prisma generate'" -ForegroundColor Yellow
    $warnings++
}

if (Test-Path "prisma\dev.db") {
    Write-Host "✅ Database exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database not initialized - run 'npx prisma migrate dev'" -ForegroundColor Yellow
    $warnings++
}

# Check critical files
Write-Host "Checking project files..." -ForegroundColor Yellow
$criticalFiles = @(
    "package.json",
    "next.config.js",
    "tsconfig.json",
    "tailwind.config.ts",
    "prisma\schema.prisma",
    "src\app\page.tsx",
    "src\app\layout.tsx",
    "src\server\GameManager.ts",
    "src\server\MinigameOrchestrator.ts"
)

$missingFiles = @()
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Gray
    } else {
        Write-Host "  ❌ $file missing" -ForegroundColor Red
        $missingFiles += $file
        $errors++
    }
}

# Check minigames
Write-Host "Checking minigames..." -ForegroundColor Yellow
$minigameCount = (Get-ChildItem "src\server\minigames\*.ts" -Exclude "BaseMinigame.ts","index.ts" -ErrorAction SilentlyContinue).Count
if ($minigameCount -ge 16) {
    Write-Host "✅ All 16 minigames found ($minigameCount files)" -ForegroundColor Green
} else {
    Write-Host "⚠️  Only $minigameCount minigames found (expected 16)" -ForegroundColor Yellow
    $warnings++
}

# Summary
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "🎉 Perfect! Everything is set up correctly!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ready to start:" -ForegroundColor Cyan
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Then open: http://localhost:3000" -ForegroundColor Cyan
} elseif ($errors -eq 0) {
    Write-Host "✅ Setup is mostly complete" -ForegroundColor Green
    Write-Host "⚠️  $warnings warning(s) found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You can try running:" -ForegroundColor Cyan
    Write-Host "  npm run dev" -ForegroundColor White
} else {
    Write-Host "❌ $errors error(s) found" -ForegroundColor Red
    if ($warnings -gt 0) {
        Write-Host "⚠️  $warnings warning(s) found" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Please run setup first:" -ForegroundColor Yellow
    Write-Host "  .\setup.ps1" -ForegroundColor White
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Return exit code
if ($errors -gt 0) {
    exit 1
}
exit 0
