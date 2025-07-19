# 🚀 PROMPT COMPLETO PARA CLAUDE - DEPLOY MTZ OUROBORUS AI v3.0

## 📋 **INSTRUCCIONES PARA CLAUDE**

Hola Claude, necesito que te encargues completamente del **deploy y configuración final** del proyecto **MTZ Ouroborus AI v3.0**. El proyecto ya está completamente optimizado y listo para producción.

---

## 🎯 **CONTEXTO DEL PROYECTO**

### **Información del Proyecto:**

- **Nombre:** MTZ Ouroborus AI v3.0
- **Tipo:** Sistema de gestión empresarial con IA conversacional
- **Stack:** React 18 + Vite + Supabase + Vercel
- **Estado:** ✅ COMPLETAMENTE FUNCIONAL Y OPTIMIZADO
- **URL Actual:** https://mtz-ouroborus-ai.vercel.app

### **Credenciales Supabase:**

- **URL:** https://bwgnmastihgndmtbqvkj.supabase.co
- **ANON KEY:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I

### **Credenciales de Acceso:**

- **Usuario Demo:** mtzcontabilidad@gmail.com
- **Password Demo:** Alohomora33.

---

## 🛠️ **TAREAS PRINCIPALES A REALIZAR**

### **1. 🗄️ CONFIGURACIÓN DE BASE DE DATOS SUPABASE**

#### **Ejecutar Scripts SQL Críticos:**

1. **Backup Automático:** `database/06_deployment/backup_automation.sql`
   - Crear funciones de backup automático
   - Configurar limpieza de backups antiguos
   - Establecer logging de operaciones

2. **Optimización de Índices:** `database/06_deployment/optimize_indexes.sql`
   - Crear índices para consultas frecuentes
   - Optimizar rendimiento de base de datos
   - Configurar análisis de consultas lentas

3. **Verificación de Setup:** `database/06_deployment/verify_setup.sql`
   - Verificar estructura de tablas
   - Validar políticas RLS
   - Comprobar funciones y triggers

#### **Configurar Row Level Security (RLS):**

1. **Políticas de Usuarios:** Solo usuarios autenticados pueden ver sus datos
2. **Políticas de Clientes:** Administradores pueden ver todos, colaboradores solo asignados
3. **Políticas de Logs:** Solo administradores pueden ver logs del sistema

### **2. 🚀 DEPLOY EN VERCEL**

#### **Verificar Configuración Vercel:**

1. **Variables de Entorno:**

   ```env
   VITE_SUPABASE_URL=https://bwgnmastihgndmtbqvkj.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I
   VITE_APP_NAME="MTZ Sistema de Gestión"
   VITE_APP_VERSION="1.0.0"
   ```

2. **Configuración de Build:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### **Optimizar Deploy:**

1. **Configurar dominio personalizado** (si es necesario)
2. **Configurar redirecciones** para SPA
3. **Optimizar cache** y headers de seguridad
4. **Configurar monitoreo** y analytics

### **3. 🧪 TESTING Y VALIDACIÓN**

#### **Ejecutar Suite de Tests:**

```bash
npm run test:coverage
npm run test:ui
```

#### **Validar Funcionalidades Críticas:**

1. **Autenticación:** Login, logout, rate limiting
2. **Gestión de Clientes:** CRUD, búsqueda, exportación
3. **Dashboard:** Métricas, gráficos, proyecciones
4. **Permisos:** Validación de roles y acceso

#### **Verificar Seguridad:**

1. **Rate limiting** funcionando correctamente
2. **Validación de inputs** anti-XSS
3. **Headers de seguridad** configurados
4. **Variables de entorno** protegidas

### **4. 📊 MONITOREO Y MANTENIMIENTO**

#### **Configurar Alertas:**

1. **Performance:** Tiempo de respuesta, errores 500
2. **Seguridad:** Intentos de login fallidos, accesos no autorizados
3. **Base de Datos:** Consultas lentas, espacio en disco
4. **Deploy:** Fallos en build, errores de runtime

#### **Configurar Logging:**

1. **Logs de aplicación** en Vercel
2. **Logs de base de datos** en Supabase
3. **Logs de seguridad** para auditoría
4. **Métricas de uso** y rendimiento

---

## 📁 **ARCHIVOS CRÍTICOS A REVISAR**

### **Archivos de Configuración:**

- `package.json` - Dependencias y scripts
- `vite.config.js` - Configuración de build
- `vercel.json` - Configuración de deploy
- `env.local` - Variables de entorno

### **Archivos de Base de Datos:**

- `database/06_deployment/backup_automation.sql`
- `database/06_deployment/optimize_indexes.sql`
- `database/06_deployment/verify_setup.sql`
- `database/06_deployment/deploy_all.sql`

### **Archivos de Testing:**

- `tests/basic.test.js` - Tests críticos
- `tests/setup.js` - Configuración de testing
- `vitest.config.js` - Configuración Vitest

### **Archivos de Seguridad:**

