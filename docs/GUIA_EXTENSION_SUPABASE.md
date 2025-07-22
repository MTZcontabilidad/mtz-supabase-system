# 🔧 Guía Completa - Extensión Supabase para Sistema MTZ

## ✅ **CONFIGURACIÓN ACTUAL**

Tu extensión de Supabase ya está configurada con:

- **Project Reference**: `bwgnmastihgndmtbqvkj`
- **Token de Servicio**: Configurado y válido
- **Conexión**: Funcionando correctamente

## 🚀 **PASOS PARA CONFIGURAR EL SISTEMA MTZ**

### **PASO 1: Ejecutar Script Principal**

1. **Abre la extensión de Supabase** en Cursor
2. **Ve al SQL Editor** de tu proyecto
3. **Copia y pega** el contenido de `database/DEPLOY_COMPLETO_EXTENSION.sql`
4. **Ejecuta el script completo**

Este script creará:

- ✅ Todas las tablas del sistema
- ✅ Políticas RLS (Row Level Security)
- ✅ Roles del sistema
- ✅ Datos de prueba básicos

### **PASO 2: Crear Usuario Administrador**

1. **Ve a Authentication > Users** en Supabase Dashboard
2. **Haz clic en "Add User"**
3. **Completa los datos:**
   - Email: `mtzcontabilidad@gmail.com`
   - Password: `Alohomora33@`
   - Role: `admin` (en user_metadata)

### **PASO 3: Obtener UUID del Usuario**

1. **Ejecuta esta consulta** en el SQL Editor:

```sql
SELECT id, email, raw_user_meta_data, created_at
FROM auth.users
WHERE email = 'mtzcontabilidad@gmail.com';
```

2. **Copia el UUID** que aparece en la columna `id`

### **PASO 4: Insertar Usuario en Tabla**

1. **Ejecuta el script** `database/INSERTAR_ADMIN_FINAL.sql`
2. **Reemplaza** `'REEMPLAZAR_CON_UUID_REAL'` con el UUID copiado
3. **Ejecuta la consulta INSERT**

### **PASO 5: Verificar Configuración**

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

## 📊 **ESTRUCTURA DEL SISTEMA**

### **Tablas Principales:**

1. **`roles`** - Roles del sistema con permisos
2. **`usuarios_sistema`** - Perfiles de usuarios extendidos
3. **`empresas`** - Clientes y proveedores
4. **`ventas`** - Facturas emitidas
5. **`cobranzas`** - Gestión de pagos pendientes
6. **`servicios`** - Catálogo de servicios
7. **`detalles_venta`** - Detalles de las facturas
8. **`proyecciones`** - Proyecciones financieras
9. **`empleados`** - Gestión de RRHH
10. **`nominas`** - Nóminas de empleados

### **Roles del Sistema:**

1. **Administrador** - Acceso completo
2. **Gerente** - Gestión de operaciones
3. **Analista** - Análisis y reportes
4. **Asistente** - Tareas administrativas
5. **Cliente** - Acceso limitado

## 🔐 **SEGURIDAD (RLS)**

### **Políticas Configuradas:**

- ✅ **Roles**: Visibles para todos
- ✅ **Usuarios**: Solo admins pueden gestionar
- ✅ **Empresas**: Lectura para todos, escritura para admins
- ✅ **Ventas**: Lectura para todos, escritura para admins
- ✅ **Cobranzas**: Lectura para todos, escritura para admins
- ✅ **Servicios**: Visibles para todos

## 📈 **DATOS DE PRUEBA INCLUIDOS**

### **Empresas (5 registros):**

- TechCorp Solutions Ltda.
- Constructora Norte Ltda.
- Distribuidora Sur SPA
- Consultoría Financiera ABC
- Restaurante El Buen Sabor

### **Servicios (5 registros):**

- Contabilidad Mensual
- Declaración IVA
- Nómina y Remuneraciones
- Asesoría Tributaria
- Auditoría Financiera

### **Ventas y Cobranzas:**

- 3 ventas de ejemplo
- 3 cobranzas correspondientes
- Detalles de venta completos

### **Proyecciones:**

- 3 proyecciones financieras

## 🎯 **VERIFICACIÓN FINAL**

Una vez completados todos los pasos, deberías poder:

1. **Iniciar sesión** con `mtzcontabilidad@gmail.com` / `Alohomora33@`
2. **Acceder al dashboard** como administrador
3. **Ver todos los módulos** del sistema
4. **Gestionar usuarios, clientes, ventas, etc.**

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Usuario no encontrado"**

- Verifica que el usuario existe en **Authentication > Users**
- Asegúrate de que el UUID sea correcto

### **Error: "Tabla no existe"**

- Ejecuta `database/DEPLOY_COMPLETO_EXTENSION.sql`

### **Error: "No hay datos"**

- Ejecuta `database/INSERTAR_ADMIN_FINAL.sql`

### **Error: "Permisos insuficientes"**

- Verifica que el rol sea `admin` en user_metadata
- Asegúrate de que RLS esté configurado correctamente

## 📞 **COMANDOS ÚTILES DE LA EXTENSIÓN**

Una vez configurado, puedes usar comandos como:

- "Mostrar todas las tablas del sistema MTZ"
- "Consultar usuarios del sistema"
- "Mostrar ventas del último mes"
- "Crear nueva empresa cliente"
- "Actualizar estado de cobranzas"

## ✅ **SISTEMA LISTO**

¡Con estos pasos tendrás el sistema MTZ completamente configurado y funcionando con la extensión de Supabase!
