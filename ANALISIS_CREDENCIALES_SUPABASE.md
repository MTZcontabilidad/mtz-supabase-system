# 🔍 ANÁLISIS DE CREDENCIALES SUPABASE - SISTEMA MTZ v3.0

## 🎯 **SITUACIÓN ACTUAL**

### **Credenciales en Vercel:**
```
URL: https://bwgnmastihgndmtbqvkj.supabase.co
ANON KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEyNDgyNzksImV4cCI6MjAzNjgyNDI3OX0.g1yKFklbTKzOHuiYV5gHU3ZzjczZJu8FOvQc1CEA2rA
```

### **Credenciales Anteriores (Local):**
```
URL: https://bwgnmastihgndmtbqvkj.supabase.co
ANON KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I
```

## 📊 **ANÁLISIS DE DIFERENCIAS**

### **✅ URLs:**
- **Iguales:** Ambas apuntan al mismo proyecto Supabase
- **Proyecto:** bwgnmastihgndmtbqvkj

### **❌ Anon Keys:**
- **Diferentes:** Las claves son completamente distintas
- **Problema:** Esto indica que se regeneraron las claves

### **📅 Fechas de Expiración:**
- **Clave Vercel:** Expira en 2036 (más reciente)
- **Clave Anterior:** Expiraba en 2035 (más antigua)

## 🔧 **PROBLEMA IDENTIFICADO**

### **Error: "Invalid API key"**
- La clave que tienes en Vercel no es válida actualmente
- Posiblemente se regeneró en Supabase
- Necesitas obtener la clave actual del dashboard

## 🚀 **SOLUCIÓN RECOMENDADA**

### **1. Obtener Clave Actual de Supabase:**
1. Ir a https://supabase.com/dashboard
2. Seleccionar proyecto: `bwgnmastihgndmtbqvkj`
3. Ir a Settings > API
4. Copiar la **anon public** key actual

### **2. Actualizar Vercel:**
1. Ir a https://vercel.com/dashboard
2. Seleccionar proyecto: `mtz-supabase-system`
3. Ir a Settings > Environment Variables
4. Actualizar `VITE_SUPABASE_ANON_KEY` con la clave actual

### **3. Verificar Conexión:**
1. Probar la nueva clave
2. Confirmar que funciona
3. Verificar que las tablas existen

## 📋 **PASOS DETALLADOS**

### **Paso 1: Obtener Clave Actual**
```bash
# Ir a Supabase Dashboard
# Project: bwgnmastihgndmtbqvkj
# Settings > API > Project API keys
# Copiar "anon public" key
```

### **Paso 2: Actualizar Vercel**
```bash
# Variables de entorno en Vercel:
VITE_SUPABASE_URL=https://bwgnmastihgndmtbqvkj.supabase.co
VITE_SUPABASE_ANON_KEY=[NUEVA_CLAVE_ACTUAL]
```

### **Paso 3: Probar Conexión**
```bash
# Ejecutar script de verificación
node verificar-credenciales-supabase.js
```

## ⚠️ **POSIBLES CAUSAS**

### **1. Regeneración de Claves:**
- Se regeneraron las claves en Supabase
- La clave anterior quedó invalidada

### **2. Proyecto Diferente:**
- Podría ser un proyecto diferente
- Verificar el project ID en el dashboard

### **3. Configuración de RLS:**
- Row Level Security podría estar bloqueando
- Verificar políticas de acceso

## 🎯 **RECOMENDACIÓN INMEDIATA**

### **✅ ACCIÓN REQUERIDA:**
1. **Obtener la clave actual** del dashboard de Supabase
2. **Actualizar Vercel** con la clave correcta
3. **Probar la conexión** para confirmar que funciona

### **📞 PASOS RÁPIDOS:**
1. Ve a https://supabase.com/dashboard
2. Busca el proyecto `bwgnmastihgndmtbqvkj`
3. Ve a Settings > API
4. Copia la "anon public" key
5. Actualiza Vercel con esa clave

## 🔒 **SEGURIDAD**

### **✅ Buenas Prácticas:**
- ✅ Usar variables de entorno
- ✅ No hardcodear credenciales
- ✅ Rotar claves regularmente
- ✅ Usar claves anónimas para frontend

### **⚠️ Consideraciones:**
- Las claves anónimas son seguras para frontend
- No contienen información sensible
- Solo permiten operaciones básicas

---

## 💡 **CONCLUSIÓN**

**El problema es que la clave en Vercel no es la actual.**
**Necesitas obtener la clave actual del dashboard de Supabase y actualizar Vercel.**

**Una vez actualizada, el sistema funcionará perfectamente.**
