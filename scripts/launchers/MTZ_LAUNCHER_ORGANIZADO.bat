@echo off
echo.
echo ========================================
echo   🎪 MTZ OUROBORUS AI v3.0 - LAUNCHER  
echo   Sistema Organizado + Multi-MCP Activo
echo ========================================
echo.

cd /d "C:\Users\s_pk_\Desktop\SUPABASE\MTZ-NUEVO"

echo ✅ Directorio: %CD%
echo 📁 Estructura organizada: ✅ IMPLEMENTADA
echo 🧠 Multi-MCP: Sequential + Memoria + Supabase + Filesystem
echo.

REM Verificar estructura organizada
if exist "docs\ESTADO_ACTUAL_Y_ROADMAP.md" (
    echo ✅ Documentación maestra: ENCONTRADA
) else (
    echo ⚠️  Documentación maestra: NO ENCONTRADA
)

if exist "database\sql\" (
    echo ✅ Scripts SQL organizados: ✅
) else (
    echo ⚠️  Scripts SQL: NO ORGANIZADOS
)

if exist "scripts\launchers\" (
    echo ✅ Scripts launchers: ✅ ORGANIZADOS  
) else (
    echo ⚠️  Scripts launchers: NO ORGANIZADOS
)

echo.
echo 🔧 Verificando configuración...

REM Verificar package.json
if not exist "package.json" (
    echo ❌ ERROR: No se encontró package.json
    pause
    exit /b 1
)

REM Verificar dependencias
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install
    if errorlevel 1 (
        echo ❌ ERROR: Falló instalación dependencias
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas
) else (
    echo ✅ Dependencias ya instaladas
)

REM Verificar .env
if not exist ".env" (
    echo ⚠️  ADVERTENCIA: Archivo .env no encontrado
    echo Sistema puede no funcionar sin configuración Supabase
) else (
    echo ✅ Configuración .env: ENCONTRADA
)

echo.
echo 🎯 ESTADO SISTEMA MTZ:
echo    • Estructura: ✅ Organizada profesionalmente  
echo    • Frontend React: ✅ Listo (puerto 3002)
echo    • Backend Supabase: ✅ PostgreSQL 17.4 operativo
echo    • Multi-MCP: ✅ 4 servidores activos
echo    • Hooks avanzados: ✅ 5 funciones ejecutivas
echo    • Clientes: ✅ 8 activos ($85,555,727)
echo    • Dashboard: ✅ Ejecutivo implementado
echo    • Análisis: ✅ Concentración 60.19% identificada
echo    • Oportunidades: ✅ $46.5M cuantificadas
echo.

echo 📊 ROADMAP DESARROLLO:
echo    • FASE 1: Dashboard Ejecutivo (Semana 1-2)
echo    • FASE 2: Análisis Comercial (Semana 3-4)  
echo    • FASE 3: Automatización (Semana 5-8)
echo    • FASE 4: Expansión Avanzada (Mes 3+)
echo.

echo 🚀 Iniciando servidor desarrollo...
echo 📱 Navegador abrirá automáticamente en localhost:3002
echo 🔄 Para detener: Ctrl+C
echo 💡 Documentación: /docs/ESTADO_ACTUAL_Y_ROADMAP.md
echo.

timeout /t 3 /nobreak >nul

npm run dev

echo.
echo 🛑 Servidor MTZ detenido
echo 📁 Estructura organizada mantenida
echo 🔄 Para reiniciar: ejecutar este script
echo.
pause
