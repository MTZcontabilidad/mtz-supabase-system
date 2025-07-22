# 👑 Guía de Configuración del Administrador - Sistema MTZ v3.0

## 🔍 Diagnóstico del Problema

Tu usuario `mtzcontabilidad@gmail.com` no aparece en las tablas porque:

1. **No se ha creado en Supabase Auth**
2. **No se ha insertado en la tabla `usuarios_sistema`**
3. **Los scripts SQL no se han ejecutado**

## 🚀 Solución Paso a Paso

### Paso 1: Verificar Estado Actual

Ejecuta este script en el **SQL Editor de Supabase**:

```sql
-- Verificar qué tablas existen
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('roles', 'usuarios_sistema', 'empresas');

-- Verificar si hay datos
SELECT 'Roles' as tabla, COUNT(*) as total FROM public.roles
UNION ALL
SELECT 'Usuarios Sistema' as tabla, COUNT(*) as total FROM public.usuarios_sistema
UNION ALL
SELECT 'Empresas' as tabla, COUNT(*) as total FROM public.empresas;
```

### Paso 2: Configurar Base de Datos

Si las tablas no existen o están vacías, ejecuta:

```sql
-- Ejecutar el script completo
-- Copia y pega el contenido de: database/configuracion_completa.sql
```

### Paso 3: Crear Usuario en Supabase Auth

1. Ve a tu **Dashboard de Supabase**
2. Navega a **Authentication > Users**
3. Haz clic en **"Add User"**
4. Completa los datos:
   - **Email:** `mtzcontabilidad@gmail.com`
   - **Password:** `Alohomora33@`
   - **Role:** `admin` (en user_metadata)

### Paso 4: Obtener UUID del Usuario

Ejecuta esta consulta en el **SQL Editor**:

```sql
SELECT id, email, raw_user_meta_data, created_at
FROM auth.users
WHERE email = 'mtzcontabilidad@gmail.com';
```

**Copia el UUID** que aparece en la columna `id`.

### Paso 5: Insertar Usuario en Tabla

Usa el UUID copiado y ejecuta:

```sql
INSERT INTO public.usuarios_sistema (
  id,
  email,
  nombre_completo,
  rol_id,
  activo,
  telefono,
  cargo,
  departamento,
  created_at,
  updated_at
) VALUES (
  'TU_UUID_AQUI', -- Reemplazar con el UUID real
  'mtzcontabilidad@gmail.com',
  'Administrador MTZ',
  1, -- ID del rol Administrador
  true,
  '+56 9 1234 5678',
  'Administrador General',
  'Administración',
  NOW(),
  NOW()
);
```

### Paso 6: Verificar Configuración

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

### Paso 7: Insertar Datos de Prueba

Ejecuta el script completo de datos de prueba:

```sql
-- Ejecutar el contenido de: database/insert_test_data.sql
```

## 🔧 Scripts Disponibles

### 1. `database/verificar_estado_actual.sql`

- **Propósito:** Verificar el estado actual de las tablas
- **Cuándo usar:** Para diagnosticar problemas

### 2. `database/configuracion_completa.sql`

- **Propósito:** Configurar todo el sistema desde cero
- **Cuándo usar:** Si las tablas no existen o están vacías

### 3. `database/insertar_admin_manual.sql`

- **Propósito:** Insertar el usuario administrador manualmente
- **Cuándo usar:** Después de crear el usuario en Auth

### 4. `database/insert_test_data.sql`

- **Propósito:** Insertar datos de prueba completos
- **Cuándo usar:** Después de configurar el usuario admin

## ✅ Verificación Final

Una vez completados todos los pasos, deberías poder:

1. **Iniciar sesión** con `mtzcontabilidad@gmail.com` / `Alohomora33@`
2. **Acceder al dashboard** como administrador
3. **Ver todos los módulos** del sistema
4. **Gestionar usuarios, clientes, ventas, etc.**

## 🆘 Solución de Problemas

### Error: "Usuario no encontrado"

- Verifica que el usuario existe en **Authentication > Users**
- Asegúrate de que el UUID sea correcto

### Error: "Tabla no existe"

- Ejecuta `database/configuracion_completa.sql`

### Error: "No hay datos"

- Ejecuta `database/insert_test_data.sql`

### Error: "Permisos insuficientes"

- Verifica que el rol sea `admin` en user_metadata
- Asegúrate de que RLS esté configurado correctamente

## 📞 Soporte

Si sigues teniendo problemas:

1. Ejecuta `database/verificar_estado_actual.sql`
2. Revisa los mensajes de error
3. Verifica que todos los pasos se hayan completado correctamente
4. Asegúrate de que las políticas RLS estén habilitadas
