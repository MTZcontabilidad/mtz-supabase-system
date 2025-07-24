# Script para inicializar Supabase Local
# Ejecutar después de instalar Supabase CLI

Write-Host "🚀 Inicializando Supabase Local..." -ForegroundColor Green

# Verificar si Supabase CLI está instalado
try {
    $version = supabase --version
    Write-Host "✅ Supabase CLI encontrado: $version" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI no está instalado" -ForegroundColor Red
    Write-Host "Ejecuta primero: .\setup-supabase-cli.ps1" -ForegroundColor Yellow
    exit 1
}

# Inicializar proyecto Supabase si no existe
if (!(Test-Path "supabase")) {
    Write-Host "📁 Inicializando proyecto Supabase..." -ForegroundColor Yellow
    supabase init
} else {
    Write-Host "✅ Proyecto Supabase ya existe" -ForegroundColor Green
}

# Iniciar Supabase local
Write-Host "🔥 Iniciando Supabase local..." -ForegroundColor Yellow
supabase start

# Mostrar estado
Write-Host "📊 Estado de Supabase:" -ForegroundColor Cyan
supabase status

Write-Host "🎉 Supabase local iniciado correctamente!" -ForegroundColor Green
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Abre VS Code" -ForegroundColor White
Write-Host "2. Instala la extensión PostgresTools" -ForegroundColor White
Write-Host "3. Ejecuta: PostgresTools: Download Server" -ForegroundColor White
Write-Host "4. Abre test-postgrestools.sql para probar" -ForegroundColor White
