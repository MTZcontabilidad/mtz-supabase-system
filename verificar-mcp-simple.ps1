# Script simple para verificar MCP de Supabase
Write-Host "Verificando MCP de Supabase..." -ForegroundColor Cyan

# Verificar token de acceso
$envToken = $env:SUPABASE_ACCESS_TOKEN
if ($envToken) {
    Write-Host "SUPABASE_ACCESS_TOKEN encontrado" -ForegroundColor Green
} else {
    Write-Host "SUPABASE_ACCESS_TOKEN NO encontrado" -ForegroundColor Red
}

# Verificar archivo .env.local
$envFile = ".env.local"
if (Test-Path $envFile) {
    Write-Host "Archivo .env.local existe" -ForegroundColor Green
} else {
    Write-Host "Archivo .env.local NO existe" -ForegroundColor Red
}

# Verificar config.toml
$configFile = "supabase/config.toml"
if (Test-Path $configFile) {
    Write-Host "Archivo config.toml existe" -ForegroundColor Green
} else {
    Write-Host "Archivo config.toml NO existe" -ForegroundColor Red
}

# Verificar Supabase CLI
try {
    $supabaseVersion = supabase --version 2>$null
    if ($supabaseVersion) {
        Write-Host "Supabase CLI instalado" -ForegroundColor Green
    } else {
        Write-Host "Supabase CLI NO instalado" -ForegroundColor Red
    }
} catch {
    Write-Host "Supabase CLI NO instalado" -ForegroundColor Red
}

Write-Host "Para configurar MCP de Supabase:" -ForegroundColor Yellow
Write-Host "1. Ve a https://supabase.com/dashboard/account/tokens" -ForegroundColor White
Write-Host "2. Crea un token de acceso" -ForegroundColor White
Write-Host "3. Configura: `$env:SUPABASE_ACCESS_TOKEN = 'tu_token'" -ForegroundColor White
