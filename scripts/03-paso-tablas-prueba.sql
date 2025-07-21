-- =====================================================
-- PASO 3: CREAR TABLAS DE PRUEBA PARA EL MCP
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Crear tabla de prueba simple
CREATE TABLE IF NOT EXISTS test_mcp_simple (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    activo BOOLEAN DEFAULT true
);

-- 2. Crear tabla de prueba con más campos
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

-- 3. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_test_mcp_codigo ON test_mcp(codigo);
CREATE INDEX IF NOT EXISTS idx_test_mcp_estado ON test_mcp(estado);
CREATE INDEX IF NOT EXISTS idx_test_mcp_simple_nombre ON test_mcp_simple(nombre);

-- 4. Verificar que las tablas se crearon
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('test_mcp', 'test_mcp_simple')
ORDER BY table_name, ordinal_position;
