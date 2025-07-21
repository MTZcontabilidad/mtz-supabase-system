-- Script de despliegue completo para el módulo de RRHH
-- Este script crea todas las tablas, políticas y datos necesarios para el módulo de RRHH

BEGIN;

-- 1. Crear esquema de RRHH
\i ../01_schemas/rrhh.sql

-- 2. Aplicar políticas de seguridad
\i ../03_security/rrhh_policies.sql

-- 3. Insertar datos de ejemplo
\i ../04_data/rrhh_data.sql

-- 4. Verificar la instalación
DO $$
DECLARE
    empleados_count INTEGER;
    nominas_count INTEGER;
BEGIN
    -- Verificar que las tablas se crearon correctamente
    SELECT COUNT(*) INTO empleados_count FROM empleados;
    SELECT COUNT(*) INTO nominas_count FROM nominas;

    RAISE NOTICE 'Despliegue de RRHH completado exitosamente:';
    RAISE NOTICE '- Empleados insertados: %', empleados_count;
    RAISE NOTICE '- Nóminas insertadas: %', nominas_count;

    -- Verificar que RLS está habilitado
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables
        WHERE tablename = 'empleados'
        AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS no está habilitado en la tabla empleados';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables
        WHERE tablename = 'nominas'
        AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS no está habilitado en la tabla nominas';
    END IF;

    RAISE NOTICE 'Verificación de seguridad completada';
END $$;

COMMIT;

-- Mostrar resumen final
SELECT
    'RRHH' as modulo,
    'empleados' as tabla,
    COUNT(*) as registros
FROM empleados
UNION ALL
SELECT
    'RRHH' as modulo,
    'nominas' as tabla,
    COUNT(*) as registros
FROM nominas
ORDER BY modulo, tabla;
