-- ===================================================================
-- CONFIGURAR ROW LEVEL SECURITY (RLS) Y POLÍTICAS
-- Ejecutar DESPUÉS de crear tablas y roles
-- ===================================================================

-- 1. Habilitar RLS en tablas críticas
ALTER TABLE public.clientes_contables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asignaciones_trabajo ENABLE ROW LEVEL SECURITY;

-- 2. Políticas RLS para clientes_contables

-- Administradores y colaboradores ven todos los clientes
CREATE POLICY "admin_colaborador_full_access" ON public.clientes_contables
    FOR ALL USING (
        public.get_user_role(auth.uid()) IN ('administrador', 'colaborador')
    );

-- Clientes solo ven su empresa asignada
CREATE POLICY "cliente_solo_su_empresa" ON public.clientes_contables
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'cliente' 
        AND id_cliente = (
            SELECT empresa_asignada 
            FROM public.usuarios_sistema 
            WHERE id = auth.uid()
        )
    );

-- Externos solo ven clientes asignados específicamente
CREATE POLICY "externo_solo_asignados" ON public.clientes_contables
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'externo' 
        AND id_cliente IN (
            SELECT cliente_id 
            FROM public.asignaciones_trabajo 
            WHERE usuario_externo_id = auth.uid() AND estado = 'en_proceso'
        )
    );

-- 3. Políticas RLS para usuarios_sistema

-- Solo administradores pueden ver/gestionar todos los usuarios
CREATE POLICY "admin_manage_users" ON public.usuarios_sistema
    FOR ALL USING (
        public.get_user_role(auth.uid()) = 'administrador'
    );

-- Colaboradores pueden ver usuarios pero no editarlos
CREATE POLICY "colaborador_view_users" ON public.usuarios_sistema
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'colaborador'
    );

-- Usuarios pueden ver solo su propio perfil
CREATE POLICY "users_own_profile" ON public.usuarios_sistema
    FOR SELECT USING (
        id = auth.uid()
    );

-- Usuarios pueden actualizar solo su propio perfil (campos limitados)
CREATE POLICY "users_update_own_profile" ON public.usuarios_sistema
    FOR UPDATE USING (
        id = auth.uid()
    ) WITH CHECK (
        id = auth.uid() 
        AND rol_id = OLD.rol_id -- No pueden cambiar su propio rol
        AND activo = OLD.activo -- No pueden desactivarse
    );

-- 4. Políticas RLS para asignaciones_trabajo

-- Administradores y colaboradores ven todas las asignaciones
CREATE POLICY "admin_colaborador_all_assignments" ON public.asignaciones_trabajo
    FOR ALL USING (
        public.get_user_role(auth.uid()) IN ('administrador', 'colaborador')
    );

-- Externos solo ven sus propias asignaciones
CREATE POLICY "externo_own_assignments" ON public.asignaciones_trabajo
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'externo' 
        AND usuario_externo_id = auth.uid()
    );

-- Externos pueden actualizar estado de sus asignaciones
CREATE POLICY "externo_update_own_assignments" ON public.asignaciones_trabajo
    FOR UPDATE USING (
        public.get_user_role(auth.uid()) = 'externo' 
        AND usuario_externo_id = auth.uid()
    ) WITH CHECK (
        usuario_externo_id = auth.uid()
        AND usuario_externo_id = OLD.usuario_externo_id -- No pueden reasignarse
        AND cliente_id = OLD.cliente_id -- No pueden cambiar cliente
    );

-- 5. Crear vista para dashboard con datos seguros
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT 
    (CASE 
        WHEN public.get_user_role(auth.uid()) IN ('administrador', 'colaborador') THEN 
            (SELECT COUNT(*) FROM public.clientes_contables)
        WHEN public.get_user_role(auth.uid()) = 'cliente' THEN 1
        WHEN public.get_user_role(auth.uid()) = 'externo' THEN 
            (SELECT COUNT(DISTINCT cliente_id) FROM public.asignaciones_trabajo WHERE usuario_externo_id = auth.uid())
        ELSE 0
    END) as total_clientes,
    
    (CASE 
        WHEN public.get_user_role(auth.uid()) IN ('administrador', 'colaborador') THEN 
            (SELECT COALESCE(SUM(total_facturado), 0) FROM public.clientes_contables)
        WHEN public.get_user_role(auth.uid()) = 'cliente' THEN 
            (SELECT COALESCE(SUM(total_facturado), 0) FROM public.clientes_contables 
             WHERE id_cliente = (SELECT empresa_asignada FROM public.usuarios_sistema WHERE id = auth.uid()))
        ELSE 0
    END) as facturacion_total,
    
    (CASE 
        WHEN public.get_user_role(auth.uid()) IN ('administrador', 'colaborador') THEN 
            (SELECT COUNT(*) FROM public.clientes_contables WHERE estado = 'Activo')
        WHEN public.get_user_role(auth.uid()) = 'cliente' THEN 
            (SELECT COUNT(*) FROM public.clientes_contables 
             WHERE estado = 'Activo' AND id_cliente = (SELECT empresa_asignada FROM public.usuarios_sistema WHERE id = auth.uid()))
        ELSE 0
    END) as clientes_activos,
    
    public.get_user_role(auth.uid()) as user_role;

-- Permitir acceso a la vista
ALTER VIEW public.dashboard_stats OWNER TO postgres;
GRANT SELECT ON public.dashboard_stats TO authenticated;

-- 6. Función para obtener clientes según rol
CREATE OR REPLACE FUNCTION public.get_clientes_by_role()
RETURNS TABLE (
    id integer,
    id_cliente varchar,
    razon_social varchar,
    rut varchar,
    tipo_empresa varchar,
    estado varchar,
    total_facturado numeric,
    email varchar,
    telefono varchar,
    user_can_edit boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.id_cliente,
        c.razon_social,
        c.rut,
        c.tipo_empresa,
        c.estado,
        c.total_facturado,
        c.email,
        c.telefono,
        (public.get_user_role(auth.uid()) IN ('administrador', 'colaborador')) as user_can_edit
    FROM public.clientes_contables c
    WHERE 
        CASE 
            WHEN public.get_user_role(auth.uid()) IN ('administrador', 'colaborador') THEN true
            WHEN public.get_user_role(auth.uid()) = 'cliente' THEN 
                c.id_cliente = (SELECT empresa_asignada FROM public.usuarios_sistema WHERE id = auth.uid())
            WHEN public.get_user_role(auth.uid()) = 'externo' THEN 
                c.id_cliente IN (SELECT cliente_id FROM public.asignaciones_trabajo WHERE usuario_externo_id = auth.uid())
            ELSE false
        END
    ORDER BY c.total_facturado DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Grants necesarios
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.roles TO authenticated;
GRANT ALL ON public.usuarios_sistema TO authenticated;
GRANT ALL ON public.clientes_contables TO authenticated;
GRANT ALL ON public.asignaciones_trabajo TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_permission(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_clientes_by_role() TO authenticated;