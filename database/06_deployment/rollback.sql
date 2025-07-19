-- =====================================================================
-- ↩️ SCRIPT DE ROLLBACK SISTEMA MTZ
-- Archivo: 06_deployment/rollback.sql
-- Propósito: Revertir completamente la instalación del sistema MTZ
-- ⚠️ ADVERTENCIA: Esto eliminará TODOS los datos del sistema MTZ
-- =====================================================================

-- CONFIRMACIÓN DE SEGURIDAD
DO $$
BEGIN
    RAISE NOTICE '⚠️ ADVERTENCIA: Este script eliminará COMPLETAMENTE el sistema MTZ';
    RAISE NOTICE '⚠️ Todos los datos, usuarios, roles y configuraciones se perderán';
    RAISE NOTICE '⚠️ Esta acción NO SE PUEDE DESHACER';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Para confirmar, debes cambiar la variable confirm_rollback a TRUE';
END
$$;

-- Variable de confirmación de seguridad
\set confirm_rollback false

-- Verificar confirmación antes de proceder
DO $$
BEGIN
    IF NOT :'confirm_rollback'::boolean THEN
        RAISE EXCEPTION '❌ ROLLBACK CANCELADO: Debes confirmar explícitamente cambiando confirm_rollback a true';
    END IF;
    
    RAISE NOTICE '🚨 INICIANDO ROLLBACK COMPLETO DEL SISTEMA MTZ...';
END
$$;

-- =====================================================================
-- 🗑️ FASE 1: ELIMINAR POLÍTICAS RLS
-- =====================================================================

RAISE NOTICE '🗑️ Eliminando políticas RLS...';

-- Eliminar políticas de asignaciones_trabajo
DROP POLICY IF EXISTS "Ver asignaciones según rol" ON public.asignaciones_trabajo;
DROP POLICY IF EXISTS "Crear asignaciones según rol" ON public.asignaciones_trabajo;
DROP POLICY IF EXISTS "Actualizar asignaciones según rol" ON public.asignaciones_trabajo;
DROP POLICY IF EXISTS "Eliminar asignaciones según rol" ON public.asignaciones_trabajo;

-- Eliminar políticas de usuarios_sistema
DROP POLICY IF EXISTS "Ver usuarios según rol" ON public.usuarios_sistema;
DROP POLICY IF EXISTS "Solo administradores pueden crear usuarios" ON public.usuarios_sistema;
DROP POLICY IF EXISTS "Actualizar usuarios según rol" ON public.usuarios_sistema;
DROP POLICY IF EXISTS "Solo administradores pueden eliminar usuarios" ON public.usuarios_sistema;
DROP POLICY IF EXISTS "Sistema puede leer usuarios" ON public.usuarios_sistema;

-- Eliminar políticas de roles
DROP POLICY IF EXISTS "Administradores pueden ver roles" ON public.roles;
DROP POLICY IF EXISTS "Administradores pueden crear roles" ON public.roles;
DROP POLICY IF EXISTS "Administradores pueden actualizar roles" ON public.roles;
DROP POLICY IF EXISTS "Administradores pueden eliminar roles" ON public.roles;
DROP POLICY IF EXISTS "Sistema puede leer roles" ON public.roles;

-- =====================================================================
-- 🗑️ FASE 2: DESHABILITAR RLS
-- =====================================================================

RAISE NOTICE '🔓 Deshabilitando Row Level Security...';

ALTER TABLE IF EXISTS public.asignaciones_trabajo DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.usuarios_sistema DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.roles DISABLE ROW LEVEL SECURITY;

-- =====================================================================
-- 🗑️ FASE 3: ELIMINAR TRIGGERS
-- =====================================================================

RAISE NOTICE '⚡ Eliminando triggers...';

DROP TRIGGER IF EXISTS update_usuarios_sistema_updated_at ON public.usuarios_sistema;
DROP TRIGGER IF EXISTS validate_usuarios_sistema_data ON public.usuarios_sistema;
DROP TRIGGER IF EXISTS update_roles_updated_at ON public.roles;

-- =====================================================================
-- 🗑️ FASE 4: ELIMINAR FUNCIONES
-- =====================================================================

RAISE NOTICE '⚙️ Eliminando funciones del sistema...';

DROP FUNCTION IF EXISTS public.get_clientes_by_role(UUID);
DROP FUNCTION IF EXISTS public.count_clientes_by_role(UUID);
DROP FUNCTION IF EXISTS public.user_has_permission(UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.user_has_any_permission(UUID, JSONB);
DROP FUNCTION IF EXISTS public.get_user_role(UUID);
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.update_user_last_access();
DROP FUNCTION IF EXISTS public.validate_user_data();

-- =====================================================================
-- 🗑️ FASE 5: ELIMINAR VISTAS
-- =====================================================================

RAISE NOTICE '📊 Eliminando vistas del dashboard...';

DROP VIEW IF EXISTS public.dashboard_stats;
DROP VIEW IF EXISTS public.actividad_reciente;

-- =====================================================================
-- 🗑️ FASE 6: ELIMINAR TABLAS (EN ORDEN INVERSO)
-- =====================================================================

RAISE NOTICE '🏗️ Eliminando tablas del sistema...';

-- Eliminar tabla de asignaciones (tiene foreign keys)
DROP TABLE IF EXISTS public.asignaciones_trabajo CASCADE;

-- Eliminar tabla de usuarios (tiene foreign keys)
DROP TABLE IF EXISTS public.usuarios_sistema CASCADE;

-- Eliminar tabla de roles (referenciada por usuarios)
DROP TABLE IF EXISTS public.roles CASCADE;

-- =====================================================================
-- ✅ VERIFICACIÓN FINAL DEL ROLLBACK
-- =====================================================================

-- Verificar que todas las tablas fueron eliminadas
DO $$
DECLARE
    remaining_tables INTEGER;
    remaining_functions INTEGER;
BEGIN
    RAISE NOTICE '✅ Verificando rollback completo...';
    
    -- Contar tablas restantes del sistema MTZ
    SELECT COUNT(*) INTO remaining_tables
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
        AND table_name IN ('roles', 'usuarios_sistema', 'asignaciones_trabajo');
    
    -- Contar funciones restantes del sistema MTZ
    SELECT COUNT(*) INTO remaining_functions
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
        AND routine_name IN ('get_user_role', 'user_has_permission', 'get_clientes_by_role');
    
    IF remaining_tables > 0 THEN
        RAISE EXCEPTION '❌ Rollback incompleto: % tablas aún existen', remaining_tables;
    END IF;
    
    IF remaining_functions > 0 THEN
        RAISE EXCEPTION '❌ Rollback incompleto: % funciones aún existen', remaining_functions;
    END IF;
    
    RAISE NOTICE '✅ Rollback completado exitosamente';
    RAISE NOTICE '✅ Todas las tablas, funciones y configuraciones MTZ han sido eliminadas';
END
$$;

-- =====================================================================
-- 🎉 ROLLBACK COMPLETADO
-- =====================================================================

SELECT 
    '🎉 ROLLBACK COMPLETADO EXITOSAMENTE' as resultado,
    'Sistema MTZ Ouroborus AI v3.0 ha sido completamente desinstalado' as estado,
    NOW() as fecha_rollback;

-- ✅ ROLLBACK COMPLETO - SISTEMA MTZ ELIMINADO
