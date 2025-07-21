-- =====================================================
-- SCRIPT MAESTRO: IMPLEMENTACIÓN COMPLETA PORTAL DE CLIENTES
-- Sistema MTZ v3.0 - Portal de Clientes
-- =====================================================

-- ⚠️ IMPORTANTE: Ejecutar este script en Supabase Dashboard > SQL Editor
-- Este script implementa todas las funcionalidades del portal de clientes

-- ============================
-- INFORMACIÓN DEL SCRIPT
-- ============================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '🚀 INICIANDO IMPLEMENTACIÓN PORTAL MTZ';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Sistema: MTZ Ouroborus AI v3.0';
    RAISE NOTICE 'Módulo: Portal de Clientes';
    RAISE NOTICE 'Fecha: %', NOW();
    RAISE NOTICE 'Ejecutado por: %', current_user;
    RAISE NOTICE '========================================';
END $$;

-- ============================
-- PASO 1: CREAR TABLAS DE DOCUMENTOS TRIBUTARIOS
-- ============================

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
  archivo_pdf TEXT,
  dte_xml TEXT,
  folio_interno VARCHAR(50),
  centro_costo VARCHAR(100),
  proyecto VARCHAR(100),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  
  CONSTRAINT documentos_numero_cliente_tipo_unique UNIQUE (numero_documento, cliente_id, tipo_documento)
);

-- ============================
-- PASO 2: CREAR TABLAS DE DECLARACIONES Y CALENDARIO
-- ============================

-- Tabla para declaraciones tributarias
CREATE TABLE IF NOT EXISTS public.declaraciones_tributarias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes_contables(id) ON DELETE CASCADE,
  tipo_declaracion VARCHAR(50) NOT NULL CHECK (tipo_declaracion IN ('f29', 'f50', 'renta', 'iva', 'retencion', 'patente', 'municipal')),
  periodo_mes INTEGER CHECK (periodo_mes BETWEEN 1 AND 12),
  periodo_ano INTEGER NOT NULL CHECK (periodo_ano >= 2020),
  monto_base DECIMAL(15,2) DEFAULT 0,
  monto_impuesto DECIMAL(15,2) NOT NULL DEFAULT 0,
  monto_retencion DECIMAL(15,2) DEFAULT 0,
  monto_credito DECIMAL(15,2) DEFAULT 0,
  monto_diferencia DECIMAL(15,2) DEFAULT 0,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'borrador', 'presentada', 'pagada', 'vencida', 'rectificada')),
  fecha_vencimiento DATE NOT NULL,
  fecha_presentacion TIMESTAMP WITH TIME ZONE,
  fecha_pago TIMESTAMP WITH TIME ZONE,
  numero_operacion VARCHAR(100),
  observaciones TEXT,
  archivo_declaracion TEXT,
  archivo_comprobante_pago TEXT,
  rectificatoria BOOLEAN DEFAULT false,
  declaracion_original_id UUID REFERENCES public.declaraciones_tributarias(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Tabla para el calendario tributario nacional
CREATE TABLE IF NOT EXISTS public.calendario_tributario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_obligacion VARCHAR(50) NOT NULL,
  descripcion VARCHAR(300) NOT NULL,
  mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
  dia INTEGER NOT NULL CHECK (dia BETWEEN 1 AND 31),
  ultimo_digito_rut VARCHAR(10),
  año INTEGER,
  activo BOOLEAN DEFAULT true,
  color_hex VARCHAR(7) DEFAULT '#3B82F6',
  url_informacion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  
  CONSTRAINT unique_calendario_obligacion UNIQUE (tipo_obligacion, mes, dia, ultimo_digito_rut, año)
);

-- Tabla para eventos personalizados del cliente
CREATE TABLE IF NOT EXISTS public.eventos_cliente (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes_contables(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  fecha_evento DATE NOT NULL,
  fecha_recordatorio DATE,
  tipo_evento VARCHAR(50) DEFAULT 'personalizado' CHECK (tipo_evento IN ('declaracion', 'pago', 'reunion', 'vencimiento', 'personalizado')),
  prioridad VARCHAR(20) DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'critica')),
  completado BOOLEAN DEFAULT false,
  recordatorio_enviado BOOLEAN DEFAULT false,
  color_hex VARCHAR(7) DEFAULT '#10B981',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ============================
-- PASO 3: CREAR ÍNDICES PARA RENDIMIENTO
-- ============================

