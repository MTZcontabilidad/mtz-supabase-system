# Script simplificado para instalar Supabase CLI

Write-Host "Instalando Supabase CLI..." -ForegroundColor Green

# Verificar si Chocolatey esta instalado
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Instalando Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
} else {
    Write-Host "Chocolatey ya esta instalado" -ForegroundColor Green
}

# Instalar Supabase CLI usando Chocolatey
Write-Host "Instalando Supabase CLI..." -ForegroundColor Yellow
choco install supabase -y

# Verificar la instalacion
Write-Host "Verificando instalacion..." -ForegroundColor Yellow
try {
    $version = supabase --version
    Write-Host "Supabase CLI instalado correctamente: $version" -ForegroundColor Green
} catch {
    Write-Host "Error al verificar Supabase CLI" -ForegroundColor Red
    Write-Host "Intenta ejecutar: choco install supabase -y" -ForegroundColor Yellow
}

Write-Host "Instalacion completada!" -ForegroundColor Green
