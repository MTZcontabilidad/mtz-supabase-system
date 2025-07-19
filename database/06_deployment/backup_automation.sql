-- =====================================================================
-- SCRIPT DE BACKUP AUTOMÁTICO PARA MTZ
-- =====================================================================

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

-- Índices para optimizar consultas de logs
CREATE INDEX IF NOT EXISTS idx_logs_sistema_timestamp ON logs_sistema(timestamp);
CREATE INDEX IF NOT EXISTS idx_logs_sistema_accion ON logs_sistema(accion);
CREATE INDEX IF NOT EXISTS idx_logs_sistema_usuario ON logs_sistema(usuario_id);

-- Políticas RLS para logs
ALTER TABLE logs_sistema ENABLE ROW LEVEL SECURITY;

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

-- Comentarios para documentación
COMMENT ON FUNCTION backup_clientes_contables() IS 'Crea backup de la tabla clientes_contables';
COMMENT ON FUNCTION backup_usuarios_sistema() IS 'Crea backup de la tabla usuarios_sistema';
COMMENT ON FUNCTION limpiar_backups_antiguos() IS 'Elimina backups más antiguos que 7 días';
COMMENT ON FUNCTION backup_completo_sistema() IS 'Ejecuta backup completo del sistema';
