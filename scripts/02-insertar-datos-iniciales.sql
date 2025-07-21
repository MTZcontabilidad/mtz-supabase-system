-- =====================================================================
-- 📊 SISTEMA MTZ - DATOS INICIALES
-- Script para insertar datos básicos del sistema
-- Ejecutar DESPUÉS del script de estructura
-- =====================================================================

-- =====================================================================
-- 1. INSERTAR ROLES BÁSICOS
-- =====================================================================
INSERT INTO roles (nombre, descripcion, permisos, activo) VALUES
('Administrador', 'Administrador del sistema con acceso completo', '{"*": {"*": true}}', true),
('Colaborador', 'Colaborador con acceso a módulos de gestión', '{"clientes": {"read": true, "write": true}, "ventas": {"read": true, "write": true}, "cobranza": {"read": true, "write": true}, "compras": {"read": true, "write": true}, "reportes": {"read": true}}', true),
('Cliente', 'Cliente con acceso a portal de cliente', '{"portal_clientes": {"read": true}, "documentos": {"read": true}}', true),
('Externo', 'Usuario externo con acceso limitado', '{"requerimientos": {"read": true, "write": true}}', true)
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================================
-- 2. INSERTAR EMPRESA PRINCIPAL
-- =====================================================================
INSERT INTO empresas (rut, razon_social, nombre_fantasia, direccion, telefono, email, sitio_web, categoria, estado) VALUES
('76.123.456-7', 'MTZ Consultores Tributarios SpA', 'MTZ Consultores', 'Av. Providencia 1234, Providencia, Santiago', '+56 2 2345 6789', 'mtzcontabilidad@gmail.com', 'https://mtzconsultores.cl', 'Premium', 'Activo')
ON CONFLICT (rut) DO NOTHING;

-- =====================================================================
-- 3. INSERTAR USUARIO ADMINISTRADOR
-- =====================================================================
INSERT INTO usuarios_sistema (email, nombre_completo, password_hash, rol_id, empresa_asignada, cargo, telefono, activo)
SELECT
    'mtzcontabilidad@gmail.com',
    'Administrador MTZ',
    crypt('Alohomora33.', gen_salt('bf')),
    r.id,
    e.id,
    'Administrador del Sistema',
    '+56 9 8765 4321',
    true
FROM roles r, empresas e
WHERE r.nombre = 'Administrador'
  AND e.rut = '76.123.456-7'
ON CONFLICT (email) DO NOTHING;

-- =====================================================================
-- 4. INSERTAR EMPRESAS DE EJEMPLO
-- =====================================================================
INSERT INTO empresas (rut, razon_social, nombre_fantasia, direccion, telefono, email, categoria, estado) VALUES
('78.987.654-3', 'Tech Solutions Ltda', 'TechSol', 'Av. Las Condes 5678, Las Condes, Santiago', '+56 2 3456 7890', 'contacto@techsol.cl', 'VIP', 'Activo'),
('79.456.789-0', 'Restaurante El Buen Sabor', 'El Buen Sabor', 'Av. Vitacura 9012, Vitacura, Santiago', '+56 2 4567 8901', 'info@elbuensabor.cl', 'Regular', 'Activo'),
('80.234.567-8', 'Constructora Edificios SA', 'Edificios SA', 'Av. Apoquindo 3456, Las Condes, Santiago', '+56 2 5678 9012', 'ventas@edificios.cl', 'Premium', 'Activo'),
('81.345.678-9', 'Farmacia Salud Total', 'Salud Total', 'Av. Providencia 7890, Providencia, Santiago', '+56 2 6789 0123', 'farmacia@saludtotal.cl', 'Regular', 'Activo')
ON CONFLICT (rut) DO NOTHING;

