-- Esquema de Empresas
-- Tabla de empresas
CREATE TABLE IF NOT EXISTS empresas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    razon_social VARCHAR(200) NOT NULL,
    nombre_fantasia VARCHAR(200),
    rut VARCHAR(20) UNIQUE NOT NULL,
    giro VARCHAR(300),
    direccion TEXT,
    comuna VARCHAR(100),
    ciudad VARCHAR(100),
    region VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(255),
    sitio_web VARCHAR(255),
    tipo_empresa VARCHAR(50) DEFAULT 'cliente' CHECK (tipo_empresa IN ('cliente', 'proveedor', 'cliente_proveedor', 'competidor', 'otro')),
    estado VARCHAR(50) DEFAULT 'activa' CHECK (estado IN ('activa', 'inactiva', 'suspendida', 'en_liquidacion')),
    fecha_creacion DATE,
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_empresas_razon_social ON empresas(razon_social);
CREATE INDEX IF NOT EXISTS idx_empresas_rut ON empresas(rut);
CREATE INDEX IF NOT EXISTS idx_empresas_tipo ON empresas(tipo_empresa);
CREATE INDEX IF NOT EXISTS idx_empresas_estado ON empresas(estado);
CREATE INDEX IF NOT EXISTS idx_empresas_ciudad ON empresas(ciudad);
CREATE INDEX IF NOT EXISTS idx_empresas_region ON empresas(region);
CREATE INDEX IF NOT EXISTS idx_empresas_email ON empresas(email);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_empresas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_empresas_updated_at
    BEFORE UPDATE ON empresas
    FOR EACH ROW EXECUTE FUNCTION update_empresas_updated_at();

-- Función para validar RUT chileno
CREATE OR REPLACE FUNCTION validar_rut_chileno(rut_param VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    rut_limpio VARCHAR;
    dv_calculado VARCHAR;
    dv_ingresado VARCHAR;
    suma INTEGER := 0;
    multiplicador INTEGER := 2;
    i INTEGER;
    digito INTEGER;
BEGIN
    -- Limpiar RUT
    rut_limpio := regexp_replace(rut_param, '[^0-9kK]', '', 'g');

    -- Verificar longitud mínima
    IF length(rut_limpio) < 2 THEN
        RETURN FALSE;
    END IF;

    -- Separar dígito verificador
    dv_ingresado := upper(substring(rut_limpio from length(rut_limpio) for 1));
    rut_limpio := substring(rut_limpio from 1 for length(rut_limpio) - 1);

    -- Calcular dígito verificador
    FOR i IN REVERSE length(rut_limpio)..1 LOOP
        digito := substring(rut_limpio from i for 1)::INTEGER;
        suma := suma + (digito * multiplicador);
        multiplicador := CASE WHEN multiplicador = 7 THEN 2 ELSE multiplicador + 1 END;
    END LOOP;

    -- Calcular dígito verificador
    dv_calculado := CASE
        WHEN (11 - (suma % 11)) = 11 THEN '0'
        WHEN (11 - (suma % 11)) = 10 THEN 'K'
        ELSE (11 - (suma % 11))::VARCHAR
    END;

    RETURN dv_calculado = dv_ingresado;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de empresas
CREATE OR REPLACE FUNCTION get_empresas_stats()
RETURNS TABLE (
    total_empresas BIGINT,
    empresas_activas BIGINT,
    clientes BIGINT,
    proveedores BIGINT,
    clientes_proveedores BIGINT,
    por_region JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) as total_empresas,
        COUNT(*) FILTER (WHERE estado = 'activa') as empresas_activas,
        COUNT(*) FILTER (WHERE tipo_empresa = 'cliente') as clientes,
        COUNT(*) FILTER (WHERE tipo_empresa = 'proveedor') as proveedores,
        COUNT(*) FILTER (WHERE tipo_empresa = 'cliente_proveedor') as clientes_proveedores,
        json_object_agg(region, count) as por_region
    FROM (
        SELECT region, COUNT(*) as count
        FROM empresas
        WHERE region IS NOT NULL
        GROUP BY region
    ) regiones;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para buscar empresas
CREATE OR REPLACE FUNCTION buscar_empresas(termino_busqueda VARCHAR)
RETURNS TABLE (
    id UUID,
    razon_social VARCHAR,
    nombre_fantasia VARCHAR,
    rut VARCHAR,
    tipo_empresa VARCHAR,
    estado VARCHAR,
    ciudad VARCHAR,
    email VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.razon_social,
        e.nombre_fantasia,
        e.rut,
        e.tipo_empresa,
        e.estado,
        e.ciudad,
        e.email
    FROM empresas e
    WHERE
        e.razon_social ILIKE '%' || termino_busqueda || '%'
        OR e.nombre_fantasia ILIKE '%' || termino_busqueda || '%'
        OR e.rut ILIKE '%' || termino_busqueda || '%'
        OR e.giro ILIKE '%' || termino_busqueda || '%'
    ORDER BY e.razon_social;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios para documentación
COMMENT ON TABLE empresas IS 'Tabla principal de empresas del sistema MTZ';
COMMENT ON COLUMN empresas.tipo_empresa IS 'Tipo de empresa: cliente, proveedor, cliente_proveedor, competidor, otro';
COMMENT ON COLUMN empresas.estado IS 'Estado de la empresa: activa, inactiva, suspendida, en_liquidacion';
COMMENT ON COLUMN empresas.rut IS 'RUT único de la empresa (formato chileno)';
