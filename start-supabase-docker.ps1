# Script para iniciar Supabase usando Docker
# Alternativa si Supabase CLI no funciona

Write-Host "🐳 Iniciando Supabase con Docker..." -ForegroundColor Green

# Verificar si Docker está instalado
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker encontrado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está instalado" -ForegroundColor Red
    Write-Host "Instala Docker Desktop desde: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Verificar si Docker está ejecutándose
try {
    docker ps > $null 2>&1
    Write-Host "✅ Docker está ejecutándose" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está ejecutándose" -ForegroundColor Red
    Write-Host "Inicia Docker Desktop y vuelve a ejecutar este script" -ForegroundColor Yellow
    exit 1
}

# Detener contenedores existentes si los hay
Write-Host "🛑 Deteniendo contenedores existentes..." -ForegroundColor Yellow
docker-compose down

# Iniciar Supabase con Docker Compose
Write-Host "🚀 Iniciando Supabase..." -ForegroundColor Yellow
docker-compose up -d

# Esperar un momento para que los servicios se inicien
Write-Host "⏳ Esperando que los servicios se inicien..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar estado de los contenedores
Write-Host "📊 Estado de los contenedores:" -ForegroundColor Cyan
docker-compose ps

Write-Host "🎉 Supabase iniciado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 URLs de acceso:" -ForegroundColor Cyan
Write-Host "• API: http://localhost:54321" -ForegroundColor White
Write-Host "• Auth: http://localhost:54323" -ForegroundColor White
Write-Host "• Realtime: http://localhost:54324" -ForegroundColor White
Write-Host "• Storage: http://localhost:54325" -ForegroundColor White
Write-Host "• Mail: http://localhost:54326" -ForegroundColor White
Write-Host ""
Write-Host "🗄️ Base de datos PostgreSQL:" -ForegroundColor Cyan
Write-Host "• Host: localhost" -ForegroundColor White
Write-Host "• Puerto: 54322" -ForegroundColor White
Write-Host "• Usuario: postgres" -ForegroundColor White
Write-Host "• Contraseña: postgres" -ForegroundColor White
Write-Host "• Base de datos: postgres" -ForegroundColor White
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Abre VS Code" -ForegroundColor White
Write-Host "2. Ejecuta: .\verificar-mcp-supabase.ps1 para verificar la conexión" -ForegroundColor White
Write-Host "3. Usa el MCP de Supabase para gestionar la base de datos" -ForegroundColor White
