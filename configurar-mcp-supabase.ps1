# Script para configurar MCP de Supabase
Write-Host "Configurando MCP de Supabase..." -ForegroundColor Cyan

# Verificar token actual
$currentToken = $env:SUPABASE_ACCESS_TOKEN
if ($currentToken) {
    Write-Host "Token actual encontrado: $($currentToken.Substring(0, 20))..." -ForegroundColor Green
} else {
    Write-Host "No hay token configurado" -ForegroundColor Red
}

# Verificar archivo .env.local
$envFile = ".env.local"
if (Test-Path $envFile) {
    Write-Host "Archivo .env.local existe" -ForegroundColor Green
    $envContent = Get-Content $envFile
    $supabaseUrl = $envContent | Where-Object {$_ -match "VITE_SUPABASE_URL"}
    if ($supabaseUrl) {
        Write-Host "URL de Supabase: $supabaseUrl" -ForegroundColor White
    }
} else {
    Write-Host "Archivo .env.local NO existe" -ForegroundColor Red
    Write-Host "Copiando env.local.example..." -ForegroundColor Yellow
    Copy-Item "env.local.example" ".env.local"
}

# Instrucciones para configurar token
Write-Host "`nPara configurar el token de acceso:" -ForegroundColor Yellow
Write-Host "1. Ve a: https://supabase.com/dashboard/account/tokens" -ForegroundColor White
Write-Host "2. Crea un nuevo token de acceso" -ForegroundColor White
Write-Host "3. Copia el token" -ForegroundColor White
Write-Host "4. Ejecuta en PowerShell:" -ForegroundColor White
Write-Host "   `$env:SUPABASE_ACCESS_TOKEN = 'tu_token_aqui'" -ForegroundColor White
Write-Host "5. O agrega al archivo .env.local:" -ForegroundColor White
Write-Host "   SUPABASE_ACCESS_TOKEN=tu_token_aqui" -ForegroundColor White

Write-Host "`nProyecto ID: bwgnmastihgndmtbqvkj" -ForegroundColor Cyan
Write-Host "URL: https://bwgnmastihgndmtbqvkj.supabase.co" -ForegroundColor Cyan
