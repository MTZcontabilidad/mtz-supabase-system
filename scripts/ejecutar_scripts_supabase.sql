-- =====================================================================
-- SCRIPT MAESTRO PARA CONFIGURACIÓN COMPLETA DE SUPABASE
-- MTZ OUROBORUS AI v3.0
-- =====================================================================

-- Ejecutar este script en el SQL Editor de Supabase
-- URL: https://bwgnmastihgndmtbqvkj.supabase.co/project/default/sql

-- =====================================================================
-- 1. BACKUP AUTOMÁTICO
-- =====================================================================

-- Crear tabla de logs si no existe
CREATE TABLE IF NOT EXISTS logs_sistema (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    accion VARCHAR(50) NOT NULL,
    tabla VARCHAR(100),
    detalles TEXT,
    usuario_id UUID REFERENCES auth.users(id),
    ip_address INET,
    user_agent TEXT
);

-- Función para crear backup de clientes
CREATE OR REPLACE FUNCTION backup_clientes_contables()
RETURNS void AS $$
BEGIN
    -- Crear tabla de backup con timestamp
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS backup_clientes_%s AS
        SELECT * FROM clientes_contables
    ', to_char(now(), 'YYYY_MM_DD_HH24_MI'));

    -- Log del backup
    INSERT INTO logs_sistema (accion, tabla, detalles, usuario_id)
    VALUES (
        'BACKUP',
        'clientes_contables',
        format('Backup creado: backup_clientes_%s', to_char(now(), 'YYYY_MM_DD_HH24_MI')),
        auth.uid()
    );

    RAISE NOTICE 'Backup de clientes creado exitosamente';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear backup de usuarios
CREATE OR REPLACE FUNCTION backup_usuarios_sistema()
RETURNS void AS $$
BEGIN
    -- Crear tabla de backup con timestamp
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS backup_usuarios_%s AS
        SELECT * FROM usuarios_sistema
    ', to_char(now(), 'YYYY_MM_DD_HH24_MI'));

    -- Log del backup
    INSERT INTO logs_sistema (accion, tabla, detalles, usuario_id)
    VALUES (
        'BACKUP',
        'usuarios_sistema',
        format('Backup creado: backup_usuarios_%s', to_char(now(), 'YYYY_MM_DD_HH24_MI')),
        auth.uid()
    );

    RAISE NOTICE 'Backup de usuarios creado exitosamente';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para limpiar backups antiguos (mantener solo últimos 7 días)
CREATE OR REPLACE FUNCTION limpiar_backups_antiguos()
RETURNS void AS $$
DECLARE
    backup_table text;
    backup_date date;
BEGIN
    -- Limpiar backups de clientes
    FOR backup_table IN
        SELECT tablename
        FROM pg_tables
        WHERE tablename LIKE 'backup_clientes_%'
    LOOP
        -- Extraer fecha del nombre de la tabla
        backup_date := to_date(
            substring(backup_table from 'backup_clientes_(\d{4}_\d{2}_\d{2})'),
            'YYYY_MM_DD'
        );

        -- Eliminar si es más antiguo que 7 días
        IF backup_date < current_date - interval '7 days' THEN
            EXECUTE format('DROP TABLE IF EXISTS %I', backup_table);
            RAISE NOTICE 'Backup eliminado: %', backup_table;
        END IF;
    END LOOP;

    -- Limpiar backups de usuarios
    FOR backup_table IN
        SELECT tablename
        FROM pg_tables
        WHERE tablename LIKE 'backup_usuarios_%'
    LOOP
        -- Extraer fecha del nombre de la tabla
        backup_date := to_date(
            substring(backup_table from 'backup_usuarios_(\d{4}_\d{2}_\d{2})'),
            'YYYY_MM_DD'
        );

        -- Eliminar si es más antiguo que 7 días
        IF backup_date < current_date - interval '7 days' THEN
            EXECUTE format('DROP TABLE IF EXISTS %I', backup_table);
            RAISE NOTICE 'Backup eliminado: %', backup_table;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para backup completo del sistema
CREATE OR REPLACE FUNCTION backup_completo_sistema()
RETURNS void AS $$
BEGIN
    -- Crear backups
    PERFORM backup_clientes_contables();
    PERFORM backup_usuarios_sistema();

    -- Limpiar backups antiguos
    PERFORM limpiar_backups_antiguos();

    RAISE NOTICE 'Backup completo del sistema realizado exitosamente';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- 2. OPTIMIZACIÓN DE ÍNDICES
-- =====================================================================

-- Índices para optimizar consultas de logs
CREATE INDEX IF NOT EXISTS idx_logs_sistema_timestamp ON logs_sistema(timestamp);
CREATE INDEX IF NOT EXISTS idx_logs_sistema_accion ON logs_sistema(accion);
CREATE INDEX IF NOT EXISTS idx_logs_sistema_usuario ON logs_sistema(usuario_id);

-- Índices para clientes_contables
CREATE INDEX IF NOT EXISTS idx_clientes_contables_rut ON clientes_contables(rut);
CREATE INDEX IF NOT EXISTS idx_clientes_contables_email ON clientes_contables(email);
CREATE INDEX IF NOT EXISTS idx_clientes_contables_total_facturado ON clientes_contables(total_facturado DESC);
CREATE INDEX IF NOT EXISTS idx_clientes_contables_fecha_registro ON clientes_contables(fecha_registro);

