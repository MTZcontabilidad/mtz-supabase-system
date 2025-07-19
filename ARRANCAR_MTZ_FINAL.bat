@echo off
title MTZ Ouroborus AI - Sistema de Inicio Automatico
color 0A

echo.
echo ========================================
echo    MTZ OUROBORUS AI v3.0 - LAUNCHER
echo ========================================
echo.
echo [INFO] Iniciando sistema MTZ...
echo [INFO] Verificando dependencias...

cd /d "C:\Users\s_pk_\Desktop\SUPABASE\MTZ-NUEVO"

if not exist "node_modules" (
    echo [WARN] Dependencias no encontradas. Instalando...
    npm install
    if errorlevel 1 (
        echo [ERROR] Falló la instalación de dependencias
        pause
        exit /b 1
    )
)

echo [INFO] Dependencias verificadas ✓
echo [INFO] Iniciando servidor de desarrollo...
echo.
echo ========================================
echo  SISTEMA MTZ INICIANDO EN PUERTO 3002
echo ========================================
echo.
echo URL Local: http://localhost:3002
echo Usuario Demo: mtzcontabilidad@gmail.com
echo Password Demo: Alohomora33.
echo.
echo [INFO] Presiona Ctrl+C para detener el servidor
echo.

start http://localhost:3002

npm run dev

pause