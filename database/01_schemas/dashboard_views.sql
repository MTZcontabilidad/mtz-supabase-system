-- =====================================================================
-- 📊 VISTAS DEL DASHBOARD MTZ
-- Archivo: 01_schemas/dashboard_views.sql
-- Propósito: Vistas optimizadas para métricas del dashboard
-- Dependencias: public.clientes_contables, public.usuarios_sistema, public.asignaciones_trabajo
-- =====================================================================

-- Vista principal de estadísticas del dashboard
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM public.clientes_contables) as total_clientes,
    (SELECT SUM(total_facturado) FROM public.clientes_contables) as facturacion_total,
    (SELECT COUNT(*) FROM public.clientes_contables WHERE estado = 'Activo') as clientes_activos,
    (SELECT COUNT(*) FROM public.usuarios_sistema WHERE activo = true) as usuarios_activos,
    (SELECT COUNT(*) FROM public.asignaciones_trabajo WHERE estado = 'pendiente') as tareas_pendientes,
    (SELECT COUNT(*) FROM public.asignaciones_trabajo WHERE fecha_vencimiento < CURRENT_DATE AND estado != 'completado') as tareas_vencidas;

-- Vista de actividad reciente
CREATE OR REPLACE VIEW public.actividad_reciente AS
SELECT 
    'cliente' as tipo,
    id_cliente as referencia,
    razon_social as descripcion,
    created_at as fecha
FROM public.clientes_contables 
WHERE created_at > CURRENT_DATE - INTERVAL '30 days'

UNION ALL

SELECT 
    'usuario' as tipo,
    id::text as referencia,
    'Usuario ' || nombre_completo || ' creado' as descripcion,
    created_at as fecha
FROM public.usuarios_sistema 
WHERE created_at > CURRENT_DATE - INTERVAL '30 days'

UNION ALL

SELECT 
    'asignacion' as tipo,
    id::text as referencia,
    'Asignación ' || tipo_trabajo || ' para cliente ' || cliente_id as descripcion,
    fecha_asignacion as fecha
FROM public.asignaciones_trabajo 
WHERE fecha_asignacion > CURRENT_DATE - INTERVAL '30 days'

ORDER BY fecha DESC
LIMIT 50;

-- Comentarios para documentación
COMMENT ON VIEW public.dashboard_stats IS 'Estadísticas principales para el dashboard MTZ';
COMMENT ON VIEW public.actividad_reciente IS 'Actividad reciente del sistema (últimos 30 días)';

-- ✅ VISTAS DASHBOARD CREADAS EXITOSAMENTE