-- =====================================================================
-- 5. INSERTAR CLIENTES DE EJEMPLO
-- =====================================================================
INSERT INTO clientes (empresa_id, rut, nombre_completo, email, telefono, direccion, categoria, estado)
SELECT
    e.id,
    '12.345.678-9',
    'Juan Pérez González',
    'juan.perez@techsol.cl',
    '+56 9 1234 5678',
    'Av. Las Condes 5678, Las Condes, Santiago',
    'VIP',
    'Activo'
FROM empresas e WHERE e.rut = '78.987.654-3'
UNION ALL
SELECT
    e.id,
    '13.456.789-0',
    'María González Silva',
    'maria.gonzalez@elbuensabor.cl',
    '+56 9 2345 6789',
    'Av. Vitacura 9012, Vitacura, Santiago',
    'Regular',
    'Activo'
FROM empresas e WHERE e.rut = '79.456.789-0'
UNION ALL
SELECT
    e.id,
    '14.567.890-1',
    'Carlos Silva Rodríguez',
    'carlos.silva@edificios.cl',
    '+56 9 3456 7890',
    'Av. Apoquindo 3456, Las Condes, Santiago',
    'Premium',
    'Activo'
FROM empresas e WHERE e.rut = '80.234.567-8'
UNION ALL
SELECT
    e.id,
    '15.678.901-2',
    'Ana Rodríguez López',
    'ana.rodriguez@saludtotal.cl',
    '+56 9 4567 8901',
    'Av. Providencia 7890, Providencia, Santiago',
    'Regular',
    'Activo'
FROM empresas e WHERE e.rut = '81.345.678-9';

-- =====================================================================
-- 6. INSERTAR VENTAS DE EJEMPLO
-- =====================================================================
INSERT INTO ventas (cliente_id, numero_factura, fecha_emision, fecha_vencimiento, monto_subtotal, monto_iva, monto_total, estado, forma_pago)
SELECT
    c.id,
    'F001-2024',
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '30 days',
    500000,
    95000,
    595000,
    'Pendiente',
    'Transferencia'
FROM clientes c
WHERE c.rut = '12.345.678-9'
UNION ALL
SELECT
    c.id,
    'F002-2024',
    CURRENT_DATE - INTERVAL '15 days',
    CURRENT_DATE + INTERVAL '15 days',
    750000,
    142500,
    892500,
    'Pagada',
    'Efectivo'
FROM clientes c
WHERE c.rut = '13.456.789-0'
UNION ALL
SELECT
    c.id,
    'F003-2024',
    CURRENT_DATE - INTERVAL '7 days',
    CURRENT_DATE + INTERVAL '23 days',
    1200000,
    228000,
    1428000,
    'Pendiente',
    'Cheque'
FROM clientes c
WHERE c.rut = '14.567.890-1';

-- =====================================================================
-- 7. INSERTAR COBRANZAS DE EJEMPLO
-- =====================================================================
INSERT INTO cobranzas (venta_id, cliente_id, monto, fecha_pago, forma_pago, estado)
SELECT
    v.id,
    v.cliente_id,
    v.monto_total,
    CURRENT_DATE - INTERVAL '5 days',
    'Transferencia',
    'Pagado'
FROM ventas v
WHERE v.numero_factura = 'F002-2024';

-- =====================================================================
-- 8. INSERTAR CONTRATOS DE EJEMPLO
-- =====================================================================
INSERT INTO contratos (cliente_id, numero_contrato, fecha_inicio, fecha_fin, monto_mensual, estado, tipo_servicio)
SELECT
    c.id,
    'C001-2024',
    CURRENT_DATE - INTERVAL '90 days',
    CURRENT_DATE + INTERVAL '275 days',
    150000,
    'Activo',
    'Contabilidad Mensual'
FROM clientes c
WHERE c.rut = '12.345.678-9'
UNION ALL
SELECT
    c.id,
    'C002-2024',
    CURRENT_DATE - INTERVAL '60 days',
    CURRENT_DATE + INTERVAL '305 days',
    200000,
    'Activo',
    'Contabilidad y Declaraciones'
