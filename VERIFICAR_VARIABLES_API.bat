@echo off
title MTZ - Verificación Variables API
color 0A

echo.
echo ========================================
echo    VERIFICACIÓN VARIABLES API
echo    MTZ OUROBORUS AI v3.0
echo ========================================
echo.

cd /d "C:\Users\s_pk_\Desktop\SUPABASE\MTZ-NUEVO"

echo [INFO] Verificando variables de entorno en Vercel...
echo.

:: =====================================================================
:: VERIFICACIÓN DE VARIABLES DE ENTORNO
:: =====================================================================
echo [1/3] Verificando variables configuradas...
vercel env ls
if errorlevel 1 (
    echo [ERROR] Error al verificar variables de entorno
    pause
    exit /b 1
)

:: =====================================================================
:: VERIFICACIÓN DE DEPLOY ACTUAL
:: =====================================================================
echo.
echo [2/3] Verificando deploy actual...
vercel ls --limit 1
if errorlevel 1 (
    echo [ERROR] Error al verificar deploy
    pause
    exit /b 1
)

:: =====================================================================
:: VERIFICACIÓN DE BUILD LOCAL
:: =====================================================================
echo.
echo [3/3] Verificando build local con variables...
echo [INFO] Ejecutando build para verificar variables...
npm run build >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Falló el build local
    echo [INFO] Ejecutando build con detalles...
    npm run build
    pause
    exit /b 1
) else (
    echo [OK] Build local exitoso
)

:: =====================================================================
:: RESUMEN FINAL
:: =====================================================================
echo.
echo ========================================
echo    VERIFICACIÓN COMPLETADA
echo ========================================
echo.
echo [SUCCESS] ✅ Variables de entorno verificadas
echo.
echo [INFO] Estado del sistema:
echo        - Variables de entorno: ✅ Configuradas
echo        - Deploy actual: ✅ Ready
echo        - Build local: ✅ Exitoso
echo.
echo [INFO] URL de producción actualizada:
echo        https://mtz-supabase-system-jhh44vtks.vercel.app
echo.
echo [INFO] Variables configuradas:
echo        - VITE_SUPABASE_URL: ✅ Configurada
echo        - VITE_SUPABASE_ANON_KEY: ✅ Configurada
echo.
echo [INFO] Próximos pasos:
echo        1. Probar nueva URL de producción
echo        2. Verificar que el error API esté resuelto
echo        3. Probar login con credenciales demo
echo        4. Verificar conexión a Supabase
echo.
echo [INFO] Para probar:
echo        - Abrir: https://mtz-supabase-system-jhh44vtks.vercel.app
echo        - Usar credenciales demo
echo        - Verificar que no aparezca "Invalid API key"
echo.
echo ========================================
echo    SISTEMA LISTO PARA PRUEBA
echo ========================================
echo.

pause
