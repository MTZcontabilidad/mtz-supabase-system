-- =====================================================
-- VERIFICAR ESTADO DEL ESQUEMA PUBLIC
-- =====================================================

-- 1. Verificar que el esquema public existe
SELECT schema_name FROM information_schema.schemata
WHERE schema_name = 'public';

-- 2. Verificar permisos del esquema public
SELECT
    nspname as schema_name,
    nspowner::regrole as owner,
    nspacl as permissions
FROM pg_namespace
WHERE nspname = 'public';

-- 3. Verificar tablas en el esquema public
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 4. Verificar si hay políticas RLS activas
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public';

-- 5. Verificar estado de RLS en las tablas
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- 6. Crear una tabla de prueba sin RLS
DROP TABLE IF EXISTS test_no_rls;
CREATE TABLE test_no_rls (
    id SERIAL PRIMARY KEY,
    nombre TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO test_no_rls (nombre) VALUES ('Test sin RLS');

-- 7. Verificar que la nueva tabla funciona
SELECT * FROM test_no_rls;
