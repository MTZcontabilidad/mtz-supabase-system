-- =====================================================================
-- 📊 DATOS DE PRUEBA COMPLETOS - SISTEMA MTZ v3.0
-- =====================================================================
-- Script para insertar datos de prueba en Supabase
-- Ejecutar en el SQL Editor de Supabase
-- Compatible con la estructura real de las tablas

-- =====================================================================
-- 🎭 DATOS DE ROLES
-- =====================================================================

-- Insertar roles del sistema
INSERT INTO public.roles (nombre, descripcion, permisos, created_at, updated_at) VALUES
('Administrador', 'Acceso completo al sistema', '{"*": true}', NOW(), NOW()),
('Gerente', 'Gestión de operaciones y reportes', '{"clientes": {"read": true, "write": true}, "ventas": {"read": true, "write": true}, "cobranza": {"read": true, "write": true}, "reportes": {"read": true}}', NOW(), NOW()),
('Analista', 'Análisis y reportes', '{"clientes": {"read": true}, "ventas": {"read": true}, "cobranza": {"read": true}, "reportes": {"read": true}}', NOW(), NOW()),
('Asistente', 'Tareas administrativas', '{"clientes": {"read": true}, "ventas": {"read": true}}', NOW(), NOW()),
('Cliente', 'Acceso limitado al portal', '{"clientes": {"read": true}, "ventas": {"read": true}}', NOW(), NOW());

-- =====================================================================
-- 👥 DATOS DE USUARIOS DEL SISTEMA
-- =====================================================================

-- Insertar usuarios de prueba (primero crear en auth.users)
-- Nota: Estos usuarios deben crearse manualmente en Supabase Auth
-- Luego se insertan en usuarios_sistema

