-- =====================================================
-- SCRIPT 4: DATOS DE EJEMPLO PARA TESTING
-- Sistema MTZ v3.0 - Portal de Clientes
-- =====================================================

-- ⚠️ IMPORTANTE: Este script es solo para testing y desarrollo
-- No ejecutar en producción sin revisar los datos

-- ============================
-- INSERTAR DOCUMENTOS TRIBUTARIOS DE EJEMPLO
-- ============================

-- Primero, obtener un cliente existente para asociar los documentos
DO $$ 
DECLARE
    cliente_ejemplo_id UUID;
    cliente_ejemplo_2_id UUID;
BEGIN
    -- Obtener el primer cliente existente
    SELECT id INTO cliente_ejemplo_id 
    FROM public.clientes_contables 
    WHERE activo = true 
    LIMIT 1;
    
    -- Obtener el segundo cliente existente
    SELECT id INTO cliente_ejemplo_2_id 
    FROM public.clientes_contables 
    WHERE activo = true AND id != cliente_ejemplo_id
    LIMIT 1;

    -- Solo insertar si tenemos clientes
    IF cliente_ejemplo_id IS NOT NULL THEN
        
        -- Insertar facturas de ejemplo para el cliente 1
        INSERT INTO public.documentos_tributarios (
            cliente_id, tipo_documento, numero_documento, fecha_emision, fecha_vencimiento,
            rut_emisor, nombre_emisor, monto_neto, monto_iva, monto_total, estado, observaciones
        ) VALUES
        -- Facturas del mes actual
        (cliente_ejemplo_id, 'factura', 'F-001-2025', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 
         '12345678-9', 'Proveedor Ejemplo S.A.', 840336, 159664, 1000000, 'pendiente', 'Factura por servicios de consultoría'),
        
        (cliente_ejemplo_id, 'factura', 'F-002-2025', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days',
         '98765432-1', 'Servicios Integrales Ltda.', 420168, 79832, 500000, 'pendiente', 'Factura por arriendo de oficinas'),
        
        (cliente_ejemplo_id, 'boleta', 'B-001-2025', CURRENT_DATE - INTERVAL '3 days', NULL,
         '11111111-1', 'Comercial El Ejemplo', 126050, 23950, 150000, 'pagado', 'Compra de suministros de oficina'),
        
        -- Facturas vencidas (para testing de alertas)
        (cliente_ejemplo_id, 'factura', 'F-045-2024', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '15 days',
         '55555555-5', 'Proveedor Vencido S.A.', 2520000, 478800, 2998800, 'vencido', 'Factura vencida - requiere seguimiento'),
        
        -- Facturas pagadas del mes anterior
        (cliente_ejemplo_id, 'factura', 'F-050-2024', CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE - INTERVAL '5 days',
         '33333333-3', 'Servicios Pagados Ltda.', 1260000, 239400, 1499400, 'pagado', 'Factura pagada dentro del plazo'),
        
        -- Nota de crédito
        (cliente_ejemplo_id, 'nota_credito', 'NC-001-2025', CURRENT_DATE - INTERVAL '2 days', NULL,
         '12345678-9', 'Proveedor Ejemplo S.A.', -84034, -15966, -100000, 'procesado', 'Nota de crédito por devolución'),
        
        -- Factura exenta
        (cliente_ejemplo_id, 'factura_exenta', 'FE-001-2025', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE + INTERVAL '23 days',
         '77777777-7', 'Servicios Exentos SpA', 800000, 0, 800000, 'pendiente', 'Servicios exentos de IVA');
        
        -- Si tenemos un segundo cliente, insertar algunos documentos para él también
        IF cliente_ejemplo_2_id IS NOT NULL THEN
            INSERT INTO public.documentos_tributarios (
                cliente_id, tipo_documento, numero_documento, fecha_emision, fecha_vencimiento,
                rut_emisor, nombre_emisor, monto_neto, monto_iva, monto_total, estado, observaciones
            ) VALUES
            (cliente_ejemplo_2_id, 'factura', 'F-100-2025', CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE + INTERVAL '22 days',
             '88888888-8', 'Gran Proveedor S.A.', 1680000, 319200, 1999200, 'pendiente', 'Factura por servicios mensuales'),
            
            (cliente_ejemplo_2_id, 'boleta', 'B-200-2025', CURRENT_DATE - INTERVAL '1 day', NULL,
             '99999999-9', 'Retail Express', 42017, 7983, 50000, 'pagado', 'Compra de materiales');
        END IF;
        
        RAISE NOTICE 'Documentos tributarios de ejemplo insertados correctamente';
    ELSE
        RAISE NOTICE 'No se encontraron clientes activos. Primero debe tener clientes en la tabla clientes_contables';
    END IF;
