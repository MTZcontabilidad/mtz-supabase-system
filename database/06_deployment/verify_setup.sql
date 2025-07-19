-- =====================================================================
-- ✅ SCRIPT DE VERIFICACIÓN SISTEMA MTZ
-- Archivo: 06_deployment/verify_setup.sql
-- Propósito: Verificar que el sistema está correctamente instalado y funcionando
-- Uso: Ejecutar después del deployment para validar instalación
-- =====================================================================

-- INFORMACIÓN DE LA VERIFICACIÓN
SELECT 
    '✅ INICIANDO VERIFICACIÓN SISTEMA MTZ OUROBORUS AI v3.0' as mensaje,
    NOW() as fecha_verificacion;

-- =====================================================================
-- 🏗️ VERIFICACIÓN 1: ESQUEMAS Y TABLAS
-- =====================================================================

-- Verificar que todas las tablas existen
DO $$
DECLARE
    table_count INTEGER;
    expected_tables TEXT[] := ARRAY['roles', 'usuarios_sistema', 'asignaciones_trabajo'];
    missing_tables TEXT[];
    table_name TEXT;
BEGIN
    RAISE NOTICE '🏗️ VERIFICANDO TABLAS...';
    
    FOREACH table_name IN ARRAY expected_tables
    LOOP
        SELECT COUNT(*) INTO table_count
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = table_name;
        
        IF table_count = 0 THEN
            missing_tables := missing_tables || table_name;
        ELSE
            RAISE NOTICE '  ✅ Tabla % existe', table_name;
        END IF;
    END LOOP;
    
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE EXCEPTION '❌ Tablas faltantes: %', array_to_string(missing_tables, ', ');
    ELSE
        RAISE NOTICE '✅ Todas las tablas necesarias están presentes';
    END IF;
END
$$;

-- =====================================================================
-- ⚙️ VERIFICACIÓN 2: FUNCIONES DEL SISTEMA
-- =====================================================================

-- Verificar que todas las funciones existen
DO $$
DECLARE
    function_count INTEGER;
    expected_functions TEXT[] := ARRAY['get_user_role', 'user_has_permission', 'get_clientes_by_role'];
    missing_functions TEXT[];
    function_name TEXT;
BEGIN
    RAISE NOTICE '⚙️ VERIFICANDO FUNCIONES...';
    
    FOREACH function_name IN ARRAY expected_functions
    LOOP
        SELECT COUNT(*) INTO function_count
        FROM information_schema.routines 
        WHERE routine_schema = 'public' AND routine_name = function_name;
        
        IF function_count = 0 THEN
            missing_functions := missing_functions || function_name;
        ELSE
            RAISE NOTICE '  ✅ Función % existe', function_name;
        END IF;
    END LOOP;
    
    IF array_length(missing_functions, 1) > 0 THEN
        RAISE EXCEPTION '❌ Funciones faltantes: %', array_to_string(missing_functions, ', ');
    ELSE
        RAISE NOTICE '✅ Todas las funciones necesarias están presentes';
    END IF;
END
$$;

-- =====================================================================
-- 🎭 VERIFICACIÓN 3: ROLES DEL SISTEMA
-- =====================================================================

-- Verificar roles del sistema
DO $$
DECLARE
    role_count INTEGER;
    expected_roles TEXT[] := ARRAY['administrador', 'colaborador', 'externo', 'cliente'];
    missing_roles TEXT[];
    role_name TEXT;
BEGIN
    RAISE NOTICE '🎭 VERIFICANDO ROLES...';
    
    FOREACH role_name IN ARRAY expected_roles
    LOOP
        SELECT COUNT(*) INTO role_count
        FROM public.roles 
        WHERE nombre = role_name;
        
        IF role_count = 0 THEN
            missing_roles := missing_roles || role_name;
        ELSE
            RAISE NOTICE '  ✅ Rol % existe', role_name;
        END IF;
    END LOOP;
    
    IF array_length(missing_roles, 1) > 0 THEN
        RAISE EXCEPTION '❌ Roles faltantes: %', array_to_string(missing_roles, ', ');
    ELSE
        RAISE NOTICE '✅ Todos los roles necesarios están presentes';
    END IF;
END
$$;

-- =====================================================================
-- 👑 VERIFICACIÓN 4: USUARIO ADMINISTRADOR
-- =====================================================================

-- Verificar que Carlos Villagra está configurado como administrador
DO $$
DECLARE
    admin_role TEXT;
    admin_active BOOLEAN;
BEGIN
    RAISE NOTICE '👑 VERIFICANDO ADMINISTRADOR...';
    
    SELECT r.nombre, u.activo
    INTO admin_role, admin_active
    FROM public.usuarios_sistema u
    JOIN public.roles r ON u.rol_id = r.id
    WHERE u.email = 'mtzcontabilidad@gmail.com';
    
    IF admin_role IS NULL THEN
        RAISE EXCEPTION '❌ Usuario administrador Carlos Villagra no encontrado';
    ELSIF admin_role != 'administrador' THEN
        RAISE EXCEPTION '❌ Carlos Villagra no tiene rol de administrador (rol actual: %)', admin_role;
    ELSIF NOT admin_active THEN
        RAISE EXCEPTION '❌ Usuario administrador Carlos Villagra está inactivo';
    ELSE
        RAISE NOTICE '  ✅ Carlos Villagra configurado correctamente como administrador activo';
    END IF;