INSERT INTO public.usuarios_sistema (id, email, nombre_completo, rol_id, activo, telefono, cargo, departamento, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'mtzcontabilidad@gmail.com', 'Administrador MTZ', 1, true, '+56 9 1234 5678', 'Administrador General', 'Administración', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'gerente@mtz.cl', 'María González', 2, true, '+56 9 2345 6789', 'Gerente de Operaciones', 'Operaciones', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'analista@mtz.cl', 'Carlos Rodríguez', 3, true, '+56 9 3456 7890', 'Analista Senior', 'Análisis', NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', 'asistente@mtz.cl', 'Ana Silva', 4, true, '+56 9 4567 8901', 'Asistente Administrativo', 'Administración', NOW(), NOW()),
('00000000-0000-0000-0000-000000000005', 'cliente@techcorp.cl', 'Juan Pérez', 5, true, '+56 9 5678 9012', 'CEO', 'Dirección', NOW(), NOW());

-- =====================================================================
-- 🏢 DATOS DE EMPRESAS/CLIENTES
-- =====================================================================

-- Insertar empresas de prueba
INSERT INTO public.empresas (razon_social, nombre_fantasia, rut, giro, direccion, comuna, ciudad, region, telefono, email, sitio_web, tipo_empresa, estado, fecha_creacion, observaciones, created_at, updated_at) VALUES
('TechCorp Solutions Ltda.', 'TechCorp', '76.123.456-7', 'Desarrollo de Software y Consultoría Tecnológica', 'Av. Providencia 1234', 'Providencia', 'Santiago', 'Metropolitana', '+56 2 2345 6789', 'contacto@techcorp.cl', 'https://techcorp.cl', 'cliente', 'activa', '2023-01-15', 'Cliente estratégico, excelente historial de pagos', NOW(), NOW()),
('Constructora Norte Ltda.', 'Constructora Norte', '78.987.654-3', 'Construcción y Edificación', 'Av. Las Condes 5678', 'Las Condes', 'Santiago', 'Metropolitana', '+56 2 3456 7890', 'info@constructoranorte.cl', 'https://constructoranorte.cl', 'cliente', 'activa', '2023-03-20', 'Cliente del sector construcción, contratos a largo plazo', NOW(), NOW()),
('Distribuidora Sur SPA', 'Distribuidora Sur', '79.456.789-1', 'Distribución y Logística', 'Camino a Melipilla 9012', 'Melipilla', 'Santiago', 'Metropolitana', '+56 2 4567 8901', 'ventas@distribuidorasur.cl', 'https://distribuidorasur.cl', 'cliente', 'activa', '2023-06-10', 'Cliente del sector logístico, pagos regulares', NOW(), NOW()),
('Consultoría Financiera ABC', 'Consultoría ABC', '76.789.123-4', 'Consultoría Financiera y Tributaria', 'Av. Apoquindo 3456', 'Las Condes', 'Santiago', 'Metropolitana', '+56 2 5678 9012', 'admin@consultoriaabc.cl', 'https://consultoriaabc.cl', 'cliente', 'activa', '2023-08-05', 'Cliente de servicios profesionales, proyectos especializados', NOW(), NOW()),
('Restaurante El Buen Sabor', 'El Buen Sabor', '77.321.654-9', 'Gastronomía y Restauración', 'Av. Vitacura 7890', 'Vitacura', 'Santiago', 'Metropolitana', '+56 2 6789 0123', 'reservas@elbuensabor.cl', 'https://elbuensabor.cl', 'cliente', 'activa', '2023-10-15', 'Cliente del sector gastronómico, facturación mensual', NOW(), NOW());

-- =====================================================================
-- 💰 DATOS DE VENTAS
-- =====================================================================

-- Insertar ventas de prueba
INSERT INTO public.ventas (numero_factura, cliente_id, fecha_emision, fecha_vencimiento, monto_neto, iva, monto_total, estado, tipo_servicio, descripcion, emitida_por_id, metodo_pago, created_at, updated_at) VALUES
('F001-2024', '76.123.456-7', '2024-01-15', '2024-02-15', 500000, 95000, 595000, 'Emitida', 'Contabilidad', 'Servicios de contabilidad mensual - Enero 2024', '00000000-0000-0000-0000-000000000001', 'Transferencia', NOW(), NOW()),
('F002-2024', '78.987.654-3', '2024-01-10', '2024-02-10', 750000, 142500, 892500, 'Pagada', 'Tributario', 'Declaración IVA - Diciembre 2023', '00000000-0000-0000-0000-000000000002', 'Efectivo', NOW(), NOW()),
('F003-2024', '79.456.789-1', '2024-01-08', '2024-02-08', 1200000, 228000, 1428000, 'Vencida', 'Contabilidad', 'Servicios de nómina y remuneraciones - Enero 2024', '00000000-0000-0000-0000-000000000003', 'Cheque', NOW(), NOW()),
('F004-2024', '76.789.123-4', '2024-01-05', '2024-02-05', 350000, 66500, 416500, 'Emitida', 'Asesoría', 'Asesoría tributaria especializada', '00000000-0000-0000-0000-000000000004', 'Transferencia', NOW(), NOW()),
('F005-2024', '77.321.654-9', '2024-01-03', '2024-02-03', 250000, 47500, 297500, 'Emitida', 'Auditoría', 'Auditoría financiera anual 2023', '00000000-0000-0000-0000-000000000001', 'Transferencia', NOW(), NOW());

-- =====================================================================
-- 💳 DATOS DE COBRANZAS
-- =====================================================================

-- Insertar cobranzas de prueba
INSERT INTO public.cobranzas (venta_id, cliente_id, numero_factura, monto_pendiente, fecha_vencimiento, estado, prioridad, descripcion, asignado_a_id, metodo_pago, created_at, updated_at) VALUES
(1, '76.123.456-7', 'F001-2024', 595000, '2024-02-15', 'Pendiente', 'Media', 'Cliente confiable, pago esperado a tiempo', '00000000-0000-0000-0000-000000000002', 'Transferencia', NOW(), NOW()),
(2, '78.987.654-3', 'F002-2024', 0, '2024-02-10', 'Pagado', 'Baja', 'Pago recibido antes del vencimiento', '00000000-0000-0000-0000-000000000002', 'Efectivo', NOW(), NOW()),
(3, '79.456.789-1', 'F003-2024', 1428000, '2024-02-08', 'Vencido', 'Alta', 'Requiere seguimiento urgente', '00000000-0000-0000-0000-000000000003', 'Cheque', NOW(), NOW()),
(4, '76.789.123-4', 'F004-2024', 416500, '2024-02-05', 'Pendiente', 'Media', 'Pago regular, sin problemas', '00000000-0000-0000-0000-000000000004', 'Transferencia', NOW(), NOW()),
(5, '77.321.654-9', 'F005-2024', 297500, '2024-02-03', 'Pendiente', 'Media', 'Cliente nuevo, primer pago', '00000000-0000-0000-0000-000000000001', 'Transferencia', NOW(), NOW());

-- =====================================================================
-- 📈 DATOS DE SERVICIOS
-- =====================================================================

-- Insertar servicios del catálogo
INSERT INTO public.servicios (codigo, nombre, descripcion, precio_base, categoria, activo, created_at, updated_at) VALUES
('SERV-001', 'Contabilidad Mensual', 'Servicios de contabilidad mensual incluyendo balance y estado de resultados', 500000, 'Contabilidad', true, NOW(), NOW()),
('SERV-002', 'Declaración IVA', 'Declaración mensual de IVA y F29', 350000, 'Tributario', true, NOW(), NOW()),
('SERV-003', 'Nómina y Remuneraciones', 'Procesamiento de nómina y cálculo de remuneraciones', 250000, 'Contabilidad', true, NOW(), NOW()),
('SERV-004', 'Asesoría Tributaria', 'Asesoría especializada en temas tributarios', 400000, 'Asesoría', true, NOW(), NOW()),
('SERV-005', 'Auditoría Financiera', 'Auditoría financiera anual completa', 2000000, 'Auditoría', true, NOW(), NOW());

-- =====================================================================
-- 📋 DATOS DE DETALLES DE VENTA
-- =====================================================================

-- Insertar detalles de venta
INSERT INTO public.detalles_venta (venta_id, servicio_id, descripcion, cantidad, precio_unitario, descuento, subtotal, created_at) VALUES
(1, 1, 'Contabilidad mensual - Enero 2024', 1, 500000, 0, 500000, NOW()),
(2, 2, 'Declaración IVA Diciembre 2023', 1, 350000, 0, 350000, NOW()),
(2, 4, 'Asesoría adicional', 1, 400000, 0, 400000, NOW()),
(3, 3, 'Nómina mensual - Enero 2024', 1, 250000, 0, 250000, NOW()),
(3, 1, 'Contabilidad mensual - Enero 2024', 1, 500000, 0, 500000, NOW()),
(3, 2, 'Declaración IVA Enero 2024', 1, 350000, 0, 350000, NOW()),
(4, 4, 'Asesoría tributaria especializada', 1, 400000, 50000, 350000, NOW()),
(5, 5, 'Auditoría financiera anual 2023', 1, 2000000, 0, 2000000, NOW());

-- =====================================================================
-- 📊 DATOS DE PROYECCIONES
-- =====================================================================

-- Insertar proyecciones de prueba
INSERT INTO public.proyecciones (nombre, descripcion, tipo, año, mes_inicio, mes_fin, monto_objetivo, monto_real, porcentaje_cumplimiento, estado, notas, created_at, updated_at) VALUES
('Proyección Ventas Q1 2024', 'Proyección de ventas para el primer trimestre de 2024', 'ventas', 2024, 1, 3, 6000000, 4500000, 75.0, 'en_progreso', 'Proyección ajustada por demanda del mercado', NOW(), NOW()),
('Proyección Cobranza Q1 2024', 'Proyección de cobranza para el primer trimestre de 2024', 'cobranza', 2024, 1, 3, 5500000, 4200000, 76.4, 'en_progreso', 'Cumplimiento del 76% de la proyección', NOW(), NOW()),
('Proyección Ingresos 2024', 'Proyección de ingresos totales para 2024', 'ingresos', 2024, 1, 12, 25000000, 8500000, 34.0, 'en_progreso', 'Excelente rendimiento, superó expectativas del primer trimestre', NOW(), NOW());

-- =====================================================================
-- 👨‍💼 DATOS DE RRHH
-- =====================================================================

-- Insertar empleados de prueba
INSERT INTO public.empleados (nombre, apellido, email, telefono, departamento, cargo, fecha_ingreso, salario_base, estado, created_at, updated_at) VALUES
('Pedro', 'Martínez', 'pedro.martinez@mtz.cl', '+56 9 1111 1111', 'Tecnología', 'Desarrollador Senior', '2023-01-15', 1500000, 'activo', NOW(), NOW()),
('Laura', 'Fernández', 'laura.fernandez@mtz.cl', '+56 9 2222 2222', 'Finanzas', 'Contadora', '2023-03-01', 1200000, 'activo', NOW(), NOW()),
('Roberto', 'Silva', 'roberto.silva@mtz.cl', '+56 9 3333 3333', 'Ventas', 'Vendedor', '2023-06-15', 800000, 'activo', NOW(), NOW()),
('Carmen', 'González', 'carmen.gonzalez@mtz.cl', '+56 9 4444 4444', 'Administración', 'Asistente Administrativo', '2023-08-20', 700000, 'activo', NOW(), NOW()),
('Diego', 'Rodríguez', 'diego.rodriguez@mtz.cl', '+56 9 5555 5555', 'Tecnología', 'Analista de Sistemas', '2023-10-10', 1100000, 'activo', NOW(), NOW());

-- =====================================================================
-- 📋 DATOS DE NÓMINAS
-- =====================================================================

-- Insertar nóminas de prueba
INSERT INTO public.nominas (empleado_id, mes, año, dias_trabajados, salario_base, bonificaciones, descuentos, salario_neto, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000006', 1, 2024, 22, 1500000, 150000, 0, 1650000, NOW(), NOW()),
('00000000-0000-0000-0000-000000000007', 1, 2024, 22, 1200000, 120000, 0, 1320000, NOW(), NOW()),
('00000000-0000-0000-0000-000000000008', 1, 2024, 22, 800000, 80000, 0, 880000, NOW(), NOW()),
('00000000-0000-0000-0000-000000000009', 1, 2024, 22, 700000, 70000, 0, 770000, NOW(), NOW()),
('00000000-0000-0000-0000-000000000010', 1, 2024, 22, 1100000, 110000, 0, 1210000, NOW(), NOW());

-- =====================================================================
-- 🔄 VERIFICACIÓN DE DATOS INSERTADOS
-- =====================================================================

-- Verificar datos insertados
SELECT 'Roles' as tabla, COUNT(*) as total FROM public.roles
UNION ALL
SELECT 'Usuarios Sistema' as tabla, COUNT(*) as total FROM public.usuarios_sistema
UNION ALL
SELECT 'Empresas' as tabla, COUNT(*) as total FROM public.empresas
UNION ALL
SELECT 'Ventas' as tabla, COUNT(*) as total FROM public.ventas
UNION ALL
SELECT 'Cobranzas' as tabla, COUNT(*) as total FROM public.cobranzas
UNION ALL
SELECT 'Servicios' as tabla, COUNT(*) as total FROM public.servicios
UNION ALL
SELECT 'Detalles Venta' as tabla, COUNT(*) as total FROM public.detalles_venta
UNION ALL
SELECT 'Proyecciones' as tabla, COUNT(*) as total FROM public.proyecciones
UNION ALL
SELECT 'Empleados' as tabla, COUNT(*) as total FROM public.empleados
UNION ALL
SELECT 'Nóminas' as tabla, COUNT(*) as total FROM public.nominas;

-- =====================================================================
-- 📊 CONSULTAS DE VERIFICACIÓN ADICIONALES
-- =====================================================================

-- Verificar estructura de roles
SELECT id, nombre, descripcion FROM public.roles ORDER BY id;

-- Verificar usuarios del sistema
SELECT id, email, nombre_completo, rol_id, activo FROM public.usuarios_sistema ORDER BY id;

-- Verificar empresas
SELECT razon_social, rut, tipo_empresa, estado FROM public.empresas ORDER BY razon_social;

-- Verificar ventas
SELECT numero_factura, cliente_id, monto_total, estado FROM public.ventas ORDER BY fecha_emision;

-- Verificar cobranzas
SELECT numero_factura, monto_pendiente, estado, prioridad FROM public.cobranzas ORDER BY fecha_vencimiento;

-- =====================================================================
-- ✅ SCRIPT COMPLETADO EXITOSAMENTE
-- =====================================================================
