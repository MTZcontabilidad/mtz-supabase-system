-- =====================================================================
-- 🏢 TABLA DE CLIENTES CONTABLES MTZ
-- Archivo: 01_schemas/clientes_contables.sql
-- Propósito: Gestionar clientes contables y sus datos
-- Dependencias: public.empresas
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.clientes_contables (
    id_cliente VARCHAR(10) PRIMARY KEY,
    razon_social VARCHAR(255) NOT NULL,
    rut VARCHAR(20) UNIQUE NOT NULL,
    giro VARCHAR(255),
    direccion TEXT,
    comuna VARCHAR(100),
    ciudad VARCHAR(100),
    region VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(255),
    sitio_web VARCHAR(255),

    -- Datos contables
    regimen_tributario VARCHAR(50), -- 'General', 'Pyme', 'Exento'
    categoria_iva VARCHAR(20), -- 'Afecto', 'Exento', 'No Recuperable'
    inicio_actividades DATE,
    fecha_inscripcion DATE,

    -- Datos de contacto principal
    contacto_principal VARCHAR(255),
    cargo_contacto VARCHAR(100),
    telefono_contacto VARCHAR(20),
    email_contacto VARCHAR(255),

    -- Datos financieros
    total_facturado DECIMAL(15,2) DEFAULT 0,
    saldo_pendiente DECIMAL(15,2) DEFAULT 0,
    limite_credito DECIMAL(15,2) DEFAULT 0,

    -- Estado y clasificación
    estado VARCHAR(20) DEFAULT 'Activo', -- 'Activo', 'Inactivo', 'Suspendido', 'Eliminado'
    prioridad VARCHAR(10) DEFAULT 'Media', -- 'Alta', 'Media', 'Baja'
    categoria VARCHAR(50), -- 'Grande', 'Mediana', 'Pequeña', 'Micro'

    -- Asignaciones
    contador_asignado_id UUID REFERENCES public.usuarios_sistema(id),
    supervisor_asignado_id UUID REFERENCES public.usuarios_sistema(id),

    -- Metadatos
    notas TEXT,
    tags TEXT[], -- Array de etiquetas para clasificación
    preferencias JSONB DEFAULT '{}',

    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by_id UUID REFERENCES public.usuarios_sistema(id),
    updated_by_id UUID REFERENCES public.usuarios_sistema(id)
);

-- =====================================================================
-- 🔍 ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================================

-- Índices principales
CREATE INDEX IF NOT EXISTS idx_clientes_rut ON public.clientes_contables(rut);
CREATE INDEX IF NOT EXISTS idx_clientes_razon_social ON public.clientes_contables(razon_social);
CREATE INDEX IF NOT EXISTS idx_clientes_estado ON public.clientes_contables(estado);
CREATE INDEX IF NOT EXISTS idx_clientes_contador ON public.clientes_contables(contador_asignado_id);
CREATE INDEX IF NOT EXISTS idx_clientes_supervisor ON public.clientes_contables(supervisor_asignado_id);
CREATE INDEX IF NOT EXISTS idx_clientes_region ON public.clientes_contables(region);
CREATE INDEX IF NOT EXISTS idx_clientes_categoria ON public.clientes_contables(categoria);

-- Índices para búsquedas
CREATE INDEX IF NOT EXISTS idx_clientes_email ON public.clientes_contables(email);
CREATE INDEX IF NOT EXISTS idx_clientes_telefono ON public.clientes_contables(telefono);
CREATE INDEX IF NOT EXISTS idx_clientes_created_at ON public.clientes_contables(created_at);

-- =====================================================================
-- 📝 COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================================

COMMENT ON TABLE public.clientes_contables IS 'Clientes contables del sistema MTZ';
COMMENT ON COLUMN public.clientes_contables.id_cliente IS 'ID único del cliente (formato: CLI-XXXXX)';
COMMENT ON COLUMN public.clientes_contables.razon_social IS 'Nombre legal de la empresa';
COMMENT ON COLUMN public.clientes_contables.rut IS 'RUT de la empresa (formato: XX.XXX.XXX-X)';
COMMENT ON COLUMN public.clientes_contables.regimen_tributario IS 'Régimen tributario aplicable';
COMMENT ON COLUMN public.clientes_contables.categoria_iva IS 'Categoría de IVA del cliente';
COMMENT ON COLUMN public.clientes_contables.total_facturado IS 'Total facturado al cliente (histórico)';
COMMENT ON COLUMN public.clientes_contables.saldo_pendiente IS 'Saldo pendiente de cobro';
COMMENT ON COLUMN public.clientes_contables.tags IS 'Etiquetas para clasificación y búsqueda';

-- =====================================================================
-- 🔄 TRIGGER PARA ACTUALIZAR updated_at
-- =====================================================================

CREATE OR REPLACE FUNCTION update_clientes_contables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_clientes_contables_updated_at
    BEFORE UPDATE ON public.clientes_contables
    FOR EACH ROW
    EXECUTE FUNCTION update_clientes_contables_updated_at();

-- ✅ TABLA CLIENTES CONTABLES CREADA EXITOSAMENTE