FROM clientes c
WHERE c.rut = '14.567.890-1';

-- =====================================================================
-- 9. INSERTAR RRHH DE EJEMPLO
-- =====================================================================
INSERT INTO rrhh (empresa_id, rut, nombre_completo, email, telefono, cargo, fecha_ingreso, salario, estado)
SELECT
    e.id,
    '16.789.012-3',
    'Pedro López Martínez',
    'pedro.lopez@techsol.cl',
    '+56 9 5678 9012',
    'Contador Senior',
    CURRENT_DATE - INTERVAL '365 days',
    1200000,
    'Activo'
FROM empresas e WHERE e.rut = '78.987.654-3'
UNION ALL
SELECT
    e.id,
    '17.890.123-4',
    'Carmen Martínez Díaz',
    'carmen.martinez@edificios.cl',
    '+56 9 6789 0123',
    'Contador',
    CURRENT_DATE - INTERVAL '180 days',
    900000,
    'Activo'
FROM empresas e WHERE e.rut = '80.234.567-8';

-- =====================================================================
-- 10. INSERTAR PROYECCIONES DE EJEMPLO
-- =====================================================================
INSERT INTO proyecciones (empresa_id, tipo, periodo, monto, estado, fecha_proyeccion)
SELECT
    e.id,
    'Ventas',
    '2024-Q1',
    5000000,
    'Pendiente',
    CURRENT_DATE
FROM empresas e WHERE e.rut = '78.987.654-3'
UNION ALL
SELECT
    e.id,
    'Gastos',
    '2024-Q1',
    3000000,
    'Pendiente',
    CURRENT_DATE
FROM empresas e WHERE e.rut = '78.987.654-3'
UNION ALL
SELECT
    e.id,
    'Ventas',
    '2024-Q1',
    8000000,
    'Pendiente',
    CURRENT_DATE
FROM empresas e WHERE e.rut = '80.234.567-8';

-- =====================================================================
-- 11. INSERTAR ASIGNACIONES DE EJEMPLO
-- =====================================================================
INSERT INTO asignaciones (usuario_id, cliente_id, tipo_asignacion, estado)
SELECT
    u.id,
    c.id,
    'Principal',
    'Activo'
FROM usuarios_sistema u, clientes c
WHERE u.email = 'mtzcontabilidad@gmail.com'
  AND c.rut = '12.345.678-9'
UNION ALL
SELECT
    u.id,
    c.id,
    'Principal',
    'Activo'
FROM usuarios_sistema u, clientes c
WHERE u.email = 'mtzcontabilidad@gmail.com'
  AND c.rut = '14.567.890-1';

-- =====================================================================
-- 12. VERIFICAR DATOS INSERTADOS
-- =====================================================================
SELECT '=== DATOS INSERTADOS ===' as info;

SELECT 'Roles:' as tabla, COUNT(*) as cantidad FROM roles
UNION ALL
SELECT 'Empresas:', COUNT(*) FROM empresas
UNION ALL
SELECT 'Usuarios:', COUNT(*) FROM usuarios_sistema
UNION ALL
SELECT 'Clientes:', COUNT(*) FROM clientes
UNION ALL
SELECT 'Ventas:', COUNT(*) FROM ventas
UNION ALL
SELECT 'Cobranzas:', COUNT(*) FROM cobranzas
UNION ALL
SELECT 'Contratos:', COUNT(*) FROM contratos
UNION ALL
SELECT 'RRHH:', COUNT(*) FROM rrhh
UNION ALL
SELECT 'Proyecciones:', COUNT(*) FROM proyecciones
UNION ALL
SELECT 'Asignaciones:', COUNT(*) FROM asignaciones;

-- =====================================================================
-- ✅ DATOS INICIALES INSERTADOS EXITOSAMENTE
-- =====================================================================
-- Ahora puedes ejecutar el script de configuración de RLS