- `src/utils/security.js` - Utilidades de seguridad
- `src/contexts/AuthContext.jsx` - Autenticación
- `src/hooks/usePermissions.js` - Permisos

---

## 🎯 **OBJETIVOS ESPECÍFICOS**

### **✅ Objetivo 1: Base de Datos Operativa**

- [ ] Ejecutar todos los scripts SQL en Supabase
- [ ] Verificar que las funciones de backup funcionen
- [ ] Confirmar que los índices estén optimizados
- [ ] Validar que RLS esté configurado correctamente

### **✅ Objetivo 2: Deploy Funcional**

- [ ] Verificar que el deploy en Vercel funcione correctamente
- [ ] Confirmar que las variables de entorno estén configuradas
- [ ] Validar que la aplicación sea accesible públicamente
- [ ] Verificar que el performance sea óptimo

### **✅ Objetivo 3: Testing Completo**

- [ ] Ejecutar todos los tests y verificar que pasen
- [ ] Generar reporte de cobertura de código
- [ ] Validar que las funcionalidades críticas funcionen
- [ ] Verificar que la seguridad esté implementada

### **✅ Objetivo 4: Monitoreo Configurado**

- [ ] Configurar alertas de rendimiento
- [ ] Establecer logging de seguridad
- [ ] Configurar métricas de uso
- [ ] Verificar que el sistema sea estable

---

## 📋 **COMANDOS A EJECUTAR**

### **Preparación:**

```bash
# Verificar dependencias
npm install

# Verificar configuración
npm run lint
npm run format

# Build local para verificar
npm run build
npm run preview
```

### **Testing:**

```bash
# Ejecutar tests completos
npm run test:coverage

# Ejecutar tests con UI
npm run test:ui

# Verificar estructura
npm run lint
```

### **Deploy:**

```bash
# Deploy a Vercel (si es necesario)
vercel --prod

# Verificar variables de entorno
vercel env ls
```

---

## 🔍 **VERIFICACIONES FINALES**

### **✅ Verificación de Funcionalidad:**

1. **Login/Logout:** Funciona correctamente
2. **Dashboard:** Métricas se cargan sin errores
3. **Clientes:** CRUD completo funcional
4. **Permisos:** Validación de roles correcta
5. **Rate Limiting:** Bloqueo después de 5 intentos

### **✅ Verificación de Seguridad:**

1. **Variables de Entorno:** No expuestas en código
2. **Rate Limiting:** Funcionando correctamente
3. **Validación de Inputs:** Anti-XSS implementado
4. **Headers de Seguridad:** Configurados correctamente

### **✅ Verificación de Performance:**

1. **Tiempo de Carga:** < 3 segundos
2. **Build Size:** Optimizado (< 2MB)
3. **Base de Datos:** Consultas rápidas
4. **Caching:** Configurado correctamente

---

## 📞 **COMUNICACIÓN**

### **Reportes Requeridos:**

1. **Reporte de Deploy:** Estado del deploy en Vercel
2. **Reporte de Base de Datos:** Estado de scripts SQL
3. **Reporte de Testing:** Resultados de tests
4. **Reporte de Seguridad:** Validación de medidas de seguridad
5. **Reporte de Performance:** Métricas de rendimiento

### **En Caso de Problemas:**

1. **Documentar el error** completamente
2. **Proponer solución** específica
3. **Verificar impacto** en funcionalidad
4. **Comunicar timeline** de resolución

---

## 🏆 **CRITERIOS DE ÉXITO**

### **✅ Deploy Exitoso:**

- Aplicación accesible en https://mtz-ouroborus-ai.vercel.app
- Todas las funcionalidades operativas
- Performance óptimo (< 3s carga inicial)
- Sin errores en consola

### **✅ Base de Datos Operativa:**

- Scripts SQL ejecutados correctamente
- Backup automático funcionando
- Índices optimizados
- RLS configurado

### **✅ Testing Aprobado:**

- Todos los tests pasando
- Cobertura > 70%
- Funcionalidades críticas validadas
- Seguridad verificada

### **✅ Monitoreo Activo:**

- Alertas configuradas
- Logging funcionando
- Métricas disponibles
- Sistema estable

---

## 🚀 **INSTRUCCIONES FINALES**

**Claude, tu misión es:**

1. **Tomar control total** del deploy y configuración
2. **Ejecutar todos los scripts** SQL en Supabase
3. **Verificar el deploy** en Vercel
4. **Ejecutar tests completos** y validar funcionalidad
5. **Configurar monitoreo** y alertas
6. **Documentar todo** el proceso y resultados

**El proyecto está 100% listo, solo necesita tu expertise para el deploy final y configuración de producción.**

**¡Confío en que harás un trabajo excelente!** 🎯

---

**Archivos de referencia importantes:**

- `AVANCES_COMPLETOS_MTZ.md` - Resumen completo de avances
- `docs/README.md` - Documentación técnica
- `README.md` - Documentación principal
- `RESUMEN_LIMPIEZA_FINAL.md` - Estado actual del proyecto
