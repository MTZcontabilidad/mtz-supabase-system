@echo off
echo.
echo ======================================================
echo    MTZ OUROBORUS AI - CONFIGURACION AUTOMATICA
echo ======================================================
echo.
echo Configurando sistema de roles y permisos...
echo.

cd /d "%~dp0"

echo [1/3] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js no encontrado
    echo    Instala Node.js desde: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js encontrado

echo.
echo [2/3] Instalando dependencias si es necesario...
if not exist "node_modules\@supabase\supabase-js" (
    echo Instalando @supabase/supabase-js...
    npm install @supabase/supabase-js
)

echo.
echo [3/3] Ejecutando configuración de roles...
echo.
node setup-mtz-roles.js

echo.
if errorlevel 1 (
    echo ❌ La configuración falló
    echo.
    echo ALTERNATIVA MANUAL:
    echo 1. Ir a: https://supabase.com/dashboard
    echo 2. Proyecto: bwgnmastihgndmtbqvkj  
    echo 3. SQL Editor
    echo 4. Ejecutar archivos de la carpeta database/
    echo.
) else (
    echo ✅ ¡Configuración completada!
    echo.
    echo PRÓXIMOS PASOS:
    echo 1. Reiniciar React: npm run dev
    echo 2. Logout y login nuevamente
    echo 3. Verificar rol "Administrador" en dashboard
    echo.
)

pause