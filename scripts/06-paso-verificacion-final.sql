-- =====================================================
-- PASO 6: VERIFICACIÓN FINAL
-- =====================================================

-- 1. Verificar todas las tablas creadas
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Verificar permisos de las tablas
SELECT
    grantee,
    table_name,
    privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND table_name IN ('test_basic', 'test_mcp', 'test_mcp_simple')
ORDER BY table_name, grantee, privilege_type;

-- 3. Verificar estado de RLS
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('test_basic', 'test_mcp', 'test_mcp_simple');

-- 4. Contar registros en todas las tablas
SELECT
    'test_basic' as tabla,
    COUNT(*) as registros
FROM test_basic
UNION ALL
SELECT
    'test_mcp' as tabla,
    COUNT(*) as registros
FROM test_mcp
UNION ALL
SELECT
    'test_mcp_simple' as tabla,
    COUNT(*) as registros
FROM test_mcp_simple;

-- 5. Probar acceso directo a todas las tablas
SELECT 'test_basic' as tabla, COUNT(*) as total FROM test_basic
UNION ALL
SELECT 'test_mcp' as tabla, COUNT(*) as total FROM test_mcp
UNION ALL
SELECT 'test_mcp_simple' as tabla, COUNT(*) as total FROM test_mcp_simple;

-- 6. Mostrar estructura final
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('test_basic', 'test_mcp', 'test_mcp_simple')
ORDER BY table_name, ordinal_position;
