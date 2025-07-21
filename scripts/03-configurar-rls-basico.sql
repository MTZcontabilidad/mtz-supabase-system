-- =====================================================================
-- 🔒 SISTEMA MTZ - CONFIGURACIÓN RLS BÁSICA
-- Script para configurar Row Level Security
-- Ejecutar DESPUÉS de los scripts de estructura y datos
-- =====================================================================

-- =====================================================================
-- 1. HABILITAR ROW LEVEL SECURITY EN TODAS LAS TABLAS
-- =====================================================================
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cobranzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE rrhh ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyecciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- 2. CREAR POLÍTICAS BÁSICAS PARA SERVICE ROLE
-- =====================================================================

-- Políticas para roles (acceso completo para service role)
CREATE POLICY "Service role full access" ON roles
    FOR ALL USING (true);

-- Políticas para empresas (acceso completo para service role)
CREATE POLICY "Service role full access" ON empresas
    FOR ALL USING (true);

-- Políticas para usuarios_sistema (acceso completo para service role)
CREATE POLICY "Service role full access" ON usuarios_sistema
    FOR ALL USING (true);

-- Políticas para clientes (acceso completo para service role)
CREATE POLICY "Service role full access" ON clientes
    FOR ALL USING (true);

-- Políticas para ventas (acceso completo para service role)
CREATE POLICY "Service role full access" ON ventas
    FOR ALL USING (true);

-- Políticas para cobranzas (acceso completo para service role)
CREATE POLICY "Service role full access" ON cobranzas
    FOR ALL USING (true);

-- Políticas para compras (acceso completo para service role)
CREATE POLICY "Service role full access" ON compras
    FOR ALL USING (true);

-- Políticas para contratos (acceso completo para service role)
CREATE POLICY "Service role full access" ON contratos
    FOR ALL USING (true);

-- Políticas para RRHH (acceso completo para service role)
CREATE POLICY "Service role full access" ON rrhh
    FOR ALL USING (true);

-- Políticas para proyecciones (acceso completo para service role)
CREATE POLICY "Service role full access" ON proyecciones
    FOR ALL USING (true);

-- Políticas para asignaciones (acceso completo para service role)
CREATE POLICY "Service role full access" ON asignaciones
    FOR ALL USING (true);

-- =====================================================================
-- 3. CONFIGURAR PERMISOS PARA SERVICE ROLE
-- =====================================================================

-- Otorgar permisos completos al service role
GRANT ALL PRIVILEGES ON SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Configurar permisos para tablas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;

-- Permitir acceso a information_schema
GRANT USAGE ON SCHEMA information_schema TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO service_role;

-- =====================================================================
-- 4. VERIFICAR CONFIGURACIÓN RLS
-- =====================================================================
SELECT '=== CONFIGURACIÓN RLS ===' as info;

-- Verificar que RLS esté habilitado
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verificar políticas creadas
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verificar permisos del service role
SELECT
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.table_privileges
WHERE grantee = 'service_role'
   AND table_schema = 'public'
ORDER BY table_name, privilege_type;

-- =====================================================================
-- 5. PROBAR CONSULTAS COMO SERVICE ROLE
-- =====================================================================
SELECT '=== PRUEBAS DE ACCESO ===' as info;

-- Probar consulta simple
SELECT
    current_user as usuario_actual,
    current_database() as base_datos,
    version() as version_postgres;

-- Probar listar tablas
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Probar consulta de datos
SELECT
    'Roles:' as tabla, COUNT(*) as cantidad FROM roles
UNION ALL
SELECT 'Empresas:', COUNT(*) FROM empresas
UNION ALL
SELECT 'Usuarios:', COUNT(*) FROM usuarios_sistema
UNION ALL
SELECT 'Clientes:', COUNT(*) FROM clientes;

-- =====================================================================
-- ✅ CONFIGURACIÓN RLS COMPLETADA
-- =====================================================================
-- El MCP de Supabase debería funcionar correctamente ahora
