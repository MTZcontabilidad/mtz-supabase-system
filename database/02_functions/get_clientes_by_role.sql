-- =====================================================================
-- 🏢 FUNCIÓN OBTENER CLIENTES SEGÚN ROL
-- Archivo: 02_functions/get_clientes_by_role.sql
-- Propósito: Retornar clientes que un usuario puede ver según su rol
-- Dependencias: public.usuarios_sistema, public.roles, public.clientes_contables, public.asignaciones_trabajo
-- =====================================================================

CREATE OR REPLACE FUNCTION public.get_clientes_by_role(user_id UUID)
RETURNS TABLE (
    id_cliente VARCHAR,
    razon_social VARCHAR,
    rut VARCHAR,
    total_facturado NUMERIC,
    estado VARCHAR,
    tipo_acceso TEXT -- 'completo', 'asignado', 'propio'
) AS $$
DECLARE
    user_role TEXT;
    user_empresa VARCHAR;
BEGIN
    -- Obtener rol y empresa asignada del usuario
    SELECT r.nombre, u.empresa_asignada 
    INTO user_role, user_empresa
    FROM public.usuarios_sistema u
    JOIN public.roles r ON u.rol_id = r.id
    WHERE u.id = user_id AND u.activo = true;
    
    -- Si no se encuentra el usuario, no retornar nada
    IF user_role IS NULL THEN
        RETURN;
    END IF;
    
    -- Según el rol, devolver diferentes clientes
    CASE user_role
        WHEN 'administrador', 'colaborador' THEN
            -- Administradores y colaboradores ven todos los clientes
            RETURN QUERY 
            SELECT 
                cc.id_cliente, 
                cc.razon_social, 
                cc.rut, 
                cc.total_facturado, 
                cc.estado,
                'completo'::TEXT as tipo_acceso
            FROM public.clientes_contables cc
            ORDER BY cc.total_facturado DESC NULLS LAST;
            
        WHEN 'externo' THEN
            -- Contadores externos solo ven clientes asignados
            RETURN QUERY
            SELECT 
                cc.id_cliente, 
                cc.razon_social, 
                cc.rut, 
                cc.total_facturado, 
                cc.estado,
                'asignado'::TEXT as tipo_acceso
            FROM public.clientes_contables cc
            INNER JOIN public.asignaciones_trabajo at ON cc.id_cliente = at.cliente_id
            WHERE at.usuario_externo_id = user_id
                AND at.estado IN ('pendiente', 'en_proceso')
            ORDER BY at.fecha_vencimiento ASC, cc.razon_social ASC;
            
        WHEN 'cliente' THEN
            -- Clientes solo ven su propia empresa
            IF user_empresa IS NOT NULL THEN
                RETURN QUERY
                SELECT 
                    cc.id_cliente, 
                    cc.razon_social, 
                    cc.rut, 
                    cc.total_facturado, 
                    cc.estado,
                    'propio'::TEXT as tipo_acceso
                FROM public.clientes_contables cc
                WHERE cc.id_cliente = user_empresa;
            END IF;
            
        ELSE
            -- Rol desconocido, no devolver nada
            RETURN;
    END CASE;
    
EXCEPTION
    WHEN OTHERS THEN
        -- En caso de error, no devolver nada por seguridad
        RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función auxiliar para contar clientes por rol
CREATE OR REPLACE FUNCTION public.count_clientes_by_role(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    cliente_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO cliente_count
    FROM public.get_clientes_by_role(user_id);
    
    RETURN COALESCE(cliente_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios para documentación
COMMENT ON FUNCTION public.get_clientes_by_role(UUID) IS 'Retorna clientes que un usuario puede ver según su rol (administrador=todos, externo=asignados, cliente=propio)';
COMMENT ON FUNCTION public.count_clientes_by_role(UUID) IS 'Cuenta la cantidad de clientes que un usuario puede ver según su rol';

-- Ejemplos de uso:
-- SELECT * FROM public.get_clientes_by_role('aa43bcf5-4eb9-46bb-8403-1028b83cbab9');
-- SELECT public.count_clientes_by_role('aa43bcf5-4eb9-46bb-8403-1028b83cbab9');

-- ✅ FUNCIONES DE CLIENTES POR ROL CREADAS EXITOSAMENTE
