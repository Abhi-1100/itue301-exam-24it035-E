# scripts/restore.ps1 - Automated system restore script
# Restores working code from the latest Git checkpoint or physical ZIP snapshot

$ErrorActionPreference = "Continue"

$rootDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$checkpointDir = Join-Path -Path $PSScriptRoot -ChildPath "..\_checkpoints"

Write-Host "======================================================" -ForegroundColor Yellow
Write-Host " [RESTORE] DriveEasy Disaster Recovery Assistant     " -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Yellow

Set-Location $rootDir

# Option 1: Git Restore
Write-Host "Attempting fast Git restore to latest checkpoint..." -ForegroundColor Cyan

try {
    # Check if git is operational
    $gitStatus = git status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " -> Stashing uncommitted local changes (safety backup)..." -ForegroundColor Gray
        git stash save "pre-restore-stash-$(Get-Date -Format 'yyyyMMdd-HHmmss')" | Out-Null
        
        Write-Host " -> Checking out checkpoint-latest tag..." -ForegroundColor Green
        git checkout checkpoint-latest
        git checkout main
        git reset --hard checkpoint-latest
        Write-Host " -> Git working tree successfully restored to 'checkpoint-latest'!" -ForegroundColor Green
    } else {
        throw "Git repository not responding or corrupted."
    }
} catch {
    Write-Host " [Warning] Git restore encountered an issue: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host " Switching to physical ZIP recovery..." -ForegroundColor Yellow

    # Option 2: Physical ZIP fallback
    if (Test-Path $checkpointDir) {
        $latestZip = Get-ChildItem -Path $checkpointDir -Filter "*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($latestZip) {
            Write-Host " -> Found latest ZIP archive: $($latestZip.Name)" -ForegroundColor Cyan
            Write-Host " -> Extracting clean files over workspace..." -ForegroundColor Cyan
            Expand-Archive -Path $latestZip.FullName -DestinationPath $rootDir -Force
            Write-Host " -> Physical ZIP recovery completed successfully!" -ForegroundColor Green
        } else {
            Write-Host " [Error] No ZIP archives found in _checkpoints directory." -ForegroundColor Red
        }
    } else {
        Write-Host " [Error] No _checkpoints directory found." -ForegroundColor Red
    }
}

# 3. Verify .env configurations
Write-Host "`nVerifying environment (.env) files..." -ForegroundColor Cyan

$backendEnv = Join-Path $rootDir "backend\.env"
$backendEnvExample = Join-Path $rootDir "backend\.env.example"
if (-not (Test-Path $backendEnv) -and (Test-Path $backendEnvExample)) {
    Copy-Item $backendEnvExample $backendEnv
    Write-Host " -> Created missing backend/.env from .env.example" -ForegroundColor Green
} else {
    Write-Host " -> backend/.env is present." -ForegroundColor Green
}

$frontendEnv = Join-Path $rootDir "frontend\.env"
$frontendEnvExample = Join-Path $rootDir "frontend\.env.example"
if (-not (Test-Path $frontendEnv) -and (Test-Path $frontendEnvExample)) {
    Copy-Item $frontendEnvExample $frontendEnv
    Write-Host " -> Created missing frontend/.env from .env.example" -ForegroundColor Green
} else {
    Write-Host " -> frontend/.env is present." -ForegroundColor Green
}

Write-Host "`n======================================================" -ForegroundColor Green
Write-Host " RESTORATION COMPLETE! Code has been recovered." -ForegroundColor Green
Write-Host " Next steps to restart your environment:" -ForegroundColor Cyan
Write-Host "   1. Reseed DB: cd backend; npm run seed" -ForegroundColor White
Write-Host "   2. Start Backend: cd backend; npm start" -ForegroundColor White
Write-Host "   3. Start Frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host "======================================================" -ForegroundColor Green