-- Índices para documentos tributarios
CREATE INDEX IF NOT EXISTS idx_documentos_cliente_fecha ON public.documentos_tributarios(cliente_id, fecha_emision DESC);
CREATE INDEX IF NOT EXISTS idx_documentos_estado ON public.documentos_tributarios(estado);
CREATE INDEX IF NOT EXISTS idx_documentos_tipo ON public.documentos_tributarios(tipo_documento);
CREATE INDEX IF NOT EXISTS idx_documentos_vencimiento ON public.documentos_tributarios(fecha_vencimiento) WHERE estado = 'pendiente';

-- Índices para declaraciones
CREATE INDEX IF NOT EXISTS idx_declaraciones_cliente_periodo ON public.declaraciones_tributarias(cliente_id, periodo_ano DESC, periodo_mes DESC);
CREATE INDEX IF NOT EXISTS idx_declaraciones_vencimiento ON public.declaraciones_tributarias(fecha_vencimiento) WHERE estado IN ('pendiente', 'borrador');
CREATE INDEX IF NOT EXISTS idx_declaraciones_tipo ON public.declaraciones_tributarias(tipo_declaracion);

-- Índices para eventos
CREATE INDEX IF NOT EXISTS idx_eventos_cliente_fecha ON public.eventos_cliente(cliente_id, fecha_evento DESC);
CREATE INDEX IF NOT EXISTS idx_eventos_recordatorio ON public.eventos_cliente(fecha_recordatorio) WHERE recordatorio_enviado = false;

-- ============================
-- PASO 4: CREAR TRIGGERS PARA UPDATED_AT
-- ============================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_documentos_tributarios_updated_at
    BEFORE UPDATE ON public.documentos_tributarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_declaraciones_tributarias_updated_at
    BEFORE UPDATE ON public.declaraciones_tributarias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_eventos_cliente_updated_at
    BEFORE UPDATE ON public.eventos_cliente
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================
-- PASO 5: HABILITAR ROW LEVEL SECURITY
-- ============================

ALTER TABLE public.documentos_tributarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.declaraciones_tributarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendario_tributario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos_cliente ENABLE ROW LEVEL SECURITY;

-- ============================
-- PASO 6: CREAR POLÍTICAS DE SEGURIDAD
-- ============================

-- Políticas para documentos tributarios
CREATE POLICY "Administradores pueden gestionar todos los documentos" 
ON public.documentos_tributarios FOR ALL 
USING (public.get_user_role(auth.uid()) = 'administrador');

CREATE POLICY "Colaboradores pueden gestionar documentos" 
ON public.documentos_tributarios FOR ALL 
USING (public.get_user_role(auth.uid()) = 'colaborador');

CREATE POLICY "Clientes pueden ver solo sus documentos" 
ON public.documentos_tributarios FOR SELECT 
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

-- Políticas para declaraciones tributarias
CREATE POLICY "Administradores pueden gestionar todas las declaraciones" 
ON public.declaraciones_tributarias FOR ALL 
USING (public.get_user_role(auth.uid()) = 'administrador');

CREATE POLICY "Colaboradores pueden gestionar declaraciones" 
ON public.declaraciones_tributarias FOR ALL 
USING (public.get_user_role(auth.uid()) = 'colaborador');

CREATE POLICY "Clientes pueden ver sus declaraciones" 
ON public.declaraciones_tributarias FOR SELECT 
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

-- Políticas para calendario tributario
CREATE POLICY "Usuarios autenticados pueden leer calendario tributario" 
ON public.calendario_tributario FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Solo administradores pueden gestionar calendario tributario" 
ON public.calendario_tributario FOR ALL 
USING (public.get_user_role(auth.uid()) = 'administrador');

-- Políticas para eventos de cliente
CREATE POLICY "Administradores pueden gestionar todos los eventos" 
ON public.eventos_cliente FOR ALL 
USING (public.get_user_role(auth.uid()) = 'administrador');

CREATE POLICY "Colaboradores pueden gestionar eventos" 
ON public.eventos_cliente FOR ALL 
USING (public.get_user_role(auth.uid()) = 'colaborador');

CREATE POLICY "Clientes pueden gestionar sus eventos" 
ON public.eventos_cliente FOR ALL 
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

-- ============================
-- PASO 7: CREAR FUNCIONES DE NEGOCIO
-- ============================

