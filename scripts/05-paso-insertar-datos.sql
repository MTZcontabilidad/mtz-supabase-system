-- =====================================================
-- PASO 5: INSERTAR DATOS DE PRUEBA
-- =====================================================

-- 1. Insertar datos en test_mcp_simple
INSERT INTO test_mcp_simple (nombre, descripcion) VALUES
    ('Cliente A', 'Cliente de prueba A'),
    ('Cliente B', 'Cliente de prueba B'),
    ('Cliente C', 'Cliente de prueba C')
ON CONFLICT DO NOTHING;

-- 2. Insertar datos en test_mcp
INSERT INTO test_mcp (codigo, nombre, email, telefono, direccion) VALUES
    ('CLI001', 'Juan Pérez', 'juan@ejemplo.com', '123456789', 'Calle Principal 123'),
    ('CLI002', 'María García', 'maria@ejemplo.com', '987654321', 'Avenida Central 456'),
    ('CLI003', 'Carlos López', 'carlos@ejemplo.com', '555666777', 'Plaza Mayor 789'),
    ('CLI004', 'Ana Martínez', 'ana@ejemplo.com', '111222333', 'Boulevard Norte 321'),
    ('CLI005', 'Luis Rodríguez', 'luis@ejemplo.com', '444555666', 'Calle Sur 654')
ON CONFLICT (codigo) DO NOTHING;

-- 3. Verificar que los datos se insertaron
SELECT
    'test_mcp' as tabla,
    COUNT(*) as registros
FROM test_mcp
UNION ALL
SELECT
    'test_mcp_simple' as tabla,
    COUNT(*) as registros
FROM test_mcp_simple;

-- 4. Mostrar algunos datos
SELECT codigo, nombre, email FROM test_mcp LIMIT 3;
SELECT nombre, descripcion FROM test_mcp_simple LIMIT 3;
