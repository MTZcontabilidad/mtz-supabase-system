# 🚀 Guía de Deploy - Sistema MTZ v3.0

## Deploy Automático

### 1. Preparación
```bash
# Verificar que estás en la rama main
git checkout main

# Instalar dependencias
npm install

# Ejecutar diagnóstico
npm run diagnostico

# Ejecutar optimizaciones
npm run optimizar
```

### 2. Deploy a Vercel
```bash
# Deploy automático
npm run deploy:vercel

# O usar el script completo
./scripts/deploy.sh
```

### 3. Verificación
- ✅ URL: https://mtz-supabase-system-eatif2o4g.vercel.app
- ✅ Build exitoso
- ✅ Tests pasando
- ✅ Performance optimizada

## Configuración de Vercel

El proyecto está configurado para deploy automático en Vercel con:

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x

## Variables de Entorno

Asegúrate de configurar estas variables en Vercel:

```env
VITE_SUPABASE_URL=https://bwgnmastihgndmtbqvkj.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
NODE_ENV=production
```

## Monitoreo

- **Performance**: Lighthouse CI
- **Errores**: Sentry (opcional)
- **Analytics**: Google Analytics

## Rollback

Si necesitas hacer rollback:

```bash
# Ver commits recientes
git log --oneline -10

# Revertir a un commit específico
git revert <commit-hash>
git push origin main
```
