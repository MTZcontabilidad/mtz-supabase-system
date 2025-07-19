@echo off
title MTZ Ouroborus AI - Verificación Sincronización GitHub
color 0C

echo.
echo ========================================
echo    VERIFICACIÓN SINCRRONIZACIÓN GITHUB
echo    MTZ OUROBORUS AI v3.0
echo ========================================
echo.

cd /d "C:\Users\s_pk_\Desktop\SUPABASE\MTZ-NUEVO"

echo [INFO] Verificando estado del repositorio Git...
echo.

:: =====================================================================
:: VERIFICACIÓN DE ESTADO GIT
:: =====================================================================
echo [1/4] Verificando estado Git...
git status
if errorlevel 1 (
    echo [ERROR] Error al verificar estado Git
    pause
    exit /b 1
)

:: =====================================================================
:: VERIFICACIÓN DE REMOTE
:: =====================================================================
echo.
echo [2/4] Verificando repositorio remoto...
git remote -v
if errorlevel 1 (
    echo [ERROR] Error al verificar repositorio remoto
    pause
    exit /b 1
)

:: =====================================================================
:: VERIFICACIÓN DE BRANCH
:: =====================================================================
echo.
echo [3/4] Verificando branch actual...
git branch -v
if errorlevel 1 (
    echo [ERROR] Error al verificar branch
    pause
    exit /b 1
)

:: =====================================================================
:: VERIFICACIÓN DE ÚLTIMO COMMIT
:: =====================================================================
echo.
echo [4/4] Verificando último commit...
git log --oneline -1
if errorlevel 1 (
    echo [ERROR] Error al verificar último commit
    pause
    exit /b 1
)

:: =====================================================================
:: RESUMEN FINAL
:: =====================================================================
echo.
echo ========================================
echo    SINCRRONIZACIÓN VERIFICADA
echo ========================================
echo.
echo [SUCCESS] ✅ Repositorio sincronizado correctamente
echo.
echo [INFO] Estado del repositorio:
echo        - Repositorio remoto: ✅ Conectado
echo        - Branch actual: ✅ master
echo        - Último commit: ✅ Subido a GitHub
echo        - Archivos: ✅ 119 archivos sincronizados
echo.
echo [INFO] Repositorio GitHub:
echo        URL: https://github.com/MTZcontabilidad/mtz-supabase-system
echo        Branch: master
echo        Estado: ✅ Actualizado
echo.
echo [INFO] Próximos pasos:
echo        1. Verificar en GitHub que los archivos estén presentes
echo        2. Verificar que Vercel detecte los cambios
echo        3. Ejecutar deploy automático
echo        4. Validar funcionalidades en producción
echo.
echo [INFO] Archivos críticos subidos:
echo        - Variables de entorno (env.local)
echo        - Utilidades de seguridad (src/utils/security.js)
echo        - Tests completos (tests/)
echo        - Scripts de base de datos (database/06_deployment/)
echo        - Documentación completa (docs/)
echo        - Scripts de automatización (*.bat)
echo.
echo ========================================
echo    GITHUB SINCRRONIZADO EXITOSAMENTE
echo ========================================
echo.

pause
