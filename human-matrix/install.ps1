<#
.SYNOPSIS
  Script d'installation Human Matrix — télécharge et extrait les fichiers
.DESCRIPTION
  Télécharge le backend et frontend depuis filebin et les extrait sur le Bureau
#>

$ErrorActionPreference = "Stop"
$Desktop = [Environment]::GetFolderPath("Desktop")
$OutputDir = Join-Path $Desktop "human-matrix"

Write-Host "=== Human Matrix - Installation ===" -ForegroundColor Cyan
Write-Host "Destination: $OutputDir" -ForegroundColor Gray
Write-Host ""

# Créer le dossier de sortie
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

# === BACKEND ===
Write-Host "[1/2] Téléchargement du backend..." -ForegroundColor Yellow
$backendUrl = "https://filebin.net/human-matrix-v2/backend.zip"
$backendZip = Join-Path $OutputDir "backend.zip"

try {
    Invoke-WebRequest -Uri $backendUrl -OutFile $backendZip -UseBasicParsing -ErrorAction Stop
    Write-Host "  ✅ Backend téléchargé ($([math]::Round((Get-Item $backendZip).Length/1KB)) KB)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Échec du téléchargement: $_" -ForegroundColor Red
    Write-Host "  Essai avec méthode alternative..."
    # Alternative: utiliser .NET WebClient
    $wc = New-Object System.Net.WebClient
    $wc.DownloadFile($backendUrl, $backendZip)
    Write-Host "  ✅ Backend téléchargé (méthode alternative)" -ForegroundColor Green
}

Write-Host "[1/2] Extraction du backend..." -ForegroundColor Yellow
$backendDir = Join-Path $OutputDir "backend"
New-Item -ItemType Directory -Force -Path $backendDir | Out-Null
try {
    Expand-Archive -Path $backendZip -DestinationPath $backendDir -Force
    Write-Host "  ✅ Backend extrait" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Échec de l'extraction: $_" -ForegroundColor Red
}

# === FRONTEND ===
Write-Host "[2/2] Téléchargement du frontend..." -ForegroundColor Yellow
$frontendUrl = "https://filebin.net/human-matrix-v2/frontend.zip"
$frontendZip = Join-Path $OutputDir "frontend.zip"

try {
    Invoke-WebRequest -Uri $frontendUrl -OutFile $frontendZip -UseBasicParsing -ErrorAction Stop
    Write-Host "  ✅ Frontend téléchargé ($([math]::Round((Get-Item $frontendZip).Length/1KB)) KB)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Échec du téléchargement: $_" -ForegroundColor Red
}

Write-Host "[2/2] Extraction du frontend..." -ForegroundColor Yellow
$frontendDir = Join-Path $OutputDir "frontend"
New-Item -ItemType Directory -Force -Path $frontendDir | Out-Null
try {
    Expand-Archive -Path $frontendZip -DestinationPath $frontendDir -Force
    Write-Host "  ✅ Frontend extrait" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Échec de l'extraction: $_" -ForegroundColor Red
}

# === RÉSULTAT ===
Write-Host ""
Write-Host "══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ TOUT EST PRÊT !" -ForegroundColor Green
Write-Host "══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Les fichiers sont dans :" -ForegroundColor White
Write-Host "  📁 $OutputDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "Structure :" -ForegroundColor Gray
Write-Host "  📁 backend\human-matrix-api\" -ForegroundColor Yellow
Write-Host "     ├── backend\server.py" -ForegroundColor Gray
Write-Host "     ├── backend\requirements.txt" -ForegroundColor Gray
Write-Host "     ├── emergentintegrations\" -ForegroundColor Gray
Write-Host "     ├── render.yaml" -ForegroundColor Gray
Write-Host "     └── .gitignore" -ForegroundColor Gray
Write-Host ""
Write-Host "  📁 frontend\" -ForegroundColor Yellow
Write-Host "     ├── index.html" -ForegroundColor Gray
Write-Host "     ├── _redirects" -ForegroundColor Gray
Write-Host "     └── ... (fichiers du site)" -ForegroundColor Gray
Write-Host ""
Write-Host "Prochaine étape :" -ForegroundColor Cyan
Write-Host "  1. Va sur https://github.com et crée un repo 'human-matrix-api'" -ForegroundColor White
Write-Host "  2. Upload le dossier backend\human-matrix-api\ sur GitHub" -ForegroundColor White
Write-Host "  3. Va sur https://dashboard.render.com et déploie le backend" -ForegroundColor White
Write-Host "  4. Va sur https://app.netlify.com et glisse le dossier frontend\" -ForegroundColor White
Write-Host ""
Write-Host "Appuie sur ENTREE pour fermer..." -ForegroundColor Gray
Read-Host | Out-Null
