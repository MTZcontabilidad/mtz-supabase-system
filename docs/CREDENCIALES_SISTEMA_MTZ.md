# 🔐 CREDENCIALES DEL SISTEMA MTZ OUROBORUS AI

## Accesos y usuarios del sistema - 2025-01-27

---

## 🎯 **CREDENCIALES PRINCIPALES**

### **👤 USUARIO ADMINISTRADOR PRINCIPAL**

- **Email**: `mtzcontabilidad@gmail.com`
- **Contraseña**: `Alohomora33.`
- **Rol**: Administrador
- **Usuario**: Carlos Villagra
- **Acceso**: Completo a todas las funcionalidades

### **🚀 CREDENCIALES DEMO (BOTÓN EN LOGIN)**

- **Email**: `mtzcontabilidad@gmail.com`
- **Contraseña**: `Alohomora33.`
- **Función**: Botón "Usar Credenciales Demo (Carlos Villagra)"
- **Ubicación**: Página de login

---

## 📧 **USUARIOS DEMO ADICIONALES**

### **👨‍💼 ADMINISTRADOR DEMO**

- **Email**: `admin@mtz.cl`
- **Contraseña**: `admin123`
- **Rol**: Administrador
- **Usuario**: Administrador MTZ Demo
- **Acceso**: Completo

### **👩‍💼 COLABORADOR DEMO**

- **Email**: `colaborador@mtz.cl`
- **Contraseña**: `colaborador123`
- **Rol**: Colaborador
- **Usuario**: María González Demo
- **Acceso**: Limitado (sin acceso a admin)

---

## 🔍 **UBICACIÓN DE LAS CREDENCIALES**

### **📁 EN EL CÓDIGO:**

#### **1. Login.jsx** - `src/pages/Auth/Login.jsx`

```javascript
// Función para autocompletar credenciales demo
const fillDemoCredentials = () => {
  setEmail('mtzcontabilidad@gmail.com');
  setPassword('Alohomora33.');
};
```

#### **2. Setup Auth** - `database/auth/setup-auth.js`

```javascript
// Usuario de producción
email: 'mtzcontabilidad@gmail.com',
password: 'Alohomora33.'

// Usuarios demo
email: 'admin@mtz.cl',
password: 'admin123'

email: 'colaborador@mtz.cl',
password: 'colaborador123'
```

#### **3. Verify Auth** - `database/auth/verify-auth.js`

```javascript
{
  email: 'mtzcontabilidad@gmail.com',
  password: 'Alohomora33.',
  type: 'Producción'
}
```

### **📁 EN LA BASE DE DATOS:**

#### **4. Insert Admin User** - `database/04_data/insert_admin_user.sql`

```sql
-- Configurar Carlos Villagra como administrador
WHERE u.email = 'mtzcontabilidad@gmail.com';
```

#### **5. Asignar Admin Carlos** - `scripts/02_asignar_admin_carlos.sql`

```sql
-- Asignar rol de administrador
WHERE email = 'mtzcontabilidad@gmail.com'
```

---

## 🚀 **CÓMO USAR LAS CREDENCIALES**

### **1. ACCESO RÁPIDO (RECOMENDADO):**

1. Ir a `http://localhost:3002/login`
2. Hacer clic en el botón **"🚀 Usar Credenciales Demo (Carlos Villagra)"**
3. Las credenciales se autocompletarán automáticamente
4. Hacer clic en **"Iniciar Sesión"**

### **2. ACCESO MANUAL:**

1. Ir a `http://localhost:3002/login`
2. Ingresar manualmente:
   - **Email**: `mtzcontabilidad@gmail.com`
   - **Contraseña**: `Alohomora33.`
3. Hacer clic en **"Iniciar Sesión"**

### **3. ACCESO CON USUARIOS DEMO:**

1. Ir a `http://localhost:3002/login`
2. Ingresar credenciales de demo:
   - **Admin**: `admin@mtz.cl` / `admin123`
   - **Colaborador**: `colaborador@mtz.cl` / `colaborador123`

---

## 🔐 **ROLES Y PERMISOS**

### **👑 ADMINISTRADOR (Carlos Villagra)**

- ✅ Acceso completo a todas las funcionalidades
- ✅ Gestión de usuarios del sistema
- ✅ Configuración de roles y permisos
- ✅ Acceso al panel de administración
- ✅ Dashboard ejecutivo completo
- ✅ Gestión completa de clientes

### **👨‍💼 COLABORADOR**

- ✅ Dashboard ejecutivo
- ✅ Gestión de clientes
- ✅ Reportes y análisis
- ❌ Sin acceso al panel de administración
- ❌ Sin gestión de usuarios

### **👤 CLIENTE**

- ✅ Dashboard limitado
- ✅ Información de su empresa
- ❌ Sin acceso a gestión de clientes
- ❌ Sin acceso a administración

---

## 🚨 **SEGURIDAD**

### **⚠️ IMPORTANTE:**

- **Estas credenciales son para desarrollo y testing**
- **En producción, cambiar las contraseñas**
- **No compartir credenciales en repositorios públicos**
- **Usar variables de entorno para credenciales sensibles**

### **🔒 RECOMENDACIONES:**

1. **Cambiar contraseñas** en producción
2. **Implementar MFA** para usuarios críticos
3. **Auditar accesos** regularmente
4. **Usar políticas de contraseñas** fuertes
5. **Implementar rate limiting** en login

---

## 📊 **ESTADO DE LAS CREDENCIALES**

### **✅ VERIFICADAS:**

- ✅ Usuario principal: `mtzcontabilidad@gmail.com`
- ✅ Botón demo en login funcionando
- ✅ Integración con Supabase Auth
- ✅ Roles y permisos configurados
- ✅ Acceso a todas las funcionalidades

### **🔄 PENDIENTE:**

- 🔄 Verificar usuarios demo adicionales
- 🔄 Configurar MFA para producción
- 🔄 Implementar políticas de seguridad

---

## 🎯 **RESUMEN RÁPIDO**

### **CREDENCIALES PRINCIPALES:**

```
Email: mtzcontabilidad@gmail.com
Contraseña: Alohomora33.
Usuario: Carlos Villagra
Rol: Administrador
```

### **ACCESO RÁPIDO:**

1. Ir a `http://localhost:3002/login`
2. Hacer clic en **"🚀 Usar Credenciales Demo"**
3. Iniciar sesión

---

_Documento creado el 2025-01-27_
_Sistema: MTZ Ouroborus AI v3.0_
