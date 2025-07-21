-- =====================================================================
-- 🏢 SISTEMA DE VENTAS Y COBRANZA MTZ
-- Archivo: 01_schemas/ventas_cobranza.sql
-- Propósito: Gestionar ventas de servicios contables y cobranzas
-- Dependencias: public.clientes_contables, public.usuarios_sistema
-- =====================================================================

-- =====================================================================
-- 📊 TABLA DE VENTAS (FACTURAS EMITIDAS)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.ventas (
    id SERIAL PRIMARY KEY,
    numero_factura VARCHAR(20) UNIQUE NOT NULL,
    cliente_id VARCHAR(10) REFERENCES public.clientes_contables(id_cliente) ON DELETE CASCADE,
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    monto_neto DECIMAL(15,2) NOT NULL,
    iva DECIMAL(15,2) DEFAULT 0,
    monto_total DECIMAL(15,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'Emitida', -- 'Emitida', 'Pagada', 'Vencida', 'Anulada'
    tipo_servicio VARCHAR(100) NOT NULL, -- 'Contabilidad', 'Tributario', 'Auditoría', 'Asesoría'
    descripcion TEXT,
    emitida_por_id UUID REFERENCES public.usuarios_sistema(id),
    fecha_pago DATE NULL,
    metodo_pago VARCHAR(50), -- 'Transferencia', 'Efectivo', 'Cheque', 'Otro'
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 💰 TABLA DE COBRANZAS (PAGOS PENDIENTES)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.cobranzas (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER REFERENCES public.ventas(id) ON DELETE CASCADE,
    cliente_id VARCHAR(10) REFERENCES public.clientes_contables(id_cliente) ON DELETE CASCADE,
    numero_factura VARCHAR(20),
    monto_pendiente DECIMAL(15,2) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente', -- 'Pendiente', 'Pagado', 'Vencido', 'Cancelado'
    prioridad VARCHAR(10) DEFAULT 'Media', -- 'Alta', 'Media', 'Baja'
    descripcion TEXT,
    recordatorios_enviados INTEGER DEFAULT 0,
    ultimo_recordatorio DATE,
    asignado_a_id UUID REFERENCES public.usuarios_sistema(id),
    fecha_pago DATE NULL,
    metodo_pago VARCHAR(50),
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 📈 TABLA DE SERVICIOS (CATÁLOGO DE SERVICIOS)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.servicios (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_base DECIMAL(15,2) NOT NULL,
    categoria VARCHAR(50) NOT NULL, -- 'Contabilidad', 'Tributario', 'Auditoría', 'Asesoría'
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 📋 TABLA DE DETALLES DE VENTA (ITEMS DE FACTURA)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.detalles_venta (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER REFERENCES public.ventas(id) ON DELETE CASCADE,
    servicio_id INTEGER REFERENCES public.servicios(id),
    descripcion TEXT NOT NULL,
    cantidad DECIMAL(10,2) DEFAULT 1,
    precio_unitario DECIMAL(15,2) NOT NULL,
    descuento DECIMAL(15,2) DEFAULT 0,
    subtotal DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 🔍 ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================================

-- Índices para ventas
CREATE INDEX IF NOT EXISTS idx_ventas_cliente ON public.ventas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha_emision ON public.ventas(fecha_emision);
CREATE INDEX IF NOT EXISTS idx_ventas_estado ON public.ventas(estado);
CREATE INDEX IF NOT EXISTS idx_ventas_numero_factura ON public.ventas(numero_factura);

-- Índices para cobranzas
CREATE INDEX IF NOT EXISTS idx_cobranzas_cliente ON public.cobranzas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cobranzas_venta ON public.cobranzas(venta_id);
CREATE INDEX IF NOT EXISTS idx_cobranzas_fecha_vencimiento ON public.cobranzas(fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_cobranzas_estado ON public.cobranzas(estado);
CREATE INDEX IF NOT EXISTS idx_cobranzas_asignado ON public.cobranzas(asignado_a_id);

-- Índices para servicios
CREATE INDEX IF NOT EXISTS idx_servicios_categoria ON public.servicios(categoria);
CREATE INDEX IF NOT EXISTS idx_servicios_activo ON public.servicios(activo);

-- Índices para detalles de venta
CREATE INDEX IF NOT EXISTS idx_detalles_venta_venta ON public.detalles_venta(venta_id);
CREATE INDEX IF NOT EXISTS idx_detalles_venta_servicio ON public.detalles_venta(servicio_id);

-- =====================================================================
-- 📝 COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================================

COMMENT ON TABLE public.ventas IS 'Facturas emitidas por servicios contables';
COMMENT ON TABLE public.cobranzas IS 'Pagos pendientes y gestión de cobranza';
COMMENT ON TABLE public.servicios IS 'Catálogo de servicios contables disponibles';
COMMENT ON TABLE public.detalles_venta IS 'Items detallados de cada factura';

-- ✅ TABLAS DE VENTAS Y COBRANZA CREADAS EXITOSAMENTE
