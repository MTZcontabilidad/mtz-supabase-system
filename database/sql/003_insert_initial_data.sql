-- Migration: Insert initial data for UUID tables
-- Date: 2025-07-20
-- Description: Initial data for authentication system

-- Insert initial empresa
INSERT INTO public.empresas_uuid (nombre, ruc, email) 
VALUES ('MTZ Consultores', '12345678901', 'mtzcontabilidad@gmail.com') 
ON CONFLICT (ruc) DO NOTHING;

-- Insert initial roles
INSERT INTO public.roles_uuid (nombre, descripcion, permisos) 
VALUES 
    ('admin', 'Administrador del sistema', '{"full_access": true}'),
    ('gerente', 'Gerente de empresa', '{"view_company_data": true}'),
    ('usuario', 'Usuario estándar', '{"limited_access": true}') 
ON CONFLICT (nombre) DO NOTHING;

-- Insert admin user profile (linking to auth.users)
-- Note: This should be executed after the auth user exists
DO $$
DECLARE
    empresa_uuid UUID;
    admin_auth_id UUID;
BEGIN
    -- Get the empresa ID
    SELECT id INTO empresa_uuid FROM public.empresas_uuid WHERE nombre = 'MTZ Consultores';
    
    -- Try to get the auth user ID
    SELECT id INTO admin_auth_id FROM auth.users WHERE email = 'mtzcontabilidad@gmail.com';
    
    -- Insert user profile if auth user exists
    IF admin_auth_id IS NOT NULL AND empresa_uuid IS NOT NULL THEN
        INSERT INTO public.usuarios_uuid (id, email, nombre, apellido, rol, empresa_id) 
        VALUES (
            admin_auth_id, 
            'mtzcontabilidad@gmail.com', 
            'MTZ', 
            'Admin', 
            'admin', 
            empresa_uuid
        ) 
        ON CONFLICT (email) DO NOTHING;
    END IF;
END $$;
