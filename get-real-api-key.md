# 🔑 OBTENER API KEY REAL DE SUPABASE

## 🚨 PROBLEMA ACTUAL

La API key en `.env.local` está **TRUNCADA** y por eso aparece "Invalid API key".

## 🎯 SOLUCIÓN: OBTENER API KEY COMPLETA

### **PASO 1: IR A SUPABASE DASHBOARD**

1. Abrir: https://supabase.com/dashboard
2. Iniciar sesión con tu cuenta
3. Seleccionar el proyecto: **mtzcontabilidad**

### **PASO 2: OBTENER API KEYS**

1. En el menú lateral, ir a **Settings** → **API**
2. En la sección **Project API keys** encontrarás:

#### **🔑 ANON PUBLIC KEY (RECOMENDADA)**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.XXXXX...
```

#### **🔑 SERVICE ROLE KEY (ADMIN)**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.XXXXX...
```

### **PASO 3: COPIAR LA CLAVE COMPLETA**

- **IMPORTANTE**: Copiar **TODA** la clave, no solo el inicio
- La clave debe tener aproximadamente **200+ caracteres**
- Incluir desde `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` hasta el final

### **PASO 4: ACTUALIZAR .env.local**

```bash
# Reemplazar la línea actual con la clave completa
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.XXXXX...
```

### **PASO 5: REINICIAR SERVIDOR**

```bash
# Detener el servidor (Ctrl+C)
# Reiniciar
npm run dev
```

## 🔍 VERIFICACIÓN

### **✅ CLAVE CORRECTA:**

- Longitud: ~200+ caracteres
- Formato: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.XXXXX...`

### **❌ CLAVE INCORRECTA:**

- Longitud: < 200 caracteres
- Termina en `...` o está truncada
- No incluye la parte final

## 🚀 RESULTADO ESPERADO

Después de actualizar con la clave completa:

- ✅ Login funcionará
- ✅ Dashboard cargará datos
- ✅ Todas las páginas funcionarán
- ✅ Sin errores "Invalid API key"

## 📞 SI NO TIENES ACCESO

Si no tienes acceso al dashboard de Supabase:

1. Contactar al administrador del proyecto
2. Solicitar las API keys completas
3. Verificar que tienes permisos de administrador