END
$$;

-- =====================================================================
-- 🔐 VERIFICACIÓN 5: ROW LEVEL SECURITY
-- =====================================================================

-- Verificar que RLS está habilitado
DO $$
DECLARE
    rls_tables TEXT[];
    table_name TEXT;
    rls_enabled BOOLEAN;
BEGIN
    RAISE NOTICE '🔐 VERIFICANDO ROW LEVEL SECURITY...';
    
    rls_tables := ARRAY['roles', 'usuarios_sistema', 'asignaciones_trabajo'];
    
    FOREACH table_name IN ARRAY rls_tables
    LOOP
        SELECT relrowsecurity INTO rls_enabled
        FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public' AND c.relname = table_name;
        
        IF NOT rls_enabled THEN
            RAISE EXCEPTION '❌ RLS no está habilitado en tabla %', table_name;
        ELSE
            RAISE NOTICE '  ✅ RLS habilitado en tabla %', table_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE '✅ Row Level Security configurado correctamente';
END
$$;

-- =====================================================================
-- 🧪 VERIFICACIÓN 6: FUNCIONALIDAD BÁSICA
-- =====================================================================

-- Probar funciones principales
DO $$
DECLARE
    test_role TEXT;
    test_permission BOOLEAN;
    test_clients_count INTEGER;
BEGIN
    RAISE NOTICE '🧪 PROBANDO FUNCIONALIDAD BÁSICA...';
    
    -- Probar get_user_role
    SELECT public.get_user_role('aa43bcf5-4eb9-46bb-8403-1028b83cbab9') INTO test_role;
    IF test_role != 'administrador' THEN
        RAISE EXCEPTION '❌ Función get_user_role no funciona correctamente (resultado: %)', test_role;
    ELSE
        RAISE NOTICE '  ✅ Función get_user_role funciona correctamente';
    END IF;
    
    -- Probar user_has_permission
    SELECT public.user_has_permission('aa43bcf5-4eb9-46bb-8403-1028b83cbab9', 'clientes', 'read') INTO test_permission;
    IF NOT test_permission THEN
        RAISE EXCEPTION '❌ Función user_has_permission no funciona correctamente';
    ELSE
        RAISE NOTICE '  ✅ Función user_has_permission funciona correctamente';
    END IF;
    
    -- Probar get_clientes_by_role (contar resultados)
    SELECT COUNT(*) INTO test_clients_count
    FROM public.get_clientes_by_role('aa43bcf5-4eb9-46bb-8403-1028b83cbab9');
    
    RAISE NOTICE '  ✅ Función get_clientes_by_role funciona correctamente (% clientes accesibles)', test_clients_count;
END
$$;

-- =====================================================================
-- 📊 VERIFICACIÓN 7: VISTAS DEL DASHBOARD
-- =====================================================================

-- Verificar vistas del dashboard
DO $$
DECLARE
    stats_record RECORD;
BEGIN
    RAISE NOTICE '📊 VERIFICANDO VISTAS DEL DASHBOARD...';
    
    -- Probar vista dashboard_stats
    SELECT * INTO stats_record FROM public.dashboard_stats LIMIT 1;
    
    IF stats_record IS NULL THEN
        RAISE EXCEPTION '❌ Vista dashboard_stats no funciona correctamente';
    ELSE
        RAISE NOTICE '  ✅ Vista dashboard_stats funciona correctamente';
        RAISE NOTICE '    - Total clientes: %', stats_record.total_clientes;
        RAISE NOTICE '    - Usuarios activos: %', stats_record.usuarios_activos;
        RAISE NOTICE '    - Tareas pendientes: %', stats_record.tareas_pendientes;
    END IF;
END
$$;

-- =====================================================================
-- 🎉 RESUMEN FINAL DE VERIFICACIÓN
-- =====================================================================

SELECT 
    '🎉 VERIFICACIÓN COMPLETADA EXITOSAMENTE' as resultado,
    'Sistema MTZ Ouroborus AI v3.0 está funcionando correctamente' as estado,
    NOW() as fecha_verificacion;

-- Mostrar estadísticas finales del sistema
SELECT 
    'RESUMEN DEL SISTEMA' as seccion,
    (SELECT COUNT(*) FROM public.roles) as roles_creados,
    (SELECT COUNT(*) FROM public.usuarios_sistema) as usuarios_registrados,
    (SELECT COUNT(*) FROM public.asignaciones_trabajo) as asignaciones_activas;

-- ✅ VERIFICACIÓN COMPLETA - SISTEMA VALIDADO Y OPERATIVO
