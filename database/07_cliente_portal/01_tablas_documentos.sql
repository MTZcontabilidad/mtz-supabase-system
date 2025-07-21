-- =====================================================
-- SCRIPT 1: CREACIÓN DE TABLAS PARA DOCUMENTOS TRIBUTARIOS
-- Sistema MTZ v3.0 - Portal de Clientes
-- =====================================================

-- Tabla para documentos tributarios (facturas, boletas, notas de crédito, etc.)
CREATE TABLE IF NOT EXISTS public.documentos_tributarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes_contables(id) ON DELETE CASCADE,
  tipo_documento VARCHAR(50) NOT NULL CHECK (tipo_documento IN ('factura', 'boleta', 'nota_credito', 'nota_debito', 'factura_exenta', 'factura_exportacion')),
  numero_documento VARCHAR(50) NOT NULL,
  fecha_emision DATE NOT NULL,
  fecha_vencimiento DATE,
  rut_emisor VARCHAR(20),
  nombre_emisor VARCHAR(200),
  monto_neto DECIMAL(15,2) NOT NULL DEFAULT 0,
  monto_iva DECIMAL(15,2) NOT NULL DEFAULT 0,
  monto_otros_impuestos DECIMAL(15,2) DEFAULT 0,
  monto_total DECIMAL(15,2) NOT NULL DEFAULT 0,
  moneda VARCHAR(3) DEFAULT 'CLP',
  tipo_cambio DECIMAL(10,4) DEFAULT 1,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'vencido', 'anulado', 'procesado')),
  forma_pago VARCHAR(50),
  observaciones TEXT,
  archivo_pdf TEXT, -- URL del documento PDF en Supabase Storage
  dte_xml TEXT, -- XML del DTE para documentos electrónicos
  folio_interno VARCHAR(50), -- Folio interno de la empresa
  centro_costo VARCHAR(100),
  proyecto VARCHAR(100),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  
  -- Índices para mejorar rendimiento
  CONSTRAINT documentos_numero_cliente_tipo_unique UNIQUE (numero_documento, cliente_id, tipo_documento)
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_documentos_cliente_fecha ON public.documentos_tributarios(cliente_id, fecha_emision DESC);
CREATE INDEX IF NOT EXISTS idx_documentos_estado ON public.documentos_tributarios(estado);
CREATE INDEX IF NOT EXISTS idx_documentos_tipo ON public.documentos_tributarios(tipo_documento);
CREATE INDEX IF NOT EXISTS idx_documentos_vencimiento ON public.documentos_tributarios(fecha_vencimiento) WHERE estado = 'pendiente';

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_documentos_tributarios_updated_at
    BEFORE UPDATE ON public.documentos_tributarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE public.documentos_tributarios IS 'Almacena todos los documentos tributarios de los clientes (facturas, boletas, notas de crédito, etc.)';
COMMENT ON COLUMN public.documentos_tributarios.tipo_documento IS 'Tipo de documento: factura, boleta, nota_credito, nota_debito, factura_exenta, factura_exportacion';
COMMENT ON COLUMN public.documentos_tributarios.estado IS 'Estado del documento: pendiente, pagado, vencido, anulado, procesado';
COMMENT ON COLUMN public.documentos_tributarios.archivo_pdf IS 'URL del archivo PDF almacenado en Supabase Storage';
COMMENT ON COLUMN public.documentos_tributarios.dte_xml IS 'XML del Documento Tributario Electrónico (DTE) para documentos electrónicos';

-- Habilitar RLS
ALTER TABLE public.documentos_tributarios ENABLE ROW LEVEL SECURITY;

-- Política para administradores (acceso completo)
CREATE POLICY "Administradores pueden gestionar todos los documentos" 
ON public.documentos_tributarios 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'administrador');

-- Política para colaboradores (pueden ver y modificar la mayoría)
CREATE POLICY "Colaboradores pueden gestionar documentos de sus clientes" 
ON public.documentos_tributarios 
FOR ALL 
USING (
  public.get_user_role(auth.uid()) = 'colaborador'
);

-- Política para clientes (solo pueden ver sus propios documentos)
CREATE POLICY "Clientes pueden ver solo sus documentos" 
ON public.documentos_tributarios 
FOR SELECT 
USING (
  public.get_user_role(auth.uid()) = 'cliente' 
  AND cliente_id IN (
    SELECT id FROM public.clientes_contables 
    WHERE empresa = (
      SELECT empresa FROM public.usuarios_sistema 
      WHERE user_id = auth.uid()
    )
  )
);

-- Política para usuarios externos (solo documentos asignados)
CREATE POLICY "Externos pueden ver documentos de sus asignaciones" 
ON public.documentos_tributarios 
FOR SELECT 
USING (
  public.get_user_role(auth.uid()) = 'externo' 
  AND cliente_id IN (
    SELECT cliente_id FROM public.asignaciones_trabajo 
    WHERE usuario_id = (
      SELECT id FROM public.usuarios_sistema 
      WHERE user_id = auth.uid()
    )
    AND activa = true
  )
);

-- ✅ SCRIPT COMPLETADO
-- Este script crea la tabla documentos_tributarios con todas las políticas de seguridad necesarias
-- Ejecutar en Supabase Dashboard > SQL Editor