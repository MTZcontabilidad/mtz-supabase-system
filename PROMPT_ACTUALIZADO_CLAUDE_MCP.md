# 🚀 PROMPT ACTUALIZADO PARA CLAUDE CON MCP - MTZ OUROBORUS AI v3.0

## 📋 **INSTRUCCIONES PARA CLAUDE CON MCP**

Hola Claude, necesito que uses tus capacidades MCP para **configurar y verificar completamente** el proyecto **MTZ Ouroborus AI v3.0**. El proyecto ya está desplegado en Vercel y necesitamos verificar que todo esté funcionando correctamente.

---

## 🎯 **CONTEXTO DEL PROYECTO**

### **Información del Proyecto:**

- **Nombre:** MTZ Ouroborus AI v3.0
- **Tipo:** Sistema de gestión empresarial con IA conversacional
- **Stack:** React 18 + Vite + Supabase + Vercel
- **Estado:** ✅ DESPLEGADO EN PRODUCCIÓN
- **URL Producción:** https://mtz-supabase-system-r9fbhnqha.vercel.app
- **URL GitHub:** https://github.com/MTZcontabilidad/mtz-supabase-system

### **Credenciales Supabase:**

- **URL:** https://bwgnmastihgndmtbqvkj.supabase.co
- **ANON KEY:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I

### **Credenciales de Acceso:**

- **Usuario Demo:** mtzcontabilidad@gmail.com
- **Password Demo:** Alohomora33.

---

## 🛠️ **TAREAS PRINCIPALES CON MCP**

### **1. 🌐 VERIFICACIÓN DE PÁGINAS WEB**

#### **Usar MCP Browser para verificar:**

1. **Página de Login:**
   - Verificar que cargue correctamente
   - Probar login con credenciales demo
   - Verificar que no haya errores de codificación de caracteres
   - Confirmar que el botón "Usar Credenciales Demo" funcione

2. **Dashboard:**
   - Verificar que se cargue después del login
   - Confirmar que las métricas se muestren correctamente
   - Verificar que los gráficos se rendericen
   - Confirmar que la navegación funcione

3. **Página de Clientes:**
   - Verificar que la lista de clientes se cargue
   - Probar la funcionalidad de búsqueda
   - Verificar que los filtros funcionen
   - Confirmar que la exportación de datos funcione

4. **Navegación General:**
   - Verificar que el sidebar funcione correctamente
   - Confirmar que el header muestre la información correcta
   - Probar la navegación entre páginas
   - Verificar que el logout funcione

### **2. 🗄️ CONFIGURACIÓN DE BASE DE DATOS SUPABASE**

#### **Usar MCP Browser para acceder a Supabase:**

1. **Acceder al SQL Editor:**
   - URL: https://bwgnmastihgndmtbqvkj.supabase.co/project/default/sql
   - Ejecutar el script: `scripts/ejecutar_scripts_supabase.sql`
   - Verificar que se ejecute sin errores

2. **Verificar Configuración:**
   - Confirmar que las funciones de backup se creen
   - Verificar que los índices se creen correctamente
   - Confirmar que las políticas RLS se apliquen
   - Verificar que las funciones de análisis se creen

### **3. 📊 VERIFICACIÓN DE FUNCIONALIDADES**

#### **Usar MCP Browser para probar:**

1. **Autenticación:**
   - Probar login/logout
   - Verificar rate limiting (5 intentos máximo)
   - Confirmar redirecciones correctas

2. **Gestión de Clientes:**
   - Verificar CRUD de clientes
   - Probar búsqueda avanzada
   - Confirmar exportación de datos
   - Verificar filtros y ordenamiento

3. **Dashboard:**
   - Verificar métricas en tiempo real
   - Confirmar gráficos interactivos
   - Probar actualización de datos
   - Verificar alertas y notificaciones

### **4. 🔧 VERIFICACIÓN TÉCNICA**

#### **Usar MCP para verificar archivos:**

1. **Verificar Configuración:**
   - Revisar `package.json` para dependencias
   - Verificar `vite.config.js` para optimización
   - Confirmar `vercel.json` para deploy
   - Verificar variables de entorno

2. **Verificar Código:**
   - Revisar componentes principales
   - Verificar hooks y utilidades
   - Confirmar configuración de Supabase
   - Verificar utilidades de seguridad

---

## 🎯 **OBJETIVOS ESPECÍFICOS CON MCP**

### **✅ Objetivo 1: Verificación Web Completa**

- [ ] Usar MCP Browser para acceder a la aplicación
- [ ] Verificar todas las páginas funcionan correctamente
- [ ] Probar todas las funcionalidades críticas
- [ ] Documentar cualquier error encontrado

### **✅ Objetivo 2: Configuración de Base de Datos**

- [ ] Usar MCP Browser para acceder a Supabase
- [ ] Ejecutar script SQL maestro
- [ ] Verificar que todas las funciones se creen
- [ ] Confirmar que las políticas RLS funcionen

### **✅ Objetivo 3: Verificación de Archivos**

- [ ] Usar MCP para revisar archivos críticos
- [ ] Verificar configuración de build
- [ ] Confirmar que las variables de entorno estén correctas
- [ ] Verificar que el código esté optimizado

### **✅ Objetivo 4: Reporte Final**

- [ ] Generar reporte completo de verificación
- [ ] Documentar cualquier problema encontrado
- [ ] Proponer soluciones para problemas detectados
- [ ] Confirmar que el sistema esté listo para producción

