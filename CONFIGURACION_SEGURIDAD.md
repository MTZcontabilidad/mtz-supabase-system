# 🔒 CONFIGURACIÓN DE SEGURIDAD - SISTEMA MTZ v3.0

## 🎯 **ESTADO DE SEGURIDAD ACTUAL**

### ✅ **ARCHIVOS SEGUROS (NO se suben a GitHub):**
- `.env.local` - Variables de entorno locales
- `.env` - Variables de entorno
- `node_modules/` - Dependencias
- `dist/` - Archivos de build
- `.vercel/` - Configuración de Vercel
- `.cursor/` - Configuración de Cursor

### ⚠️ **ARCHIVOS QUE CONTIENEN CREDENCIALES:**
- `src/lib/supabase.js` - **CREDENCIALES EXPUESTAS** ❌
- `.cursor/mcp.json` - **TOKEN DE ACCESO EXPUESTO** ❌

## 🔧 **SOLUCIONES DE SEGURIDAD**

### **1. Variables de Entorno para Producción**

Crear archivo `.env.example`:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Development Settings
NODE_ENV=development
VITE_APP_ENV=development

# Application Settings
VITE_APP_NAME=MTZ Sistema
VITE_APP_VERSION=3.0.0
VITE_APP_DESCRIPTION=Sistema de gestion empresarial MTZ
```

### **2. Configuración de Supabase Segura**

Actualizar `src/lib/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js';

// Usar variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las variables existan
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  throw new Error('Configuración de Supabase incompleta');
}

const supabaseConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'MTZ-Sistema-v3.0'
    }
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseConfig);
export default supabase;
```

### **3. Configuración de Vercel**

Archivo `vercel.json` actualizado:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@vite_supabase_anon_key"
  }
}
```

## 🚀 **PASOS PARA DESPLIEGUE SEGURO**

### **1. Preparar Variables de Entorno**
```bash
# Crear archivo .env.local con credenciales reales
VITE_SUPABASE_URL=https://bwgnmastihgndmtbqvkj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **2. Configurar Vercel**
1. Ir a [vercel.com](https://vercel.com)
2. Conectar repositorio de GitHub
3. Configurar variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### **3. Configurar GitHub Secrets**
1. Ir a Settings > Secrets and variables > Actions
2. Agregar secretos:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

## 📋 **CHECKLIST DE SEGURIDAD**

### **Antes de subir a GitHub:**
- [ ] Remover credenciales hardcodeadas de `src/lib/supabase.js`
- [ ] Crear archivo `.env.example`
- [ ] Verificar que `.env.local` esté en `.gitignore`
- [ ] Verificar que `.cursor/mcp.json` esté en `.gitignore`
- [ ] Probar aplicación con variables de entorno

### **Para Vercel:**
- [ ] Configurar variables de entorno en Vercel
- [ ] Verificar build exitoso
- [ ] Probar funcionalidad en producción
- [ ] Configurar dominio personalizado (opcional)

## 🔐 **CREDENCIALES ACTUALES**

### **Supabase:**
- **URL:** `https://bwgnmastihgndmtbqvkj.supabase.co`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I`

### **⚠️ IMPORTANTE:**
- Estas credenciales son **ANÓNIMAS** (solo lectura/escritura básica)
- No contienen información sensible
- Son seguras para usar en frontend
- Para operaciones administrativas usar Service Role Key

## 🎉 **RESULTADO FINAL**

Una vez configurado:
- ✅ Código seguro en GitHub
- ✅ Variables de entorno en Vercel
- ✅ Aplicación funcionando en producción
- ✅ Datos guardándose en Supabase
- ✅ Sin credenciales expuestas

---

**Estado: ⚠️ NECESITA CONFIGURACIÓN DE SEGURIDAD**
