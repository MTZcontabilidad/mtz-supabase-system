-- =====================================================
-- SISTEMA DE AUTENTICACION UUID - MTZ CONSULTORES
-- =====================================================
-- Fecha: 2025-07-20
-- Descripción: Sistema completo de autenticación con UUID
-- Tablas: empresas_uuid, roles_uuid, usuarios_uuid, asignaciones_uuid
-- =====================================================

-- 1. HABILITAR EXTENSION UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;

-- 2. CREAR TABLAS PRINCIPALES
-- =====================================================

-- Tabla empresas_uuid
CREATE TABLE IF NOT EXISTS public.empresas_uuid (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    nombre TEXT NOT NULL,
    ruc TEXT UNIQUE NOT NULL,
    direccion TEXT,
    telefono TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla roles_uuid
CREATE TABLE IF NOT EXISTS public.roles_uuid (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT,
    permisos JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla usuarios_uuid (vinculada a auth.users)
CREATE TABLE IF NOT EXISTS public.usuarios_uuid (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    rol TEXT NOT NULL DEFAULT 'usuario',
    empresa_id UUID REFERENCES public.empresas_uuid(id),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla asignaciones_uuid
CREATE TABLE IF NOT EXISTS public.asignaciones_uuid (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    usuario_id UUID REFERENCES public.usuarios_uuid(id) ON DELETE CASCADE,
    empresa_id UUID REFERENCES public.empresas_uuid(id) ON DELETE CASCADE,
    rol_id UUID REFERENCES public.roles_uuid(id) ON DELETE CASCADE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, empresa_id, rol_id)
);

-- 3. CREAR ÍNDICES PARA RENDIMIENTO
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_usuarios_uuid_empresa ON public.usuarios_uuid(empresa_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_uuid_auth_user ON public.usuarios_uuid(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_uuid_usuario ON public.asignaciones_uuid(usuario_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_uuid_empresa ON public.asignaciones_uuid(empresa_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_uuid_rol ON public.asignaciones_uuid(rol_id);

-- 4. HABILITAR ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.empresas_uuid ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles_uuid ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_uuid ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asignaciones_uuid ENABLE ROW LEVEL SECURITY;

-- 5. CREAR FUNCIONES DE UTILIDAD
-- =====================================================

-- Función para obtener el rol del usuario
CREATE OR REPLACE FUNCTION public.get_user_role_uuid() 
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$ 
DECLARE 
    user_role TEXT; 
BEGIN 
    SELECT rol INTO user_role 
    FROM public.usuarios_uuid 
    WHERE auth_user_id = auth.uid(); 
    RETURN COALESCE(user_role, 'anonymous'); 
END; 
$$;

-- Función para obtener la empresa del usuario
CREATE OR REPLACE FUNCTION public.get_user_company_uuid() 
RETURNS UUID 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$ 
DECLARE 
    user_company UUID; 
BEGIN 
    SELECT empresa_id INTO user_company 
    FROM public.usuarios_uuid 
    WHERE auth_user_id = auth.uid(); 
    RETURN user_company; 
END; 
$$;

-- Función para verificar permisos
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
    -- Obtener rol y permisos del usuario
    SELECT u.rol, r.permisos 
    INTO user_role, user_perms 
    FROM public.usuarios_uuid u
    LEFT JOIN public.roles_uuid r ON r.nombre = u.rol
    WHERE u.auth_user_id = auth.uid(); 
    
    -- Admin siempre tiene acceso completo
    IF user_role = 'admin' OR user_perms->>'full_access' = 'true' THEN 
        RETURN true; 
    END IF; 
    
    -- Verificar permisos específicos
    RETURN COALESCE(
        (user_perms->>(p_resource || '_' || p_action))::boolean, 
        false
    ); 
END; 
$$;

-- 6. CREAR POLÍTICAS RLS
-- =====================================================

-- Políticas para empresas_uuid
CREATE POLICY "Admins can manage all empresas_uuid" ON public.empresas_uuid 
FOR ALL USING ( 
    public.get_user_role_uuid() = 'admin' 
);

CREATE POLICY "Users can view their company_uuid" ON public.empresas_uuid 
FOR SELECT USING ( 
    id = public.get_user_company_uuid()
);

-- Políticas para roles_uuid
CREATE POLICY "Everyone can view roles_uuid" ON public.roles_uuid 
FOR SELECT USING (true);

CREATE POLICY "Admins can manage roles_uuid" ON public.roles_uuid 
FOR ALL USING ( 
    public.get_user_role_uuid() = 'admin' 
);

-- Políticas para usuarios_uuid
CREATE POLICY "Users can view their own profile_uuid" ON public.usuarios_uuid 
FOR SELECT USING ( 
    auth_user_id = auth.uid() OR public.get_user_role_uuid() = 'admin'
);

CREATE POLICY "Users can update their own profile_uuid" ON public.usuarios_uuid 
FOR UPDATE USING ( 
    auth_user_id = auth.uid() 
) WITH CHECK (
    auth_user_id = auth.uid()
);

CREATE POLICY "Admins can manage all usuarios_uuid" ON public.usuarios_uuid 
FOR ALL USING ( 
    public.get_user_role_uuid() = 'admin' 
);

-- Políticas para asignaciones_uuid
CREATE POLICY "Users can view their asignaciones_uuid" ON public.asignaciones_uuid 
FOR SELECT USING ( 
    EXISTS (
        SELECT 1 FROM public.usuarios_uuid u 
        WHERE u.id = usuario_id AND u.auth_user_id = auth.uid()
    )
    OR public.get_user_role_uuid() = 'admin'
);

CREATE POLICY "Admins can manage asignaciones_uuid" ON public.asignaciones_uuid 
FOR ALL USING ( 
    public.get_user_role_uuid() = 'admin' 
);

-- 7. FUNCIÓN DE TRIGGER PARA CREACIÓN AUTOMÁTICA DE PERFILES
-- =====================================================
CREATE OR REPLACE FUNCTION public.create_user_profile_uuid() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$ 
DECLARE
    default_empresa_id UUID;
BEGIN 
    -- Obtener la empresa por defecto
    SELECT id INTO default_empresa_id 
    FROM public.empresas_uuid 
    WHERE nombre = 'MTZ Consultores' 
    LIMIT 1;
    
    -- Si no existe MTZ Consultores, tomar cualquier empresa
    IF default_empresa_id IS NULL THEN
        SELECT id INTO default_empresa_id 
        FROM public.empresas_uuid 
        LIMIT 1;
    END IF;
    
    -- Insertar perfil de usuario automáticamente
    INSERT INTO public.usuarios_uuid (
        id, 
        email, 
        nombre, 
        apellido, 
        rol, 
        empresa_id,
        auth_user_id
    ) 
    VALUES ( 
        extensions.uuid_generate_v4(),
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'nombre', 'Nuevo'), 
        COALESCE(NEW.raw_user_meta_data->>'apellido', 'Usuario'), 
        COALESCE(NEW.raw_user_meta_data->>'rol', 'usuario'), 
        default_empresa_id,
        NEW.id
    ) 
    ON CONFLICT (email) DO NOTHING; 
    
    RETURN NEW; 
END; 
$$;

-- Crear el trigger
DROP TRIGGER IF EXISTS on_auth_user_created_uuid ON auth.users;
CREATE TRIGGER on_auth_user_created_uuid 
    AFTER INSERT ON auth.users 
    FOR EACH ROW 
    EXECUTE FUNCTION public.create_user_profile_uuid();

-- 8. INSERTAR DATOS INICIALES
-- =====================================================

-- Insertar empresa inicial
INSERT INTO public.empresas_uuid (nombre, ruc, email) 
VALUES ('MTZ Consultores', '12345678901', 'mtzcontabilidad@gmail.com') 
ON CONFLICT (ruc) DO NOTHING;

-- Insertar roles iniciales
INSERT INTO public.roles_uuid (nombre, descripcion, permisos) 
VALUES 
    ('admin', 'Administrador del sistema', '{"full_access": true}'),
    ('gerente', 'Gerente de empresa', '{"view_company_data": true, "manage_users": true}'),
    ('contador', 'Contador autorizado', '{"view_company_data": true, "manage_documents": true}'),
    ('usuario', 'Usuario estándar', '{"limited_access": true}') 
ON CONFLICT (nombre) DO NOTHING;

-- 9. OTORGAR PERMISOS
-- =====================================================
GRANT ALL ON public.empresas_uuid TO authenticated, service_role;
GRANT ALL ON public.roles_uuid TO authenticated, service_role;
GRANT ALL ON public.usuarios_uuid TO authenticated, service_role;
GRANT ALL ON public.asignaciones_uuid TO authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.get_user_role_uuid() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_user_company_uuid() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_user_permissions_uuid(TEXT, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_user_profile_uuid() TO service_role;

-- =====================================================
-- SISTEMA UUID COMPLETADO
-- =====================================================
-- Las siguientes tablas han sido creadas:
-- - public.empresas_uuid
-- - public.roles_uuid  
-- - public.usuarios_uuid
-- - public.asignaciones_uuid
-- 
-- Funciones disponibles:
-- - public.get_user_role_uuid()
-- - public.get_user_company_uuid() 
-- - public.check_user_permissions_uuid(action, resource)
-- 
-- RLS habilitado y políticas configuradas
-- Trigger automático para creación de perfiles
-- =====================================================