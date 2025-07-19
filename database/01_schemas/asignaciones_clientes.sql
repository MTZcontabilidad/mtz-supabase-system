-- =====================================================================
-- 🏢 TABLA DE ASIGNACIONES DE CLIENTES A USUARIOS
-- Archivo: 01_schemas/asignaciones_clientes.sql
-- Propósito: Gestionar qué clientes puede ver cada usuario
-- Dependencias: public.usuarios_sistema, public.clientes_contables
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.asignaciones_clientes (
    id SERIAL PRIMARY KEY,
    usuario_id UUID REFERENCES public.usuarios_sistema(id) ON DELETE CASCADE,
    cliente_id VARCHAR(10) REFERENCES public.clientes_contables(id_cliente) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMPTZ DEFAULT NOW(),
    asignado_por_id UUID REFERENCES public.usuarios_sistema(id),
    activo BOOLEAN DEFAULT true,
    permisos_especiales JSONB DEFAULT '{}',
    notas TEXT,

    -- Constraint para evitar asignaciones duplicadas
    UNIQUE(usuario_id, cliente_id)
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_asignaciones_clientes_usuario ON public.asignaciones_clientes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_clientes_cliente ON public.asignaciones_clientes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_clientes_activo ON public.asignaciones_clientes(activo);

-- Comentarios para documentación
COMMENT ON TABLE public.asignaciones_clientes IS 'Asignaciones de clientes específicos a usuarios del sistema';
COMMENT ON COLUMN public.asignaciones_clientes.permisos_especiales IS 'Permisos específicos para este cliente: {"ver_facturas": true, "editar_datos": false}';

-- ✅ TABLA ASIGNACIONES CLIENTES CREADA EXITOSAMENTE
