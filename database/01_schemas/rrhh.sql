-- Esquema de RRHH (Recursos Humanos)
-- Tabla de empleados
CREATE TABLE IF NOT EXISTS empleados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    departamento VARCHAR(100) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    salario_base DECIMAL(12,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'vacaciones', 'licencia')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de nóminas
CREATE TABLE IF NOT EXISTS nominas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    empleado_id UUID NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
    año INTEGER NOT NULL,
    dias_trabajados INTEGER,
    salario_base DECIMAL(12,2) NOT NULL,
    bonificaciones DECIMAL(12,2) DEFAULT 0,
    descuentos DECIMAL(12,2) DEFAULT 0,
    salario_neto DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(empleado_id, mes, año)
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_empleados_departamento ON empleados(departamento);
CREATE INDEX IF NOT EXISTS idx_empleados_estado ON empleados(estado);
CREATE INDEX IF NOT EXISTS idx_empleados_email ON empleados(email);
CREATE INDEX IF NOT EXISTS idx_nominas_empleado ON nominas(empleado_id);
CREATE INDEX IF NOT EXISTS idx_nominas_periodo ON nominas(año, mes);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_empleados_updated_at
    BEFORE UPDATE ON empleados
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nominas_updated_at
    BEFORE UPDATE ON nominas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para calcular salario neto automáticamente
CREATE OR REPLACE FUNCTION calcular_salario_neto()
RETURNS TRIGGER AS $$
BEGIN
    NEW.salario_neto = NEW.salario_base + COALESCE(NEW.bonificaciones, 0) - COALESCE(NEW.descuentos, 0);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_calcular_salario_neto
    BEFORE INSERT OR UPDATE ON nominas
    FOR EACH ROW EXECUTE FUNCTION calcular_salario_neto();

-- Comentarios para documentación
COMMENT ON TABLE empleados IS 'Tabla principal de empleados del sistema';
COMMENT ON TABLE nominas IS 'Tabla de nóminas mensuales por empleado';
COMMENT ON COLUMN empleados.estado IS 'Estado del empleado: activo, inactivo, vacaciones, licencia';
COMMENT ON COLUMN nominas.salario_neto IS 'Salario neto calculado automáticamente: base + bonificaciones - descuentos';
