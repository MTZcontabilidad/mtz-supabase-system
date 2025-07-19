-- =====================================================================
-- 👤 TABLA DE USUARIOS DEL SISTEMA MTZ
-- Archivo: 01_schemas/usuarios.sql
-- Propósito: Extender auth.users con datos específicos de MTZ
-- Dependencias: auth.users, public.roles
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.usuarios_sistema (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre_completo VARCHAR(255),
    rol_id INTEGER REFERENCES public.roles(id),
    activo BOOLEAN DEFAULT true,
    empresa_asignada VARCHAR(10), -- Para clientes: ID de empresa que pueden ver
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadatos adicionales del usuario
    telefono VARCHAR(20),
    cargo VARCHAR(100),
    departamento VARCHAR(100),
    fecha_ultimo_acceso TIMESTAMPTZ,
    notas TEXT,
    
    -- Configuraciones personales
    preferencias JSONB DEFAULT '{}',
    timezone VARCHAR(50) DEFAULT 'America/Santiago'
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios_sistema(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON public.usuarios_sistema(rol_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON public.usuarios_sistema(activo);
CREATE INDEX IF NOT EXISTS idx_usuarios_empresa ON public.usuarios_sistema(empresa_asignada);

-- Comentarios para documentación
COMMENT ON TABLE public.usuarios_sistema IS 'Usuarios del sistema MTZ con roles y permisos específicos';
COMMENT ON COLUMN public.usuarios_sistema.empresa_asignada IS 'ID de cliente para usuarios tipo "cliente" - solo ven su empresa';
COMMENT ON COLUMN public.usuarios_sistema.preferencias IS 'Configuraciones personales del usuario en formato JSON';

-- ✅ TABLA USUARIOS SISTEMA CREADA EXITOSAMENTE
