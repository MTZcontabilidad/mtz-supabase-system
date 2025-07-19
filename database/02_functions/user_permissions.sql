-- =====================================================================
-- 🔐 FUNCIÓN VERIFICAR PERMISOS DE USUARIO
-- Archivo: 02_functions/user_permissions.sql
-- Propósito: Verificar si un usuario tiene permiso para una acción específica
-- Dependencias: public.usuarios_sistema, public.roles
-- =====================================================================

CREATE OR REPLACE FUNCTION public.user_has_permission(
    user_id UUID, 
    resource TEXT, 
    action TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    user_permissions JSONB;
    permission_value BOOLEAN;
BEGIN
    -- Obtener permisos del rol del usuario
    SELECT r.permisos INTO user_permissions
    FROM public.usuarios_sistema u
    JOIN public.roles r ON u.rol_id = r.id
    WHERE u.id = user_id AND u.activo = true;
    
    -- Si no hay permisos, denegar acceso
    IF user_permissions IS NULL THEN
        RETURN false;
    END IF;
    
    -- Extraer permiso específico del JSON
    permission_value := (user_permissions -> resource ->> action)::boolean;
    
    -- Retornar permiso (false si no existe el permiso)
    RETURN COALESCE(permission_value, false);
    
EXCEPTION
    WHEN OTHERS THEN
        -- En caso de error, denegar acceso por seguridad
        RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función auxiliar para verificar múltiples permisos
CREATE OR REPLACE FUNCTION public.user_has_any_permission(
    user_id UUID,
    permissions JSONB -- Formato: {"resource1": ["action1", "action2"], "resource2": ["action3"]}
)
RETURNS BOOLEAN AS $$
DECLARE
    resource_key TEXT;
    actions JSONB;
    action_item TEXT;
BEGIN
    -- Iterar sobre cada recurso
    FOR resource_key IN SELECT jsonb_object_keys(permissions)
    LOOP
        actions := permissions -> resource_key;
        
        -- Iterar sobre cada acción del recurso
        FOR action_item IN SELECT jsonb_array_elements_text(actions)
        LOOP
            -- Si tiene al menos un permiso, retornar true
            IF public.user_has_permission(user_id, resource_key, action_item) THEN
                RETURN true;
            END IF;
        END LOOP;
    END LOOP;
    
    -- Si no tiene ningún permiso, retornar false
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios para documentación
COMMENT ON FUNCTION public.user_has_permission(UUID, TEXT, TEXT) IS 'Verifica si un usuario tiene un permiso específico para un recurso y acción';
COMMENT ON FUNCTION public.user_has_any_permission(UUID, JSONB) IS 'Verifica si un usuario tiene al menos uno de los permisos especificados';

-- Ejemplos de uso:
-- SELECT public.user_has_permission('uuid', 'clientes', 'read');
-- SELECT public.user_has_any_permission('uuid', '{"clientes": ["read", "write"], "reportes": ["read"]}');

-- ✅ FUNCIONES DE PERMISOS CREADAS EXITOSAMENTE
