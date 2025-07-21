-- =====================================================================
-- 🚀 SCRIPT FINAL SIMPLE - MTZ v3.0
-- =====================================================================
-- Script mínimo para que funcione la aplicación

-- =====================================================================
-- 1. VERIFICAR ESTRUCTURA
-- =====================================================================

SELECT 'VERIFICANDO ESTRUCTURA:' as info;

-- Verificar tablas principales
SELECT
  table_name,
  'EXISTE' as estado
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('usuarios', 'roles', 'empresas')
ORDER BY table_name;

-- =====================================================================
-- 2. CREAR FUNCIONES BÁSICAS
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
-- 3. HABILITAR RLS BÁSICO
-- =====================================================================

-- Habilitar RLS en tablas principales
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

-- Política básica para usuarios
DROP POLICY IF EXISTS "Usuarios pueden ver su perfil" ON usuarios;
CREATE POLICY "Usuarios pueden ver su perfil" ON usuarios
  FOR SELECT USING (auth.uid() = id);

-- Política básica para roles
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver roles" ON roles;
CREATE POLICY "Usuarios autenticados pueden ver roles" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política básica para empresas
DROP POLICY IF EXISTS "Usuarios pueden ver empresas" ON empresas;
CREATE POLICY "Usuarios pueden ver empresas" ON empresas
  FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================================
-- 4. VERIFICAR DATOS
-- =====================================================================

SELECT 'VERIFICANDO DATOS:' as info;

-- Verificar roles
SELECT 'Roles:' as tipo, COUNT(*) as cantidad FROM public.roles;

-- Verificar empresas
SELECT 'Empresas:' as tipo, COUNT(*) as cantidad FROM public.empresas;

-- Verificar usuarios
SELECT 'Usuarios:' as tipo, COUNT(*) as cantidad FROM public.usuarios;

-- Verificar usuario admin
SELECT 'Usuario admin:' as info;
SELECT
  u.email,
  u.nombre,
  u.apellido,
  r.nombre as rol,
  e.nombre as empresa
FROM public.usuarios u
LEFT JOIN public.roles r ON u.rol_id = r.id
LEFT JOIN public.empresas e ON u.empresa_id = e.id
WHERE u.email = 'mtzcontabilidad@gmail.com';

-- =====================================================================
-- 5. RESULTADO FINAL
-- =====================================================================

SELECT 'SCRIPT COMPLETADO EXITOSAMENTE' as resultado;
