-- =====================================================
-- SCRIPT 3: FUNCIONES DE NEGOCIO PARA EL PORTAL DE CLIENTES
-- Sistema MTZ v3.0 - Portal de Clientes
-- =====================================================

-- ============================
-- FUNCIÓN 1: RESUMEN FINANCIERO DEL CLIENTE
-- ============================

CREATE OR REPLACE FUNCTION public.obtener_resumen_financiero_cliente(
  p_cliente_id UUID,
  p_fecha_inicio DATE DEFAULT DATE_TRUNC('year', CURRENT_DATE)::DATE,
  p_fecha_fin DATE DEFAULT CURRENT_DATE
) RETURNS JSON AS $$
DECLARE
  resultado JSON;
  cliente_info RECORD;
BEGIN
  -- Obtener información básica del cliente
  SELECT empresa, rut INTO cliente_info
  FROM public.clientes_contables
  WHERE id = p_cliente_id;

  -- Calcular resumen financiero
  SELECT json_build_object(
    'cliente', json_build_object(
      'id', p_cliente_id,
      'empresa', cliente_info.empresa,
      'rut', cliente_info.rut
    ),
    'periodo', json_build_object(
      'fecha_inicio', p_fecha_inicio,
      'fecha_fin', p_fecha_fin
    ),
    'documentos', json_build_object(
      'total_facturas', COALESCE((
        SELECT COUNT(*) FROM public.documentos_tributarios 
        WHERE cliente_id = p_cliente_id 
        AND tipo_documento = 'factura'
        AND fecha_emision BETWEEN p_fecha_inicio AND p_fecha_fin
      ), 0),
      'total_boletas', COALESCE((
        SELECT COUNT(*) FROM public.documentos_tributarios 
        WHERE cliente_id = p_cliente_id 
        AND tipo_documento = 'boleta'
        AND fecha_emision BETWEEN p_fecha_inicio AND p_fecha_fin
      ), 0),
      'monto_total_ventas', COALESCE((
        SELECT SUM(monto_total) FROM public.documentos_tributarios 
        WHERE cliente_id = p_cliente_id 
        AND tipo_documento IN ('factura', 'boleta', 'factura_exenta', 'factura_exportacion')
        AND fecha_emision BETWEEN p_fecha_inicio AND p_fecha_fin
        AND estado != 'anulado'
      ), 0),
      'monto_iva_ventas', COALESCE((
        SELECT SUM(monto_iva) FROM public.documentos_tributarios 
        WHERE cliente_id = p_cliente_id 
        AND tipo_documento IN ('factura', 'boleta')
        AND fecha_emision BETWEEN p_fecha_inicio AND p_fecha_fin
        AND estado != 'anulado'
      ), 0),
      'documentos_pendientes', COALESCE((
        SELECT COUNT(*) FROM public.documentos_tributarios 
        WHERE cliente_id = p_cliente_id 
        AND estado = 'pendiente'
        AND fecha_emision BETWEEN p_fecha_inicio AND p_fecha_fin
      ), 0),
      'documentos_vencidos', COALESCE((
        SELECT COUNT(*) FROM public.documentos_tributarios 
        WHERE cliente_id = p_cliente_id 
        AND estado = 'vencido'
        AND fecha_emision BETWEEN p_fecha_inicio AND p_fecha_fin
      ), 0)
    ),
    'declaraciones', json_build_object(
      'pendientes', COALESCE((
        SELECT COUNT(*) FROM public.declaraciones_tributarias 
        WHERE cliente_id = p_cliente_id 
        AND estado = 'pendiente'
        AND fecha_vencimiento >= CURRENT_DATE
      ), 0),
      'vencidas', COALESCE((
        SELECT COUNT(*) FROM public.declaraciones_tributarias 
        WHERE cliente_id = p_cliente_id 
        AND estado IN ('pendiente', 'vencida')
        AND fecha_vencimiento < CURRENT_DATE
      ), 0),
      'proximas_vencer', COALESCE((
        SELECT COUNT(*) FROM public.declaraciones_tributarias 
        WHERE cliente_id = p_cliente_id 
        AND estado = 'pendiente'
        AND fecha_vencimiento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
      ), 0)
    ),
    'resumen_mensual', (
      SELECT json_agg(
        json_build_object(
          'mes', TO_CHAR(fecha_emision, 'YYYY-MM'),
          'ventas_netas', COALESCE(SUM(monto_neto), 0),
          'iva', COALESCE(SUM(monto_iva), 0),
          'total', COALESCE(SUM(monto_total), 0),
          'cantidad_documentos', COUNT(*)
        ) ORDER BY fecha_emision
      )
      FROM public.documentos_tributarios
      WHERE cliente_id = p_cliente_id
      AND tipo_documento IN ('factura', 'boleta', 'factura_exenta')
      AND fecha_emision BETWEEN p_fecha_inicio AND p_fecha_fin
      AND estado != 'anulado'
      GROUP BY DATE_TRUNC('month', fecha_emision)
    )
  ) INTO resultado;

  RETURN resultado;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================
