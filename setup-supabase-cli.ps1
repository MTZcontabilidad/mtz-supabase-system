# Script para instalar Supabase CLI en Windows
# Ejecutar como administrador si es necesario

Write-Host "🚀 Instalando Supabase CLI..." -ForegroundColor Green

# Verificar si Chocolatey está instalado
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Instalando Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
} else {
    Write-Host "✅ Chocolatey ya está instalado" -ForegroundColor Green
}

# Instalar Supabase CLI usando Chocolatey
Write-Host "📥 Instalando Supabase CLI..." -ForegroundColor Yellow
choco install supabase -y

# Verificar la instalación
Write-Host "🔍 Verificando instalación..." -ForegroundColor Yellow
try {
    $version = supabase --version
    Write-Host "✅ Supabase CLI instalado correctamente: $version" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al verificar Supabase CLI" -ForegroundColor Red
    Write-Host "Intenta ejecutar: choco install supabase -y" -ForegroundColor Yellow
}

Write-Host "🎉 Instalación completada!" -ForegroundColor Green
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Ejecuta: supabase start" -ForegroundColor White
Write-Host "2. Ejecuta: supabase status" -ForegroundColor White
Write-Host "3. Ejecuta: .\verificar-mcp-supabase.ps1 para verificar la conexión" -ForegroundColor White
