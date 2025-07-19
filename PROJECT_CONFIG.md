# ⚙️ CONFIGURACIÓN DEL PROYECTO MTZ

## 📋 **INFORMACIÓN GENERAL**

- **Nombre:** MTZ Ouroborus AI v3.0
- **Tipo:** Sistema de Gestión Empresarial
- **Cliente:** MTZ Consultores Tributarios
- **Versión:** 3.0.0
- **Estado:** ✅ **PRODUCCIÓN**

---

## 🔧 **CONFIGURACIÓN TÉCNICA**

### **Variables de Entorno**

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://bwgnmastihgndmtbqvkj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I

# App Configuration
VITE_APP_NAME=MTZ Sistema de Gestión
VITE_APP_VERSION=3.0.0
```

### **Dependencias Principales**

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "@supabase/supabase-js": "^2.38.0",
  "tailwindcss": "^3.3.0",
  "recharts": "^2.8.0",
  "react-hook-form": "^7.48.0",
  "zustand": "^4.4.0"
}
```

---

## 🗄️ **BASE DE DATOS**

### **Tablas Principales**

- **clientes_contables** - Datos de clientes (8 registros)
- **usuarios_sistema** - Usuarios del sistema
- **roles** - Roles y permisos

### **Datos Actuales**

- **Facturación Total:** $85,555,727
- **Clientes Activos:** 8
- **Usuarios Registrados:** 1 (admin)

---

## 🔐 **SEGURIDAD**

### **Autenticación**

- **Proveedor:** Supabase Auth
- **Método:** Email/Password
- **Rate Limiting:** 5 intentos/5min

### **Credenciales Demo**

- **Email:** mtzcontabilidad@gmail.com
- **Password:** Alohomora33.

### **Row Level Security (RLS)**

- ✅ Habilitado en todas las tablas
- ✅ Políticas granulares configuradas
- ✅ Acceso basado en roles

---

## 🚀 **DEPLOY**

### **Plataforma**

- **Hosting:** Vercel
- **URL:** https://mtz-supabase-system-eatif2o4g.vercel.app
- **CI/CD:** Automático desde GitHub

### **Variables Vercel**

- ✅ `VITE_SUPABASE_URL` configurada
- ✅ `VITE_SUPABASE_ANON_KEY` configurada
- ✅ Build optimizado para producción

---

## 📁 **ESTRUCTURA LIMPIA**

### **Archivos Mantenidos**

```
✅ README.md                    # Documentación principal
✅ PROJECT_CONFIG.md            # Configuración del proyecto
✅ package.json                 # Dependencias
✅ vite.config.js              # Configuración Vite
✅ vercel.json                 # Configuración Vercel
✅ tailwind.config.js          # Configuración Tailwind
✅ .env.local                  # Variables locales
✅ src/                        # Código fuente
✅ database/                   # Scripts SQL
✅ docs/                       # Documentación
✅ scripts/                    # Scripts importantes
✅ public/                     # Archivos públicos
```

### **Archivos Eliminados**

```
❌ Archivos MCP obsoletos
❌ Scripts batch redundantes
❌ Documentación duplicada
❌ Archivos de backup
❌ Logs temporales
```

---

## 🎯 **ESTADO ACTUAL**

### ✅ **FUNCIONALIDADES OPERATIVAS**

- [x] **Login/Autenticación** - 100% funcional
- [x] **Dashboard Ejecutivo** - 100% funcional
- [x] **Gestión de Clientes** - 100% funcional
- [x] **Búsqueda y Filtros** - 100% funcional
- [x] **Exportación de Datos** - 100% funcional
- [x] **Carga Masiva** - 100% funcional
- [x] **Gráficos Interactivos** - 100% funcional
- [x] **Responsive Design** - 100% funcional

### ✅ **CORRECCIONES APLICADAS**

- [x] **Imports corregidos** - Todos los alias `@/` eliminados
- [x] **Extensiones agregadas** - Todos los imports con `.js`/`.jsx`
- [x] **Rutas relativas** - Todas las rutas corregidas
- [x] **Dependencias circulares** - Resueltas
- [x] **Build de producción** - Funcionando correctamente

---

## 🔄 **MANTENIMIENTO**

### **Comandos de Verificación**

```bash
# Verificar estado
npm run lint
npm run test
npm run build

# Actualizar dependencias
npm update
npm audit fix
```

### **Deploy Manual**

```bash
npm run build
git add .
git commit -m "feat: Actualización MTZ v3.0"
git push origin main
```

---

## 📞 **CONTACTO**

- **Empresa:** MTZ Consultores Tributarios
- **Email:** mtzcontabilidad@gmail.com
- **Sistema:** MTZ Ouroborus AI v3.0
- **Última Actualización:** Julio 2025

---

**✅ PROYECTO LIMPIO, ORGANIZADO Y LISTO PARA PRODUCCIÓN**