-- FUNCIÓN 2: OBTENER PRÓXIMOS VENCIMIENTOS
-- ============================

CREATE OR REPLACE FUNCTION public.obtener_proximos_vencimientos(
  p_cliente_id UUID,
  p_dias_adelante INTEGER DEFAULT 30
) RETURNS JSON AS $$
DECLARE
  resultado JSON;
BEGIN
  SELECT json_build_object(
    'declaraciones_vencen', COALESCE((
      SELECT json_agg(
        json_build_object(
          'id', id,
          'tipo', tipo_declaracion,
          'periodo', CASE 
            WHEN periodo_mes IS NOT NULL THEN periodo_mes || '/' || periodo_ano
            ELSE periodo_ano::TEXT
          END,
          'fecha_vencimiento', fecha_vencimiento,
          'monto_impuesto', monto_impuesto,
          'estado', estado,
          'dias_para_vencer', fecha_vencimiento - CURRENT_DATE
        ) ORDER BY fecha_vencimiento
      )
      FROM public.declaraciones_tributarias
      WHERE cliente_id = p_cliente_id
      AND estado IN ('pendiente', 'borrador')
      AND fecha_vencimiento BETWEEN CURRENT_DATE AND CURRENT_DATE + p_dias_adelante
    ), '[]'::json),
    'documentos_vencen', COALESCE((
      SELECT json_agg(
        json_build_object(
          'id', id,
          'tipo', tipo_documento,
          'numero', numero_documento,
          'fecha_vencimiento', fecha_vencimiento,
          'monto_total', monto_total,
          'estado', estado,
          'dias_para_vencer', fecha_vencimiento - CURRENT_DATE
        ) ORDER BY fecha_vencimiento
      )
      FROM public.documentos_tributarios
      WHERE cliente_id = p_cliente_id
      AND estado = 'pendiente'
      AND fecha_vencimiento IS NOT NULL
      AND fecha_vencimiento BETWEEN CURRENT_DATE AND CURRENT_DATE + p_dias_adelante
    ), '[]'::json),
    'eventos_proximos', COALESCE((
      SELECT json_agg(
        json_build_object(
          'id', id,
          'titulo', titulo,
          'descripcion', descripcion,
          'fecha_evento', fecha_evento,
          'tipo_evento', tipo_evento,
          'prioridad', prioridad,
          'dias_para_evento', fecha_evento - CURRENT_DATE
        ) ORDER BY fecha_evento
      )
      FROM public.eventos_cliente
      WHERE cliente_id = p_cliente_id
      AND completado = false
      AND fecha_evento BETWEEN CURRENT_DATE AND CURRENT_DATE + p_dias_adelante
    ), '[]'::json)
  ) INTO resultado;

  RETURN resultado;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================
-- FUNCIÓN 3: ESTADÍSTICAS DE DOCUMENTOS POR PERÍODO
-- ============================

CREATE OR REPLACE FUNCTION public.estadisticas_documentos_periodo(
  p_cliente_id UUID,
  p_tipo_periodo VARCHAR(10) DEFAULT 'mensual', -- 'semanal', 'mensual', 'trimestral'
  p_fecha_inicio DATE DEFAULT DATE_TRUNC('year', CURRENT_DATE)::DATE,
  p_fecha_fin DATE DEFAULT CURRENT_DATE
) RETURNS JSON AS $$
DECLARE
  resultado JSON;
  periodo_sql TEXT;
