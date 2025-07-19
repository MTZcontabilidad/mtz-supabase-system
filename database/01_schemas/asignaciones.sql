-- =====================================================================
-- 📋 TABLA DE ASIGNACIONES DE TRABAJO MTZ
-- Archivo: 01_schemas/asignaciones.sql
-- Propósito: Gestionar asignaciones de contadores externos a clientes
-- Dependencias: public.usuarios_sistema, public.clientes_contables
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.asignaciones_trabajo (
    id SERIAL PRIMARY KEY,
    usuario_externo_id UUID REFERENCES public.usuarios_sistema(id) ON DELETE CASCADE,
    cliente_id VARCHAR(10) REFERENCES public.clientes_contables(id_cliente) ON DELETE CASCADE,
    tipo_trabajo VARCHAR(50) NOT NULL, -- 'contabilidad', 'tributario', 'auditoria', 'nomina'
    descripcion TEXT,
    fecha_asignacion TIMESTAMPTZ DEFAULT NOW(),
    fecha_vencimiento DATE,
    estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'en_proceso', 'completado', 'cancelado'
    prioridad VARCHAR(10) DEFAULT 'media', -- 'alta', 'media', 'baja'
    asignado_por_id UUID REFERENCES public.usuarios_sistema(id),
    completado_en TIMESTAMPTZ NULL,
    notas_internas TEXT,
    
    -- Constraint para evitar asignaciones duplicadas
    UNIQUE(usuario_externo_id, cliente_id, tipo_trabajo)
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_asignaciones_usuario ON public.asignaciones_trabajo(usuario_externo_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_cliente ON public.asignaciones_trabajo(cliente_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_estado ON public.asignaciones_trabajo(estado);
CREATE INDEX IF NOT EXISTS idx_asignaciones_tipo ON public.asignaciones_trabajo(tipo_trabajo);
CREATE INDEX IF NOT EXISTS idx_asignaciones_vencimiento ON public.asignaciones_trabajo(fecha_vencimiento);

-- Comentarios para documentación
COMMENT ON TABLE public.asignaciones_trabajo IS 'Asignaciones de trabajo para contadores externos';
COMMENT ON COLUMN public.asignaciones_trabajo.tipo_trabajo IS 'Tipo de trabajo asignado: contabilidad, tributario, auditoria, nomina';
COMMENT ON COLUMN public.asignaciones_trabajo.estado IS 'Estado actual: pendiente, en_proceso, completado, cancelado';

-- ✅ TABLA ASIGNACIONES CREADA EXITOSAMENTE
