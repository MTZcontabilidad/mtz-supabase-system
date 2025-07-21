-- =====================================================================
-- 🔧 CORRECCIÓN ESTRUCTURA SIMPLE - MTZ v3.0
-- =====================================================================

-- =====================================================================
-- CORREGIR FUNCIONES BÁSICAS
-- =====================================================================

-- Función para obtener rol del usuario
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT r.nombre INTO user_role
  FROM public.usuarios u
  JOIN public.roles r ON u.rol_id = r.id
  WHERE u.id = user_id AND u.activo = true;

  RETURN COALESCE(user_role, 'invitado');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener permisos del usuario
CREATE OR REPLACE FUNCTION get_user_permissions(user_id UUID)
RETURNS JSONB AS $$
DECLARE
  user_permissions JSONB;
BEGIN
  SELECT r.permisos INTO user_permissions
  FROM public.usuarios u
  JOIN public.roles r ON u.rol_id = r.id
  WHERE u.id = user_id AND u.activo = true;

  RETURN COALESCE(user_permissions, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- VERIFICAR DATOS EXISTENTES
-- =====================================================================

-- Verificar roles
SELECT 'Roles existentes:' as info;
SELECT id, nombre, descripcion FROM public.roles ORDER BY id;

-- Verificar empresas
SELECT 'Empresas existentes:' as info;
SELECT id, nombre, ruc FROM public.empresas;

-- Verificar usuarios
SELECT 'Usuarios existentes:' as info;
SELECT
  u.id,
  u.email,
  u.nombre,
  u.apellido,
  r.nombre as rol,
  e.nombre as empresa
FROM public.usuarios u
LEFT JOIN public.roles r ON u.rol_id = r.id
LEFT JOIN public.empresas e ON u.empresa_id = e.id;

-- =====================================================================
-- INSERTAR DATOS FALTANTES SI ES NECESARIO
-- =====================================================================

-- Insertar roles si no existen (usando ON CONFLICT DO NOTHING)
INSERT INTO public.roles (id, nombre, descripcion, permisos, created_at, updated_at)
VALUES
  (1, 'admin', 'Administrador del sistema', '{"all": true}', NOW(), NOW()),
  (2, 'supervisor', 'Supervisor de operaciones', '{"read": true, "write": true}', NOW(), NOW()),
  (3, 'usuario', 'Usuario estándar', '{"read": true}', NOW(), NOW()),
  (4, 'invitado', 'Usuario invitado', '{"read": false}', NOW(), NOW())
ON CONFLICT (nombre) DO NOTHING;

-- Insertar empresa si no existe
INSERT INTO public.empresas (id, nombre, ruc, direccion, telefono, email, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'MTZ Contabilidad',
  '12345678-9',
  'Av. Principal 123, Santiago',
  '+56 2 2345 6789',
  'contacto@mtzcontabilidad.cl',
  NOW(),
  NOW()
)
ON CONFLICT (ruc) DO NOTHING;

-- =====================================================================
-- VERIFICACIÓN FINAL
-- =====================================================================

SELECT 'CORRECCIÓN COMPLETADA' as status;
