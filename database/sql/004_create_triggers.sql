-- Migration: Create trigger for user profile creation
-- Date: 2025-07-20
-- Description: Automatic user profile creation on signup

-- Trigger function to create user profile on signup
CREATE OR REPLACE FUNCTION public.create_user_profile_uuid() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$ 
DECLARE
    default_empresa_id UUID;
BEGIN 
    -- Get the default empresa (first one or MTZ Consultores)
    SELECT id INTO default_empresa_id 
    FROM public.empresas_uuid 
    WHERE nombre = 'MTZ Consultores' 
    LIMIT 1;
    
    -- If no MTZ Consultores, get any empresa
    IF default_empresa_id IS NULL THEN
        SELECT id INTO default_empresa_id 
        FROM public.empresas_uuid 
        LIMIT 1;
    END IF;
    
    -- Insert a new user profile when a new auth user is created
    INSERT INTO public.usuarios_uuid (id, email, nombre, apellido, rol, empresa_id) 
    VALUES ( 
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'nombre', 'Nuevo'), 
        COALESCE(NEW.raw_user_meta_data->>'apellido', 'Usuario'), 
        COALESCE(NEW.raw_user_meta_data->>'rol', 'usuario'), 
        default_empresa_id
    ) 
    ON CONFLICT (email) DO NOTHING; 
    
    RETURN NEW; 
END; 
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created_uuid ON auth.users;
CREATE TRIGGER on_auth_user_created_uuid 
    AFTER INSERT ON auth.users 
    FOR EACH ROW 
    EXECUTE FUNCTION public.create_user_profile_uuid();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.create_user_profile_uuid() TO service_role;
