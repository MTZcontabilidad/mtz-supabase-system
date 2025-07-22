-- =====================================================================
-- 👑 CONFIGURACIÓN ADMINISTRADOR PRINCIPAL - SISTEMA MTZ v3.0
-- =====================================================================
-- Script para configurar el usuario administrador principal
-- Ejecutar en el SQL Editor de Supabase

-- =====================================================================
-- 📋 PASO 1: CREAR USUARIO EN SUPABASE AUTH
-- =====================================================================
-- Ve a Authentication > Users > Add User y crea:

-- Email: mtzcontabilidad@gmail.com
-- Password: Alohomora33@
-- Role: admin (en user_metadata)

-- =====================================================================
-- 📋 PASO 2: OBTENER EL UUID DEL USUARIO
-- =====================================================================
-- Ejecuta esta consulta para obtener el UUID:

SELECT id, email, raw_user_meta_data
FROM auth.users
WHERE email = 'mtzcontabilidad@gmail.com';

-- =====================================================================
-- 📋 PASO 3: ACTUALIZAR METADATA DEL USUARIO
-- =====================================================================
-- Ejecuta esta consulta (reemplaza USER_UUID con el UUID obtenido):

-- UPDATE auth.users
-- SET raw_user_meta_data = jsonb_set(
--   COALESCE(raw_user_meta_data, '{}'::jsonb),
--   '{role}',
--   '"admin"'
-- )
-- WHERE email = 'mtzcontabilidad@gmail.com';

-- =====================================================================
-- 📋 PASO 4: INSERTAR EN TABLA USUARIOS_SISTEMA
-- =====================================================================
-- Ejecuta esta consulta (reemplaza USER_UUID con el UUID obtenido):

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
--   'USER_UUID', -- Reemplazar con el UUID real
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
-- 📋 PASO 5: VERIFICAR CONFIGURACIÓN
-- =====================================================================

-- Verificar usuario en auth.users
SELECT
  id,
  email,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users
WHERE email = 'mtzcontabilidad@gmail.com';

-- Verificar usuario en usuarios_sistema
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

-- =====================================================================
-- 📋 PASO 6: CONFIGURAR POLÍTICAS RLS PARA ADMIN
-- =====================================================================

-- Política para que el admin pueda ver todos los usuarios
CREATE POLICY "Admin puede ver todos los usuarios" ON public.usuarios_sistema
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.usuarios_sistema
    WHERE id = auth.uid() AND rol_id = 1
  )
);

-- Política para que el admin pueda gestionar empresas
CREATE POLICY "Admin puede gestionar empresas" ON public.empresas
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.usuarios_sistema
    WHERE id = auth.uid() AND rol_id = 1
  )
);

-- Política para que el admin pueda gestionar ventas
CREATE POLICY "Admin puede gestionar ventas" ON public.ventas
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.usuarios_sistema
    WHERE id = auth.uid() AND rol_id = 1
  )
);

-- Política para que el admin pueda gestionar cobranzas
CREATE POLICY "Admin puede gestionar cobranzas" ON public.cobranzas
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.usuarios_sistema
    WHERE id = auth.uid() AND rol_id = 1
  )
);

-- =====================================================================
-- ✅ CONFIGURACIÓN COMPLETADA
-- =====================================================================
-- El usuario mtzcontabilidad@gmail.com ahora tiene acceso completo como administrador
-- Puede acceder al sistema con las credenciales configuradas
