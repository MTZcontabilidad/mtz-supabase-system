-- =====================================================
-- SCRIPT DE VERIFICACIÓN DEL PROYECTO MTZ v3.0
-- =====================================================

-- Verificar estructura de tablas
SELECT
    table_name,
    column_count,
    row_count
FROM (
    SELECT
        'clientes_contables' as table_name,
        COUNT(*) as column_count,
        (SELECT COUNT(*) FROM clientes_contables) as row_count
    FROM information_schema.columns
    WHERE table_name = 'clientes_contables'

    UNION ALL

    SELECT
        'usuarios_sistema' as table_name,
        COUNT(*) as column_count,
        (SELECT COUNT(*) FROM usuarios_sistema) as row_count
    FROM information_schema.columns
    WHERE table_name = 'usuarios_sistema'

    UNION ALL

    SELECT
        'roles' as table_name,
        COUNT(*) as column_count,
        (SELECT COUNT(*) FROM roles) as row_count
    FROM information_schema.columns
    WHERE table_name = 'roles'
) as table_info
ORDER BY table_name;

-- Verificar RLS habilitado
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename IN ('clientes_contables', 'usuarios_sistema', 'roles')
ORDER BY tablename;

-- Verificar políticas RLS
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename IN ('clientes_contables', 'usuarios_sistema', 'roles')
ORDER BY tablename, policyname;

-- Verificar datos de clientes
SELECT
    COUNT(*) as total_clientes,
    SUM(facturacion_anual) as facturacion_total,
    AVG(facturacion_anual) as facturacion_promedio
FROM clientes_contables;

-- Verificar usuarios del sistema
SELECT
    email,
    rol,
    created_at,
    last_sign_in_at
FROM usuarios_sistema
ORDER BY created_at DESC;

-- Verificar roles disponibles
SELECT
    nombre_rol,
    descripcion,
    permisos
FROM roles
ORDER BY nombre_rol;

-- =====================================================
-- RESUMEN DE VERIFICACIÓN
-- =====================================================
/*
ESTADO ESPERADO:
✅ 8 clientes en clientes_contables
✅ $85,555,727 facturación total
✅ 1 usuario admin en usuarios_sistema
✅ 3 roles configurados (admin, user, guest)
✅ RLS habilitado en todas las tablas
✅ Políticas de seguridad configuradas
*/
