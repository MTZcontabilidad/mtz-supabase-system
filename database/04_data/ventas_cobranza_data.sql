-- =====================================================================
-- 📊 DATOS DE EJEMPLO - VENTAS Y COBRANZA MTZ
-- Archivo: 04_data/ventas_cobranza_data.sql
-- Propósito: Insertar datos de ejemplo para testing
-- =====================================================================

-- =====================================================================
-- 📈 INSERTAR SERVICIOS (CATÁLOGO)
-- =====================================================================

INSERT INTO public.servicios (codigo, nombre, descripcion, precio_base, categoria) VALUES
('CONT-001', 'Contabilidad Mensual', 'Servicios de contabilidad mensual incluyendo libro diario, mayor y balance', 150000, 'Contabilidad'),
('CONT-002', 'Declaración IVA', 'Declaración mensual de IVA con libro de compras y ventas', 80000, 'Tributario'),
('CONT-003', 'Declaración Renta', 'Declaración anual de renta con todos los formularios', 250000, 'Tributario'),
('CONT-004', 'Auditoría Financiera', 'Auditoría completa de estados financieros', 500000, 'Auditoría'),
('CONT-005', 'Asesoría Tributaria', 'Asesoría personalizada en materia tributaria', 120000, 'Asesoría'),
('CONT-006', 'Nómina y Remuneraciones', 'Cálculo y emisión de liquidaciones de sueldo', 100000, 'Contabilidad'),
('CONT-007', 'Declaración F29', 'Declaración de retenciones de IVA', 60000, 'Tributario'),
('CONT-008', 'Balances Mensuales', 'Elaboración de balances mensuales detallados', 90000, 'Contabilidad');

-- =====================================================================
-- 📊 INSERTAR VENTAS (FACTURAS)
-- =====================================================================

-- Obtener IDs de clientes existentes
DO $$
DECLARE
    cliente_record RECORD;
    venta_id INTEGER;
    fecha_emision DATE;
    fecha_vencimiento DATE;
    monto_neto DECIMAL(15,2);
    monto_total DECIMAL(15,2);
    iva DECIMAL(15,2);
    servicios_array TEXT[] := ARRAY['Contabilidad', 'Tributario', 'Auditoría', 'Asesoría'];
    servicio TEXT;
    contador INTEGER := 1;
BEGIN
    -- Crear ventas para cada cliente
    FOR cliente_record IN SELECT id_cliente, razon_social, total_facturado FROM public.clientes_contables LIMIT 8
    LOOP
        -- Crear 2-3 ventas por cliente
        FOR i IN 1..3 LOOP
            servicio := servicios_array[1 + (contador % array_length(servicios_array, 1))];
            fecha_emision := CURRENT_DATE - INTERVAL '30 days' * i;
            fecha_vencimiento := fecha_emision + INTERVAL '30 days';
            monto_neto := (cliente_record.total_facturado * 0.1) + (i * 50000);
            iva := monto_neto * 0.19;
            monto_total := monto_neto + iva;

            -- Insertar venta
            INSERT INTO public.ventas (
                numero_factura,
                cliente_id,
                fecha_emision,
                fecha_vencimiento,
                monto_neto,
                iva,
                monto_total,
                estado,
                tipo_servicio,
                descripcion,
                emitida_por_id
            ) VALUES (
                'FAC-' || LPAD(contador::TEXT, 6, '0'),
                cliente_record.id_cliente,
                fecha_emision,
                fecha_vencimiento,
                monto_neto,
                iva,
                monto_total,
                CASE WHEN i = 1 THEN 'Pagada' WHEN i = 2 THEN 'Emitida' ELSE 'Vencida' END,
                servicio,
                'Servicios de ' || servicio || ' para ' || cliente_record.razon_social,
                (SELECT id FROM public.usuarios_sistema LIMIT 1)
            ) RETURNING id INTO venta_id;

            -- Crear cobranza si no está pagada
            IF i > 1 THEN
                INSERT INTO public.cobranzas (
                    venta_id,
                    cliente_id,
                    numero_factura,
                    monto_pendiente,
                    fecha_vencimiento,
                    estado,
                    prioridad,
                    descripcion,
                    asignado_a_id
                ) VALUES (
                    venta_id,
                    cliente_record.id_cliente,
                    'FAC-' || LPAD(contador::TEXT, 6, '0'),
                    monto_total,
                    fecha_vencimiento,
                    CASE WHEN i = 2 THEN 'Pendiente' ELSE 'Vencido' END,
                    CASE WHEN i = 2 THEN 'Media' ELSE 'Alta' END,
                    'Cobranza pendiente por servicios de ' || servicio,
                    (SELECT id FROM public.usuarios_sistema LIMIT 1)
                );
            END IF;

            contador := contador + 1;
        END LOOP;
    END LOOP;
