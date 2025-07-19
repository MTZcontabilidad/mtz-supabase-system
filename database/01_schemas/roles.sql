-- =====================================================================
-- 🎭 TABLA DE ROLES DEL SISTEMA MTZ
-- Archivo: 01_schemas/roles.sql
-- Propósito: Definir tabla de roles con permisos JSONB
-- Dependencias: Ninguna
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    permisos JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_roles_nombre ON public.roles(nombre);
CREATE INDEX IF NOT EXISTS idx_roles_created_at ON public.roles(created_at);

-- Comentarios para documentación
COMMENT ON TABLE public.roles IS 'Roles del sistema MTZ con permisos granulares en formato JSONB';
COMMENT ON COLUMN public.roles.nombre IS 'Nombre único del rol (administrador, colaborador, externo, cliente)';
COMMENT ON COLUMN public.roles.permisos IS 'Permisos del rol en formato JSON con estructura: {"recurso": {"accion": boolean}}';

-- ✅ TABLA ROLES CREADA EXITOSAMENTE
