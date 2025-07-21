-- Script de despliegue completo para el módulo de Proyecciones
-- Este script crea todas las tablas, políticas y datos necesarios para el módulo de proyecciones

BEGIN;

-- 1. Crear esquema de proyecciones
\i ../01_schemas/proyecciones.sql

-- 2. Aplicar políticas de seguridad
\i ../03_security/proyecciones_policies.sql

-- 3. Insertar datos de ejemplo
\i ../04_data/proyecciones_data.sql

-- 4. Verificar la instalación
DO $$
DECLARE
    proyecciones_count INTEGER;
    tipos_count INTEGER;
BEGIN
    -- Verificar que las tablas se crearon correctamente
    SELECT COUNT(*) INTO proyecciones_count FROM proyecciones;

    -- Verificar tipos únicos
    SELECT COUNT(DISTINCT tipo) INTO tipos_count FROM proyecciones;

    RAISE NOTICE 'Despliegue de Proyecciones completado exitosamente:';
    RAISE NOTICE '- Proyecciones insertadas: %', proyecciones_count;
    RAISE NOTICE '- Tipos de proyecciones: %', tipos_count;

    -- Verificar que RLS está habilitado
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables
        WHERE tablename = 'proyecciones'
        AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS no está habilitado en la tabla proyecciones';
    END IF;

    -- Verificar funciones
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc
        WHERE proname = 'get_proyecciones_stats'
    ) THEN
        RAISE EXCEPTION 'Función get_proyecciones_stats no encontrada';
    END IF;

    RAISE NOTICE 'Verificación de seguridad completada';
END $$;

COMMIT;

-- Mostrar resumen final
SELECT
    'PROYECCIONES' as modulo,
    'proyecciones' as tabla,
    COUNT(*) as registros
FROM proyecciones
UNION ALL
SELECT
    'PROYECCIONES' as modulo,
    'tipos_unicos' as tabla,
    COUNT(DISTINCT tipo) as registros
FROM proyecciones
ORDER BY modulo, tabla;

-- Mostrar estadísticas básicas
SELECT
    tipo,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE estado = 'completado') as completadas,
    COUNT(*) FILTER (WHERE estado = 'en_progreso') as en_progreso,
    COUNT(*) FILTER (WHERE estado = 'atrasado') as atrasadas,
    AVG(porcentaje_cumplimiento) as promedio_cumplimiento
FROM proyecciones
GROUP BY tipo
ORDER BY tipo;
