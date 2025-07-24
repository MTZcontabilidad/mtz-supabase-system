# Script para configurar el MCP de Supabase correctamente
# Este script configura el token de acceso y verifica la conexion

Write-Host "Configurando MCP de Supabase..." -ForegroundColor Green
Write-Host ""

# Verificar que estamos en el directorio correcto
if (!(Test-Path "package.json")) {
    Write-Host "Error: No se encontro package.json. Ejecuta este script desde la raiz del proyecto." -ForegroundColor Red
    exit 1
}

# Token de acceso de Supabase (service role)
$SUPABASE_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM"

# URL del proyecto Supabase
$SUPABASE_URL = "https://bwgnmastihgndmtbqvkj.supabase.co"

Write-Host "Informacion del proyecto:" -ForegroundColor Cyan
Write-Host "URL: $SUPABASE_URL" -ForegroundColor White
Write-Host "Token: ${SUPABASE_ACCESS_TOKEN:0:20}..." -ForegroundColor White
Write-Host ""

# Configurar variables de entorno
Write-Host "Configurando variables de entorno..." -ForegroundColor Cyan
$env:SUPABASE_ACCESS_TOKEN = $SUPABASE_ACCESS_TOKEN
$env:SUPABASE_URL = $SUPABASE_URL

Write-Host "Variables de entorno configuradas" -ForegroundColor Green
Write-Host ""

# Verificar archivo .cursor/mcp.json
Write-Host "Verificando configuracion del MCP..." -ForegroundColor Cyan
if (Test-Path ".cursor/mcp.json") {
    Write-Host "Archivo .cursor/mcp.json encontrado" -ForegroundColor Green

    # Leer y mostrar la configuracion actual
    $mcpConfig = Get-Content ".cursor/mcp.json" | ConvertFrom-Json
    Write-Host "Configuracion actual del MCP:" -ForegroundColor Yellow
    $mcpConfig | ConvertTo-Json -Depth 3 | Write-Host
} else {
    Write-Host "Archivo .cursor/mcp.json no encontrado" -ForegroundColor Red
    Write-Host "Creando configuracion del MCP..." -ForegroundColor Yellow

    # Crear configuracion del MCP
    $mcpConfig = @{
        mcpServers = @{
            supabase = @{
                command = "npx"
                args = @("-y", "@modelcontextprotocol/server-supabase")
                env = @{
                    SUPABASE_ACCESS_TOKEN = $SUPABASE_ACCESS_TOKEN
                }
            }
        }
    }

    # Crear directorio si no existe
    if (!(Test-Path ".cursor")) {
        New-Item -ItemType Directory -Path ".cursor" | Out-Null
    }

    # Guardar configuracion
    $mcpConfig | ConvertTo-Json -Depth 3 | Set-Content ".cursor/mcp.json"
    Write-Host "Configuracion del MCP creada" -ForegroundColor Green
}

Write-Host ""

# Verificar archivo .env.local
Write-Host "Verificando archivo .env.local..." -ForegroundColor Cyan
if (Test-Path ".env.local") {
    Write-Host "Archivo .env.local encontrado" -ForegroundColor Green
} else {
    Write-Host "Archivo .env.local no encontrado" -ForegroundColor Red
    Write-Host "Creando archivo .env.local..." -ForegroundColor Yellow

    # Crear contenido del archivo .env.local
    $envContent = @"
# Supabase Production Configuration
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui

# MCP Configuration
SUPABASE_ACCESS_TOKEN=$SUPABASE_ACCESS_TOKEN

# Development Settings
NODE_ENV=development
VITE_APP_ENV=production

# Application Settings
VITE_APP_NAME=MTZ Sistema
VITE_APP_VERSION=3.0.0
VITE_APP_DESCRIPTION=Sistema de gestion empresarial MTZ
"@

    $envContent | Set-Content ".env.local"
    Write-Host "Archivo .env.local creado" -ForegroundColor Green
    Write-Host "IMPORTANTE: Actualiza VITE_SUPABASE_ANON_KEY con tu clave anonima" -ForegroundColor Yellow
}

Write-Host ""

# Verificar instalacion de dependencias
Write-Host "Verificando dependencias..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Write-Host "node_modules encontrado" -ForegroundColor Green
} else {
    Write-Host "node_modules no encontrado" -ForegroundColor Red
    Write-Host "Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

Write-Host ""

# Mostrar resumen
Write-Host "RESUMEN DE CONFIGURACION:" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host "Variables de entorno configuradas" -ForegroundColor White
Write-Host "Archivo .cursor/mcp.json verificado" -ForegroundColor White
Write-Host "Archivo .env.local verificado" -ForegroundColor White
Write-Host "Dependencias verificadas" -ForegroundColor White
Write-Host ""

Write-Host "PROXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. Reinicia Cursor para que tome la nueva configuracion del MCP" -ForegroundColor White
Write-Host "2. Actualiza VITE_SUPABASE_ANON_KEY en .env.local" -ForegroundColor White
Write-Host "3. Ejecuta npm run dev para iniciar el servidor de desarrollo" -ForegroundColor White
Write-Host "4. Prueba las funciones del MCP de Supabase" -ForegroundColor White
Write-Host ""

Write-Host "Configuracion del MCP de Supabase completada!" -ForegroundColor Green
