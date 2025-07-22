-- =====================================================================
-- 🔍 VERIFICACIÓN ESTADO ACTUAL - SISTEMA MTZ v3.0
-- =====================================================================
-- Script para verificar el estado actual de las tablas y usuarios
-- Ejecutar en el SQL Editor de Supabase

-- =====================================================================
-- 📋 VERIFICACIÓN DE TABLAS EXISTENTES
-- =====================================================================

-- Verificar qué tablas existen
SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'roles',
  'usuarios_sistema',
  'empresas',
  'ventas',
  'cobranzas',
  'servicios',
  'detalles_venta',
  'proyecciones',
  'empleados',
  'nominas'
)
ORDER BY table_name;

-- =====================================================================
-- 📋 VERIFICACIÓN DE DATOS EN TABLAS
-- =====================================================================

-- Verificar roles
SELECT 'Roles' as tabla, COUNT(*) as total FROM public.roles
UNION ALL
SELECT 'Usuarios Sistema' as tabla, COUNT(*) as total FROM public.usuarios_sistema
UNION ALL
SELECT 'Empresas' as tabla, COUNT(*) as total FROM public.empresas
UNION ALL
SELECT 'Ventas' as tabla, COUNT(*) as total FROM public.ventas
UNION ALL
SELECT 'Cobranzas' as tabla, COUNT(*) as total FROM public.cobranzas
UNION ALL
SELECT 'Servicios' as tabla, COUNT(*) as total FROM public.servicios
UNION ALL
SELECT 'Detalles Venta' as tabla, COUNT(*) as total FROM public.detalles_venta
UNION ALL
SELECT 'Proyecciones' as tabla, COUNT(*) as total FROM public.proyecciones
UNION ALL
SELECT 'Empleados' as tabla, COUNT(*) as total FROM public.empleados
UNION ALL
SELECT 'Nóminas' as tabla, COUNT(*) as total FROM public.nominas;

-- =====================================================================
-- 📋 VERIFICACIÓN ESPECÍFICA DEL USUARIO ADMINISTRADOR
-- =====================================================================

-- Verificar si existe el usuario administrador en usuarios_sistema
SELECT
  'usuarios_sistema' as tabla,
  id,
  email,
  nombre_completo,
  rol_id,
  activo,
  created_at
FROM public.usuarios_sistema
WHERE email = 'mtzcontabilidad@gmail.com';

-- Verificar si existe en auth.users (solo si tienes permisos)
-- SELECT
--   'auth.users' as tabla,
--   id,
--   email,
--   raw_user_meta_data,
--   created_at
-- FROM auth.users
-- WHERE email = 'mtzcontabilidad@gmail.com';

-- =====================================================================
-- 📋 VERIFICACIÓN DE ROLES
-- =====================================================================

-- Verificar roles disponibles
SELECT
  id,
  nombre,
  descripcion,
  permisos,
  created_at
FROM public.roles
ORDER BY id;

-- =====================================================================
-- 📋 VERIFICACIÓN DE POLÍTICAS RLS
-- =====================================================================

-- Verificar si RLS está habilitado en las tablas principales
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'roles',
  'usuarios_sistema',
  'empresas',
  'ventas',
  'cobranzas',
  'servicios',
  'detalles_venta',
  'proyecciones',
  'empleados',
  'nominas'
)
ORDER BY tablename;

-- =====================================================================
-- 📋 VERIFICACIÓN DE POLÍTICAS EXISTENTES
-- =====================================================================

-- Verificar políticas en usuarios_sistema
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'usuarios_sistema';

-- =====================================================================
-- 📋 DIAGNÓSTICO Y RECOMENDACIONES
-- =====================================================================

-- Si no hay datos, mostrar recomendaciones
DO $$
BEGIN
  -- Verificar si hay usuarios en usuarios_sistema
  IF NOT EXISTS (SELECT 1 FROM public.usuarios_sistema WHERE email = 'mtzcontabilidad@gmail.com') THEN
    RAISE NOTICE '❌ USUARIO ADMINISTRADOR NO ENCONTRADO';
    RAISE NOTICE '🔧 ACCIONES REQUERIDAS:';
    RAISE NOTICE '   1. Crear usuario en Authentication > Users';
    RAISE NOTICE '   2. Ejecutar database/configurar_admin_principal.sql';
    RAISE NOTICE '   3. Ejecutar database/insert_test_data.sql';
  ELSE
    RAISE NOTICE '✅ USUARIO ADMINISTRADOR ENCONTRADO';
  END IF;

  -- Verificar si hay roles
  IF NOT EXISTS (SELECT 1 FROM public.roles) THEN
    RAISE NOTICE '❌ NO HAY ROLES CONFIGURADOS';
    RAISE NOTICE '🔧 Ejecutar database/insert_test_data.sql';
  ELSE
    RAISE NOTICE '✅ ROLES CONFIGURADOS';
  END IF;

  -- Verificar si hay datos de prueba
  IF NOT EXISTS (SELECT 1 FROM public.empresas) THEN
    RAISE NOTICE '❌ NO HAY DATOS DE PRUEBA';
    RAISE NOTICE '🔧 Ejecutar database/insert_test_data.sql';
  ELSE
    RAISE NOTICE '✅ DATOS DE PRUEBA PRESENTES';
  END IF;

END $$;

-- =====================================================================
-- 📋 RESUMEN FINAL
-- =====================================================================

SELECT
  'RESUMEN' as tipo,
  CASE
    WHEN EXISTS (SELECT 1 FROM public.usuarios_sistema WHERE email = 'mtzcontabilidad@gmail.com')
    THEN '✅ Usuario admin configurado'
    ELSE '❌ Usuario admin faltante'
  END as estado
UNION ALL
SELECT
  'ROLES',
  CASE
    WHEN EXISTS (SELECT 1 FROM public.roles)
    THEN '✅ Roles configurados'
    ELSE '❌ Roles faltantes'
  END
UNION ALL
SELECT
  'DATOS',
  CASE
    WHEN EXISTS (SELECT 1 FROM public.empresas)
    THEN '✅ Datos de prueba presentes'
    ELSE '❌ Datos de prueba faltantes'
  END
UNION ALL
SELECT
  'RLS',
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename = 'usuarios_sistema'
      AND rowsecurity = true
    )
    THEN '✅ RLS habilitado'
    ELSE '❌ RLS no habilitado'
  END;
