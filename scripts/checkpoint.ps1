# scripts/checkpoint.ps1 - Automated checkpoint backup script
# Saves both a Git checkpoint commit and a standalone physical ZIP snapshot

$ErrorActionPreference = "Stop"

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$checkpointDir = Join-Path -Path $PSScriptRoot -ChildPath "..\_checkpoints"
$rootDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " [CHECKPOINT] Creating System Recovery Snapshot...    " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# 1. Ensure _checkpoints folder exists
if (-not (Test-Path $checkpointDir)) {
    New-Item -ItemType Directory -Path $checkpointDir -Force | Out-Null
}

# 2. Git Checkpoint (Commit + Tag)
try {
    Set-Location $rootDir
    git add -A
    $status = git status --porcelain
    if ($status) {
        git commit -m "checkpoint: automatic snapshot at $timestamp"
        Write-Host " -> Git commit created: checkpoint $timestamp" -ForegroundColor Green
    } else {
        Write-Host " -> Working tree clean. Tagging current state..." -ForegroundColor Yellow
    }

    # Update floating recovery tag 'checkpoint-latest'
    git tag -f "checkpoint-latest"
    Write-Host " -> Updated Git tag: checkpoint-latest" -ForegroundColor Green
} catch {
    Write-Host " [Warning] Git checkpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Create Standalone Physical ZIP Snapshot (Excludes node_modules and .git)
$zipName = "DriveEasy_Checkpoint_$timestamp.zip"
$zipPath = Join-Path $checkpointDir $zipName

Write-Host " -> Archiving clean source code to $zipName..." -ForegroundColor Cyan

# Files and folders to back up
$itemsToCompress = @(
    (Join-Path $rootDir "backend"),
    (Join-Path $rootDir "frontend"),
    (Join-Path $rootDir "README.md"),
    (Join-Path $rootDir ".gitignore")
)

# Temporary staging directory to exclude node_modules and .git
$tempStage = Join-Path $env:TEMP "driveeasy_stage_$timestamp"
New-Item -ItemType Directory -Path $tempStage -Force | Out-Null

try {
    # Copy backend (excluding node_modules)
    $destBackend = Join-Path $tempStage "backend"
    robocopy (Join-Path $rootDir "backend") $destBackend /E /XD node_modules /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null

    # Copy frontend (excluding node_modules and dist)
    $destFrontend = Join-Path $tempStage "frontend"
    robocopy (Join-Path $rootDir "frontend") $destFrontend /E /XD node_modules dist /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null

    # Copy root config files
    Copy-Item (Join-Path $rootDir "README.md") -Destination $tempStage -Force -ErrorAction SilentlyContinue
    Copy-Item (Join-Path $rootDir ".gitignore") -Destination $tempStage -Force -ErrorAction SilentlyContinue

    # Compress into archive
    Compress-Archive -Path "$tempStage\*" -DestinationPath $zipPath -Force
    Write-Host " -> Standalone ZIP archive saved: $zipPath" -ForegroundColor Green
} finally {
    Remove-Item -Recurse -Force $tempStage -ErrorAction SilentlyContinue
}

Write-Host "`n======================================================" -ForegroundColor Green
Write-Host " SUCCESS: Checkpoint recorded at $timestamp!" -ForegroundColor Green
Write-Host " In case of crash, run: .\scripts\restore.ps1" -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Green
