# 🚀 PROMPT CLAUDE MCP - RESOLVER ERROR API DEFINITIVAMENTE

## 🎯 **OBJETIVO PRINCIPAL**

Resolver completamente el error "Invalid API key" en el sistema MTZ Ouroborus AI v3.0 usando las capacidades MCP de Claude.

## 📊 **ESTADO ACTUAL DEL PROBLEMA**

### **🔍 Error Persistente:**

- **Error:** "Invalid API key" en la página de login
- **URL Actual:** https://mtz-supabase-system-eatif2o4g.vercel.app
- **Código de Error:** 401 Unauthorized
- **Estado:** El error persiste a pesar de múltiples intentos de solución

### **📋 Variables Configuradas:**

```bash
VITE_SUPABASE_URL=https://bwgnmastihgndmtbqvkj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I
```

---

## 🔧 **INSTRUCCIONES PARA CLAUDE CON MCP**

### **1. 🕵️ DIAGNÓSTICO COMPLETO**

**Usar MCP Browser para:**

1. **Navegar a la URL:** https://mtz-supabase-system-eatif2o4g.vercel.app
2. **Abrir Developer Console** y verificar:
   - Mensajes de debug de variables de entorno
   - Errores 401 específicos
   - Logs de conexión a Supabase
3. **Verificar el estado actual** de la página de login
4. **Capturar screenshots** si es necesario

### **2. 🔍 ANÁLISIS DE CREDENCIALES SUPABASE**

**Usar MCP para verificar:**

1. **Acceder al dashboard de Supabase** con las credenciales del proyecto
2. **Verificar la configuración del proyecto:**
   - URL del proyecto
   - API Keys (anon y service_role)
   - Configuración de autenticación
   - Políticas RLS
3. **Comprobar si las credenciales están activas**
4. **Verificar la configuración de dominios permitidos**

### **3. 🔧 VERIFICACIÓN DE VARIABLES EN VERCEL**

**Usar MCP para:**

1. **Acceder al dashboard de Vercel** del proyecto
2. **Verificar las variables de entorno:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Confirmar que las variables están aplicadas** a producción
4. **Verificar si hay variables duplicadas o conflictivas**

### **4. 🛠️ CORRECCIÓN DIRECTA**

**Si se identifican problemas:**

#### **A. Problema en Supabase:**

- **Regenerar API keys** si es necesario
- **Verificar configuración de autenticación**
- **Actualizar políticas RLS** si están causando problemas
- **Verificar configuración de CORS**

#### **B. Problema en Vercel:**

- **Actualizar variables de entorno** con valores correctos
- **Forzar redeploy** después de cambios
- **Verificar configuración de build**

#### **C. Problema en el Código:**

- **Revisar configuración de Supabase client**
- **Verificar manejo de variables de entorno**
- **Corregir fallbacks hardcodeados** si es necesario

### **5. 🧪 VERIFICACIÓN FINAL**

**Después de las correcciones:**

1. **Hacer deploy** con las correcciones aplicadas
2. **Navegar a la nueva URL** de producción
3. **Verificar que NO aparece** "Invalid API key"
4. **Probar login** con credenciales demo
5. **Confirmar que el dashboard** se carga correctamente

---

## 📋 **ARCHIVOS CRÍTICOS A REVISAR**

### **🔧 Configuración Supabase:**

- `src/lib/supabase.js` - Cliente principal
- `src/utils/debugEnv.js` - Script de debug
- `.env.local` - Variables de entorno locales

### **🚀 Configuración Vercel:**

- `vercel.json` - Configuración de deploy
- `vite.config.js` - Configuración de build

### **🗄️ Base de Datos:**

- `database/` - Scripts de configuración
- `scripts/` - Scripts SQL importantes

---

## 🎯 **CRITERIOS DE ÉXITO**

### **✅ Verificación Exitosa:**

- [ ] No aparece "Invalid API key" en la interfaz
- [ ] No hay errores 401 en la consola
- [ ] Debug muestra variables configuradas correctamente
- [ ] Login funciona con credenciales demo
- [ ] Dashboard se carga correctamente
- [ ] Conexión a Supabase establecida

### **📊 Métricas de Verificación:**

- **Tiempo de respuesta:** < 2 segundos
- **Errores en consola:** 0
- **Estado de autenticación:** Funcional
- **Conexión a BD:** Establecida

---

## 🚨 **PRIORIDADES DE ACCIÓN**

### **🔥 CRÍTICO (Hacer primero):**

1. **Verificar credenciales Supabase** - Confirmar que las API keys son válidas
2. **Verificar variables Vercel** - Confirmar que están aplicadas correctamente
3. **Regenerar API keys** si es necesario

### **⚡ IMPORTANTE:**

1. **Corregir configuración** si se identifican problemas
2. **Hacer deploy** con correcciones
3. **Verificar funcionalidad** completa

### **📝 DOCUMENTACIÓN:**

1. **Registrar cambios** realizados
2. **Actualizar documentación** del proyecto
3. **Crear guía** de solución para futuras referencias

---

## 🔑 **CREDENCIALES DE ACCESO**

### **🌐 Supabase Dashboard:**

- **URL:** https://supabase.com/dashboard
- **Proyecto:** MTZ Sistema de Gestión
- **ID del proyecto:** bwgnmastihgndmtbqvkj

### **🚀 Vercel Dashboard:**

- **URL:** https://vercel.com/dashboard
- **Proyecto:** mtz-supabase-system
- **Equipo:** mtz-consultores-tributarios-projects

### **📧 Credenciales Demo:**

- **Email:** mtzcontabilidad@gmail.com
- **Password:** Alohomora33.

---

## 🎯 **RESULTADO ESPERADO**

**Al finalizar, el sistema debe estar:**

- ✅ **Completamente funcional** sin errores de API
- ✅ **Login operativo** con credenciales demo
- ✅ **Dashboard cargando** correctamente
- ✅ **Conexión a Supabase** establecida
- ✅ **Variables de entorno** configuradas correctamente
- ✅ **Deploy en producción** funcionando

---

## 📞 **INSTRUCCIONES FINALES**

**Claude, por favor:**

1. **Usa todas las capacidades MCP** disponibles para diagnosticar y resolver el problema
2. **Sigue el orden de prioridades** establecido
3. **Verifica cada paso** antes de continuar
4. **Documenta todos los cambios** realizados
5. **Confirma el resultado final** con pruebas completas

**¡El objetivo es resolver definitivamente el error "Invalid API key" y tener el sistema 100% operativo!**

---

**Estado Actual: 🔴 ERROR API PERSISTENTE**
**Objetivo: 🟢 SISTEMA 100% OPERATIVO**

**¡Claude, usa tus capacidades MCP para resolver esto definitivamente!** 🚀
