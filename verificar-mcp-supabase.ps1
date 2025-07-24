# Script para verificar y configurar MCP de Supabase
# Autor: Sistema MTZ
# Fecha: Enero 2025

Write-Host "🔍 VERIFICANDO MCP DE SUPABASE" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# 1. Verificar si existe el token de acceso
Write-Host "`n1️⃣ Verificando token de acceso..." -ForegroundColor Yellow
$envToken = $env:SUPABASE_ACCESS_TOKEN
if ($envToken) {
    Write-Host "✅ SUPABASE_ACCESS_TOKEN encontrado en variables de entorno" -ForegroundColor Green
    Write-Host "   Token: $($envToken.Substring(0, 10))..." -ForegroundColor White
} else {
    Write-Host "❌ SUPABASE_ACCESS_TOKEN NO encontrado" -ForegroundColor Red
}

# 2. Verificar archivo .env.local
Write-Host "`n2️⃣ Verificando archivo .env.local..." -ForegroundColor Yellow
$envFile = ".env.local"
if (Test-Path $envFile) {
    Write-Host "✅ Archivo .env.local existe" -ForegroundColor Green
    $envContent = Get-Content $envFile
    $supabaseUrl = $envContent | Where-Object {$_ -match "VITE_SUPABASE_URL"}
    $supabaseKey = $envContent | Where-Object {$_ -match "VITE_SUPABASE_ANON_KEY"}

    if ($supabaseUrl) {
        Write-Host "✅ VITE_SUPABASE_URL configurado" -ForegroundColor Green
        Write-Host "   URL: $supabaseUrl" -ForegroundColor White
    } else {
        Write-Host "❌ VITE_SUPABASE_URL NO configurado" -ForegroundColor Red
    }

    if ($supabaseKey) {
        Write-Host "✅ VITE_SUPABASE_ANON_KEY configurado" -ForegroundColor Green
        Write-Host "   Key: $($supabaseKey.Split('=')[1].Substring(0, 20))..." -ForegroundColor White
    } else {
        Write-Host "❌ VITE_SUPABASE_ANON_KEY NO configurado" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Archivo .env.local NO existe" -ForegroundColor Red
}

# 3. Verificar configuración de Supabase
Write-Host "`n3️⃣ Verificando configuración de Supabase..." -ForegroundColor Yellow
$configFile = "supabase/config.toml"
if (Test-Path $configFile) {
    Write-Host "✅ Archivo config.toml existe" -ForegroundColor Green
} else {
    Write-Host "❌ Archivo config.toml NO existe" -ForegroundColor Red
}

# 4. Verificar Supabase CLI
Write-Host "`n4️⃣ Verificando Supabase CLI..." -ForegroundColor Yellow
try {
    $supabaseVersion = supabase --version 2>$null
    if ($supabaseVersion) {
        Write-Host "✅ Supabase CLI instalado" -ForegroundColor Green
        Write-Host "   Versión: $supabaseVersion" -ForegroundColor White
    } else {
        Write-Host "❌ Supabase CLI NO instalado" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Supabase CLI NO instalado" -ForegroundColor Red
}

# 5. Verificar conexión a Supabase
Write-Host "`n5️⃣ Verificando conexión a Supabase..." -ForegroundColor Yellow
$supabaseUrl = "https://bwgnmastihgndmtbqvkj.supabase.co"
try {
    $response = Invoke-WebRequest -Uri "$supabaseUrl/rest/v1/" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Conexión a Supabase exitosa" -ForegroundColor Green
    } else {
        Write-Host "❌ Conexión a Supabase falló (Status: $($response.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ No se pudo conectar a Supabase" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Resumen y recomendaciones
Write-Host "`n📊 RESUMEN DEL MCP DE SUPABASE" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

if ($envToken -and (Test-Path $envFile) -and (Test-Path $configFile)) {
    Write-Host "✅ MCP de Supabase está configurado correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ MCP de Supabase necesita configuración" -ForegroundColor Red
}

Write-Host "`n🚀 PRÓXIMOS PASOS PARA CONFIGURAR MCP:" -ForegroundColor Yellow

if (-not $envToken) {
    Write-Host "1️⃣ Configurar SUPABASE_ACCESS_TOKEN:" -ForegroundColor White
    Write-Host "   - Ve a https://supabase.com/dashboard/account/tokens" -ForegroundColor White
    Write-Host "   - Crea un nuevo token de acceso" -ForegroundColor White
    Write-Host "   - Configura la variable de entorno:" -ForegroundColor White
    Write-Host "     `$env:SUPABASE_ACCESS_TOKEN = 'tu_token_aqui'" -ForegroundColor White
}

if (-not (Test-Path $envFile)) {
    Write-Host "2️⃣ Crear archivo .env.local:" -ForegroundColor White
    Write-Host "   - Copia env.local.example como .env.local" -ForegroundColor White
    Write-Host "   - Configura las variables de Supabase" -ForegroundColor White
}

Write-Host "`n3️⃣ Para probar MCP de Supabase:" -ForegroundColor White
Write-Host "   - Configura el token de acceso" -ForegroundColor White
Write-Host "   - Reinicia el entorno de desarrollo" -ForegroundColor White
Write-Host "   - Prueba las funciones MCP de Supabase" -ForegroundColor White

Write-Host "`n✅ Verificación del MCP completada!" -ForegroundColor Green
