# 🗺️ FLUJO DE NAVEGACIÓN - SISTEMA MTZ

## 📋 RESUMEN EJECUTIVO

El sistema MTZ tiene una arquitectura de navegación basada en roles con las siguientes características:

- **3 Roles Principales**: Admin, Colaborador, Cliente
- **2 Tipos de Rutas**: Públicas y Protegidas
- **1 Layout Principal**: Con sidebar y header
- **Sistema de Permisos**: Basado en roles

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### **Flujo de Login:**

```
1. Usuario accede a /login
2. Formulario pre-llenado con credenciales demo
3. Opciones de acceso:
   - Login normal (Supabase)
   - Acceso Demo (sin Supabase)
4. Redirección según rol:
   - Admin → /admin/usuarios
   - Colaborador → /dashboard
   - Cliente → /portal-clientes
```

### **Credenciales Demo:**

- **Email**: `mtzcontabilidad@gmail.com`
- **Contraseña**: `Alohomora33.`
- **Rol**: Admin (acceso completo)

---

## 🏗️ ESTRUCTURA DE RUTAS

### **RUTAS PÚBLICAS** (Sin autenticación)

```
/                   → LandingPage (Página principal)
/login              → Login (Formulario de acceso)
/register           → Register (Registro de usuarios)
/reset-password     → ResetPassword (Recuperar contraseña)
```

### **RUTAS PROTEGIDAS** (Con autenticación + Layout)

#### **📊 DASHBOARD PRINCIPAL**

```
/dashboard          → Dashboard (Panel principal)
```

#### **👥 GESTIÓN DE CLIENTES**

```
/clientes           → ClientesPage (CRUD de clientes)
/portal-clientes    → PortalClientes (Vista cliente)
```

#### **💰 VENTAS Y COBRANZA**

```
/ventas             → VentasPage (Gestión de ventas)
/cobranza           → CobranzaPage (Gestión de cobranza)
```

#### **🏢 OPERACIONES**

```
/compras            → ComprasPage (Gestión de compras)
/contratos          → ContratosPanel (Gestión de contratos)
/iva                → IVAPage (Declaraciones IVA)
```

#### **👨‍💼 RECURSOS HUMANOS**

```
/rrhh               → RRHHPage (Gestión de empleados)
```

#### **📈 REPORTES Y ANÁLISIS**

```
/reportes           → ReportsPage (Reportes y estadísticas)
/carga-masiva       → CargaMasivaPage (Importación masiva)
```

#### **⚙️ ADMINISTRACIÓN** (Solo Admin)

```
/admin/usuarios     → UserManagementPage (Gestión de usuarios)
/configuracion      → SettingsPage (Configuración del sistema)
```

---

## 🎭 SISTEMA DE ROLES

### **ADMIN** (Acceso completo)

- ✅ Dashboard
- ✅ Gestión de Clientes
- ✅ Ventas y Cobranza
- ✅ Compras y Contratos
- ✅ IVA y RRHH
- ✅ Reportes y Carga Masiva
- ✅ **Administración de Usuarios**
- ✅ **Configuración del Sistema**

### **COLABORADOR** (Acceso limitado)

- ✅ Dashboard
- ✅ Gestión de Clientes
- ✅ Ventas y Cobranza
- ✅ Compras
- ✅ IVA y RRHH
- ✅ Reportes
- ❌ Administración de Usuarios
- ❌ Configuración del Sistema
- ❌ Contratos

### **CLIENTE** (Acceso mínimo)

- ✅ Portal de Clientes
- ❌ Dashboard principal
- ❌ Gestión de ventas
- ❌ Administración

---

## 🧭 NAVEGACIÓN POR SIDEBAR

### **Elementos del Sidebar:**

```
📊 Dashboard MTZ          → /dashboard
👥 Clientes              → /clientes
👤 Portal Clientes       → /portal-clientes (solo clientes)
📄 Ventas                → /ventas
💰 Cobranza              → /cobranza
🏢 Compras               → /compras
📋 Contratos             → /contratos (solo admin)
🧮 IVA                   → /iva
💼 RRHH                  → /rrhh
📤 Carga Masiva          → /carga-masiva
📈 Reportes              → /reportes
🛡️ Administración        → /admin/usuarios (solo admin)
⚙️ Configuración         → /configuracion (solo admin)
```

---

## 🔄 FLUJO DE REDIRECCIÓN

### **Al hacer Login:**

```
1. Usuario ingresa credenciales
2. Sistema valida autenticación
3. Determina rol del usuario
4. Redirige según rol:
   - Admin → /admin/usuarios
   - Colaborador → /dashboard
   - Cliente → /portal-clientes
```

### **Al acceder a rutas protegidas:**

```
1. Usuario intenta acceder a ruta protegida
2. ProtectedRoute verifica autenticación
3. Si no está autenticado → /login
4. Si está autenticado → muestra contenido
5. Sidebar filtra elementos según rol
```

### **Al acceder a rutas públicas:**

```
1. Usuario accede a ruta pública
2. PublicRoute verifica autenticación
3. Si está autenticado → /dashboard
4. Si no está autenticado → muestra contenido
```

---

## 🎯 PUNTOS DE ENTRADA

### **Para Usuarios Nuevos:**

```
1. / (Landing Page)
2. /register (Crear cuenta)
3. /login (Acceder)
```

### **Para Usuarios Existentes:**

```
1. /login (Acceder)
2. Acceso directo según rol
```

### **Para Administradores:**

```
1. /login
2. /admin/usuarios (Panel de administración)
3. /configuracion (Configuración del sistema)
```

---

## 🚨 MANEJO DE ERRORES

### **Rutas No Encontradas:**

```
* → /dashboard (redirección por defecto)
```

### **Acceso No Autorizado:**

```
- Usuario sin permisos → mensaje de error
- Elementos del sidebar → ocultos según rol
```

### **Sesión Expirada:**

```
- Redirección automática a /login
- Limpieza de datos de sesión
```

---

## 📱 RESPONSIVIDAD

### **Desktop (lg+):**

- Sidebar fijo visible
- Navegación completa

### **Tablet (md):**

- Sidebar colapsable
- Botón hamburguesa

### **Mobile (sm):**

- Sidebar overlay
- Navegación optimizada

---

## 🔧 CONFIGURACIÓN ACTUAL

### **Archivos Principales:**

- `src/App.jsx` → Configuración de rutas
- `src/components/layout/Sidebar.jsx` → Navegación
- `src/components/auth/ProtectedRoute.jsx` → Protección
- `src/components/auth/PublicRoute.jsx` → Rutas públicas
- `src/contexts/AuthContext.jsx` → Estado de autenticación

### **Variables de Entorno:**

- `VITE_SUPABASE_URL` → URL de Supabase
- `VITE_SUPABASE_ANON_KEY` → Clave anónima
- `VITE_GA_TRACKING_ID` → Google Analytics (opcional)

---

## ✅ ESTADO ACTUAL

### **Funcionando:**

- ✅ Sistema de rutas
- ✅ Protección de rutas
- ✅ Navegación por sidebar
- ✅ Sistema de roles
- ✅ Credenciales demo
- ✅ Responsividad

### **Pendiente:**

- 🔄 Integración completa con Supabase
- 🔄 Gestión de permisos granular
- 🔄 Auditoría de navegación
- 🔄 Optimización de carga

---

## 🎯 PRÓXIMOS PASOS

1. **Probar flujo completo** con credenciales demo
2. **Verificar navegación** entre todas las páginas
3. **Validar permisos** según roles
4. **Optimizar experiencia** de usuario
5. **Implementar analytics** de navegación