-- Función: Resumen financiero del cliente
CREATE OR REPLACE FUNCTION public.obtener_resumen_financiero_cliente(
  p_cliente_id UUID,
  p_fecha_inicio DATE DEFAULT DATE_TRUNC('year', CURRENT_DATE)::DATE,
  p_fecha_fin DATE DEFAULT CURRENT_DATE
) RETURNS JSON AS $$
DECLARE
  resultado JSON;
  cliente_info RECORD;
BEGIN
  SELECT empresa, rut INTO cliente_info
  FROM public.clientes_contables
  WHERE id = p_cliente_id;

  SELECT json_build_object(
    'cliente', json_build_object(
      'id', p_cliente_id,
      'empresa', cliente_info.empresa,
      'rut', cliente_info.rut
    ),
    'periodo', json_build_object(
      'fecha_inicio', p_fecha_inicio,
      'fecha_fin', p_fecha_fin
    ),
    'documentos', json_build_object(
      'total_facturas', COALESCE((
        SELECT COUNT(*) FROM public.documentos_tributarios 
        WHERE cliente_id = p_cliente_id 
        AND tipo_documento = 'factura'
        AND fecha_emision BETWEEN p_fecha_inicio AND p_fecha_fin
      ), 0),
      'monto_total_ventas', COALESCE((
        SELECT SUM(monto_total) FROM public.documentos_tributarios 
        WHERE cliente_id = p_cliente_id 
        AND tipo_documento IN ('factura', 'boleta', 'factura_exenta', 'factura_exportacion')
        AND fecha_emision BETWEEN p_fecha_inicio AND p_fecha_fin
        AND estado != 'anulado'
      ), 0),
      'documentos_pendientes', COALESCE((
        SELECT COUNT(*) FROM public.documentos_tributarios 
        WHERE cliente_id = p_cliente_id 
        AND estado = 'pendiente'
        AND fecha_emision BETWEEN p_fecha_inicio AND p_fecha_fin
      ), 0)
    ),
    'declaraciones', json_build_object(
      'pendientes', COALESCE((
        SELECT COUNT(*) FROM public.declaraciones_tributarias 
        WHERE cliente_id = p_cliente_id 
        AND estado = 'pendiente'
        AND fecha_vencimiento >= CURRENT_DATE
      ), 0),
      'vencidas', COALESCE((
        SELECT COUNT(*) FROM public.declaraciones_tributarias 
        WHERE cliente_id = p_cliente_id 
        AND estado IN ('pendiente', 'vencida')
        AND fecha_vencimiento < CURRENT_DATE
      ), 0)
    )
  ) INTO resultado;

  RETURN resultado;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: Próximos vencimientos
CREATE OR REPLACE FUNCTION public.obtener_proximos_vencimientos(
  p_cliente_id UUID,
  p_dias_adelante INTEGER DEFAULT 30
) RETURNS JSON AS $$
DECLARE
  resultado JSON;
BEGIN
  SELECT json_build_object(
    'declaraciones_vencen', COALESCE((
      SELECT json_agg(
        json_build_object(
          'id', id,
          'tipo', tipo_declaracion,
          'periodo', CASE 
            WHEN periodo_mes IS NOT NULL THEN periodo_mes || '/' || periodo_ano
            ELSE periodo_ano::TEXT
          END,
          'fecha_vencimiento', fecha_vencimiento,
          'monto_impuesto', monto_impuesto,
          'estado', estado,
          'dias_para_vencer', fecha_vencimiento - CURRENT_DATE
        ) ORDER BY fecha_vencimiento
      )
      FROM public.declaraciones_tributarias
      WHERE cliente_id = p_cliente_id
      AND estado IN ('pendiente', 'borrador')
      AND fecha_vencimiento BETWEEN CURRENT_DATE AND CURRENT_DATE + p_dias_adelante
    ), '[]'::json),
    'eventos_proximos', COALESCE((
      SELECT json_agg(
        json_build_object(
          'id', id,
          'titulo', titulo,
          'descripcion', descripcion,
          'fecha_evento', fecha_evento,
          'tipo_evento', tipo_evento,
          'prioridad', prioridad,
          'dias_para_evento', fecha_evento - CURRENT_DATE
        ) ORDER BY fecha_evento
      )
      FROM public.eventos_cliente
      WHERE cliente_id = p_cliente_id
      AND completado = false
      AND fecha_evento BETWEEN CURRENT_DATE AND CURRENT_DATE + p_dias_adelante
    ), '[]'::json)
  ) INTO resultado;

  RETURN resultado;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================
