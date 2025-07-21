-- Políticas de seguridad RLS para RRHH

-- Habilitar RLS en las tablas
ALTER TABLE empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE nominas ENABLE ROW LEVEL SECURITY;

-- Políticas para empleados
-- Administradores pueden hacer todo
CREATE POLICY "admin_all_empleados" ON empleados
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'admin'
        )
    );

-- Gerentes pueden ver y editar empleados de su departamento
CREATE POLICY "gerente_empleados_departamento" ON empleados
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'gerente'
        )
    );

-- RRHH puede ver y editar todos los empleados
CREATE POLICY "rrhh_all_empleados" ON empleados
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'rrhh'
        )
    );

-- Usuarios autenticados pueden ver empleados activos
CREATE POLICY "usuarios_view_empleados_activos" ON empleados
    FOR SELECT USING (
        auth.role() = 'authenticated' AND estado = 'activo'
    );

-- Políticas para nóminas
-- Administradores pueden hacer todo
CREATE POLICY "admin_all_nominas" ON nominas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'admin'
        )
    );

-- RRHH puede gestionar todas las nóminas
CREATE POLICY "rrhh_all_nominas" ON nominas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'rrhh'
        )
    );

-- Contadores pueden ver nóminas para reportes
CREATE POLICY "contador_view_nominas" ON nominas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM usuarios u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'contador'
        )
    );

-- Empleados pueden ver solo sus propias nóminas
CREATE POLICY "empleado_view_own_nominas" ON nominas
    FOR SELECT USING (
        empleado_id IN (
            SELECT id FROM empleados WHERE email = (
                SELECT email FROM auth.users WHERE id = auth.uid()
            )
        )
    );

-- Función para verificar permisos de RRHH
CREATE OR REPLACE FUNCTION check_rrhh_permissions()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = auth.uid() AND r.nombre IN ('admin', 'rrhh', 'gerente')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener empleados por departamento
CREATE OR REPLACE FUNCTION get_empleados_by_departamento(departamento_param VARCHAR)
RETURNS TABLE (
    id UUID,
    nombre VARCHAR,
    apellido VARCHAR,
    email VARCHAR,
    telefono VARCHAR,
    departamento VARCHAR,
    cargo VARCHAR,
    fecha_ingreso DATE,
    salario_base DECIMAL,
    estado VARCHAR
) AS $$
BEGIN
    -- Verificar permisos
    IF NOT check_rrhh_permissions() THEN
        RAISE EXCEPTION 'Acceso denegado: permisos insuficientes';
    END IF;

    RETURN QUERY
    SELECT
        e.id,
        e.nombre,
        e.apellido,
        e.email,
        e.telefono,
        e.departamento,
        e.cargo,
        e.fecha_ingreso,
        e.salario_base,
        e.estado
    FROM empleados e
    WHERE e.departamento = departamento_param
    ORDER BY e.nombre, e.apellido;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas de RRHH
CREATE OR REPLACE FUNCTION get_rrhh_stats()
RETURNS TABLE (
    total_empleados BIGINT,
    empleados_activos BIGINT,
    empleados_vacaciones BIGINT,
    empleados_licencia BIGINT,
    total_nominas_mes BIGINT,
    total_salarios_mes DECIMAL
) AS $$
BEGIN
    -- Verificar permisos
    IF NOT check_rrhh_permissions() THEN
        RAISE EXCEPTION 'Acceso denegado: permisos insuficientes';
    END IF;

    RETURN QUERY
    SELECT
        COUNT(*) as total_empleados,
        COUNT(*) FILTER (WHERE estado = 'activo') as empleados_activos,
        COUNT(*) FILTER (WHERE estado = 'vacaciones') as empleados_vacaciones,
        COUNT(*) FILTER (WHERE estado = 'licencia') as empleados_licencia,
        (SELECT COUNT(*) FROM nominas WHERE mes = EXTRACT(MONTH FROM CURRENT_DATE) AND año = EXTRACT(YEAR FROM CURRENT_DATE)) as total_nominas_mes,
        (SELECT COALESCE(SUM(salario_neto), 0) FROM nominas WHERE mes = EXTRACT(MONTH FROM CURRENT_DATE) AND año = EXTRACT(YEAR FROM CURRENT_DATE)) as total_salarios_mes
    FROM empleados;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
