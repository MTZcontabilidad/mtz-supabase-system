-- =====================================================================
-- 👑 INSERTAR ADMINISTRADOR MANUAL - SISTEMA MTZ v3.0
-- =====================================================================
-- Script para insertar el usuario administrador después de crearlo en Auth
-- Ejecutar en el SQL Editor de Supabase

-- =====================================================================
-- 📋 PASO 1: OBTENER EL UUID DEL USUARIO
-- =====================================================================
-- Primero, ejecuta esta consulta para obtener el UUID del usuario que creaste:

SELECT id, email, raw_user_meta_data, created_at
FROM auth.users
WHERE email = 'mtzcontabilidad@gmail.com';

-- =====================================================================
-- 📋 PASO 2: INSERTAR EN USUARIOS_SISTEMA
-- =====================================================================
-- Copia el UUID obtenido y reemplázalo en la siguiente consulta:

-- INSERT INTO public.usuarios_sistema (
--   id,
--   email,
--   nombre_completo,
--   rol_id,
--   activo,
--   telefono,
--   cargo,
--   departamento,
--   created_at,
--   updated_at
-- ) VALUES (
--   'REEMPLAZAR_CON_UUID_REAL', -- Reemplazar con el UUID obtenido
--   'mtzcontabilidad@gmail.com',
--   'Administrador MTZ',
--   1, -- ID del rol Administrador
--   true,
--   '+56 9 1234 5678',
--   'Administrador General',
--   'Administración',
--   NOW(),
--   NOW()
-- );

-- =====================================================================
-- 📋 PASO 3: VERIFICAR INSERCIÓN
-- =====================================================================
-- Después de insertar, ejecuta esta consulta para verificar:

SELECT
  id,
  email,
  nombre_completo,
  rol_id,
  activo,
  created_at
FROM public.usuarios_sistema
WHERE email = 'mtzcontabilidad@gmail.com';

-- =====================================================================
-- 📋 PASO 4: VERIFICAR ROL ASIGNADO
-- =====================================================================
-- Verificar que el rol esté correctamente asignado:

SELECT
  u.email,
  u.nombre_completo,
  r.nombre as rol,
  r.permisos
FROM public.usuarios_sistema u
JOIN public.roles r ON u.rol_id = r.id
WHERE u.email = 'mtzcontabilidad@gmail.com';

-- =====================================================================
-- 📋 EJEMPLO COMPLETO
-- =====================================================================
-- Si el UUID es '12345678-1234-1234-1234-123456789abc', la consulta sería:

/*
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
  '12345678-1234-1234-1234-123456789abc',
  'mtzcontabilidad@gmail.com',
  'Administrador MTZ',
  1,
  true,
  '+56 9 1234 5678',
  'Administrador General',
  'Administración',
  NOW(),
  NOW()
);
*/

-- =====================================================================
-- ✅ CONFIGURACIÓN COMPLETADA
-- =====================================================================
-- Una vez insertado, el usuario mtzcontabilidad@gmail.com tendrá acceso completo como administrador