-- PASO 8: OTORGAR PERMISOS
-- ============================

GRANT EXECUTE ON FUNCTION public.obtener_resumen_financiero_cliente TO authenticated;
GRANT EXECUTE ON FUNCTION public.obtener_proximos_vencimientos TO authenticated;

-- ============================
-- PASO 9: INSERTAR DATOS DEL CALENDARIO TRIBUTARIO
-- ============================

INSERT INTO public.calendario_tributario (tipo_obligacion, descripcion, mes, dia, ultimo_digito_rut, color_hex) VALUES
-- IVA (F29) - según último dígito del RUT
('f29_iva', 'Vencimiento F29 - IVA', 2, 12, '1,2', '#EF4444'),
('f29_iva', 'Vencimiento F29 - IVA', 2, 13, '3,4', '#EF4444'),
('f29_iva', 'Vencimiento F29 - IVA', 2, 14, '5,6', '#EF4444'),
('f29_iva', 'Vencimiento F29 - IVA', 2, 15, '7,8', '#EF4444'),
('f29_iva', 'Vencimiento F29 - IVA', 2, 16, '9,0', '#EF4444'),

-- Retenciones (F50)
('f50_retencion', 'Vencimiento F50 - Retenciones', 1, 12, '1,2', '#F59E0B'),
('f50_retencion', 'Vencimiento F50 - Retenciones', 1, 13, '3,4', '#F59E0B'),
('f50_retencion', 'Vencimiento F50 - Retenciones', 1, 14, '5,6', '#F59E0B'),
('f50_retencion', 'Vencimiento F50 - Retenciones', 1, 15, '7,8', '#F59E0B'),
('f50_retencion', 'Vencimiento F50 - Retenciones', 1, 16, '9,0', '#F59E0B'),

-- Renta anual
('renta_anual', 'Vencimiento Declaración de Renta', 4, 30, NULL, '#8B5CF6'),

-- Patentes municipales
('patente_municipal', 'Vencimiento 1ª Cuota Patente Municipal', 2, 28, NULL, '#06B6D4'),
('patente_municipal', 'Vencimiento 2ª Cuota Patente Municipal', 5, 31, NULL, '#06B6D4'),
('patente_municipal', 'Vencimiento 3ª Cuota Patente Municipal', 8, 31, NULL, '#06B6D4'),
('patente_municipal', 'Vencimiento 4ª Cuota Patente Municipal', 11, 30, NULL, '#06B6D4')
ON CONFLICT ON CONSTRAINT unique_calendario_obligacion DO NOTHING;

-- ============================
-- PASO 10: VERIFICACIÓN FINAL
-- ============================

DO $$
DECLARE
    total_documentos INTEGER;
    total_declaraciones INTEGER;
    total_eventos INTEGER;
    total_calendario INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_documentos FROM public.documentos_tributarios;
    SELECT COUNT(*) INTO total_declaraciones FROM public.declaraciones_tributarias;
    SELECT COUNT(*) INTO total_eventos FROM public.eventos_cliente;
    SELECT COUNT(*) INTO total_calendario FROM public.calendario_tributario;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ IMPLEMENTACIÓN COMPLETADA CON ÉXITO';
    RAISE NOTICE '========================================';
    RAISE NOTICE '📄 Tabla documentos_tributarios: Creada';
    RAISE NOTICE '📋 Tabla declaraciones_tributarias: Creada';
    RAISE NOTICE '📅 Tabla calendario_tributario: Creada (%)', total_calendario;
    RAISE NOTICE '🎯 Tabla eventos_cliente: Creada';
    RAISE NOTICE '🔒 Políticas RLS: Configuradas';
    RAISE NOTICE '⚙️ Funciones de negocio: Implementadas';
    RAISE NOTICE '📊 Datos de calendario: % registros', total_calendario;
    RAISE NOTICE '========================================';
    RAISE NOTICE '🚀 PORTAL DE CLIENTES LISTO PARA USAR';
    RAISE NOTICE '========================================';
END $$;

-- ✅ IMPLEMENTACIÓN COMPLETADA
-- El portal de clientes está completamente configurado y listo para usar
-- Próximo paso: Desarrollar los componentes React del frontend