---

## 📋 **COMANDOS MCP A UTILIZAR**

### **🌐 Para Verificación Web:**

```javascript
// Crear sesión de navegador
mcp_Browserbase_multi_browserbase_stagehand_session_create({
  name: 'mtz-verification',
});

// Navegar a la aplicación
mcp_Browserbase_multi_browserbase_stagehand_navigate_session({
  sessionId: 'session-id',
  url: 'https://mtz-supabase-system-r9fbhnqha.vercel.app',
});

// Probar login
mcp_Browserbase_multi_browserbase_stagehand_act_session({
  sessionId: 'session-id',
  action: 'Click the login button with demo credentials',
});

// Verificar dashboard
mcp_Browserbase_multi_browserbase_stagehand_extract_session({
  sessionId: 'session-id',
  instruction:
    'Extract dashboard metrics and verify they are displayed correctly',
});
```

### **🗄️ Para Configuración Supabase:**

```javascript
// Navegar a Supabase
mcp_Browserbase_multi_browserbase_stagehand_navigate_session({
  sessionId: 'supabase-session',
  url: 'https://bwgnmastihgndmtbqvkj.supabase.co/project/default/sql',
});

// Ejecutar script SQL
mcp_Browserbase_multi_browserbase_stagehand_act_session({
  sessionId: 'supabase-session',
  action:
    'Paste and execute the SQL script from scripts/ejecutar_scripts_supabase.sql',
});
```

### **📁 Para Verificación de Archivos:**

```javascript
// Revisar archivos críticos
read_file({
  target_file: 'package.json',
  should_read_entire_file: true,
});

read_file({
  target_file: 'vite.config.js',
  should_read_entire_file: true,
});

read_file({
  target_file: 'src/lib/supabase.js',
  should_read_entire_file: false,
  start_line_one_indexed: 1,
  end_line_one_indexed: 20,
});
```

---

## 🔍 **VERIFICACIONES ESPECÍFICAS**

### **✅ Verificación de Páginas:**

1. **Login Page:**
   - [ ] Carga sin errores de codificación
   - [ ] Botón demo funciona correctamente
   - [ ] Validación de campos funciona
   - [ ] Rate limiting funciona

2. **Dashboard:**
   - [ ] Métricas se cargan correctamente
   - [ ] Gráficos se renderizan
   - [ ] Navegación funciona
   - [ ] Datos están actualizados

3. **Clientes:**
   - [ ] Lista se carga correctamente
   - [ ] Búsqueda funciona
   - [ ] Filtros aplican correctamente
   - [ ] Exportación funciona

4. **Navegación:**
   - [ ] Sidebar funciona en móvil y desktop
   - [ ] Header muestra información correcta
   - [ ] Logout funciona
   - [ ] Rutas protegidas funcionan

### **✅ Verificación de Base de Datos:**

1. **Funciones SQL:**
   - [ ] Backup automático configurado
   - [ ] Índices optimizados creados
   - [ ] Políticas RLS aplicadas
   - [ ] Funciones de análisis creadas

2. **Datos:**
   - [ ] Clientes se cargan correctamente
   - [ ] Métricas se calculan correctamente
   - [ ] Búsqueda funciona
   - [ ] Exportación funciona

---

## 📞 **COMUNICACIÓN Y REPORTES**

### **Reportes Requeridos:**

1. **Reporte de Verificación Web:** Estado de todas las páginas
2. **Reporte de Base de Datos:** Estado de configuración SQL
3. **Reporte de Archivos:** Estado de configuración técnica
4. **Reporte de Problemas:** Lista de errores encontrados
5. **Reporte de Soluciones:** Propuestas de corrección

### **En Caso de Problemas:**

1. **Documentar el error** completamente con MCP
2. **Proponer solución** específica
3. **Verificar impacto** en funcionalidad
4. **Implementar corrección** si es posible

---

## 🏆 **CRITERIOS DE ÉXITO**

### **✅ Verificación Web Exitosa:**

- Todas las páginas cargan sin errores
- Todas las funcionalidades críticas funcionan
- No hay errores de codificación de caracteres
- Performance es óptimo (< 3s carga inicial)

### **✅ Base de Datos Operativa:**

- Script SQL ejecutado sin errores
- Todas las funciones creadas correctamente
- Políticas RLS funcionando
- Datos se cargan correctamente

### **✅ Configuración Técnica Correcta:**

- Variables de entorno configuradas
- Build optimizado para producción
- Código limpio y sin errores
- Documentación actualizada

---

## 🚀 **INSTRUCCIONES FINALES**

**Claude, tu misión con MCP es:**

1. **Usar MCP Browser** para verificar todas las páginas web
2. **Usar MCP Browser** para configurar Supabase
3. **Usar MCP File System** para verificar archivos críticos
4. **Documentar todo** el proceso y resultados
5. **Proponer correcciones** para cualquier problema encontrado

**El proyecto está desplegado y funcional, solo necesita tu verificación exhaustiva con MCP.**

**¡Confío en que harás una verificación completa y profesional!** 🎯

---

**Archivos de referencia importantes:**

- `scripts/ejecutar_scripts_supabase.sql` - Script maestro para Supabase
- `AVANCES_COMPLETOS_MTZ.md` - Resumen completo de avances
- `RESUMEN_FINAL_COMPLETO.md` - Estado final del proyecto
- `VERIFICACION_FINAL_DEPLOY.bat` - Script de verificación local
