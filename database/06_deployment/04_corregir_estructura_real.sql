-- =====================================================================
-- 🔧 CORREGIR ESTRUCTURA REAL - MTZ v3.0
-- =====================================================================
-- Script para corregir la estructura de la base de datos
-- para que coincida con la estructura real de Supabase

-- =====================================================================
-- VERIFICAR ESTRUCTURA ACTUAL
-- =====================================================================

-- Verificar si existe la tabla usuarios_sistema (incorrecta)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'usuarios_sistema') THEN
    RAISE NOTICE 'Tabla usuarios_sistema existe - debe ser eliminada';
  ELSE
    RAISE NOTICE 'Tabla usuarios_sistema no existe';
  END IF;
END $$;

-- Verificar estructura de tabla usuarios (correcta)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'usuarios') THEN
    RAISE NOTICE 'Tabla usuarios existe';

    -- Verificar columnas
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'rol_id') THEN
      RAISE NOTICE 'Columna rol_id existe';
    ELSE
      RAISE NOTICE 'Columna rol_id no existe';
    END IF;

    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'empresa_id') THEN
      RAISE NOTICE 'Columna empresa_id existe';
    ELSE
      RAISE NOTICE 'Columna empresa_id no existe';
    END IF;
  ELSE
    RAISE NOTICE 'Tabla usuarios no existe';
  END IF;
END $$;

-- =====================================================================
-- CORREGIR FUNCIONES
-- =====================================================================

-- Corregir función get_user_role
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

-- Corregir función get_user_permissions
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

-- Corregir función get_clientes_by_role
CREATE OR REPLACE FUNCTION get_clientes_by_role(user_id UUID)
RETURNS TABLE (
  cliente_id UUID,
  nombre TEXT,
  ruc TEXT,
  email TEXT,
  telefono TEXT,
  estado TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id as cliente_id,
    c.nombre,
    c.ruc,
    c.email,
    c.telefono,
    c.estado
  FROM public.clientes_contables c
  JOIN public.asignaciones_trabajo a ON c.id = a.cliente_id
  JOIN public.usuarios u ON a.usuario_id = u.id
  WHERE u.id = user_id AND u.activo = true
  AND c.activo = true
  ORDER BY c.nombre;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- CORREGIR VISTAS
-- =====================================================================

-- Corregir vista dashboard_stats
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM public.clientes_contables WHERE activo = true) as clientes_activos,
  (SELECT COUNT(*) FROM public.usuarios WHERE activo = true) as usuarios_activos,
  (SELECT COUNT(*) FROM public.asignaciones_trabajo WHERE estado = 'pendiente') as tareas_pendientes,
  (SELECT COUNT(*) FROM public.ventas_cobranza WHERE estado = 'pendiente') as facturas_pendientes,
  (SELECT SUM(monto) FROM public.ventas_cobranza WHERE estado = 'pagada' AND fecha_emision >= CURRENT_DATE - INTERVAL '30 days') as ventas_mes,
  (SELECT SUM(monto) FROM public.cobranzas WHERE estado = 'cobrada' AND fecha_cobro >= CURRENT_DATE - INTERVAL '30 days') as cobranzas_mes;

-- =====================================================================
-- VERIFICACIÓN FINAL
-- =====================================================================

-- Verificar estructura corregida
SELECT 'VERIFICACIÓN FINAL' as info;

-- Verificar tabla usuarios
SELECT
  'Tabla usuarios:' as tabla,
  COUNT(*) as registros
FROM public.usuarios;

-- Verificar tabla roles
SELECT
  'Tabla roles:' as tabla,
  COUNT(*) as registros
FROM public.roles;

-- Verificar tabla empresas
SELECT
  'Tabla empresas:' as tabla,
  COUNT(*) as registros
FROM public.empresas;

-- Verificar usuario admin
SELECT
  'Usuario admin:' as info,
  u.email,
  u.nombre,
  u.apellido,
  r.nombre as rol,
  e.nombre as empresa
FROM public.usuarios u
JOIN public.roles r ON u.rol_id = r.id
JOIN public.empresas e ON u.empresa_id = e.id
WHERE u.email = 'mtzcontabilidad@gmail.com';

-- Verificar funciones
SELECT
  'Funciones corregidas:' as info,
  routine_name
FROM information_schema.routines
WHERE routine_name IN ('get_user_role', 'get_user_permissions', 'get_clientes_by_role')
AND routine_schema = 'public';
