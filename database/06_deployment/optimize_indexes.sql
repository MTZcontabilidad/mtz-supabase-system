-- =====================================================================
-- OPTIMIZACIÓN DE ÍNDICES PARA MTZ
-- =====================================================================

-- Índices para tabla clientes_contables
CREATE INDEX IF NOT EXISTS idx_clientes_contables_rut ON clientes_contables(rut);
CREATE INDEX IF NOT EXISTS idx_clientes_contables_email ON clientes_contables(email);
CREATE INDEX IF NOT EXISTS idx_clientes_contables_estado ON clientes_contables(estado);
CREATE INDEX IF NOT EXISTS idx_clientes_contables_total_facturado ON clientes_contables(total_facturado DESC);
CREATE INDEX IF NOT EXISTS idx_clientes_contables_fecha_registro ON clientes_contables(fecha_registro DESC);
CREATE INDEX IF NOT EXISTS idx_clientes_contables_razon_social ON clientes_contables USING gin(to_tsvector('spanish', razon_social));

-- Índices compuestos para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_clientes_estado_facturacion ON clientes_contables(estado, total_facturado DESC);
CREATE INDEX IF NOT EXISTS idx_clientes_fecha_estado ON clientes_contables(fecha_registro DESC, estado);

-- Índices para tabla usuarios_sistema
CREATE INDEX IF NOT EXISTS idx_usuarios_sistema_email ON usuarios_sistema(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_sistema_rol_id ON usuarios_sistema(rol_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_sistema_estado ON usuarios_sistema(estado);
CREATE INDEX IF NOT EXISTS idx_usuarios_sistema_fecha_registro ON usuarios_sistema(fecha_registro DESC);

-- Índices para tabla roles
CREATE INDEX IF NOT EXISTS idx_roles_nombre ON roles(nombre);
CREATE INDEX IF NOT EXISTS idx_roles_estado ON roles(estado);

-- Índices para tabla asignaciones
CREATE INDEX IF NOT EXISTS idx_asignaciones_usuario_id ON asignaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_cliente_id ON asignaciones(cliente_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_estado ON asignaciones(estado);
CREATE INDEX IF NOT EXISTS idx_asignaciones_fecha_asignacion ON asignaciones(fecha_asignacion DESC);
CREATE INDEX IF NOT EXISTS idx_asignaciones_fecha_vencimiento ON asignaciones(fecha_vencimiento);

-- Índices compuestos para asignaciones
CREATE INDEX IF NOT EXISTS idx_asignaciones_usuario_estado ON asignaciones(usuario_id, estado);
CREATE INDEX IF NOT EXISTS idx_asignaciones_cliente_estado ON asignaciones(cliente_id, estado);

-- Índices para búsquedas de texto completo
CREATE INDEX IF NOT EXISTS idx_clientes_busqueda ON clientes_contables
USING gin(to_tsvector('spanish',
    coalesce(razon_social, '') || ' ' ||
    coalesce(rut, '') || ' ' ||
    coalesce(email, '') || ' ' ||
    coalesce(telefono, '')
));

-- Índices para consultas de estadísticas
CREATE INDEX IF NOT EXISTS idx_clientes_facturacion_anio ON clientes_contables
USING btree(EXTRACT(YEAR FROM fecha_registro), total_facturado DESC);

-- Índices para auditoría
CREATE INDEX IF NOT EXISTS idx_logs_sistema_timestamp_accion ON logs_sistema(timestamp DESC, accion);
CREATE INDEX IF NOT EXISTS idx_logs_sistema_usuario_timestamp ON logs_sistema(usuario_id, timestamp DESC);

-- Función para analizar y optimizar índices
CREATE OR REPLACE FUNCTION analizar_rendimiento_indices()
RETURNS TABLE(
    tabla text,
    indice text,
    tamano text,
    scans bigint,
    tuples_read bigint,
    tuples_fetched bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        schemaname::text as tabla,
        indexname::text as indice,
        pg_size_pretty(pg_relation_size(indexrelid)) as tamano,
        idx_scan as scans,
        idx_tup_read as tuples_read,
        idx_tup_fetch as tuples_fetched
    FROM pg_stat_user_indexes
    WHERE schemaname = 'public'
    ORDER BY pg_relation_size(indexrelid) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para identificar índices no utilizados
CREATE OR REPLACE FUNCTION indices_no_utilizados()
RETURNS TABLE(
    tabla text,
    indice text,
    tamano text,
    ultimo_uso interval
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        schemaname::text as tabla,
        indexname::text as indice,
        pg_size_pretty(pg_relation_size(indexrelid)) as tamano,
        now() - last_vacuum as ultimo_uso
    FROM pg_stat_user_indexes
    WHERE schemaname = 'public'
    AND idx_scan = 0
    AND pg_relation_size(indexrelid) > 1024 * 1024  -- Solo índices > 1MB
    ORDER BY pg_relation_size(indexrelid) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para recomendar índices faltantes
CREATE OR REPLACE FUNCTION recomendar_indices()
RETURNS TABLE(
    tabla text,
    columnas text,
    tipo_consulta text,
    recomendacion text
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        schemaname::text as tabla,
        attname::text as columnas,
        'WHERE'::text as tipo_consulta,
        'Considerar índice en ' || attname as recomendacion
    FROM pg_stat_user_tables st
    JOIN pg_attribute a ON a.attrelid = st.relid
    WHERE schemaname = 'public'
    AND a.attnum > 0
    AND NOT a.attisdropped
    AND NOT EXISTS (
        SELECT 1 FROM pg_index i
        WHERE i.indrelid = st.relid
        AND a.attnum = ANY(i.indkey)
    )
    LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios para documentación
COMMENT ON FUNCTION analizar_rendimiento_indices() IS 'Analiza el rendimiento de los índices existentes';
COMMENT ON FUNCTION indices_no_utilizados() IS 'Identifica índices que no se están utilizando';
COMMENT ON FUNCTION recomendar_indices() IS 'Recomienda índices faltantes basado en el uso';
