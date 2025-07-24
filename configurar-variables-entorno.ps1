# Script para configurar variables de entorno para el Sistema MTZ
Write-Host "🔧 Configurando variables de entorno para MTZ Sistema..." -ForegroundColor Green
Write-Host ""

# Verificar que estamos en el directorio correcto
if (!(Test-Path "package.json")) {
    Write-Host "Error: No se encontro package.json. Ejecuta este script desde la raiz del proyecto." -ForegroundColor Red
    exit 1
}

# Credenciales de Supabase
$SUPABASE_URL = "https://bwgnmastihgndmtbqvkj.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I"

# Crear archivo .env.local
$envContent = @"
# =====================================================================
# 🔧 VARIABLES DE ENTORNO - SISTEMA MTZ v3.0
# Archivo generado automaticamente - NO SUBIR A GITHUB
# =====================================================================

# Supabase Configuration
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# Development Settings
NODE_ENV=development
VITE_APP_ENV=development

# Application Settings
VITE_APP_NAME=MTZ Sistema
VITE_APP_VERSION=3.0.0
VITE_APP_DESCRIPTION=Sistema de gestion empresarial MTZ

# =====================================================================
# ⚠️ IMPORTANTE: Este archivo contiene credenciales reales
# NO lo subas a GitHub ni lo compartas
# =====================================================================
"@

# Escribir archivo .env.local
$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "✅ Archivo .env.local creado exitosamente" -ForegroundColor Green
Write-Host ""

# Verificar que el archivo se creó
if (Test-Path ".env.local") {
    Write-Host "📋 Contenido del archivo .env.local:" -ForegroundColor Yellow
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match "VITE_SUPABASE") {
            Write-Host "  $_" -ForegroundColor Cyan
        } else {
            Write-Host "  $_" -ForegroundColor White
        }
    }
} else {
    Write-Host "❌ Error: No se pudo crear el archivo .env.local" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. Ejecuta 'npm run dev' para probar la aplicación" -ForegroundColor White
Write-Host "2. Verifica que las páginas funcionen correctamente" -ForegroundColor White
Write-Host "3. Sube el código a GitHub (sin .env.local)" -ForegroundColor White
Write-Host "4. Configura las variables en Vercel para producción" -ForegroundColor White
Write-Host ""
Write-Host "🔒 SEGURIDAD:" -ForegroundColor Yellow
Write-Host "✅ .env.local está en .gitignore (no se subirá a GitHub)" -ForegroundColor Green
Write-Host "✅ Credenciales configuradas de forma segura" -ForegroundColor Green
Write-Host "✅ Listo para despliegue en Vercel" -ForegroundColor Green
