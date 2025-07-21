#!/bin/bash
# Script de deploy para MTZ v3.0

echo "🚀 Iniciando deploy del Sistema MTZ v3.0"

# Verificar que estamos en la rama main
if [ "$(git branch --show-current)" != "main" ]; then
    echo "❌ Debes estar en la rama main para hacer deploy"
    exit 1
fi

# Verificar que no hay cambios pendientes
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Hay cambios pendientes. Haz commit antes de hacer deploy"
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci

# Ejecutar tests
echo "🧪 Ejecutando tests..."
npm run test:run

# Build del proyecto
echo "🔨 Construyendo proyecto..."
npm run build

# Verificar que el build fue exitoso
if [ ! -d "dist" ]; then
    echo "❌ El build falló. No se encontró el directorio dist/"
    exit 1
fi

# Commit de los cambios de build
echo "📝 Haciendo commit de los cambios..."
git add .
git commit -m "feat: Deploy MTZ v3.0 - $(date)"

# Push a GitHub
echo "📤 Subiendo a GitHub..."
git push origin main

# Deploy a Vercel
echo "🌐 Desplegando a Vercel..."
vercel --prod

echo "✅ Deploy completado exitosamente!"
echo "🌍 URL: https://mtz-supabase-system-eatif2o4g.vercel.app"
