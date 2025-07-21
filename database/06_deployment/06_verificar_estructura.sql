-- =====================================================================
-- 🔍 VERIFICAR ESTRUCTURA ACTUAL - MTZ v3.0
-- =====================================================================

-- Verificar tablas principales
SELECT 'TABLAS PRINCIPALES:' as info;

SELECT
  table_name,
  CASE
    WHEN table_name IN ('usuarios', 'roles', 'empresas') THEN '✅ EXISTE'
    ELSE '❌ NO EXISTE'
  END as estado
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('usuarios', 'roles', 'empresas', 'usuarios_sistema')
ORDER BY table_name;

-- Verificar estructura de tabla usuarios
SELECT 'ESTRUCTURA TABLA USUARIOS:' as info;

SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'usuarios'
ORDER BY ordinal_position;

-- Verificar datos existentes
SELECT 'DATOS EXISTENTES:' as info;

SELECT 'Roles:' as tipo, COUNT(*) as cantidad FROM public.roles
UNION ALL
SELECT 'Empresas:' as tipo, COUNT(*) as cantidad FROM public.empresas
UNION ALL
SELECT 'Usuarios:' as tipo, COUNT(*) as cantidad FROM public.usuarios;

-- Verificar usuario admin
SELECT 'USUARIO ADMIN:' as info;

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
