-- Esquema de Proyecciones Financieras
-- Tabla de proyecciones
CREATE TABLE IF NOT EXISTS proyecciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('ventas', 'cobranza', 'compras', 'gastos', 'ingresos', 'utilidades')),
    año INTEGER NOT NULL,
    mes_inicio INTEGER NOT NULL CHECK (mes_inicio >= 1 AND mes_inicio <= 12),
    mes_fin INTEGER NOT NULL CHECK (mes_fin >= 1 AND mes_fin <= 12),
    monto_objetivo DECIMAL(15,2) NOT NULL,
    monto_real DECIMAL(15,2) DEFAULT 0,
    porcentaje_cumplimiento DECIMAL(5,2) DEFAULT 0,
    estado VARCHAR(50) DEFAULT 'en_progreso' CHECK (estado IN ('planificado', 'en_progreso', 'completado', 'atrasado', 'cancelado')),
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_proyecciones_tipo ON proyecciones(tipo);
CREATE INDEX IF NOT EXISTS idx_proyecciones_año ON proyecciones(año);
CREATE INDEX IF NOT EXISTS idx_proyecciones_estado ON proyecciones(estado);
CREATE INDEX IF NOT EXISTS idx_proyecciones_periodo ON proyecciones(año, mes_inicio, mes_fin);
CREATE INDEX IF NOT EXISTS idx_proyecciones_created_by ON proyecciones(created_by);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_proyecciones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_proyecciones_updated_at
    BEFORE UPDATE ON proyecciones
    FOR EACH ROW EXECUTE FUNCTION update_proyecciones_updated_at();

-- Función para calcular porcentaje de cumplimiento automáticamente
CREATE OR REPLACE FUNCTION calcular_cumplimiento_proyeccion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.monto_objetivo > 0 THEN
        NEW.porcentaje_cumplimiento = (NEW.monto_real / NEW.monto_objetivo) * 100;
    ELSE
        NEW.porcentaje_cumplimiento = 0;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_calcular_cumplimiento_proyeccion
    BEFORE INSERT OR UPDATE ON proyecciones
    FOR EACH ROW EXECUTE FUNCTION calcular_cumplimiento_proyeccion();

-- Función para obtener estadísticas de proyecciones
CREATE OR REPLACE FUNCTION get_proyecciones_stats(año_param INTEGER DEFAULT NULL)
RETURNS TABLE (
    total_proyecciones BIGINT,
    proyecciones_completadas BIGINT,
    proyecciones_en_progreso BIGINT,
    proyecciones_atrasadas BIGINT,
    promedio_cumplimiento DECIMAL,
    monto_total_objetivo DECIMAL,
    monto_total_real DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) as total_proyecciones,
        COUNT(*) FILTER (WHERE estado = 'completado') as proyecciones_completadas,
        COUNT(*) FILTER (WHERE estado = 'en_progreso') as proyecciones_en_progreso,
        COUNT(*) FILTER (WHERE estado = 'atrasado') as proyecciones_atrasadas,
        AVG(porcentaje_cumplimiento) as promedio_cumplimiento,
        SUM(monto_objetivo) as monto_total_objetivo,
        SUM(monto_real) as monto_total_real
    FROM proyecciones
    WHERE año_param IS NULL OR año = año_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener proyecciones por tipo
CREATE OR REPLACE FUNCTION get_proyecciones_by_tipo(tipo_param VARCHAR, año_param INTEGER DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    nombre VARCHAR,
    descripcion TEXT,
    tipo VARCHAR,
    año INTEGER,
    mes_inicio INTEGER,
    mes_fin INTEGER,
    monto_objetivo DECIMAL,
    monto_real DECIMAL,
    porcentaje_cumplimiento DECIMAL,
    estado VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.tipo,
        p.año,
        p.mes_inicio,
        p.mes_fin,
        p.monto_objetivo,
        p.monto_real,
        p.porcentaje_cumplimiento,
        p.estado,
        p.created_at
    FROM proyecciones p
    WHERE p.tipo = tipo_param
    AND (año_param IS NULL OR p.año = año_param)
    ORDER BY p.año DESC, p.mes_inicio ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios para documentación
COMMENT ON TABLE proyecciones IS 'Tabla principal de proyecciones financieras del sistema';
COMMENT ON COLUMN proyecciones.tipo IS 'Tipo de proyección: ventas, cobranza, compras, gastos, ingresos, utilidades';
COMMENT ON COLUMN proyecciones.estado IS 'Estado de la proyección: planificado, en_progreso, completado, atrasado, cancelado';
COMMENT ON COLUMN proyecciones.porcentaje_cumplimiento IS 'Porcentaje de cumplimiento calculado automáticamente: (real/objetivo)*100';
