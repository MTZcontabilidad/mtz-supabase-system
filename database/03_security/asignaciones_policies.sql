-- =====================================================================
-- 📋 POLÍTICAS RLS PARA TABLA ASIGNACIONES
-- Archivo: 03_security/asignaciones_policies.sql
-- Propósito: Configurar permisos granulares para tabla asignaciones_trabajo
-- Dependencias: public.asignaciones_trabajo, function get_user_role
-- =====================================================================

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Ver asignaciones según rol" ON public.asignaciones_trabajo;
DROP POLICY IF EXISTS "Admin y colaboradores gestionan asignaciones" ON public.asignaciones_trabajo;

-- POLÍTICA: Ver asignaciones según rol del usuario
CREATE POLICY "Ver asignaciones según rol" ON public.asignaciones_trabajo
    FOR SELECT USING (
        public.get_user_role(auth.uid()) IN ('administrador', 'colaborador')
        OR usuario_externo_id = auth.uid() -- Externos ven solo sus asignaciones
    );

-- POLÍTICA: Solo administradores y colaboradores pueden crear asignaciones
CREATE POLICY "Crear asignaciones según rol" ON public.asignaciones_trabajo
    FOR INSERT WITH CHECK (
        public.get_user_role(auth.uid()) IN ('administrador', 'colaborador')
    );

-- POLÍTICA: Actualizar asignaciones según rol
CREATE POLICY "Actualizar asignaciones según rol" ON public.asignaciones_trabajo
    FOR UPDATE USING (
        public.get_user_role(auth.uid()) IN ('administrador', 'colaborador')
        OR (usuario_externo_id = auth.uid() AND estado != 'completado') -- Externos pueden actualizar sus asignaciones activas
    ) WITH CHECK (
        public.get_user_role(auth.uid()) IN ('administrador', 'colaborador')
        OR usuario_externo_id = auth.uid()
    );

-- POLÍTICA: Solo administradores y colaboradores pueden eliminar asignaciones
CREATE POLICY "Eliminar asignaciones según rol" ON public.asignaciones_trabajo
    FOR DELETE USING (
        public.get_user_role(auth.uid()) IN ('administrador', 'colaborador')
    );

-- Comentarios para documentación
COMMENT ON POLICY "Ver asignaciones según rol" ON public.asignaciones_trabajo IS 'RLS: Admins/colaboradores ven todas, externos solo las suyas';
COMMENT ON POLICY "Crear asignaciones según rol" ON public.asignaciones_trabajo IS 'RLS: Solo administradores y colaboradores pueden crear asignaciones';
COMMENT ON POLICY "Actualizar asignaciones según rol" ON public.asignaciones_trabajo IS 'RLS: Admins/colaboradores actualizan todas, externos sus asignaciones activas';
COMMENT ON POLICY "Eliminar asignaciones según rol" ON public.asignaciones_trabajo IS 'RLS: Solo administradores y colaboradores pueden eliminar asignaciones';

-- ✅ POLÍTICAS RLS PARA ASIGNACIONES CONFIGURADAS EXITOSAMENTE
