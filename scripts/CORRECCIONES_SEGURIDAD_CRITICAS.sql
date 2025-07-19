-- =====================================================================
-- 🔐 CORRECCIONES DE SEGURIDAD CRÍTICAS - MTZ SISTEMA
-- Detectado por MCP Supabase Security Advisor - 17 Julio 2025
-- EJECUTAR INMEDIATAMENTE en Supabase SQL Editor con role service_role
-- =====================================================================

-- =====================================================================
-- 1. HABILITAR ROW LEVEL SECURITY (RLS) EN TABLAS CRÍTICAS
-- =====================================================================

-- Habilitar RLS en usuarios_sistema
ALTER TABLE public.usuarios_sistema ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en roles
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en asignaciones_trabajo
ALTER TABLE public.asignaciones_trabajo ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- 2. CREAR POLÍTICAS RLS GRANULARES
-- =====================================================================

-- Políticas para usuarios_sistema
CREATE POLICY "users_can_view_own_profile" ON public.usuarios_sistema
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile" ON public.usuarios_sistema
    FOR UPDATE USING (auth.uid() = id);

-- Solo administradores pueden ver todos los usuarios
CREATE POLICY "admins_can_view_all_users" ON public.usuarios_sistema
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuarios_sistema u
            JOIN public.roles r ON u.rol_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'administrador'
        )
    );

-- Solo administradores pueden crear usuarios
CREATE POLICY "admins_can_create_users" ON public.usuarios_sistema
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.usuarios_sistema u
            JOIN public.roles r ON u.rol_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'administrador'
        )
    );

-- Políticas para roles
CREATE POLICY "authenticated_can_view_roles" ON public.roles
    FOR SELECT TO authenticated USING (true);

-- Solo administradores pueden modificar roles
CREATE POLICY "admins_can_modify_roles" ON public.roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.usuarios_sistema u
            JOIN public.roles r ON u.rol_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'administrador'
        )
    );

-- Políticas para asignaciones_trabajo
CREATE POLICY "users_can_view_own_assignments" ON public.asignaciones_trabajo
    FOR SELECT USING (
        auth.uid() = usuario_externo_id OR 
        auth.uid() = asignado_por_id OR
        EXISTS (
            SELECT 1 FROM public.usuarios_sistema u
            JOIN public.roles r ON u.rol_id = r.id
            WHERE u.id = auth.uid() AND r.nombre IN ('administrador', 'colaborador')
        )
    );

CREATE POLICY "authorized_can_create_assignments" ON public.asignaciones_trabajo
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.usuarios_sistema u
            JOIN public.roles r ON u.rol_id = r.id
            WHERE u.id = auth.uid() AND r.nombre IN ('administrador', 'colaborador')
        )
    );

-- =====================================================================
-- 3. CORREGIR SEARCH_PATH EN FUNCIONES VULNERABLES
-- =====================================================================

-- Corregir función get_user_role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT r.nombre INTO user_role
    FROM public.usuarios_sistema u
    JOIN public.roles r ON u.rol_id = r.id
    WHERE u.id = user_id AND u.activo = true;
    
    RETURN COALESCE(user_role, 'sin_rol');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Corregir función user_has_permission
CREATE OR REPLACE FUNCTION public.user_has_permission(
    user_id UUID, 
    resource TEXT, 
    action TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    user_permissions JSONB;
BEGIN
    SELECT r.permisos INTO user_permissions
    FROM public.usuarios_sistema u
    JOIN public.roles r ON u.rol_id = r.id
    WHERE u.id = user_id AND u.activo = true;
    
    IF user_permissions IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN COALESCE(
        (user_permissions -> resource ->> action)::boolean, 
        false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Corregir función handle_new_user (si existe)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.usuarios_sistema (id, email, nombre_completo)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================================
-- 4. CREAR FUNCIONES DE AUDITORÍA Y LOGGING
-- =====================================================================

-- Función para logging de acciones (temporal hasta crear tabla audit_logs)
CREATE OR REPLACE FUNCTION public.log_security_event(
    event_type TEXT,
    details JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
    -- Log temporal en el sistema de logs de PostgreSQL
    RAISE NOTICE 'SECURITY_EVENT: % by user % - %', 
        event_type, 
        auth.uid(), 
        details;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================================
-- 5. CREAR TRIGGER PARA AUDITORÍA AUTOMÁTICA
-- =====================================================================

-- Trigger para log de cambios en usuarios_sistema
CREATE OR REPLACE FUNCTION public.audit_usuarios_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM public.log_security_event('user_created', 
            jsonb_build_object('user_id', NEW.id, 'email', NEW.email));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM public.log_security_event('user_updated', 
            jsonb_build_object('user_id', NEW.id, 'changes', 
                jsonb_build_object('old_activo', OLD.activo, 'new_activo', NEW.activo)));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM public.log_security_event('user_deleted', 
            jsonb_build_object('user_id', OLD.id, 'email', OLD.email));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Crear trigger
DROP TRIGGER IF EXISTS audit_usuarios_trigger ON public.usuarios_sistema;
CREATE TRIGGER audit_usuarios_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.usuarios_sistema
    FOR EACH ROW EXECUTE FUNCTION public.audit_usuarios_changes();

-- =====================================================================
-- 6. VALIDACIONES ADICIONALES DE SEGURIDAD
-- =====================================================================

-- Función para validar permisos críticos
CREATE OR REPLACE FUNCTION public.validate_critical_operation(operation_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    user_role := public.get_user_role(auth.uid());
    
    -- Operaciones que requieren rol administrador
    IF operation_type IN ('delete_user', 'modify_roles', 'system_config') THEN
        IF user_role != 'administrador' THEN
            RAISE EXCEPTION 'UNAUTHORIZED: Operation % requires administrator role', operation_type;
        END IF;
    END IF;
    
    -- Log de la validación
    PERFORM public.log_security_event('permission_check', 
        jsonb_build_object('operation', operation_type, 'user_role', user_role, 'result', 'granted'));
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================================
-- 7. GRANTS Y PERMISOS FINALES
-- =====================================================================

-- Asegurar que authenticated puede ejecutar las funciones de seguridad
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_permission(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_critical_operation(TEXT) TO authenticated;

-- =====================================================================
-- ✅ RESUMEN DE CORRECCIONES APLICADAS
-- =====================================================================

/*
🔒 SEGURIDAD MEJORADA:
✅ RLS habilitado en todas las tablas críticas
✅ Políticas granulares por rol implementadas
✅ Search_path fijo en funciones de seguridad
✅ Sistema de auditoría y logging implementado
✅ Validaciones de permisos críticos
✅ Triggers automáticos para monitoreo

🚨 ACCIONES MANUALES REQUERIDAS EN SUPABASE DASHBOARD:
1. Auth > Settings > Enable MFA (TOTP + SMS)
2. Auth > Settings > Enable HaveIBeenPwned protection
3. Auth > Email Templates > Configurar templates personalizados
4. Project Settings > API > Revisar claves y permisos

📊 PRÓXIMOS PASOS:
1. Ejecutar este script completo en SQL Editor
2. Verificar que todas las políticas funcionan correctamente
3. Hacer pruebas de acceso con diferentes roles
4. Configurar alertas de seguridad en Dashboard
5. Documentar procedimientos de emergencia
*/