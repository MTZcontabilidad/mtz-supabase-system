# Script para verificar el estado del proyecto y hacer correcciones

Write-Host "Verificando estado del proyecto MTZ..." -ForegroundColor Green
Write-Host ""

# Verificar que estamos en el directorio correcto
if (!(Test-Path "package.json")) {
    Write-Host "Error: No se encontro package.json. Ejecuta este script desde la raiz del proyecto." -ForegroundColor Red
    exit 1
}

# Verificar archivos de configuracion
Write-Host "Verificando archivos de configuracion..." -ForegroundColor Cyan
$configFiles = @(
    "package.json",
    "vite.config.js",
    "tailwind.config.js",
    "jsconfig.json",
    ".eslintrc.cjs",
    "src/lib/supabase.js"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "OK: $file" -ForegroundColor Green
    } else {
        Write-Host "ERROR: $file (faltante)" -ForegroundColor Red
    }
}

Write-Host ""

# Verificar dependencias
Write-Host "Verificando dependencias..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Write-Host "OK: node_modules encontrado" -ForegroundColor Green
} else {
    Write-Host "ERROR: node_modules no encontrado" -ForegroundColor Red
    Write-Host "Ejecutando npm install..." -ForegroundColor Yellow
    npm install
}

Write-Host ""

# Verificar archivo .env.local
Write-Host "Verificando variables de entorno..." -ForegroundColor Cyan
if (Test-Path ".env.local") {
    Write-Host "OK: .env.local encontrado" -ForegroundColor Green
} else {
    Write-Host "ERROR: .env.local no encontrado" -ForegroundColor Red
    Write-Host "Creando .env.local..." -ForegroundColor Yellow

    $envContent = @"
# Supabase Configuration
VITE_SUPABASE_URL=https://bwgnmastihgndmtbqvkj.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Development Settings
NODE_ENV=development
VITE_APP_ENV=production

# Application Settings
VITE_APP_NAME=MTZ Sistema
VITE_APP_VERSION=3.0.0
VITE_APP_DESCRIPTION=Sistema de gestion empresarial MTZ
"@

    $envContent | Set-Content ".env.local"
    Write-Host "OK: .env.local creado" -ForegroundColor Green
}

Write-Host ""

# Verificar estructura de directorios
Write-Host "Verificando estructura de directorios..." -ForegroundColor Cyan
$directories = @(
    "src/components",
    "src/pages",
    "src/hooks",
    "src/contexts",
    "src/services",
    "src/utils"
)

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Write-Host "OK: $dir" -ForegroundColor Green
    } else {
        Write-Host "ERROR: $dir (faltante)" -ForegroundColor Red
    }
}

Write-Host ""

# Verificar archivos principales
Write-Host "Verificando archivos principales..." -ForegroundColor Cyan
$mainFiles = @(
    "src/App.jsx",
    "src/main.jsx",
    "src/index.css",
    "src/contexts/AuthContext.jsx",
    "src/services/dataService.js"
)

foreach ($file in $mainFiles) {
    if (Test-Path $file) {
        Write-Host "OK: $file" -ForegroundColor Green
    } else {
        Write-Host "ERROR: $file (faltante)" -ForegroundColor Red
    }
}

Write-Host ""

# Verificar paginas funcionales
Write-Host "Verificando paginas funcionales..." -ForegroundColor Cyan
$functionalPages = @(
    "src/pages/Dashboard/Dashboard.jsx",
    "src/pages/Clientes/ClientesPage.jsx",
    "src/pages/Ventas/VentasPageSimple.jsx",
    "src/pages/Cobranza/CobranzaPage.jsx",
    "src/pages/Compras/ComprasPage.jsx",
    "src/pages/RRHH/RRHHPage.jsx"
)

foreach ($page in $functionalPages) {
    if (Test-Path $page) {
        Write-Host "OK: $page" -ForegroundColor Green
    } else {
        Write-Host "ERROR: $page (faltante)" -ForegroundColor Red
    }
}

Write-Host ""

# Verificar componentes UI
Write-Host "Verificando componentes UI..." -ForegroundColor Cyan
$uiComponents = @(
    "src/components/ui/Button.jsx",
    "src/components/ui/Card.jsx",
    "src/components/ui/Input.jsx",
    "src/components/ui/Badge.jsx",
    "src/components/ui/SimpleModal.jsx"
)

foreach ($component in $uiComponents) {
    if (Test-Path $component) {
        Write-Host "OK: $component" -ForegroundColor Green
    } else {
        Write-Host "ERROR: $component (faltante)" -ForegroundColor Red
    }
}

Write-Host ""

# Mostrar resumen
Write-Host "RESUMEN DE VERIFICACION:" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host "Archivos de configuracion: Verificados" -ForegroundColor White
Write-Host "Dependencias: Verificadas" -ForegroundColor White
Write-Host "Variables de entorno: Verificadas" -ForegroundColor White
Write-Host "Estructura de directorios: Verificada" -ForegroundColor White
Write-Host "Archivos principales: Verificados" -ForegroundColor White
Write-Host "Paginas funcionales: Verificadas" -ForegroundColor White
Write-Host "Componentes UI: Verificados" -ForegroundColor White
Write-Host ""

Write-Host "PROXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. Ejecuta 'npm run dev' para iniciar el servidor" -ForegroundColor White
Write-Host "2. Ejecuta 'npm run lint' para verificar warnings" -ForegroundColor White
Write-Host "3. Actualiza VITE_SUPABASE_ANON_KEY en .env.local" -ForegroundColor White
Write-Host "4. Prueba las funcionalidades del sistema" -ForegroundColor White
Write-Host ""

Write-Host "Verificacion del proyecto completada!" -ForegroundColor Green