END $$;

-- ============================
-- INSERTAR DECLARACIONES TRIBUTARIAS DE EJEMPLO
-- ============================

DO $$ 
DECLARE
    cliente_ejemplo_id UUID;
    cliente_ejemplo_2_id UUID;
BEGIN
    -- Obtener clientes existentes
    SELECT id INTO cliente_ejemplo_id 
    FROM public.clientes_contables 
    WHERE activo = true 
    LIMIT 1;
    
    SELECT id INTO cliente_ejemplo_2_id 
    FROM public.clientes_contables 
    WHERE activo = true AND id != cliente_ejemplo_id
    LIMIT 1;

    IF cliente_ejemplo_id IS NOT NULL THEN
        
        -- Declaraciones de IVA (F29)
        INSERT INTO public.declaraciones_tributarias (
            cliente_id, tipo_declaracion, periodo_mes, periodo_ano, 
            monto_base, monto_impuesto, monto_retencion, monto_diferencia,
            estado, fecha_vencimiento, observaciones
        ) VALUES
        -- F29 del mes anterior (ya vencida)
        (cliente_ejemplo_id, 'f29', EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')::INTEGER, 
         EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month')::INTEGER,
         5000000, 950000, 0, 950000, 'vencida', 
         DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '12 days', 
         'F29 vencido - requiere presentación urgente'),
        
        -- F29 del mes actual (pendiente)
        (cliente_ejemplo_id, 'f29', EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER, 
         EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
         3500000, 665000, 0, 665000, 'pendiente', 
         DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + INTERVAL '12 days',
         'F29 mes actual - en proceso'),
        
        -- Retenciones (F50)
        (cliente_ejemplo_id, 'f50', EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER, 
         EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
         1200000, 120000, 120000, 0, 'pendiente',
         DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + INTERVAL '12 days',
         'Retenciones mes actual'),
        
        -- Declaración de Renta anual (si estamos en época)
        (cliente_ejemplo_id, 'renta', NULL, EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 year')::INTEGER,
         120000000, 2400000, 500000, 1900000, 'pendiente',
         MAKE_DATE(EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER, 4, 30),
         'Declaración de Renta año anterior');
        
        -- Declaraciones para el segundo cliente
        IF cliente_ejemplo_2_id IS NOT NULL THEN
            INSERT INTO public.declaraciones_tributarias (
                cliente_id, tipo_declaracion, periodo_mes, periodo_ano, 
                monto_base, monto_impuesto, estado, fecha_vencimiento, observaciones
            ) VALUES
            (cliente_ejemplo_2_id, 'f29', EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER, 
             EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
             2800000, 532000, 'borrador', 
             DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + INTERVAL '14 days',
             'F29 en preparación');
        END IF;
        
        RAISE NOTICE 'Declaraciones tributarias de ejemplo insertadas correctamente';
    END IF;
END $$;

-- ============================
-- INSERTAR EVENTOS DE CLIENTE DE EJEMPLO
-- ============================

DO $$ 
DECLARE
    cliente_ejemplo_id UUID;
    admin_user_id UUID;