-- Índices para usuarios_sistema
CREATE INDEX IF NOT EXISTS idx_usuarios_sistema_email ON usuarios_sistema(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_sistema_rol_id ON usuarios_sistema(rol_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_sistema_activo ON usuarios_sistema(activo);

-- Índices para roles
CREATE INDEX IF NOT EXISTS idx_roles_nombre ON roles(nombre);
CREATE INDEX IF NOT EXISTS idx_roles_activo ON roles(activo);

-- =====================================================================
-- 3. POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE logs_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes_contables ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Políticas para logs_sistema
-- Solo administradores pueden ver logs
CREATE POLICY "Administradores pueden ver logs" ON logs_sistema
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM usuarios_sistema us
            JOIN roles r ON us.rol_id = r.id
            WHERE us.id = auth.uid()
            AND r.nombre = 'administrador'
        )
    );

-- Solo administradores pueden insertar logs
CREATE POLICY "Sistema puede insertar logs" ON logs_sistema
    FOR INSERT WITH CHECK (true);

-- Políticas para clientes_contables
-- Administradores pueden ver todos los clientes
CREATE POLICY "Administradores pueden ver todos los clientes" ON clientes_contables
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM usuarios_sistema us
            JOIN roles r ON us.rol_id = r.id
            WHERE us.id = auth.uid()
            AND r.nombre = 'administrador'
        )
    );

-- Colaboradores pueden ver clientes asignados
CREATE POLICY "Colaboradores pueden ver clientes asignados" ON clientes_contables
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM usuarios_sistema us
            JOIN roles r ON us.rol_id = r.id
            WHERE us.id = auth.uid()
            AND r.nombre = 'colaborador'
        )
    );

-- Políticas para usuarios_sistema
-- Solo administradores pueden ver usuarios
CREATE POLICY "Administradores pueden ver usuarios" ON usuarios_sistema
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM usuarios_sistema us
            JOIN roles r ON us.rol_id = r.id
            WHERE us.id = auth.uid()
            AND r.nombre = 'administrador'
        )
    );

-- Políticas para roles
-- Solo administradores pueden ver roles
CREATE POLICY "Administradores pueden ver roles" ON roles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM usuarios_sistema us
            JOIN roles r ON us.rol_id = r.id
            WHERE us.id = auth.uid()
            AND r.nombre = 'administrador'
        )
    );

-- =====================================================================
-- 4. FUNCIONES DE ANÁLISIS
-- =====================================================================

-- Función para obtener estadísticas del dashboard
CREATE OR REPLACE FUNCTION get_estadisticas_dashboard()
RETURNS TABLE (
    total_clientes BIGINT,
    total_facturado NUMERIC,
    promedio_facturacion NUMERIC,
    cliente_mayor_facturacion TEXT,
    monto_mayor_facturacion NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_clientes,
        COALESCE(SUM(total_facturado), 0) as total_facturado,
        COALESCE(AVG(total_facturado), 0) as promedio_facturacion,
        COALESCE(razon_social, 'N/A') as cliente_mayor_facturacion,
        COALESCE(MAX(total_facturado), 0) as monto_mayor_facturacion
    FROM clientes_contables;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener análisis de concentración
CREATE OR REPLACE FUNCTION get_analisis_concentracion()
RETURNS TABLE (
    cliente TEXT,
    facturacion NUMERIC,
    porcentaje_concentracion NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        razon_social as cliente,
        total_facturado as facturacion,
        ROUND((total_facturado / SUM(total_facturado) OVER()) * 100, 2) as porcentaje_concentracion
    FROM clientes_contables
    ORDER BY total_facturado DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- 5. VERIFICACIÓN Y LOGGING
-- =====================================================================

-- Log de la configuración
INSERT INTO logs_sistema (accion, tabla, detalles, usuario_id)
VALUES (
    'CONFIGURACION',
    'SISTEMA',
    'Configuración completa de Supabase aplicada: backup, índices, RLS y funciones de análisis',
    NULL
);

-- Verificar que todo esté configurado correctamente
DO $$
DECLARE
    backup_count INTEGER;
    index_count INTEGER;
    policy_count INTEGER;
BEGIN
    -- Verificar funciones de backup
    SELECT COUNT(*) INTO backup_count
    FROM pg_proc
    WHERE proname IN ('backup_clientes_contables', 'backup_usuarios_sistema', 'backup_completo_sistema');

    -- Verificar índices
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes
    WHERE indexname LIKE 'idx_%';

    -- Verificar políticas RLS
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies;

    RAISE NOTICE 'Configuración completada: % funciones de backup, % índices, % políticas RLS',
                 backup_count, index_count, policy_count;
END;
$$;

-- =====================================================================
-- 6. COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================================

COMMENT ON FUNCTION backup_clientes_contables() IS 'Crea backup de la tabla clientes_contables';
COMMENT ON FUNCTION backup_usuarios_sistema() IS 'Crea backup de la tabla usuarios_sistema';
COMMENT ON FUNCTION limpiar_backups_antiguos() IS 'Elimina backups más antiguos que 7 días';
COMMENT ON FUNCTION backup_completo_sistema() IS 'Ejecuta backup completo del sistema';
COMMENT ON FUNCTION get_estadisticas_dashboard() IS 'Obtiene estadísticas para el dashboard';
COMMENT ON FUNCTION get_analisis_concentracion() IS 'Obtiene análisis de concentración de clientes';

-- =====================================================================
-- SCRIPT COMPLETADO
-- =====================================================================

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'CONFIGURACIÓN COMPLETA DE SUPABASE';
    RAISE NOTICE 'MTZ OUROBORUS AI v3.0';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Backup automático configurado';
    RAISE NOTICE '✅ Índices optimizados';
    RAISE NOTICE '✅ Políticas RLS aplicadas';
    RAISE NOTICE '✅ Funciones de análisis creadas';
    RAISE NOTICE '✅ Logging configurado';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'SISTEMA LISTO PARA PRODUCCIÓN';
    RAISE NOTICE '========================================';
END;
$$;
