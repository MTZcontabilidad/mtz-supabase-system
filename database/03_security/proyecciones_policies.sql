-- Políticas de seguridad RLS para Proyecciones

-- Habilitar RLS en la tabla
ALTER TABLE proyecciones ENABLE ROW LEVEL SECURITY;

-- Políticas para proyecciones
-- Administradores pueden hacer todo
CREATE POLICY "admin_all_proyecciones" ON proyecciones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'admin'
        )
    );

-- Gerentes pueden gestionar todas las proyecciones
CREATE POLICY "gerente_all_proyecciones" ON proyecciones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'gerente'
        )
    );

-- Contadores pueden ver y editar proyecciones
CREATE POLICY "contador_proyecciones" ON proyecciones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'contador'
        )
    );

-- Analistas pueden ver proyecciones
CREATE POLICY "analista_view_proyecciones" ON proyecciones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM usuarios u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'analista'
        )
    );

-- Usuarios autenticados pueden ver proyecciones básicas
CREATE POLICY "usuarios_view_proyecciones" ON proyecciones
    FOR SELECT USING (
        auth.role() = 'authenticated'
    );

-- Función para verificar permisos de proyecciones
CREATE OR REPLACE FUNCTION check_proyecciones_permissions()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = auth.uid() AND r.nombre IN ('admin', 'gerente', 'contador')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener proyecciones con permisos
CREATE OR REPLACE FUNCTION get_proyecciones_with_permissions()
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
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Verificar permisos
    IF NOT check_proyecciones_permissions() THEN
        RAISE EXCEPTION 'Acceso denegado: permisos insuficientes';
    END IF;

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
        p.notas,
        p.created_at
    FROM proyecciones p
    ORDER BY p.año DESC, p.mes_inicio ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear proyección con permisos
CREATE OR REPLACE FUNCTION create_proyeccion(
    nombre_param VARCHAR,
    descripcion_param TEXT,
    tipo_param VARCHAR,
    año_param INTEGER,
    mes_inicio_param INTEGER,
    mes_fin_param INTEGER,
    monto_objetivo_param DECIMAL,
    estado_param VARCHAR DEFAULT 'en_progreso',
    notas_param TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    nueva_proyeccion_id UUID;
BEGIN
    -- Verificar permisos
    IF NOT check_proyecciones_permissions() THEN
        RAISE EXCEPTION 'Acceso denegado: permisos insuficientes';
    END IF;

    -- Insertar nueva proyección
    INSERT INTO proyecciones (
        nombre,
        descripcion,
        tipo,
        año,
        mes_inicio,
        mes_fin,
        monto_objetivo,
        estado,
        notas,
        created_by
    ) VALUES (
        nombre_param,
        descripcion_param,
        tipo_param,
        año_param,
        mes_inicio_param,
        mes_fin_param,
        monto_objetivo_param,
        estado_param,
        notas_param,
        auth.uid()
    ) RETURNING id INTO nueva_proyeccion_id;

    RETURN nueva_proyeccion_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar proyección con permisos
CREATE OR REPLACE FUNCTION update_proyeccion(
    proyeccion_id UUID,
    nombre_param VARCHAR DEFAULT NULL,
    descripcion_param TEXT DEFAULT NULL,
    tipo_param VARCHAR DEFAULT NULL,
    año_param INTEGER DEFAULT NULL,
    mes_inicio_param INTEGER DEFAULT NULL,
    mes_fin_param INTEGER DEFAULT NULL,
    monto_objetivo_param DECIMAL DEFAULT NULL,
    monto_real_param DECIMAL DEFAULT NULL,
    estado_param VARCHAR DEFAULT NULL,
    notas_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Verificar permisos
    IF NOT check_proyecciones_permissions() THEN
        RAISE EXCEPTION 'Acceso denegado: permisos insuficientes';
    END IF;

    -- Actualizar proyección
    UPDATE proyecciones SET
        nombre = COALESCE(nombre_param, nombre),
        descripcion = COALESCE(descripcion_param, descripcion),
        tipo = COALESCE(tipo_param, tipo),
        año = COALESCE(año_param, año),
        mes_inicio = COALESCE(mes_inicio_param, mes_inicio),
        mes_fin = COALESCE(mes_fin_param, mes_fin),
        monto_objetivo = COALESCE(monto_objetivo_param, monto_objetivo),
        monto_real = COALESCE(monto_real_param, monto_real),
        estado = COALESCE(estado_param, estado),
        notas = COALESCE(notas_param, notas)
    WHERE id = proyeccion_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
