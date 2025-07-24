-- ========================================
-- CONFIGURACIÓN COMPLETA DE SUPABASE PARA SISTEMA MTZ
-- ========================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- TABLAS PRINCIPALES
-- ========================================

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    razon_social TEXT,
    ruc TEXT UNIQUE NOT NULL,
    email TEXT,
    telefono TEXT,
    direccion TEXT,
    estado TEXT DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_factura TEXT UNIQUE NOT NULL,
    cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
    descripcion TEXT,
    monto_subtotal DECIMAL(12,2) DEFAULT 0,
    monto_iva DECIMAL(12,2) DEFAULT 0,
    monto_total DECIMAL(12,2) DEFAULT 0,
    estado TEXT DEFAULT 'Pendiente',
    forma_pago TEXT DEFAULT 'Transferencia',
    categoria TEXT DEFAULT 'Contabilidad',
    fecha_emision DATE DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cobranzas
CREATE TABLE IF NOT EXISTS cobranzas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_documento TEXT UNIQUE NOT NULL,
    cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
    descripcion TEXT,
    monto_total DECIMAL(12,2) DEFAULT 0,
    estado TEXT DEFAULT 'Pendiente',
    fecha_emision DATE DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE,
    fecha_pago DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de compras
CREATE TABLE IF NOT EXISTS compras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_orden TEXT UNIQUE NOT NULL,
    proveedor TEXT NOT NULL,
    descripcion TEXT,
    monto_total DECIMAL(12,2) DEFAULT 0,
    estado TEXT DEFAULT 'Pendiente',
    categoria TEXT DEFAULT 'Suministros',
    fecha_orden DATE DEFAULT CURRENT_DATE,
    fecha_entrega DATE,
    forma_pago TEXT DEFAULT 'Transferencia',
    prioridad TEXT DEFAULT 'Normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de empleados
CREATE TABLE IF NOT EXISTS empleados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT UNIQUE,
    telefono TEXT,
    departamento TEXT DEFAULT 'Administración',
    cargo TEXT,
    fecha_ingreso DATE DEFAULT CURRENT_DATE,
    salario_base DECIMAL(12,2) DEFAULT 0,
    estado TEXT DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de nóminas
CREATE TABLE IF NOT EXISTS nominas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empleado_id UUID REFERENCES empleados(id) ON DELETE CASCADE,
    mes INTEGER NOT NULL,
    año INTEGER NOT NULL,
    salario_base DECIMAL(12,2) DEFAULT 0,
    bonificaciones DECIMAL(12,2) DEFAULT 0,
    descuentos DECIMAL(12,2) DEFAULT 0,
    salario_neto DECIMAL(12,2) DEFAULT 0,
    estado TEXT DEFAULT 'Pendiente',
    fecha_pago DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(empleado_id, mes, año)
);

-- Tabla de contratos
CREATE TABLE IF NOT EXISTS contratos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_contrato TEXT UNIQUE NOT NULL,
    cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
    descripcion TEXT,
    monto_total DECIMAL(12,2) DEFAULT 0,
    estado TEXT DEFAULT 'Activo',
    fecha_inicio DATE DEFAULT CURRENT_DATE,
    fecha_fin DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de declaraciones IVA
