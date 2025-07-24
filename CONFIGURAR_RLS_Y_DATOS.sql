-- =====================================================================
-- 🔐 CONFIGURAR RLS Y INSERTAR DATOS - SISTEMA MTZ
-- =====================================================================
-- Script para configurar políticas RLS e insertar datos de ejemplo
-- =====================================================================

-- =====================================================================
-- 🔐 CONFIGURAR POLÍTICAS RLS
-- =====================================================================

-- Políticas para clientes_contables
DROP POLICY IF EXISTS "Permitir acceso completo a clientes_contables" ON public.clientes_contables;
CREATE POLICY "Permitir acceso completo a clientes_contables" ON public.clientes_contables
    FOR ALL USING (true) WITH CHECK (true);

-- Políticas para empleados
DROP POLICY IF EXISTS "Permitir acceso completo a empleados" ON public.empleados;
CREATE POLICY "Permitir acceso completo a empleados" ON public.empleados
    FOR ALL USING (true) WITH CHECK (true);

-- Políticas para nominas
DROP POLICY IF EXISTS "Permitir acceso completo a nominas" ON public.nominas;
CREATE POLICY "Permitir acceso completo a nominas" ON public.nominas
    FOR ALL USING (true) WITH CHECK (true);

-- =====================================================================
-- 📊 INSERTAR DATOS DE EJEMPLO
-- =====================================================================

-- Clientes de ejemplo
INSERT INTO public.clientes_contables (
    id_cliente, razon_social, rut, giro, direccion, comuna, ciudad, region,
    telefono, email, regimen_tributario, categoria_iva, estado, categoria,
    total_facturado, saldo_pendiente
) VALUES
    ('CLI-0001', 'Empresa Ejemplo 1 SPA', '76.123.456-7', 'Servicios de Consultoría', 'Av. Providencia 123', 'Providencia', 'Santiago', 'Metropolitana', '+56 2 2345 6789', 'contacto@empresa1.cl', 'General', 'Afecto', 'Activo', 'Mediana', 2500000, 500000),
    ('CLI-0002', 'Comercial Ejemplo 2 Ltda.', '77.234.567-8', 'Comercio al por menor', 'Calle Las Condes 456', 'Las Condes', 'Santiago', 'Metropolitana', '+56 2 3456 7890', 'ventas@empresa2.cl', 'General', 'Afecto', 'Activo', 'Grande', 5000000, 1200000),
    ('CLI-0003', 'Servicios Ejemplo 3 EIRL', '78.345.678-9', 'Servicios profesionales', 'Av. Vitacura 789', 'Vitacura', 'Santiago', 'Metropolitana', '+56 2 4567 8901', 'info@empresa3.cl', 'Pyme', 'Afecto', 'Activo', 'Pequeña', 800000, 150000),
    ('CLI-0004', 'Constructora Ejemplo 4 SPA', '79.456.789-0', 'Construcción', 'Calle Apoquindo 321', 'Las Condes', 'Santiago', 'Metropolitana', '+56 2 5678 9012', 'proyectos@empresa4.cl', 'General', 'Afecto', 'Activo', 'Grande', 8000000, 2000000),
    ('CLI-0005', 'Restaurante Ejemplo 5 Ltda.', '80.567.890-1', 'Servicios de alimentación', 'Av. Manquehue 654', 'Las Condes', 'Santiago', 'Metropolitana', '+56 2 6789 0123', 'reservas@empresa5.cl', 'General', 'Afecto', 'Activo', 'Mediana', 1200000, 300000)
ON CONFLICT (id_cliente) DO NOTHING;

-- Empleados de ejemplo
INSERT INTO public.empleados (
    rut, nombres, apellidos, email, telefono, direccion, fecha_nacimiento,
    fecha_contratacion, cargo, departamento, salario_base, tipo_contrato, estado
) VALUES
    ('12.345.678-9', 'Juan Carlos', 'Pérez González', 'juan.perez@mtz.cl', '+56 9 1234 5678', 'Av. Las Condes 1234', '1985-03-15', '2023-01-15', 'Contador Senior', 'Contabilidad', 1200000, 'Indefinido', 'Activo'),
    ('23.456.789-0', 'María Elena', 'Rodríguez Silva', 'maria.rodriguez@mtz.cl', '+56 9 2345 6789', 'Calle Providencia 567', '1990-07-22', '2023-03-01', 'Asistente Contable', 'Contabilidad', 800000, 'Indefinido', 'Activo'),
    ('34.567.890-1', 'Carlos Alberto', 'Mendoza López', 'carlos.mendoza@mtz.cl', '+56 9 3456 7890', 'Av. Vitacura 890', '1988-11-10', '2023-02-10', 'Auditor', 'Auditoría', 1500000, 'Indefinido', 'Activo'),
    ('45.678.901-2', 'Ana Patricia', 'Silva Morales', 'ana.silva@mtz.cl', '+56 9 4567 8901', 'Calle Apoquindo 456', '1992-05-18', '2023-04-01', 'Contador Junior', 'Contabilidad', 900000, 'Indefinido', 'Activo'),
    ('56.789.012-3', 'Roberto Andrés', 'González Herrera', 'roberto.gonzalez@mtz.cl', '+56 9 5678 9012', 'Av. Manquehue 789', '1987-09-25', '2023-05-15', 'Auditor Senior', 'Auditoría', 1800000, 'Indefinido', 'Activo')
ON CONFLICT (rut) DO NOTHING;

-- Nóminas de ejemplo
INSERT INTO public.nominas (
    empleado_id, mes, año, fecha_pago, sueldo_base, horas_extras, bonificaciones,
    total_haberes, afp, salud, mutual, total_descuentos, liquido_pagable, estado
) VALUES
    (1, 1, 2025, '2025-01-31', 1200000, 50000, 100000, 1350000, 108000, 81000, 13500, 202500, 1147500, 'Pagada'),
    (2, 1, 2025, '2025-01-31', 800000, 30000, 50000, 880000, 72000, 54000, 9000, 135000, 745000, 'Pagada'),
    (3, 1, 2025, '2025-01-31', 1500000, 75000, 150000, 1725000, 135000, 101250, 16875, 253125, 1471875, 'Pagada')
ON CONFLICT (empleado_id, mes, año) DO NOTHING;

-- =====================================================================
-- ✅ VERIFICAR INSERCIÓN
-- =====================================================================

SELECT '🎉 DATOS INSERTADOS EXITOSAMENTE' as resultado;
SELECT '📊 REGISTROS INSERTADOS:' as mensaje;

SELECT 'clientes_contables' as tabla, COUNT(*) as registros FROM public.clientes_contables
UNION ALL
SELECT 'empleados' as tabla, COUNT(*) as registros FROM public.empleados
UNION ALL
SELECT 'nominas' as tabla, COUNT(*) as registros FROM public.nominas;

-- =====================================================================
-- 🔍 VERIFICAR FUNCIONALIDADES
-- =====================================================================

SELECT '🔍 VERIFICANDO FUNCIONALIDADES:' as mensaje;

SELECT 'cobranzas' as tabla, COUNT(*) as registros FROM public.cobranzas
UNION ALL
SELECT 'ventas' as tabla, COUNT(*) as registros FROM public.ventas;

-- =====================================================================
-- 🎯 ¡CORRECCIÓN COMPLETADA!
-- =====================================================================
-- Ahora recarga la aplicación en http://localhost:3001/
-- Todos los errores 400 y 404 deberían estar resueltos
-- =====================================================================
