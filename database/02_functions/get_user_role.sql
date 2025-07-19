-- =====================================================================
-- 👤 FUNCIÓN OBTENER ROL DE USUARIO
-- Archivo: 02_functions/get_user_role.sql
-- Propósito: Obtener rol de un usuario por su UUID
-- Dependencias: public.usuarios_sistema, public.roles
-- =====================================================================

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Obtener rol del usuario activo
    SELECT r.nombre INTO user_role
    FROM public.usuarios_sistema u
    JOIN public.roles r ON u.rol_id = r.id
    WHERE u.id = user_id AND u.activo = true;
    
    -- Retornar rol o 'sin_rol' si no existe
    RETURN COALESCE(user_role, 'sin_rol');
    
EXCEPTION
    WHEN OTHERS THEN
        -- En caso de error, retornar estado de error
        RETURN 'error';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios para documentación
COMMENT ON FUNCTION public.get_user_role(UUID) IS 'Obtiene el rol de un usuario por su UUID. Retorna sin_rol si no existe o error en caso de excepción';

-- Ejemplo de uso:
-- SELECT public.get_user_role('aa43bcf5-4eb9-46bb-8403-1028b83cbab9');

-- ✅ FUNCIÓN GET_USER_ROLE CREADA EXITOSAMENTE
