# Script para abrir VS Code con la configuracion completa

Write-Host "Abriendo VS Code con configuracion PostgresTools..." -ForegroundColor Green

# Verificar que VS Code esta instalado
try {
    $vscodePath = Get-Command code -ErrorAction Stop
    Write-Host "VS Code encontrado: $($vscodePath.Source)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: VS Code no esta instalado o no esta en el PATH" -ForegroundColor Red
    Write-Host "Instala VS Code desde: https://code.visualstudio.com/" -ForegroundColor Yellow
    exit 1
}

# Verificar archivos de configuracion
$configFiles = @(
    "mtz-nuevo.code-workspace",
    "postgrestools.jsonc",
    "test-postgrestools.sql"
)

Write-Host "Verificando archivos de configuracion..." -ForegroundColor Cyan
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "OK: $file" -ForegroundColor Green
    } else {
        Write-Host "ERROR: $file (faltante)" -ForegroundColor Red
    }
}

Write-Host ""

# Abrir VS Code con el workspace
Write-Host "Abriendo VS Code..." -ForegroundColor Yellow
Start-Process code -ArgumentList "mtz-nuevo.code-workspace"

Write-Host ""
Write-Host "VS Code se ha abierto con la configuracion completa!" -ForegroundColor Green
Write-Host ""
Write-Host "Instrucciones para completar la configuracion:" -ForegroundColor Cyan
Write-Host "1. Instala las extensiones recomendadas cuando aparezca el popup" -ForegroundColor White
Write-Host "2. Abre el archivo: test-postgrestools.sql" -ForegroundColor White
Write-Host "3. Ejecuta en Command Palette (Ctrl+Shift+P): PostgresTools: Download Server" -ForegroundColor White
Write-Host "4. Verifica que aparezcan errores de sintaxis en el archivo SQL" -ForegroundColor White
Write-Host ""
Write-Host "Para verificar el estado, ejecuta: .\check-setup.ps1" -ForegroundColor Yellow
