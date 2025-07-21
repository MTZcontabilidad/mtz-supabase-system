-- Script para configurar permisos del service role en Supabase
-- Ejecutar este script en el SQL Editor de Supabase Dashboard

-- 1. Verificar el rol service_role actual
SELECT
    rolname,
    rolsuper,
    rolinherit,
    rolcreaterole,
    rolcreatedb,
    rolcanlogin,
    rolreplication
FROM pg_roles
WHERE rolname = 'service_role';

-- 2. Otorgar permisos completos al service_role en el schema public
GRANT ALL PRIVILEGES ON SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- 3. Configurar permisos para tablas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;

-- 4. Verificar que el service_role pueda acceder a information_schema
GRANT USAGE ON SCHEMA information_schema TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO service_role;

-- 5. Verificar permisos después de la configuración
SELECT
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.table_privileges
WHERE grantee = 'service_role'
   AND table_schema = 'public'
ORDER BY table_name, privilege_type;

-- 6. Probar una consulta simple como service_role
-- (Esto debería funcionar después de aplicar los permisos)
SELECT
    current_user as usuario_actual,
    current_database() as base_datos,
    version() as version_postgres;

-- 7. Listar tablas disponibles
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 8. Verificar si RLS está habilitado y configurar si es necesario
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 9. Si RLS está habilitado y está causando problemas, puedes deshabilitarlo temporalmente
-- (Solo para pruebas, no para producción)
-- ALTER TABLE nombre_tabla DISABLE ROW LEVEL SECURITY;

-- 10. Verificar conexiones y sesiones
SELECT
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query_start
FROM pg_stat_activity
WHERE datname = current_database()
   AND usename = 'service_role'
ORDER BY query_start DESC;

-- ✅ CONFIGURACIÓN COMPLETADA
-- Después de ejecutar este script, el MCP de Supabase debería funcionar correctamente
