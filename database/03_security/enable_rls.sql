-- =====================================================================
-- 🔐 HABILITAR ROW LEVEL SECURITY (RLS)
-- Archivo: 03_security/enable_rls.sql
-- Propósito: Habilitar RLS en todas las tablas del sistema
-- Dependencias: Todas las tablas deben existir
-- =====================================================================

-- Habilitar RLS en tabla roles
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en tabla usuarios_sistema
ALTER TABLE public.usuarios_sistema ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en tabla asignaciones_trabajo
ALTER TABLE public.asignaciones_trabajo ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en tabla clientes_contables (si existe)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes_contables') THEN
        ALTER TABLE public.clientes_contables ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- Comentarios para documentación
COMMENT ON TABLE public.roles IS 'RLS HABILITADO: Solo administradores pueden gestionar roles';
COMMENT ON TABLE public.usuarios_sistema IS 'RLS HABILITADO: Acceso según rol y permisos del usuario';
COMMENT ON TABLE public.asignaciones_trabajo IS 'RLS HABILITADO: Cada usuario ve solo sus asignaciones';

-- ✅ ROW LEVEL SECURITY HABILITADO EN TODAS LAS TABLAS
