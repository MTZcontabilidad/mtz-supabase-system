-- =====================================================
-- SCRIPT SQL ULTRA SIMPLE PARA VERIFICAR PERMISOS
-- =====================================================

-- 1. Crear una tabla muy simple
CREATE TABLE IF NOT EXISTS test_basic (
    id SERIAL PRIMARY KEY,
    nombre TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Insertar un dato de prueba
INSERT INTO test_basic (nombre) VALUES ('Test básico');

-- 3. Verificar que se creó
SELECT * FROM test_basic;

-- 4. Mostrar todas las tablas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
