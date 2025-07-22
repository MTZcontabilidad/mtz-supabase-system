-- =====================================================================
-- 👑 INSERTAR ADMINISTRADOR FINAL - SISTEMA MTZ v3.0
-- =====================================================================
-- Script para insertar el usuario administrador después de crear las tablas
-- Ejecutar DESPUÉS de database/DEPLOY_COMPLETO_EXTENSION.sql

-- =====================================================================
-- 📋 PASO 1: OBTENER UUID DEL USUARIO CREADO EN AUTH
-- =====================================================================

-- Ejecuta esta consulta para obtener el UUID del usuario que creaste en Authentication > Users:
SELECT id, email, raw_user_meta_data, created_at
FROM auth.users
WHERE email = 'mtzcontabilidad@gmail.com';

-- =====================================================================
-- 📋 PASO 2: INSERTAR EN USUARIOS_SISTEMA
-- =====================================================================

-- Copia el UUID obtenido y reemplázalo en la siguiente consulta:

-- INSERT INTO public.usuarios_sistema (
--   id,
--   email,
--   nombre_completo,
--   rol_id,
--   activo,
--   telefono,
--   cargo,
--   departamento,
--   created_at,
--   updated_at
-- ) VALUES (
--   'REEMPLAZAR_CON_UUID_REAL', -- Reemplazar con el UUID obtenido
--   'mtzcontabilidad@gmail.com',
--   'Administrador MTZ',
--   1, -- ID del rol Administrador
--   true,
--   '+56 9 1234 5678',
--   'Administrador General',
--   'Administración',
--   NOW(),
--   NOW()
-- );

-- =====================================================================
-- 📋 PASO 3: VERIFICAR INSERCIÓN
-- =====================================================================

-- Después de insertar, ejecuta esta consulta para verificar:

SELECT
  id,
  email,
  nombre_completo,
  rol_id,
  activo,
  created_at
FROM public.usuarios_sistema
WHERE email = 'mtzcontabilidad@gmail.com';

-- =====================================================================
-- 📋 PASO 4: VERIFICAR ROL ASIGNADO
-- =====================================================================

-- Verificar que el rol esté correctamente asignado:

SELECT
  u.email,
  u.nombre_completo,
  r.nombre as rol,
  r.permisos
FROM public.usuarios_sistema u
JOIN public.roles r ON u.rol_id = r.id
WHERE u.email = 'mtzcontabilidad@gmail.com';

-- =====================================================================
-- 📋 PASO 5: INSERTAR DATOS ADICIONALES DE PRUEBA
-- =====================================================================

-- Insertar ventas de prueba
INSERT INTO public.ventas (numero_factura, cliente_id, fecha_emision, fecha_vencimiento, monto_neto, iva, monto_total, estado, tipo_servicio, descripcion, emitida_por_id, metodo_pago, created_at, updated_at) VALUES
('F001-2024', '76.123.456-7', '2024-01-15', '2024-02-15', 500000, 95000, 595000, 'Emitida', 'Contabilidad', 'Servicios de contabilidad mensual - Enero 2024', NULL, 'Transferencia', NOW(), NOW()),
('F002-2024', '78.987.654-3', '2024-01-10', '2024-02-10', 750000, 142500, 892500, 'Pagada', 'Tributario', 'Declaración IVA - Diciembre 2023', NULL, 'Efectivo', NOW(), NOW()),
('F003-2024', '79.456.789-1', '2024-01-08', '2024-02-08', 1200000, 228000, 1428000, 'Vencida', 'Contabilidad', 'Servicios de nómina y remuneraciones - Enero 2024', NULL, 'Cheque', NOW(), NOW())
ON CONFLICT (numero_factura) DO NOTHING;

-- Insertar cobranzas de prueba
INSERT INTO public.cobranzas (venta_id, cliente_id, numero_factura, monto_pendiente, fecha_vencimiento, estado, prioridad, descripcion, asignado_a_id, metodo_pago, created_at, updated_at) VALUES
(1, '76.123.456-7', 'F001-2024', 595000, '2024-02-15', 'Pendiente', 'Media', 'Cliente confiable, pago esperado a tiempo', NULL, 'Transferencia', NOW(), NOW()),
(2, '78.987.654-3', 'F002-2024', 0, '2024-02-10', 'Pagado', 'Baja', 'Pago recibido antes del vencimiento', NULL, 'Efectivo', NOW(), NOW()),
(3, '79.456.789-1', 'F003-2024', 1428000, '2024-02-08', 'Vencido', 'Alta', 'Requiere seguimiento urgente', NULL, 'Cheque', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insertar detalles de venta
INSERT INTO public.detalles_venta (venta_id, servicio_id, descripcion, cantidad, precio_unitario, descuento, subtotal, created_at) VALUES
(1, 1, 'Contabilidad mensual - Enero 2024', 1, 500000, 0, 500000, NOW()),
(2, 2, 'Declaración IVA Diciembre 2023', 1, 350000, 0, 350000, NOW()),
(2, 4, 'Asesoría adicional', 1, 400000, 0, 400000, NOW()),
(3, 3, 'Nómina mensual - Enero 2024', 1, 250000, 0, 250000, NOW()),
(3, 1, 'Contabilidad mensual - Enero 2024', 1, 500000, 0, 500000, NOW()),
(3, 2, 'Declaración IVA Enero 2024', 1, 350000, 0, 350000, NOW())
ON CONFLICT DO NOTHING;

-- Insertar proyecciones de prueba
INSERT INTO public.proyecciones (nombre, descripcion, fecha_inicio, fecha_fin, monto_proyectado, monto_real, estado, tipo_proyeccion, responsable_id, created_at, updated_at) VALUES
('Proyección Q1 2024', 'Proyección de ingresos para el primer trimestre de 2024', '2024-01-01', '2024-03-31', 5000000, 4800000, 'Activa', 'Ingresos', NULL, NOW(), NOW()),
('Proyección Q2 2024', 'Proyección de ingresos para el segundo trimestre de 2024', '2024-04-01', '2024-06-30', 6000000, NULL, 'Activa', 'Ingresos', NULL, NOW(), NOW()),
('Proyección Anual 2024', 'Proyección de ingresos para todo el año 2024', '2024-01-01', '2024-12-31', 25000000, NULL, 'Activa', 'Ingresos', NULL, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================================================================
-- 📋 PASO 6: VERIFICACIÓN FINAL COMPLETA
-- =====================================================================

-- Verificar todos los datos insertados
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
SELECT 'Proyecciones' as tabla, COUNT(*) as total FROM public.proyecciones;

-- =====================================================================
-- ✅ CONFIGURACIÓN COMPLETADA
-- =====================================================================
-- El sistema MTZ está completamente configurado y listo para usar
-- El usuario mtzcontabilidad@gmail.com tiene acceso completo como administrador
