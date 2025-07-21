#!/bin/bash
# Script de build optimizado para MTZ v3.0

echo "🚀 Iniciando build optimizado..."

# Limpiar cache
npm run clean

# Instalar dependencias
npm ci --only=production

# Build optimizado
npm run build

# Verificar bundle
npm run analyze

# Optimizar imágenes
npm run optimize-images

# Generar sitemap
npm run generate-sitemap

echo "✅ Build completado exitosamente"
