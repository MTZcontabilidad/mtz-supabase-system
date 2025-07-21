-- =====================================================
-- DESHABILITAR RLS COMPLETAMENTE EN TODAS LAS TABLAS
-- =====================================================

-- 1. Verificar estado actual de RLS
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- 2. Deshabilitar RLS en todas las tablas
ALTER TABLE test_mcp DISABLE ROW LEVEL SECURITY;
ALTER TABLE test_mcp_simple DISABLE ROW LEVEL SECURITY;

-- 3. Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Service role full access" ON test_mcp;
DROP POLICY IF EXISTS "Service role full access" ON test_mcp_simple;
DROP POLICY IF EXISTS "service_role_all_access" ON test_mcp;
DROP POLICY IF EXISTS "service_role_all_access" ON test_mcp_simple;
DROP POLICY IF EXISTS "Enable read access for all users" ON test_mcp;
DROP POLICY IF EXISTS "Enable read access for all users" ON test_mcp_simple;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON test_mcp;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON test_mcp_simple;
DROP POLICY IF EXISTS "Enable update for users based on email" ON test_mcp;
DROP POLICY IF EXISTS "Enable update for users based on email" ON test_mcp_simple;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON test_mcp;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON test_mcp_simple;

-- 4. Verificar que RLS está deshabilitado
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- 5. Verificar que no hay políticas activas
SELECT
    schemaname,
    tablename,
    policyname
FROM pg_policies
WHERE schemaname = 'public';

-- 6. Probar acceso directo
SELECT COUNT(*) as total_test_mcp FROM test_mcp;
SELECT COUNT(*) as total_test_mcp_simple FROM test_mcp_simple;

-- 7. Mostrar algunos datos
SELECT codigo, nombre, email FROM test_mcp LIMIT 3;
SELECT nombre, descripcion FROM test_mcp_simple LIMIT 3;
