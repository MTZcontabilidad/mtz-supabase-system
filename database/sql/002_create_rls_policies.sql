-- Migration: Create RLS policies for UUID tables
-- Date: 2025-07-20
-- Description: Row Level Security policies for authentication system

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role_uuid() 
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$ 
DECLARE 
    user_role TEXT; 
BEGIN 
    SELECT rol INTO user_role FROM public.usuarios_uuid WHERE id = auth.uid(); 
    RETURN COALESCE(user_role, 'anonymous'); 
END; 
$$;

-- Function to get user's company
CREATE OR REPLACE FUNCTION public.get_user_company_uuid() 
RETURNS UUID 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$ 
DECLARE 
    user_company UUID; 
BEGIN 
    SELECT empresa_id INTO user_company FROM public.usuarios_uuid WHERE id = auth.uid(); 
    RETURN user_company; 
END; 
$$;

-- Function to check user permissions
CREATE OR REPLACE FUNCTION public.check_user_permissions_uuid(
    p_action TEXT, 
    p_resource TEXT
) 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$ 
DECLARE 
    user_role TEXT; 
    user_perms JSONB; 
BEGIN 
    -- Get user role and permissions
    SELECT rol, (SELECT permisos FROM public.roles_uuid WHERE nombre = usuarios_uuid.rol) 
    INTO user_role, user_perms 
    FROM public.usuarios_uuid 
    WHERE id = auth.uid(); 
    
    -- Admin always has full access
    IF user_role = 'admin' THEN 
        RETURN true; 
    END IF; 
    
    -- Check specific permissions based on role and action
    RETURN COALESCE(
        (user_perms->>(p_resource || '_' || p_action))::boolean, 
        false
    ); 
END; 
$$;

-- RLS Policy for empresas_uuid
CREATE POLICY "Admins can manage all empresas_uuid" ON public.empresas_uuid 
FOR ALL USING ( 
    (SELECT get_user_role_uuid()) = 'admin' 
);

CREATE POLICY "Users can view their company_uuid" ON public.empresas_uuid 
FOR SELECT USING ( 
    EXISTS ( 
        SELECT 1 FROM public.usuarios_uuid u 
        JOIN public.asignaciones_uuid a ON u.id = a.usuario_id 
        WHERE u.id = auth.uid() AND a.empresa_id = empresas_uuid.id 
    ) 
);

-- RLS Policy for usuarios_uuid
CREATE POLICY "Admins can manage all usuarios_uuid" ON public.usuarios_uuid 
FOR ALL USING ( 
    (SELECT get_user_role_uuid()) = 'admin' 
);

CREATE POLICY "Users can view usuarios_uuid in their company" ON public.usuarios_uuid 
FOR SELECT USING ( 
    EXISTS ( 
        SELECT 1 FROM public.asignaciones_uuid a 
        WHERE a.usuario_id = usuarios_uuid.id 
        AND a.empresa_id = (SELECT get_user_company_uuid()) 
    ) 
);

-- RLS Policy for roles_uuid
CREATE POLICY "Admins can manage roles_uuid" ON public.roles_uuid 
FOR ALL USING ( 
    (SELECT get_user_role_uuid()) = 'admin' 
);

-- RLS Policy for asignaciones_uuid
CREATE POLICY "Admins can manage asignaciones_uuid" ON public.asignaciones_uuid 
FOR ALL USING ( 
    (SELECT get_user_role_uuid()) = 'admin' 
);

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.get_user_role_uuid() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_user_company_uuid() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_user_permissions_uuid(TEXT, TEXT) TO authenticated, service_role;
