# Script para verificar la configuracion de PostgresTools

Write-Host "Verificando configuracion de PostgresTools..." -ForegroundColor Green
Write-Host ""

# Verificar archivos de configuracion
Write-Host "Verificando archivos de configuracion:" -ForegroundColor Cyan

$files = @(
    "postgrestools.jsonc",
    ".vscode/settings.json",
    ".vscode/extensions.json",
    "test-postgrestools.sql",
    "docker-compose.yml",
    "env.local.example"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "OK: $file" -ForegroundColor Green
    } else {
        Write-Host "ERROR: $file (faltante)" -ForegroundColor Red
    }
}

Write-Host ""

# Verificar paquete npm
Write-Host "Verificando paquete npm:" -ForegroundColor Cyan
try {
    $package = npm list @postgrestools/postgrestools
    if ($package -match "@postgrestools/postgrestools") {
        Write-Host "OK: @postgrestools/postgrestools instalado" -ForegroundColor Green
    } else {
        Write-Host "ERROR: @postgrestools/postgrestools no encontrado" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR: Error al verificar paquete npm" -ForegroundColor Red
}

Write-Host ""

# Verificar Docker
Write-Host "Verificando Docker:" -ForegroundColor Cyan
try {
    $dockerVersion = docker --version
    Write-Host "OK: Docker: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker no esta instalado" -ForegroundColor Red
}

Write-Host ""

# Verificar Supabase CLI
Write-Host "Verificando Supabase CLI:" -ForegroundColor Cyan
try {
    $supabaseVersion = supabase --version
    Write-Host "OK: Supabase CLI: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Supabase CLI no esta instalado" -ForegroundColor Red
    Write-Host "   Ejecuta: .\setup-supabase-cli.ps1" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Resumen de configuracion:" -ForegroundColor Cyan
Write-Host ""

Write-Host "Proximos pasos para completar la configuracion:" -ForegroundColor Yellow
Write-Host "1. Instala la extension PostgresTools en VS Code" -ForegroundColor White
Write-Host "2. Ejecuta: PostgresTools: Download Server" -ForegroundColor White
Write-Host "3. Inicia Supabase local:" -ForegroundColor White
Write-Host "   - Opcion A: .\init-supabase.ps1 (si tienes Supabase CLI)" -ForegroundColor White
Write-Host "   - Opcion B: .\start-supabase-docker.ps1 (usando Docker)" -ForegroundColor White
Write-Host "4. Copia env.local.example como .env.local" -ForegroundColor White
Write-Host "5. Abre test-postgrestools.sql en VS Code" -ForegroundColor White
Write-Host "6. Verifica que aparezcan errores de sintaxis" -ForegroundColor White

Write-Host ""
Write-Host "Documentacion disponible:" -ForegroundColor Cyan
Write-Host "- README_POSTGRESTOOLS.md - Guia completa" -ForegroundColor White
Write-Host "- POSTGRESTOOLS_SETUP.md - Configuracion especifica para Windows" -ForegroundColor White

Write-Host ""
Write-Host "Configuracion de PostgresTools completada!" -ForegroundColor Green
