-- Migration: Create UUID-based tables for enhanced authentication system
-- Date: 2025-07-20
-- Description: Create new tables with UUID primary keys for proper auth integration

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;

-- Create empresas table with UUID
CREATE TABLE IF NOT EXISTS public.empresas_uuid (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    nombre TEXT NOT NULL,
    ruc TEXT UNIQUE NOT NULL,
    direccion TEXT,
    telefono TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roles table with UUID
CREATE TABLE IF NOT EXISTS public.roles_uuid (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    nombre TEXT NOT NULL,
    descripcion TEXT,
    permisos JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usuarios table with UUID (linking to auth.users)
CREATE TABLE IF NOT EXISTS public.usuarios_uuid (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    rol TEXT NOT NULL,
    empresa_id UUID REFERENCES public.empresas_uuid(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create asignaciones table with UUID
CREATE TABLE IF NOT EXISTS public.asignaciones_uuid (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    usuario_id UUID REFERENCES public.usuarios_uuid(id),
    empresa_id UUID REFERENCES public.empresas_uuid(id),
    rol_id UUID REFERENCES public.roles_uuid(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_usuarios_uuid_empresa ON public.usuarios_uuid(empresa_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_uuid_usuario ON public.asignaciones_uuid(usuario_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_uuid_empresa ON public.asignaciones_uuid(empresa_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_uuid_rol ON public.asignaciones_uuid(rol_id);

-- Enable Row Level Security on all tables
ALTER TABLE public.empresas_uuid ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles_uuid ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_uuid ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asignaciones_uuid ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to database roles
GRANT ALL ON public.empresas_uuid TO authenticated, service_role;
GRANT ALL ON public.roles_uuid TO authenticated, service_role;
GRANT ALL ON public.usuarios_uuid TO authenticated, service_role;
GRANT ALL ON public.asignaciones_uuid TO authenticated, service_role;

GRANT USAGE ON SCHEMA public TO authenticated, service_role;
