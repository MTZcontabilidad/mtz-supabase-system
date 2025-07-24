# Script para verificar que todo esté listo para GitHub y Vercel
Write-Host "Verificando configuracion para despliegue..." -ForegroundColor Green
Write-Host ""

# Verificar archivos críticos
$archivosCriticos = @(
    "package.json",
    "vite.config.js",
    "src/lib/supabase.js",
    "src/services/dataService.js",
    ".gitignore",
    "vercel.json"
)

Write-Host "Verificando archivos criticos..." -ForegroundColor Yellow
foreach ($archivo in $archivosCriticos) {
    if (Test-Path $archivo) {
        Write-Host "  ✅ $archivo" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $archivo (FALTANTE)" -ForegroundColor Red
    }
}

Write-Host ""

# Verificar variables de entorno
Write-Host "Verificando variables de entorno..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "  ✅ .env.local existe" -ForegroundColor Green

    $envContent = Get-Content ".env.local"
    $hasSupabaseUrl = $envContent | Where-Object { $_ -match "VITE_SUPABASE_URL" }
    $hasSupabaseKey = $envContent | Where-Object { $_ -match "VITE_SUPABASE_ANON_KEY" }

    if ($hasSupabaseUrl) {
        Write-Host "  ✅ VITE_SUPABASE_URL configurado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ VITE_SUPABASE_URL faltante" -ForegroundColor Red
    }

    if ($hasSupabaseKey) {
        Write-Host "  ✅ VITE_SUPABASE_ANON_KEY configurado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ VITE_SUPABASE_ANON_KEY faltante" -ForegroundColor Red
    }
} else {
    Write-Host "  ❌ .env.local no existe" -ForegroundColor Red
}

Write-Host ""

# Verificar .gitignore
Write-Host "Verificando .gitignore..." -ForegroundColor Yellow
$gitignoreContent = Get-Content ".gitignore"
$ignoredFiles = @(".env.local", ".env", "node_modules", "dist", ".vercel")

foreach ($file in $ignoredFiles) {
    $isIgnored = $gitignoreContent | Where-Object { $_ -match $file }
    if ($isIgnored) {
        Write-Host "  ✅ $file está en .gitignore" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file NO está en .gitignore" -ForegroundColor Red
    }
}

Write-Host ""

# Verificar configuración de Supabase
Write-Host "Verificando configuracion de Supabase..." -ForegroundColor Yellow
$supabaseContent = Get-Content "src/lib/supabase.js"
$usesEnvVars = $supabaseContent | Where-Object { $_ -match "import.meta.env" }
$hasHardcodedCreds = $supabaseContent | Where-Object { $_ -match "bwgnmastihgndmtbqvkj" }

if ($usesEnvVars) {
    Write-Host "  ✅ Usa variables de entorno" -ForegroundColor Green
} else {
    Write-Host "  ❌ No usa variables de entorno" -ForegroundColor Red
}

if ($hasHardcodedCreds) {
    Write-Host "  ⚠️ Credenciales hardcodeadas detectadas" -ForegroundColor Yellow
} else {
    Write-Host "  ✅ Sin credenciales hardcodeadas" -ForegroundColor Green
}

Write-Host ""

# Verificar configuración de Vercel
Write-Host "Verificando configuracion de Vercel..." -ForegroundColor Yellow
if (Test-Path "vercel.json") {
    Write-Host "  ✅ vercel.json existe" -ForegroundColor Green
    $vercelContent = Get-Content "vercel.json" | ConvertFrom-Json
    if ($vercelContent.buildCommand) {
        Write-Host "  ✅ Build command configurado" -ForegroundColor Green
    }
} else {
    Write-Host "  ❌ vercel.json no existe" -ForegroundColor Red
}

Write-Host ""

# Resumen final
Write-Host "RESUMEN DE DESPLIEGUE:" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan

$readyForGitHub = $true
$readyForVercel = $true

if (!(Test-Path ".env.local")) {
    Write-Host "❌ NO LISTO: Falta .env.local" -ForegroundColor Red
    $readyForGitHub = $false
    $readyForVercel = $false
}

if ($hasHardcodedCreds) {
    Write-Host "❌ NO LISTO: Credenciales hardcodeadas" -ForegroundColor Red
    $readyForGitHub = $false
}

if ($readyForGitHub -and $readyForVercel) {
    Write-Host "✅ LISTO PARA GITHUB Y VERCEL" -ForegroundColor Green
    Write-Host ""
    Write-Host "PASOS PARA DESPLIEGUE:" -ForegroundColor Yellow
    Write-Host "1. git add ." -ForegroundColor White
    Write-Host "2. git commit -m 'Sistema MTZ listo para despliegue'" -ForegroundColor White
    Write-Host "3. git push origin main" -ForegroundColor White
    Write-Host "4. Conectar repositorio en Vercel" -ForegroundColor White
    Write-Host "5. Configurar variables de entorno en Vercel" -ForegroundColor White
} else {
    Write-Host "❌ NO LISTO: Revisar errores arriba" -ForegroundColor Red
}
