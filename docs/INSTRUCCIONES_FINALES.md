# 🚀 INSTRUCCIONES FINALES - CONFIGURAR SISTEMA MTZ

## ✅ **ARCHIVOS LISTOS PARA EJECUTAR**

He creado todos los archivos necesarios para configurar tu sistema MTZ. Ahora necesitas ejecutar los scripts manualmente en Supabase.

## 📋 **PASOS A SEGUIR:**

### **PASO 1: Abrir Supabase Dashboard**

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto MTZ
3. Ve a **SQL Editor**

### **PASO 2: Ejecutar Script Principal**

1. Abre el archivo `database/SCRIPT_FINAL_MANUAL.sql`
2. Copia TODO el contenido
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **"Run"** para ejecutar

**Este script creará:**

- ✅ Todas las tablas del sistema
- ✅ Políticas RLS (seguridad)
- ✅ Roles del sistema
- ✅ Datos de prueba básicos

### **PASO 3: Crear Usuario Administrador**

1. Ve a **Authentication > Users**
2. Haz clic en **"Add User"**
3. Completa los datos:
   - **Email**: `mtzcontabilidad@gmail.com`
   - **Password**: `Alohomora33@`
   - **Role**: `admin` (en user_metadata)

### **PASO 4: Obtener UUID del Usuario**

1. En el SQL Editor, ejecuta:

```sql
SELECT id, email, raw_user_meta_data, created_at
FROM auth.users
WHERE email = 'mtzcontabilidad@gmail.com';
```

2. **Copia el UUID** que aparece en la columna `id`

### **PASO 5: Insertar Usuario en Tabla**

1. Abre el archivo `database/INSERTAR_ADMIN_INMEDIATO.sql`
2. Busca la línea que dice `'REEMPLAZAR_CON_UUID_REAL'`
3. Reemplázala con el UUID que copiaste
4. Ejecuta el script completo

### **PASO 6: Verificar Configuración**

Ejecuta estas consultas para verificar:

```sql
-- Verificar usuario insertado
SELECT
  id,
  email,
  nombre_completo,
  rol_id,
  activo
FROM public.usuarios_sistema
WHERE email = 'mtzcontabilidad@gmail.com';

-- Verificar rol asignado
SELECT
  u.email,
  u.nombre_completo,
  r.nombre as rol,
  r.permisos
FROM public.usuarios_sistema u
JOIN public.roles r ON u.rol_id = r.id
WHERE u.email = 'mtzcontabilidad@gmail.com';
```

## 🏗️ **ESTRUCTURA CREADA:**

### **Tablas Principales:**

1. **`roles`** - Roles del sistema (5 roles)
2. **`usuarios_sistema`** - Perfiles de usuarios
3. **`empresas`** - Clientes y proveedores (5 empresas)
4. **`servicios`** - Catálogo de servicios (5 servicios)
5. **`ventas`** - Facturas emitidas (3 ventas)
6. **`cobranzas`** - Gestión de pagos (3 cobranzas)
7. **`detalles_venta`** - Detalles de facturas
8. **`proyecciones`** - Proyecciones financieras (3 proyecciones)
9. **`empleados`** - Gestión de RRHH
10. **`nominas`** - Nóminas de empleados

### **Roles del Sistema:**

1. **Administrador** - Acceso completo
2. **Gerente** - Gestión de operaciones
3. **Analista** - Análisis y reportes
4. **Asistente** - Tareas administrativas
5. **Cliente** - Acceso limitado

## 🔐 **SEGURIDAD CONFIGURADA:**

- ✅ **RLS habilitado** en todas las tablas
- ✅ **Políticas de acceso** configuradas
- ✅ **Solo admins** pueden gestionar datos
- ✅ **Lectura pública** para reportes

## 📊 **DATOS DE PRUEBA INCLUIDOS:**

### **Empresas:**

- TechCorp Solutions Ltda.
- Constructora Norte Ltda.
- Distribuidora Sur SPA
- Consultoría Financiera ABC
- Restaurante El Buen Sabor

### **Servicios:**

- Contabilidad Mensual ($500.000)
- Declaración IVA ($350.000)
- Nómina y Remuneraciones ($250.000)
- Asesoría Tributaria ($400.000)
- Auditoría Financiera ($2.000.000)

### **Ventas y Cobranzas:**

- 3 ventas de ejemplo con diferentes estados
- 3 cobranzas correspondientes
- Detalles de venta completos

## 🎯 **VERIFICACIÓN FINAL:**

Una vez completados todos los pasos, deberías poder:

1. **Iniciar sesión** con `mtzcontabilidad@gmail.com` / `Alohomora33@`
2. **Acceder al dashboard** como administrador
3. **Ver todos los módulos** del sistema
4. **Gestionar usuarios, clientes, ventas, etc.**

## 🆘 **SI HAY PROBLEMAS:**

### **Error: "Usuario no encontrado"**

- Verifica que el usuario existe en Authentication > Users
- Asegúrate de que el UUID sea correcto

### **Error: "Tabla no existe"**

- Ejecuta `database/SCRIPT_FINAL_MANUAL.sql` completo

### **Error: "No hay datos"**

- Ejecuta `database/INSERTAR_ADMIN_INMEDIATO.sql`

### **Error: "Permisos insuficientes"**

- Verifica que el rol sea `admin` en user_metadata
- Asegúrate de que RLS esté configurado correctamente

## ✅ **SISTEMA LISTO**

¡Con estos pasos tendrás el sistema MTZ completamente configurado y funcionando!

**Credenciales de acceso:**

- **Email**: mtzcontabilidad@gmail.com
- **Password**: Alohomora33@
- **Rol**: Administrador (acceso completo)
