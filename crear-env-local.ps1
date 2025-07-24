# Script simple para crear .env.local
Write-Host "Configurando variables de entorno..." -ForegroundColor Green

# Credenciales de Supabase
$SUPABASE_URL = "https://bwgnmastihgndmtbqvkj.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I"

# Crear contenido del archivo
$content = @"
# Variables de entorno para MTZ Sistema
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
NODE_ENV=development
VITE_APP_ENV=development
VITE_APP_NAME=MTZ Sistema
VITE_APP_VERSION=3.0.0
"@

# Escribir archivo
$content | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "Archivo .env.local creado exitosamente" -ForegroundColor Green
Write-Host "Variables configuradas:" -ForegroundColor Yellow
Write-Host "  VITE_SUPABASE_URL: $SUPABASE_URL" -ForegroundColor Cyan
Write-Host "  VITE_SUPABASE_ANON_KEY: [CONFIGURADO]" -ForegroundColor Cyan