BEGIN
    -- Obtener cliente y usuario admin
    SELECT id INTO cliente_ejemplo_id 
    FROM public.clientes_contables 
    WHERE activo = true 
    LIMIT 1;
    
    SELECT user_id INTO admin_user_id
    FROM public.usuarios_sistema
    WHERE rol_id = (SELECT id FROM public.roles WHERE nombre = 'administrador')
    LIMIT 1;

    IF cliente_ejemplo_id IS NOT NULL THEN
        
        INSERT INTO public.eventos_cliente (
            cliente_id, titulo, descripcion, fecha_evento, fecha_recordatorio,
            tipo_evento, prioridad, color_hex, created_by
        ) VALUES
        -- Eventos próximos
        (cliente_ejemplo_id, 'Reunión Revisión Mensual', 
         'Reunión para revisar el estado financiero y tributario del mes',
         CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '3 days',
         'reunion', 'alta', '#8B5CF6', admin_user_id),
        
        (cliente_ejemplo_id, 'Vencimiento Patente Municipal',
         'Recordatorio: vence la segunda cuota de la patente municipal',
         CURRENT_DATE + INTERVAL '15 days', CURRENT_DATE + INTERVAL '10 days',
         'vencimiento', 'media', '#F59E0B', admin_user_id),
        
        (cliente_ejemplo_id, 'Entrega de Documentos',
         'El cliente debe entregar las facturas de compras del mes',
         CURRENT_DATE + INTERVAL '3 days', CURRENT_DATE + INTERVAL '1 day',
         'personalizado', 'alta', '#EF4444', admin_user_id),
        
        -- Evento pasado (completado)
        (cliente_ejemplo_id, 'Declaración F29 Diciembre',
         'F29 presentado exitosamente',
         CURRENT_DATE - INTERVAL '10 days', NULL,
         'declaracion', 'media', '#10B981', admin_user_id);
        
        -- Marcar el evento pasado como completado
        UPDATE public.eventos_cliente 
        SET completado = true 
        WHERE titulo = 'Declaración F29 Diciembre' AND cliente_id = cliente_ejemplo_id;
        
        RAISE NOTICE 'Eventos de cliente de ejemplo insertados correctamente';
    END IF;
END $$;

-- ============================
-- ACTUALIZAR DATOS EXISTENTES PARA MAYOR REALISMO
-- ============================

-- Actualizar algunos clientes existentes con más información
UPDATE public.clientes_contables 
SET 
    telefono = CASE 
        WHEN id IN (SELECT id FROM public.clientes_contables LIMIT 1) THEN '+56 9 8765 4321'
        ELSE telefono 
    END,
    giro = CASE 
        WHEN id IN (SELECT id FROM public.clientes_contables LIMIT 1) THEN 'Servicios de consultoría empresarial'
        ELSE giro 
    END,
    estado = 'activo'
WHERE activo = true;

-- ============================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ============================

-- Mostrar resumen de los datos insertados
DO $$ 
DECLARE
    total_documentos INTEGER;
    total_declaraciones INTEGER;
    total_eventos INTEGER;
    cliente_ejemplo_name TEXT;
BEGIN
    SELECT COUNT(*) INTO total_documentos FROM public.documentos_tributarios;
    SELECT COUNT(*) INTO total_declaraciones FROM public.declaraciones_tributarias;
    SELECT COUNT(*) INTO total_eventos FROM public.eventos_cliente;
    
    SELECT empresa INTO cliente_ejemplo_name 
    FROM public.clientes_contables 
    WHERE activo = true 
    LIMIT 1;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RESUMEN DE DATOS DE EJEMPLO INSERTADOS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total documentos tributarios: %', total_documentos;
    RAISE NOTICE 'Total declaraciones tributarias: %', total_declaraciones;
    RAISE NOTICE 'Total eventos de cliente: %', total_eventos;
    RAISE NOTICE 'Cliente de ejemplo principal: %', COALESCE(cliente_ejemplo_name, 'No encontrado');
    RAISE NOTICE '========================================';
END $$;

-- ============================
-- CONSULTAS DE VERIFICACIÓN RÁPIDA
-- ============================

-- Ver documentos por cliente
SELECT 
    c.empresa,
    dt.tipo_documento,
    dt.numero_documento,
    dt.fecha_emision,
    dt.monto_total,
    dt.estado
FROM public.documentos_tributarios dt
JOIN public.clientes_contables c ON dt.cliente_id = c.id
ORDER BY c.empresa, dt.fecha_emision DESC;

-- Ver próximos vencimientos
SELECT 
    c.empresa,
    'Declaración' as tipo,
    dt.tipo_declaracion,
    dt.fecha_vencimiento,
    dt.monto_impuesto,
    dt.estado
FROM public.declaraciones_tributarias dt
JOIN public.clientes_contables c ON dt.cliente_id = c.id
WHERE dt.fecha_vencimiento >= CURRENT_DATE
ORDER BY dt.fecha_vencimiento;

-- ✅ SCRIPT COMPLETADO
-- Este script inserta datos de ejemplo para poder probar inmediatamente el sistema
-- Incluye documentos tributarios, declaraciones y eventos de ejemplo
-- Los datos se asocian automáticamente a los clientes existentes en el sistema
-- Ejecutar en Supabase Dashboard > SQL Editor