CREATE TABLE IF NOT EXISTS declaraciones_iva (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    periodo TEXT NOT NULL UNIQUE,
    fecha_declaracion DATE DEFAULT CURRENT_DATE,
    ventas_gravadas DECIMAL(12,2) DEFAULT 0,
    compras_gravadas DECIMAL(12,2) DEFAULT 0,
    iva_debitado DECIMAL(12,2) DEFAULT 0,
    iva_creditado DECIMAL(12,2) DEFAULT 0,
    iva_a_pagar DECIMAL(12,2) DEFAULT 0,
    estado TEXT DEFAULT 'Pendiente',
    fecha_pago DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- FUNCIONES Y TRIGGERS
-- ========================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ventas_updated_at BEFORE UPDATE ON ventas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cobranzas_updated_at BEFORE UPDATE ON cobranzas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compras_updated_at BEFORE UPDATE ON compras FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_empleados_updated_at BEFORE UPDATE ON empleados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nominas_updated_at BEFORE UPDATE ON nominas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contratos_updated_at BEFORE UPDATE ON contratos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_declaraciones_iva_updated_at BEFORE UPDATE ON declaraciones_iva FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para calcular IVA automáticamente
CREATE OR REPLACE FUNCTION calcular_iva_venta()
RETURNS TRIGGER AS $$
BEGIN
    NEW.monto_iva = NEW.monto_subtotal * 0.19;
    NEW.monto_total = NEW.monto_subtotal + NEW.monto_iva;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para calcular IVA en ventas
CREATE TRIGGER calcular_iva_venta_trigger BEFORE INSERT OR UPDATE ON ventas FOR EACH ROW EXECUTE FUNCTION calcular_iva_venta();

-- ========================================
-- HABILITAR RLS (ROW LEVEL SECURITY)
-- ========================================

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cobranzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE nominas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE declaraciones_iva ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLÍTICAS RLS
-- ========================================

-- Políticas para clientes
CREATE POLICY "Permitir acceso completo a clientes" ON clientes
    FOR ALL USING (true);

-- Políticas para ventas
CREATE POLICY "Permitir acceso completo a ventas" ON ventas
    FOR ALL USING (true);

-- Políticas para cobranzas
CREATE POLICY "Permitir acceso completo a cobranzas" ON cobranzas
    FOR ALL USING (true);

-- Políticas para compras
CREATE POLICY "Permitir acceso completo a compras" ON compras
    FOR ALL USING (true);

-- Políticas para empleados
CREATE POLICY "Permitir acceso completo a empleados" ON empleados
    FOR ALL USING (true);

-- Políticas para nóminas
CREATE POLICY "Permitir acceso completo a nominas" ON nominas
    FOR ALL USING (true);

-- Políticas para contratos
CREATE POLICY "Permitir acceso completo a contratos" ON contratos
    FOR ALL USING (true);

-- Políticas para declaraciones IVA
CREATE POLICY "Permitir acceso completo a declaraciones_iva" ON declaraciones_iva
    FOR ALL USING (true);

-- ========================================
-- DATOS INICIALES
-- ========================================

-- Insertar clientes de ejemplo
INSERT INTO clientes (nombre, razon_social, ruc, email, telefono, direccion, estado) VALUES
('Empresa ABC Ltda.', 'Empresa ABC Limitada', '12345678-9', 'contacto@abc.cl', '+56 2 2345 6789', 'Av. Providencia 123, Santiago', 'activo'),
('Comercial XYZ SpA', 'Comercial XYZ Sociedad por Acciones', '98765432-1', 'info@xyz.cl', '+56 2 3456 7890', 'Las Condes 456, Santiago', 'activo'),
('Servicios LTDA', 'Servicios Profesionales Limitada', '45678912-3', 'servicios@ltda.cl', '+56 2 4567 8901', 'Ñuñoa 789, Santiago', 'activo'),
('Consultoría Pro', 'Consultoría Profesional SpA', '78912345-6', 'consultoria@pro.cl', '+56 2 5678 9012', 'Providencia 321, Santiago', 'activo'),
('Inversiones MTZ', 'Inversiones MTZ Limitada', '32165498-7', 'inversiones@mtz.cl', '+56 2 6789 0123', 'Las Condes 654, Santiago', 'activo')
ON CONFLICT (ruc) DO NOTHING;

-- Insertar empleados de ejemplo
INSERT INTO empleados (nombre, apellido, email, telefono, departamento, cargo, salario_base, estado) VALUES
('Juan', 'Pérez', 'juan.perez@mtz.cl', '+56 9 1234 5678', 'Contabilidad', 'Contador Senior', 800000, 'activo'),
('María', 'González', 'maria.gonzalez@mtz.cl', '+56 9 2345 6789', 'RRHH', 'Gerente de RRHH', 1200000, 'activo'),
('Carlos', 'Rodríguez', 'carlos.rodriguez@mtz.cl', '+56 9 3456 7890', 'Ventas', 'Ejecutivo de Ventas', 600000, 'activo'),
('Ana', 'Martínez', 'ana.martinez@mtz.cl', '+56 9 4567 8901', 'Administración', 'Asistente Administrativa', 500000, 'activo'),
('Luis', 'Fernández', 'luis.fernandez@mtz.cl', '+56 9 5678 9012', 'Sistemas', 'Desarrollador', 900000, 'activo')
ON CONFLICT (email) DO NOTHING;

-- Insertar ventas de ejemplo
INSERT INTO ventas (numero_factura, cliente_id, descripcion, monto_subtotal, estado, forma_pago, categoria, fecha_emision, fecha_vencimiento)
SELECT
    'F001-2024',
    c.id,
    'Servicios de contabilidad mensual',
    500000,
    'Pagada',
    'Transferencia',
    'Contabilidad',
    '2024-01-15',
    '2024-02-15'
FROM clientes c WHERE c.ruc = '12345678-9'
ON CONFLICT (numero_factura) DO NOTHING;

INSERT INTO ventas (numero_factura, cliente_id, descripcion, monto_subtotal, estado, forma_pago, categoria, fecha_emision, fecha_vencimiento)
SELECT
    'F002-2024',
    c.id,
    'Declaración de IVA',
    300000,
    'Pendiente',
    'Efectivo',
    'Tributario',
    '2024-01-20',
    '2024-02-20'
FROM clientes c WHERE c.ruc = '98765432-1'
ON CONFLICT (numero_factura) DO NOTHING;

INSERT INTO ventas (numero_factura, cliente_id, descripcion, monto_subtotal, estado, forma_pago, categoria, fecha_emision, fecha_vencimiento)
SELECT
    'F003-2024',
    c.id,
    'Auditoría anual',
    800000,
    'Vencida',
    'Cheque',
    'Auditoría',
    '2024-01-10',
    '2024-02-10'
FROM clientes c WHERE c.ruc = '45678912-3'
ON CONFLICT (numero_factura) DO NOTHING;

-- Insertar cobranzas de ejemplo
INSERT INTO cobranzas (numero_documento, cliente_id, descripcion, monto_total, estado, fecha_emision, fecha_vencimiento)
SELECT
    'C001-2024',
    c.id,
    'Factura F001-2024',
    595000,
    'Pagada',
    '2024-01-15',
    '2024-02-15'
FROM clientes c WHERE c.ruc = '12345678-9'
ON CONFLICT (numero_documento) DO NOTHING;

INSERT INTO cobranzas (numero_documento, cliente_id, descripcion, monto_total, estado, fecha_emision, fecha_vencimiento)
SELECT
    'C002-2024',
    c.id,
    'Factura F002-2024',
    357000,
    'Pendiente',
    '2024-01-20',
    '2024-02-20'
FROM clientes c WHERE c.ruc = '98765432-1'
ON CONFLICT (numero_documento) DO NOTHING;

-- Insertar compras de ejemplo
INSERT INTO compras (numero_orden, proveedor, descripcion, monto_total, estado, categoria, fecha_orden, fecha_entrega, prioridad) VALUES
('OC001-2024', 'Proveedor ABC', 'Material de oficina', 150000, 'Aprobada', 'Suministros', '2024-01-05', '2024-01-10', 'Normal'),
('OC002-2024', 'Proveedor XYZ', 'Equipos informáticos', 2500000, 'Pendiente', 'Tecnología', '2024-01-15', '2024-01-25', 'Alta'),
('OC003-2024', 'Proveedor DEF', 'Servicios de limpieza', 300000, 'En proceso', 'Servicios', '2024-01-10', '2024-01-20', 'Normal')
ON CONFLICT (numero_orden) DO NOTHING;

-- Insertar contratos de ejemplo
INSERT INTO contratos (numero_contrato, cliente_id, descripcion, monto_total, estado, fecha_inicio, fecha_fin)
SELECT
    'CT001-2024',
    c.id,
    'Contrato de servicios contables anual',
    6000000,
    'Activo',
    '2024-01-01',
    '2024-12-31'
FROM clientes c WHERE c.ruc = '12345678-9'
ON CONFLICT (numero_contrato) DO NOTHING;

INSERT INTO contratos (numero_contrato, cliente_id, descripcion, monto_total, estado, fecha_inicio, fecha_fin)
SELECT
    'CT002-2024',
    c.id,
    'Contrato de auditoría semestral',
    4000000,
    'Activo',
    '2024-01-01',
    '2024-06-30'
FROM clientes c WHERE c.ruc = '98765432-1'
ON CONFLICT (numero_contrato) DO NOTHING;

-- Insertar nóminas de ejemplo
INSERT INTO nominas (empleado_id, mes, año, salario_base, bonificaciones, descuentos, salario_neto, estado)
SELECT
    e.id,
    1,
    2024,
    e.salario_base,
    100000,
    50000,
    e.salario_base + 100000 - 50000,
    'Pagada'
FROM empleados e WHERE e.email = 'juan.perez@mtz.cl'
ON CONFLICT (empleado_id, mes, año) DO NOTHING;

-- Insertar declaraciones IVA de ejemplo
INSERT INTO declaraciones_iva (periodo, fecha_declaracion, ventas_gravadas, compras_gravadas, iva_debitado, iva_creditado, iva_a_pagar, estado) VALUES
('Enero 2024', '2024-02-15', 1600000, 800000, 304000, 152000, 152000, 'Pendiente'),
('Diciembre 2023', '2024-01-15', 2000000, 1200000, 380000, 228000, 152000, 'Pagada')
ON CONFLICT (periodo) DO NOTHING;

-- ========================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ========================================

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_clientes_ruc ON clientes(ruc);
CREATE INDEX IF NOT EXISTS idx_clientes_estado ON clientes(estado);
CREATE INDEX IF NOT EXISTS idx_ventas_numero_factura ON ventas(numero_factura);
CREATE INDEX IF NOT EXISTS idx_ventas_estado ON ventas(estado);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha_emision ON ventas(fecha_emision);
CREATE INDEX IF NOT EXISTS idx_cobranzas_numero_documento ON cobranzas(numero_documento);
CREATE INDEX IF NOT EXISTS idx_cobranzas_estado ON cobranzas(estado);
CREATE INDEX IF NOT EXISTS idx_compras_numero_orden ON compras(numero_orden);
CREATE INDEX IF NOT EXISTS idx_compras_estado ON compras(estado);
CREATE INDEX IF NOT EXISTS idx_empleados_email ON empleados(email);
CREATE INDEX IF NOT EXISTS idx_empleados_estado ON empleados(estado);
CREATE INDEX IF NOT EXISTS idx_contratos_numero_contrato ON contratos(numero_contrato);
CREATE INDEX IF NOT EXISTS idx_contratos_estado ON contratos(estado);

-- ========================================
-- VISTAS ÚTILES
-- ========================================

-- Vista para estadísticas del dashboard
CREATE OR REPLACE VIEW estadisticas_dashboard AS
SELECT
    (SELECT COUNT(*) FROM clientes WHERE estado = 'activo') as clientes_activos,
    (SELECT COUNT(*) FROM ventas) as total_ventas,
    (SELECT COUNT(*) FROM cobranzas WHERE estado = 'Pendiente') as cobranzas_pendientes,
    (SELECT COUNT(*) FROM compras WHERE estado = 'Pendiente') as compras_pendientes,
    (SELECT COUNT(*) FROM empleados WHERE estado = 'activo') as empleados_activos,
    (SELECT COUNT(*) FROM contratos WHERE estado = 'Activo') as contratos_activos,
    (SELECT COALESCE(SUM(monto_total), 0) FROM ventas WHERE estado = 'Pagada') as total_facturado,
    (SELECT COALESCE(SUM(monto_total), 0) FROM cobranzas WHERE estado = 'Pagada') as total_cobrado;

-- Vista para ventas con información del cliente
CREATE OR REPLACE VIEW ventas_con_cliente AS
SELECT
    v.*,
    c.nombre as nombre_cliente,
    c.ruc as ruc_cliente
FROM ventas v
LEFT JOIN clientes c ON v.cliente_id = c.id;

-- Vista para cobranzas con información del cliente
CREATE OR REPLACE VIEW cobranzas_con_cliente AS
SELECT
    c.*,
    cl.nombre as nombre_cliente,
    cl.ruc as ruc_cliente
FROM cobranzas c
LEFT JOIN clientes cl ON c.cliente_id = cl.id;

-- Vista para contratos con información del cliente
CREATE OR REPLACE VIEW contratos_con_cliente AS
SELECT
    co.*,
    cl.nombre as nombre_cliente,
    cl.ruc as ruc_cliente
FROM contratos co
LEFT JOIN clientes cl ON co.cliente_id = cl.id;

-- Vista para nóminas con información del empleado
CREATE OR REPLACE VIEW nominas_con_empleado AS
SELECT
    n.*,
    e.nombre,
    e.apellido,
    e.email,
    e.departamento,
    e.cargo
FROM nominas n
LEFT JOIN empleados e ON n.empleado_id = e.id;

-- ========================================
-- FUNCIONES DE UTILIDAD
-- ========================================

-- Función para obtener estadísticas de RRHH
CREATE OR REPLACE FUNCTION get_estadisticas_rrhh()
RETURNS TABLE (
    total_empleados BIGINT,
    empleados_activos BIGINT,
    promedio_salario NUMERIC,
    total_nominas BIGINT,
    nominas_este_mes BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_empleados,
        COUNT(*) FILTER (WHERE estado = 'activo')::BIGINT as empleados_activos,
        ROUND(AVG(salario_base), 0) as promedio_salario,
        (SELECT COUNT(*) FROM nominas)::BIGINT as total_nominas,
        (SELECT COUNT(*) FROM nominas WHERE mes = EXTRACT(MONTH FROM CURRENT_DATE) AND año = EXTRACT(YEAR FROM CURRENT_DATE))::BIGINT as nominas_este_mes
    FROM empleados;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de compras
CREATE OR REPLACE FUNCTION get_estadisticas_compras()
RETURNS TABLE (
    total_compras BIGINT,
    compras_pendientes BIGINT,
    compras_aprobadas BIGINT,
    compras_en_proceso BIGINT,
    monto_total NUMERIC,
    promedio_por_compra NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_compras,
        COUNT(*) FILTER (WHERE estado = 'Pendiente')::BIGINT as compras_pendientes,
        COUNT(*) FILTER (WHERE estado = 'Aprobada')::BIGINT as compras_aprobadas,
        COUNT(*) FILTER (WHERE estado = 'En proceso')::BIGINT as compras_en_proceso,
        COALESCE(SUM(monto_total), 0) as monto_total,
        ROUND(COALESCE(AVG(monto_total), 0), 0) as promedio_por_compra
    FROM compras;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- MENSAJE DE CONFIRMACIÓN
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '✅ CONFIGURACIÓN DE SUPABASE COMPLETADA EXITOSAMENTE';
    RAISE NOTICE '📊 Tablas creadas: clientes, ventas, cobranzas, compras, empleados, nominas, contratos, declaraciones_iva';
    RAISE NOTICE '🔒 RLS habilitado en todas las tablas';
    RAISE NOTICE '📈 Vistas y funciones de estadísticas creadas';
    RAISE NOTICE '📝 Datos de ejemplo insertados';
    RAISE NOTICE '🚀 Sistema MTZ listo para usar con datos reales!';
END $$;
