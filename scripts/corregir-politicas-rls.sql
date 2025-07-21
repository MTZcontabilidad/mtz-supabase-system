-- =====================================================
-- CORREGIR POLÍTICAS RLS PARA SERVICE ROLE
-- =====================================================

-- 1. Verificar que las tablas existen
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('test_mcp', 'test_mcp_simple');

-- 2. Habilitar RLS en las tablas
ALTER TABLE test_mcp ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_mcp_simple ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Service role full access" ON test_mcp;
DROP POLICY IF EXISTS "Service role full access" ON test_mcp_simple;
DROP POLICY IF EXISTS "Enable read access for all users" ON test_mcp;
DROP POLICY IF EXISTS "Enable read access for all users" ON test_mcp_simple;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON test_mcp;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON test_mcp_simple;
DROP POLICY IF EXISTS "Enable update for users based on email" ON test_mcp;
DROP POLICY IF EXISTS "Enable update for users based on email" ON test_mcp_simple;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON test_mcp;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON test_mcp_simple;

-- 4. Crear políticas que permitan todo al service role
CREATE POLICY "service_role_all_access" ON test_mcp
    FOR ALL USING (true);

CREATE POLICY "service_role_all_access" ON test_mcp_simple
    FOR ALL USING (true);

-- 5. Verificar las políticas creadas
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
AND tablename IN ('test_mcp', 'test_mcp_simple');

-- 6. Probar acceso directo
SELECT COUNT(*) as total_test_mcp FROM test_mcp;
SELECT COUNT(*) as total_test_mcp_simple FROM test_mcp_simple;
