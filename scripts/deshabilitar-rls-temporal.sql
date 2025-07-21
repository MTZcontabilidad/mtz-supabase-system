-- =====================================================
-- DESHABILITAR RLS TEMPORALMENTE PARA PRUEBAS
-- =====================================================

-- 1. Verificar estado actual de RLS
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('test_mcp', 'test_mcp_simple');

-- 2. Deshabilitar RLS en las tablas
ALTER TABLE test_mcp DISABLE ROW LEVEL SECURITY;
ALTER TABLE test_mcp_simple DISABLE ROW LEVEL SECURITY;

-- 3. Verificar que RLS está deshabilitado
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('test_mcp', 'test_mcp_simple');

-- 4. Probar acceso directo
SELECT COUNT(*) as total_test_mcp FROM test_mcp;
SELECT COUNT(*) as total_test_mcp_simple FROM test_mcp_simple;

-- 5. Mostrar algunos datos
SELECT codigo, nombre, email FROM test_mcp LIMIT 3;
SELECT nombre, descripcion FROM test_mcp_simple LIMIT 3;