BEGIN
  -- Determinar el formato de agrupación según el tipo de período
  CASE p_tipo_periodo
    WHEN 'semanal' THEN periodo_sql := 'DATE_TRUNC(''week'', fecha_emision)';
    WHEN 'mensual' THEN periodo_sql := 'DATE_TRUNC(''month'', fecha_emision)';
    WHEN 'trimestral' THEN periodo_sql := 'DATE_TRUNC(''quarter'', fecha_emision)';
    ELSE periodo_sql := 'DATE_TRUNC(''month'', fecha_emision)';
  END CASE;

  -- Ejecutar consulta dinámica
  EXECUTE format('
    SELECT json_build_object(
      ''tipo_periodo'', $1,
      ''fecha_inicio'', $2,
      ''fecha_fin'', $3,
      ''estadisticas'', json_agg(
        json_build_object(
          ''periodo'', periodo,
          ''total_documentos'', total_documentos,
          ''monto_neto_total'', monto_neto_total,
          ''monto_iva_total'', monto_iva_total,
          ''monto_total'', monto_total,
          ''por_tipo_documento'', tipos_documentos
        ) ORDER BY periodo
      )
    )
    FROM (
      SELECT 
        %s as periodo,
        COUNT(*) as total_documentos,
        SUM(monto_neto) as monto_neto_total,
        SUM(monto_iva) as monto_iva_total,
        SUM(monto_total) as monto_total,
        json_object_agg(
          tipo_documento,
          json_build_object(
            ''cantidad'', COUNT(*),
            ''monto_total'', SUM(monto_total)
          )
        ) as tipos_documentos
      FROM public.documentos_tributarios
      WHERE cliente_id = $4
      AND fecha_emision BETWEEN $2 AND $3
      AND estado != ''anulado''
      GROUP BY %s
    ) stats
  ', periodo_sql, periodo_sql)
  INTO resultado
  USING p_tipo_periodo, p_fecha_inicio, p_fecha_fin, p_cliente_id;

  RETURN resultado;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================
-- FUNCIÓN 4: CALENDARIO TRIBUTARIO PERSONALIZADO
-- ============================

CREATE OR REPLACE FUNCTION public.obtener_calendario_tributario_cliente(
  p_cliente_id UUID,
  p_mes INTEGER DEFAULT EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER,
  p_año INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
) RETURNS JSON AS $$
DECLARE
  resultado JSON;
  ultimo_digito_rut CHAR(1);
BEGIN
  -- Obtener el último dígito del RUT del cliente
  SELECT RIGHT(REPLACE(rut, '-', ''), 1) INTO ultimo_digito_rut
  FROM public.clientes_contables
  WHERE id = p_cliente_id;

  SELECT json_build_object(
    'mes', p_mes,
    'año', p_año,
    'cliente_id', p_cliente_id,
    'ultimo_digito_rut', ultimo_digito_rut,
    'obligaciones_tributarias', COALESCE((
      SELECT json_agg(
        json_build_object(
          'id', id,
          'tipo_obligacion', tipo_obligacion,
          'descripcion', descripcion,
          'dia', dia,
          'fecha_completa', MAKE_DATE(p_año, mes, dia),
          'color_hex', color_hex,
          'url_informacion', url_informacion
        ) ORDER BY dia
      )
      FROM public.calendario_tributario
      WHERE mes = p_mes
      AND activo = true
      AND (ultimo_digito_rut IS NULL OR ultimo_digito_rut LIKE '%' || ultimo_digito_rut || '%')
      AND (año IS NULL OR año = p_año)
    ), '[]'::json),
    'declaraciones_cliente', COALESCE((
      SELECT json_agg(
        json_build_object(
          'id', id,
          'tipo_declaracion', tipo_declaracion,
          'fecha_vencimiento', fecha_vencimiento,
          'monto_impuesto', monto_impuesto,
          'estado', estado,
          'dias_restantes', fecha_vencimiento - CURRENT_DATE
        ) ORDER BY fecha_vencimiento
      )
      FROM public.declaraciones_tributarias
      WHERE cliente_id = p_cliente_id
      AND EXTRACT(MONTH FROM fecha_vencimiento) = p_mes
      AND EXTRACT(YEAR FROM fecha_vencimiento) = p_año
    ), '[]'::json),
    'eventos_cliente', COALESCE((
      SELECT json_agg(
        json_build_object(
          'id', id,
          'titulo', titulo,
          'descripcion', descripcion,
          'fecha_evento', fecha_evento,
          'tipo_evento', tipo_evento,
          'prioridad', prioridad,
          'color_hex', color_hex,
          'completado', completado
        ) ORDER BY fecha_evento
      )
      FROM public.eventos_cliente
      WHERE cliente_id = p_cliente_id
      AND EXTRACT(MONTH FROM fecha_evento) = p_mes
      AND EXTRACT(YEAR FROM fecha_evento) = p_año
    ), '[]'::json)
  ) INTO resultado;

  RETURN resultado;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================
-- FUNCIÓN 5: VERIFICAR DOCUMENTOS PENDIENTES DE PROCESAR
-- ============================

CREATE OR REPLACE FUNCTION public.verificar_documentos_pendientes_cliente(
  p_cliente_id UUID
) RETURNS JSON AS $$
DECLARE
  resultado JSON;
BEGIN
  SELECT json_build_object(
    'resumen', json_build_object(
      'total_pendientes', (
        SELECT COUNT(*) FROM public.documentos_tributarios 
        WHERE cliente_id = p_cliente_id AND estado = 'pendiente'
      ),
      'total_vencidos', (
        SELECT COUNT(*) FROM public.documentos_tributarios 
        WHERE cliente_id = p_cliente_id AND estado = 'vencido'
      ),
      'monto_total_pendiente', COALESCE((
        SELECT SUM(monto_total) FROM public.documentos_tributarios 
        WHERE cliente_id = p_cliente_id AND estado IN ('pendiente', 'vencido')
      ), 0)
    ),
    'documentos_criticos', COALESCE((
      SELECT json_agg(
        json_build_object(
          'id', id,
          'tipo_documento', tipo_documento,
          'numero_documento', numero_documento,
          'fecha_emision', fecha_emision,
          'fecha_vencimiento', fecha_vencimiento,
          'monto_total', monto_total,
          'dias_vencido', CASE 
            WHEN fecha_vencimiento < CURRENT_DATE THEN CURRENT_DATE - fecha_vencimiento
            ELSE 0
          END,
          'estado', estado
        ) ORDER BY 
          CASE WHEN fecha_vencimiento < CURRENT_DATE THEN 0 ELSE 1 END,
          fecha_vencimiento
      )
      FROM public.documentos_tributarios
      WHERE cliente_id = p_cliente_id
      AND estado IN ('pendiente', 'vencido')
      AND (fecha_vencimiento < CURRENT_DATE + INTERVAL '7 days' OR estado = 'vencido')
    ), '[]'::json),
    'declaraciones_urgentes', COALESCE((
      SELECT json_agg(
        json_build_object(
          'id', id,
          'tipo_declaracion', tipo_declaracion,
          'periodo', CASE 
            WHEN periodo_mes IS NOT NULL THEN periodo_mes || '/' || periodo_ano
            ELSE periodo_ano::TEXT
          END,
          'fecha_vencimiento', fecha_vencimiento,
          'monto_impuesto', monto_impuesto,
          'dias_para_vencer', fecha_vencimiento - CURRENT_DATE,
          'estado', estado
        ) ORDER BY fecha_vencimiento
      )
      FROM public.declaraciones_tributarias
      WHERE cliente_id = p_cliente_id
      AND estado IN ('pendiente', 'borrador')
      AND fecha_vencimiento <= CURRENT_DATE + INTERVAL '15 days'
    ), '[]'::json)
  ) INTO resultado;

  RETURN resultado;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================
-- PERMISOS PARA LAS FUNCIONES
-- ============================

-- Otorgar permisos de ejecución a usuarios autenticados
GRANT EXECUTE ON FUNCTION public.obtener_resumen_financiero_cliente TO authenticated;
GRANT EXECUTE ON FUNCTION public.obtener_proximos_vencimientos TO authenticated;
GRANT EXECUTE ON FUNCTION public.estadisticas_documentos_periodo TO authenticated;
GRANT EXECUTE ON FUNCTION public.obtener_calendario_tributario_cliente TO authenticated;
GRANT EXECUTE ON FUNCTION public.verificar_documentos_pendientes_cliente TO authenticated;

-- Comentarios para documentación
COMMENT ON FUNCTION public.obtener_resumen_financiero_cliente IS 'Obtiene un resumen financiero completo del cliente para un período específico';
COMMENT ON FUNCTION public.obtener_proximos_vencimientos IS 'Obtiene las próximas declaraciones, documentos y eventos que vencen';
COMMENT ON FUNCTION public.estadisticas_documentos_periodo IS 'Calcula estadísticas de documentos agrupadas por período (semanal, mensual, trimestral)';
COMMENT ON FUNCTION public.obtener_calendario_tributario_cliente IS 'Obtiene el calendario tributario personalizado para un cliente específico';
COMMENT ON FUNCTION public.verificar_documentos_pendientes_cliente IS 'Verifica documentos y declaraciones pendientes que requieren atención inmediata';

-- ✅ SCRIPT COMPLETADO
-- Este script crea las funciones de negocio principales para el portal de clientes
-- Incluye funciones para resúmenes financieros, vencimientos, estadísticas y calendario
-- Ejecutar en Supabase Dashboard > SQL Editor