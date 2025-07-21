-- =====================================================
-- SCRIPT 2: TABLAS PARA DECLARACIONES Y CALENDARIO TRIBUTARIO
-- Sistema MTZ v3.0 - Portal de Clientes
-- =====================================================

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
  monto_diferencia DECIMAL(15,2) DEFAULT 0, -- Diferencia a pagar o favor
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'borrador', 'presentada', 'pagada', 'vencida', 'rectificada')),
  fecha_vencimiento DATE NOT NULL,
  fecha_presentacion TIMESTAMP WITH TIME ZONE,
  fecha_pago TIMESTAMP WITH TIME ZONE,
  numero_operacion VARCHAR(100), -- Número de operación del pago
  observaciones TEXT,
  archivo_declaracion TEXT, -- URL del archivo de declaración
  archivo_comprobante_pago TEXT, -- URL del comprobante de pago
  rectificatoria BOOLEAN DEFAULT false,
  declaracion_original_id UUID REFERENCES public.declaraciones_tributarias(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_declaraciones_cliente_periodo ON public.declaraciones_tributarias(cliente_id, periodo_ano DESC, periodo_mes DESC);
CREATE INDEX IF NOT EXISTS idx_declaraciones_vencimiento ON public.declaraciones_tributarias(fecha_vencimiento) WHERE estado IN ('pendiente', 'borrador');
CREATE INDEX IF NOT EXISTS idx_declaraciones_tipo ON public.declaraciones_tributarias(tipo_declaracion);

-- Trigger para updated_at
CREATE TRIGGER update_declaraciones_tributarias_updated_at
    BEFORE UPDATE ON public.declaraciones_tributarias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tabla para el calendario tributario nacional (fechas importantes)
CREATE TABLE IF NOT EXISTS public.calendario_tributario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_obligacion VARCHAR(50) NOT NULL,
  descripcion VARCHAR(300) NOT NULL,
  mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
  dia INTEGER NOT NULL CHECK (dia BETWEEN 1 AND 31),
  ultimo_digito_rut VARCHAR(10), -- Para obligaciones que dependen del último dígito del RUT
  año INTEGER, -- NULL si se aplica a todos los años
  activo BOOLEAN DEFAULT true,
  color_hex VARCHAR(7) DEFAULT '#3B82F6', -- Color para mostrar en el calendario
  url_informacion TEXT, -- URL con más información sobre la obligación
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
  fecha_recordatorio DATE, -- Fecha para enviar recordatorio
  tipo_evento VARCHAR(50) DEFAULT 'personalizado' CHECK (tipo_evento IN ('declaracion', 'pago', 'reunion', 'vencimiento', 'personalizado')),
  prioridad VARCHAR(20) DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'critica')),
  completado BOOLEAN DEFAULT false,
  recordatorio_enviado BOOLEAN DEFAULT false,
  color_hex VARCHAR(7) DEFAULT '#10B981',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Índices para eventos de cliente
CREATE INDEX IF NOT EXISTS idx_eventos_cliente_fecha ON public.eventos_cliente(cliente_id, fecha_evento DESC);
CREATE INDEX IF NOT EXISTS idx_eventos_recordatorio ON public.eventos_cliente(fecha_recordatorio) WHERE recordatorio_enviado = false;

-- Trigger para eventos de cliente
CREATE TRIGGER update_eventos_cliente_updated_at
    BEFORE UPDATE ON public.eventos_cliente
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS para todas las tablas
ALTER TABLE public.declaraciones_tributarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendario_tributario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos_cliente ENABLE ROW LEVEL SECURITY;

-- ============================
-- POLÍTICAS RLS PARA DECLARACIONES TRIBUTARIAS
-- ============================

-- Administradores: acceso completo
CREATE POLICY "Administradores pueden gestionar todas las declaraciones" 
ON public.declaraciones_tributarias 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'administrador');

-- Colaboradores: pueden gestionar declaraciones
CREATE POLICY "Colaboradores pueden gestionar declaraciones" 
ON public.declaraciones_tributarias 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'colaborador');

-- Clientes: solo pueden ver sus declaraciones
CREATE POLICY "Clientes pueden ver sus declaraciones" 
ON public.declaraciones_tributarias 
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

-- Externos: declaraciones de clientes asignados
CREATE POLICY "Externos pueden ver declaraciones de sus asignaciones" 
ON public.declaraciones_tributarias 
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

-- ============================
-- POLÍTICAS RLS PARA CALENDARIO TRIBUTARIO
-- ============================

-- Todos los usuarios autenticados pueden leer el calendario tributario nacional
CREATE POLICY "Usuarios autenticados pueden leer calendario tributario" 
ON public.calendario_tributario 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Solo administradores pueden modificar el calendario
CREATE POLICY "Solo administradores pueden gestionar calendario tributario" 
ON public.calendario_tributario 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'administrador');

-- ============================
-- POLÍTICAS RLS PARA EVENTOS DE CLIENTE
-- ============================

-- Administradores: acceso completo
CREATE POLICY "Administradores pueden gestionar todos los eventos" 
ON public.eventos_cliente 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'administrador');

-- Colaboradores: pueden gestionar eventos
CREATE POLICY "Colaboradores pueden gestionar eventos" 
ON public.eventos_cliente 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'colaborador');

-- Clientes: solo pueden ver y crear sus eventos
CREATE POLICY "Clientes pueden gestionar sus eventos" 
ON public.eventos_cliente 
FOR ALL 
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

-- Externos: eventos de clientes asignados
CREATE POLICY "Externos pueden ver eventos de sus asignaciones" 
ON public.eventos_cliente 
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

-- ============================
-- DATOS INICIALES DEL CALENDARIO TRIBUTARIO
-- ============================

-- Insertar fechas importantes del calendario tributario chileno
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
('patente_municipal', 'Vencimiento 4ª Cuota Patente Municipal', 11, 30, NULL, '#06B6D4');

-- Comentarios para documentación
COMMENT ON TABLE public.declaraciones_tributarias IS 'Almacena todas las declaraciones tributarias de los clientes';
COMMENT ON TABLE public.calendario_tributario IS 'Calendario tributario nacional con fechas importantes';
COMMENT ON TABLE public.eventos_cliente IS 'Eventos personalizados y recordatorios por cliente';

-- ✅ SCRIPT COMPLETADO
-- Este script crea las tablas para declaraciones tributarias y calendario tributario
-- Incluye políticas RLS y datos iniciales del calendario tributario chileno
-- Ejecutar en Supabase Dashboard > SQL Editor