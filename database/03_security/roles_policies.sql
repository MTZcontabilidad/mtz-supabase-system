-- =====================================================================
-- 🎭 POLÍTICAS RLS PARA TABLA ROLES
-- Archivo: 03_security/roles_policies.sql
-- Propósito: Configurar permisos granulares para tabla roles
-- Dependencias: public.roles, function get_user_role
-- =====================================================================

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Administradores pueden ver roles" ON public.roles;
DROP POLICY IF EXISTS "Administradores pueden modificar roles" ON public.roles;
DROP POLICY IF EXISTS "Todos pueden leer roles" ON public.roles;

-- POLÍTICA: Solo administradores pueden ver roles
CREATE POLICY "Administradores pueden ver roles" ON public.roles
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'administrador'
    );

-- POLÍTICA: Solo administradores pueden insertar roles
CREATE POLICY "Administradores pueden crear roles" ON public.roles
    FOR INSERT WITH CHECK (
        public.get_user_role(auth.uid()) = 'administrador'
    );

-- POLÍTICA: Solo administradores pueden actualizar roles
CREATE POLICY "Administradores pueden actualizar roles" ON public.roles
    FOR UPDATE USING (
        public.get_user_role(auth.uid()) = 'administrador'
    ) WITH CHECK (
        public.get_user_role(auth.uid()) = 'administrador'
    );

-- POLÍTICA: Solo administradores pueden eliminar roles
CREATE POLICY "Administradores pueden eliminar roles" ON public.roles
    FOR DELETE USING (
        public.get_user_role(auth.uid()) = 'administrador'
    );

-- POLÍTICA ESPECIAL: Permitir lectura de roles para funciones del sistema
-- (Necesario para que las funciones get_user_role funcionen correctamente)
CREATE POLICY "Sistema puede leer roles" ON public.roles
    FOR SELECT USING (true);

-- Comentarios para documentación
COMMENT ON POLICY "Administradores pueden ver roles" ON public.roles IS 'RLS: Solo administradores pueden consultar roles';
COMMENT ON POLICY "Administradores pueden crear roles" ON public.roles IS 'RLS: Solo administradores pueden crear nuevos roles';
COMMENT ON POLICY "Administradores pueden actualizar roles" ON public.roles IS 'RLS: Solo administradores pueden modificar roles existentes';
COMMENT ON POLICY "Administradores pueden eliminar roles" ON public.roles IS 'RLS: Solo administradores pueden eliminar roles';
COMMENT ON POLICY "Sistema puede leer roles" ON public.roles IS 'RLS: Permite a funciones del sistema leer roles para verificaciones';

-- ✅ POLÍTICAS RLS PARA ROLES CONFIGURADAS EXITOSAMENTE
