-- Políticas de seguridad RLS para Empresas

-- Habilitar RLS en la tabla
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

-- Políticas para empresas
-- Administradores pueden hacer todo
CREATE POLICY "admin_all_empresas" ON empresas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'admin'
        )
    );

-- Gerentes pueden gestionar todas las empresas
CREATE POLICY "gerente_all_empresas" ON empresas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'gerente'
        )
    );

-- Vendedores pueden ver y editar empresas (clientes)
CREATE POLICY "vendedor_empresas" ON empresas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'vendedor'
        )
    );

-- Contadores pueden ver y editar empresas
CREATE POLICY "contador_empresas" ON empresas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'contador'
        )
    );

-- Usuarios autenticados pueden ver empresas activas
CREATE POLICY "usuarios_view_empresas_activas" ON empresas
    FOR SELECT USING (
        auth.role() = 'authenticated' AND estado = 'activa'
    );

-- Función para verificar permisos de empresas
CREATE OR REPLACE FUNCTION check_empresas_permissions()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = auth.uid() AND r.nombre IN ('admin', 'gerente', 'vendedor', 'contador')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener empresas con permisos
CREATE OR REPLACE FUNCTION get_empresas_with_permissions()
RETURNS TABLE (
    id UUID,
    razon_social VARCHAR,
    nombre_fantasia VARCHAR,
    rut VARCHAR,
    giro VARCHAR,
    direccion TEXT,
    comuna VARCHAR,
    ciudad VARCHAR,
    region VARCHAR,
    telefono VARCHAR,
    email VARCHAR,
    sitio_web VARCHAR,
    tipo_empresa VARCHAR,
    estado VARCHAR,
    fecha_creacion DATE,
    observaciones TEXT
) AS $$
BEGIN
    -- Verificar permisos
    IF NOT check_empresas_permissions() THEN
        RAISE EXCEPTION 'Acceso denegado: permisos insuficientes';
    END IF;

    RETURN QUERY
    SELECT
        e.id,
        e.razon_social,
        e.nombre_fantasia,
        e.rut,
        e.giro,
        e.direccion,
        e.comuna,
        e.ciudad,
        e.region,
        e.telefono,
        e.email,
        e.sitio_web,
        e.tipo_empresa,
        e.estado,
        e.fecha_creacion,
        e.observaciones
    FROM empresas e
    ORDER BY e.razon_social;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear empresa con permisos
CREATE OR REPLACE FUNCTION create_empresa(
    razon_social_param VARCHAR,
    nombre_fantasia_param VARCHAR,
    rut_param VARCHAR,
    giro_param VARCHAR,
    direccion_param TEXT,
    comuna_param VARCHAR,
    ciudad_param VARCHAR,
    region_param VARCHAR,
    telefono_param VARCHAR,
    email_param VARCHAR,
    sitio_web_param VARCHAR,
    tipo_empresa_param VARCHAR DEFAULT 'cliente',
    estado_param VARCHAR DEFAULT 'activa',
    fecha_creacion_param DATE DEFAULT NULL,
    observaciones_param TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    nueva_empresa_id UUID;
BEGIN
    -- Verificar permisos
    IF NOT check_empresas_permissions() THEN
        RAISE EXCEPTION 'Acceso denegado: permisos insuficientes';
    END IF;

    -- Validar RUT si se proporciona
    IF rut_param IS NOT NULL AND NOT validar_rut_chileno(rut_param) THEN
        RAISE EXCEPTION 'RUT inválido';
    END IF;

    -- Insertar nueva empresa
    INSERT INTO empresas (
        razon_social,
        nombre_fantasia,
        rut,
        giro,
        direccion,
        comuna,
        ciudad,
        region,
        telefono,
        email,
        sitio_web,
        tipo_empresa,
        estado,
        fecha_creacion,
        observaciones,
        created_by
    ) VALUES (
        razon_social_param,
        nombre_fantasia_param,
        rut_param,
        giro_param,
        direccion_param,
        comuna_param,
        ciudad_param,
        region_param,
        telefono_param,
        email_param,
        sitio_web_param,
        tipo_empresa_param,
        estado_param,
        fecha_creacion_param,
        observaciones_param,
        auth.uid()
    ) RETURNING id INTO nueva_empresa_id;

    RETURN nueva_empresa_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar empresa con permisos
CREATE OR REPLACE FUNCTION update_empresa(
    empresa_id UUID,
    razon_social_param VARCHAR DEFAULT NULL,
    nombre_fantasia_param VARCHAR DEFAULT NULL,
    rut_param VARCHAR DEFAULT NULL,
    giro_param VARCHAR DEFAULT NULL,
    direccion_param TEXT DEFAULT NULL,
    comuna_param VARCHAR DEFAULT NULL,
    ciudad_param VARCHAR DEFAULT NULL,
    region_param VARCHAR DEFAULT NULL,
    telefono_param VARCHAR DEFAULT NULL,
    email_param VARCHAR DEFAULT NULL,
    sitio_web_param VARCHAR DEFAULT NULL,
    tipo_empresa_param VARCHAR DEFAULT NULL,
    estado_param VARCHAR DEFAULT NULL,
    fecha_creacion_param DATE DEFAULT NULL,
    observaciones_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Verificar permisos
    IF NOT check_empresas_permissions() THEN
        RAISE EXCEPTION 'Acceso denegado: permisos insuficientes';
    END IF;

    -- Validar RUT si se proporciona
    IF rut_param IS NOT NULL AND NOT validar_rut_chileno(rut_param) THEN
        RAISE EXCEPTION 'RUT inválido';
    END IF;

    -- Actualizar empresa
    UPDATE empresas SET
        razon_social = COALESCE(razon_social_param, razon_social),
        nombre_fantasia = COALESCE(nombre_fantasia_param, nombre_fantasia),
        rut = COALESCE(rut_param, rut),
        giro = COALESCE(giro_param, giro),
        direccion = COALESCE(direccion_param, direccion),
        comuna = COALESCE(comuna_param, comuna),
        ciudad = COALESCE(ciudad_param, ciudad),
        region = COALESCE(region_param, region),
        telefono = COALESCE(telefono_param, telefono),
        email = COALESCE(email_param, email),
        sitio_web = COALESCE(sitio_web_param, sitio_web),
        tipo_empresa = COALESCE(tipo_empresa_param, tipo_empresa),
        estado = COALESCE(estado_param, estado),
        fecha_creacion = COALESCE(fecha_creacion_param, fecha_creacion),
        observaciones = COALESCE(observaciones_param, observaciones)
    WHERE id = empresa_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
