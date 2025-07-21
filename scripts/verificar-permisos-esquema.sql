-- =====================================================
-- VERIFICAR Y CORREGIR PERMISOS DEL ESQUEMA PUBLIC
-- =====================================================

-- 1. Verificar permisos actuales del esquema public
SELECT
    nspname as schema_name,
    nspowner::regrole as owner,
    nspacl as permissions
FROM pg_namespace
WHERE nspname = 'public';

-- 2. Verificar permisos de las tablas
SELECT
    schemaname,
    tablename,
    tableowner,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- 3. Verificar si el usuario anónimo tiene permisos
SELECT
    grantee,
    table_name,
    privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND table_name IN ('test_mcp', 'test_mcp_simple');

-- 4. Otorgar permisos explícitos al rol anónimo
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- 5. Otorgar permisos explícitos al rol service_role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- 6. Configurar permisos para futuras tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;

-- 7. Verificar permisos después de los cambios
SELECT
    grantee,
    table_name,
    privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND table_name IN ('test_mcp', 'test_mcp_simple')
ORDER BY grantee, privilege_type;

-- 8. Probar acceso directo
SELECT COUNT(*) as total_test_mcp FROM test_mcp;
SELECT COUNT(*) as total_test_mcp_simple FROM test_mcp_simple;
