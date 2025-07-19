@echo off
echo ========================================
echo LIMPIEZA Y ORGANIZACION DEL PROYECTO MTZ
echo ========================================
echo.

echo [1/6] Eliminando archivos DELETED obsoletos...
if exist DELETED_MFASetup.jsx (
    del DELETED_MFASetup.jsx
    echo ✅ DELETED_MFASetup.jsx eliminado
)

if exist DELETED_MFAVerification.jsx (
    del DELETED_MFAVerification.jsx
    echo ✅ DELETED_MFAVerification.jsx eliminado
)

if exist DELETED_MFAManager.jsx (
    del DELETED_MFAManager.jsx
    echo ✅ DELETED_MFAManager.jsx eliminado
)

if exist DELETED_security_index.js (
    del DELETED_security_index.js
    echo ✅ DELETED_security_index.js eliminado
)

echo.
echo [2/6] Eliminando scripts BAT obsoletos...
if exist CORREGIR_MTZ_SIMPLE.bat (
    del CORREGIR_MTZ_SIMPLE.bat
    echo ✅ CORREGIR_MTZ_SIMPLE.bat eliminado
)

if exist CORRECCION_DEFINITIVA_MTZ.bat (
    del CORRECCION_DEFINITIVA_MTZ.bat
    echo ✅ CORRECCION_DEFINITIVA_MTZ.bat eliminado
)

if exist CORREGIR_SISTEMA_MTZ.bat (
    del CORREGIR_SISTEMA_MTZ.bat
    echo ✅ CORREGIR_SISTEMA_MTZ.bat eliminado
)

if exist INICIAR_MTZ_CORREGIDO_FINAL.bat (
    del INICIAR_MTZ_CORREGIDO_FINAL.bat
    echo ✅ INICIAR_MTZ_CORREGIDO_FINAL.bat eliminado
)

if exist VERIFICAR_PRE_DEPLOY.bat (
    del VERIFICAR_PRE_DEPLOY.bat
    echo ✅ VERIFICAR_PRE_DEPLOY.bat eliminado
)

if exist MONITOR_DEPLOY_VERCEL.bat (
    del MONITOR_DEPLOY_VERCEL.bat
    echo ✅ MONITOR_DEPLOY_VERCEL.bat eliminado
)

echo.
echo [3/6] Eliminando documentación redundante...
if exist ESTADO_ACTUAL_CORREGIDO.md (
    del ESTADO_ACTUAL_CORREGIDO.md
    echo ✅ ESTADO_ACTUAL_CORREGIDO.md eliminado
)

if exist ESTADO_AVANCES_ACTUAL.md (
    del ESTADO_AVANCES_ACTUAL.md
    echo ✅ ESTADO_AVANCES_ACTUAL.md eliminado
)

if exist RESUMEN_PAGINAS_BACKEND.md (
    del RESUMEN_PAGINAS_BACKEND.md
    echo ✅ RESUMEN_PAGINAS_BACKEND.md eliminado
)

if exist RESUMEN_EJECUTIVO_CLAUDE_AI.md (
    del RESUMEN_EJECUTIVO_CLAUDE_AI.md
    echo ✅ RESUMEN_EJECUTIVO_CLAUDE_AI.md eliminado
)

if exist NOTA_PARA_CLAUDE_AI.md (
    del NOTA_PARA_CLAUDE_AI.md
    echo ✅ NOTA_PARA_CLAUDE_AI.md eliminado
)

if exist GUIA_CODIFICACION_MTZ.md (
    del GUIA_CODIFICACION_MTZ.md
    echo ✅ GUIA_CODIFICACION_MTZ.md eliminado
)

if exist PLAN_LIMPIEZA_ORGANIZACION.md (
    del PLAN_LIMPIEZA_ORGANIZACION.md
    echo ✅ PLAN_LIMPIEZA_ORGANIZACION.md eliminado
)

if exist LIMPIEZA_COMPLETADA.md (
    del LIMPIEZA_COMPLETADA.md
    echo ✅ LIMPIEZA_COMPLETADA.md eliminado
)

if exist TESTING_PAGINAS_CHECKLIST.md (
    del TESTING_PAGINAS_CHECKLIST.md
    echo ✅ TESTING_PAGINAS_CHECKLIST.md eliminado
)

if exist RESULTADOS_TESTING.md (
    del RESULTADOS_TESTING.md
    echo ✅ RESULTADOS_TESTING.md eliminado
)

if exist VERIFICACION_COMPLETA_ESTADO.md (
    del VERIFICACION_COMPLETA_ESTADO.md
    echo ✅ VERIFICACION_COMPLETA_ESTADO.md eliminado
)

echo.
echo [4/6] Creando carpeta de documentación...
if not exist docs mkdir docs
echo ✅ Carpeta docs creada

echo.
echo [5/6] Moviendo documentación importante a docs...
if exist README.md (
    move README.md docs\
    echo ✅ README.md movido a docs\
)

if exist RESUMEN_CORRECCIONES_APLICADAS.md (
    move RESUMEN_CORRECCIONES_APLICADAS.md docs\
    echo ✅ RESUMEN_CORRECCIONES_APLICADAS.md movido a docs\
)

if exist COMPARACION_ANALISIS_CLAUDE_VS_MIO.md (
    move COMPARACION_ANALISIS_CLAUDE_VS_MIO.md docs\
    echo ✅ COMPARACION_ANALISIS_CLAUDE_VS_MIO.md movido a docs\
)

if exist ANALISIS_ERRORES_DETECTADOS.md (
    move ANALISIS_ERRORES_DETECTADOS.md docs\
    echo ✅ ANALISIS_ERRORES_DETECTADOS.md movido a docs\
)

if exist CREDENCIALES_SISTEMA_MTZ.md (
    move CREDENCIALES_SISTEMA_MTZ.md docs\
    echo ✅ CREDENCIALES_SISTEMA_MTZ.md movido a docs\
)

if exist REGLAS_DESARROLLO_MTZ.md (
    move REGLAS_DESARROLLO_MTZ.md docs\
    echo ✅ REGLAS_DESARROLLO_MTZ.md movido a docs\
)

echo.
echo [6/6] Verificando estructura final...
echo.
echo 📁 ESTRUCTURA FINAL DEL PROYECTO:
echo.
echo 📂 Archivos de configuración:
dir *.json *.js *.cjs *.rc *.config.js 2>nul | findstr /v "node_modules"
echo.
echo 📂 Scripts útiles:
dir *.bat 2>nul
echo.
echo 📂 Documentación:
dir docs\*.md 2>nul
echo.
echo 📂 Carpetas principales:
dir /ad /b | findstr /v "node_modules"
echo.
echo ========================================
echo LIMPIEZA COMPLETADA EXITOSAMENTE
echo ========================================
echo.
echo ✅ Archivos obsoletos eliminados
echo ✅ Documentación organizada en docs\
echo ✅ Estructura del proyecto optimizada
echo.
echo 🎯 PROYECTO MÁS LIMPIO Y ORGANIZADO
echo.
pause
