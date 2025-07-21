-- =====================================================
-- SCRIPT SQL MÍNIMO PARA PRUEBAS DEL MCP
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Habilitar Row Level Security (RLS)
ALTER TABLE IF EXISTS test_mcp ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS test_mcp_simple ENABLE ROW LEVEL SECURITY;

-- 2. Crear tabla de prueba simple
CREATE TABLE IF NOT EXISTS test_mcp_simple (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    activo BOOLEAN DEFAULT true
);

-- 3. Crear tabla de prueba con más campos
CREATE TABLE IF NOT EXISTS test_mcp (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_registro TIMESTAMP DEFAULT NOW(),
    ultima_actualizacion TIMESTAMP DEFAULT NOW(),
    estado VARCHAR(20) DEFAULT 'activo'
);

-- 4. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_test_mcp_codigo ON test_mcp(codigo);
CREATE INDEX IF NOT EXISTS idx_test_mcp_estado ON test_mcp(estado);
CREATE INDEX IF NOT EXISTS idx_test_mcp_simple_nombre ON test_mcp_simple(nombre);

-- 5. Configurar políticas RLS básicas para service role
-- Política para permitir todo al service role
DROP POLICY IF EXISTS "Service role full access" ON test_mcp;
CREATE POLICY "Service role full access" ON test_mcp
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access" ON test_mcp_simple;
CREATE POLICY "Service role full access" ON test_mcp_simple
    FOR ALL USING (true);

-- 6. Insertar datos de prueba
INSERT INTO test_mcp_simple (nombre, descripcion) VALUES
    ('Cliente A', 'Cliente de prueba A'),
    ('Cliente B', 'Cliente de prueba B'),
    ('Cliente C', 'Cliente de prueba C')
ON CONFLICT DO NOTHING;

INSERT INTO test_mcp (codigo, nombre, email, telefono, direccion) VALUES
    ('CLI001', 'Juan Pérez', 'juan@ejemplo.com', '123456789', 'Calle Principal 123'),
    ('CLI002', 'María García', 'maria@ejemplo.com', '987654321', 'Avenida Central 456'),
    ('CLI003', 'Carlos López', 'carlos@ejemplo.com', '555666777', 'Plaza Mayor 789'),
    ('CLI004', 'Ana Martínez', 'ana@ejemplo.com', '111222333', 'Boulevard Norte 321'),
    ('CLI005', 'Luis Rodríguez', 'luis@ejemplo.com', '444555666', 'Calle Sur 654')
ON CONFLICT (codigo) DO NOTHING;

-- 7. Crear función para obtener estadísticas básicas
CREATE OR REPLACE FUNCTION get_test_stats()
RETURNS TABLE (
    tabla_nombre TEXT,
    total_registros BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 'test_mcp'::TEXT, COUNT(*)::BIGINT FROM test_mcp
    UNION ALL
    SELECT 'test_mcp_simple'::TEXT, COUNT(*)::BIGINT FROM test_mcp_simple;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Verificar que todo se creó correctamente
SELECT
    'test_mcp' as tabla,
    COUNT(*) as registros
FROM test_mcp
UNION ALL
SELECT
    'test_mcp_simple' as tabla,
    COUNT(*) as registros
FROM test_mcp_simple;

-- 9. Mostrar información de las tablas creadas
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('test_mcp', 'test_mcp_simple')
ORDER BY table_name, ordinal_position;