END $$;

-- =====================================================================
-- 📋 INSERTAR DETALLES DE VENTA
-- =====================================================================

-- Crear detalles para las ventas existentes
DO $$
DECLARE
    venta_record RECORD;
    servicio_record RECORD;
    subtotal DECIMAL(15,2);
BEGIN
    FOR venta_record IN SELECT id, monto_neto, tipo_servicio FROM public.ventas
    LOOP
        -- Seleccionar servicio aleatorio de la categoría
        SELECT id, precio_base INTO servicio_record
        FROM public.servicios
        WHERE categoria = venta_record.tipo_servicio
        AND activo = true
        ORDER BY RANDOM()
        LIMIT 1;

        IF FOUND THEN
            subtotal := servicio_record.precio_base;

            INSERT INTO public.detalles_venta (
                venta_id,
                servicio_id,
                descripcion,
                cantidad,
                precio_unitario,
                subtotal
            ) VALUES (
                venta_record.id,
                servicio_record.id,
                'Servicio de ' || venta_record.tipo_servicio,
                1,
                servicio_record.precio_base,
                subtotal
            );
        END IF;
    END LOOP;
END $$;

-- =====================================================================
-- ✅ VERIFICACIÓN DE DATOS INSERTADOS
-- =====================================================================

-- Mostrar resumen de datos insertados
SELECT '📊 RESUMEN DE DATOS INSERTADOS' as seccion, '' as detalle
UNION ALL
SELECT '===================' as seccion, '' as detalle
UNION ALL
SELECT 'Servicios' as seccion, COUNT(*)::text || ' servicios creados' as detalle FROM public.servicios
UNION ALL
SELECT 'Ventas' as seccion, COUNT(*)::text || ' facturas creadas' as detalle FROM public.ventas
UNION ALL
SELECT 'Cobranzas' as seccion, COUNT(*)::text || ' cobranzas pendientes' as detalle FROM public.cobranzas
UNION ALL
SELECT 'Detalles' as seccion, COUNT(*)::text || ' items de factura' as detalle FROM public.detalles_venta
UNION ALL
SELECT '' as seccion, '' as detalle
UNION ALL
SELECT '💰 FACTURACIÓN TOTAL' as seccion, '' as detalle
UNION ALL
SELECT '===================' as seccion, '' as detalle
UNION ALL
SELECT 'Monto Total' as seccion, '$' || ROUND(SUM(monto_total)/1000000, 1) || 'M' as detalle FROM public.ventas
UNION ALL
SELECT 'Pendiente' as seccion, '$' || ROUND(SUM(monto_pendiente)/1000000, 1) || 'M' as detalle FROM public.cobranzas WHERE estado = 'Pendiente'
UNION ALL
SELECT 'Vencido' as seccion, '$' || ROUND(SUM(monto_pendiente)/1000000, 1) || 'M' as detalle FROM public.cobranzas WHERE estado = 'Vencido';

-- ✅ DATOS DE VENTAS Y COBRANZA INSERTADOS EXITOSAMENTE
