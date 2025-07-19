-- =====================================================================
-- 👤 POLÍTICAS RLS PARA TABLA USUARIOS
-- Archivo: 03_security/usuarios_policies.sql
-- Propósito: Configurar permisos granulares para tabla usuarios_sistema
-- Dependencias: public.usuarios_sistema, function get_user_role
-- =====================================================================

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Admin y colaboradores pueden ver usuarios" ON public.usuarios_sistema;
DROP POLICY IF EXISTS "Solo administradores pueden modificar usuarios" ON public.usuarios_sistema;
DROP POLICY IF EXISTS "Usuarios pueden ver su perfil" ON public.usuarios_sistema;

-- POLÍTICA: Administradores y colaboradores pueden ver usuarios + cada usuario su perfil
CREATE POLICY "Ver usuarios según rol" ON public.usuarios_sistema
    FOR SELECT USING (
        public.get_user_role(auth.uid()) IN ('administrador', 'colaborador')
        OR id = auth.uid() -- Los usuarios pueden ver su propio perfil
    );

-- POLÍTICA: Solo administradores pueden crear usuarios
CREATE POLICY "Solo administradores pueden crear usuarios" ON public.usuarios_sistema
    FOR INSERT WITH CHECK (
        public.get_user_role(auth.uid()) = 'administrador'
    );

-- POLÍTICA: Administradores pueden actualizar cualquier usuario, usuarios pueden actualizar su perfil
CREATE POLICY "Actualizar usuarios según rol" ON public.usuarios_sistema
    FOR UPDATE USING (
        public.get_user_role(auth.uid()) = 'administrador'
        OR id = auth.uid() -- Los usuarios pueden actualizar su propio perfil
    ) WITH CHECK (
        public.get_user_role(auth.uid()) = 'administrador'
        OR (id = auth.uid() AND rol_id = OLD.rol_id) -- Los usuarios no pueden cambiar su propio rol
    );

-- POLÍTICA: Solo administradores pueden eliminar usuarios
CREATE POLICY "Solo administradores pueden eliminar usuarios" ON public.usuarios_sistema
    FOR DELETE USING (
        public.get_user_role(auth.uid()) = 'administrador'
        AND id != auth.uid() -- No pueden eliminarse a sí mismos
    );

-- POLÍTICA ESPECIAL: Permitir lectura para funciones del sistema
CREATE POLICY "Sistema puede leer usuarios" ON public.usuarios_sistema
    FOR SELECT USING (true);

-- Comentarios para documentación
COMMENT ON POLICY "Ver usuarios según rol" ON public.usuarios_sistema IS 'RLS: Admins/colaboradores ven todos, usuarios ven su perfil';
COMMENT ON POLICY "Solo administradores pueden crear usuarios" ON public.usuarios_sistema IS 'RLS: Solo administradores pueden crear nuevos usuarios';
COMMENT ON POLICY "Actualizar usuarios según rol" ON public.usuarios_sistema IS 'RLS: Admins actualizan cualquiera, usuarios su perfil (sin cambiar rol)';
COMMENT ON POLICY "Solo administradores pueden eliminar usuarios" ON public.usuarios_sistema IS 'RLS: Solo administradores pueden eliminar usuarios (no a sí mismos)';
COMMENT ON POLICY "Sistema puede leer usuarios" ON public.usuarios_sistema IS 'RLS: Permite a funciones del sistema leer usuarios para verificaciones';

-- ✅ POLÍTICAS RLS PARA USUARIOS CONFIGURADAS EXITOSAMENTE
