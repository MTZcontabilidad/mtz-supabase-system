@echo off
echo ============================================
echo    SOLUCIONANDO ERRORES MTZ SISTEMA
echo ============================================
echo.

echo [1/5] Eliminando node_modules y package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo [2/5] Limpiando cache de npm...
npm cache clean --force

echo [3/5] Instalando dependencias frescas...
npm install

echo [4/5] Instalando Supabase...
npm install @supabase/supabase-js

echo [5/5] Iniciando servidor de desarrollo...
echo.
echo ============================================
echo    SERVIDOR INICIANDOSE EN LOCALHOST:5173
echo ============================================
echo.
npm run dev

pause
