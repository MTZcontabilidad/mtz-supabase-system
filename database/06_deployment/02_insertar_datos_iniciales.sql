-- =====================================================
-- SCRIPT 2: INSERTAR DATOS INICIALES Y DE PRUEBA
-- =====================================================
-- Este script inserta datos básicos para que el sistema funcione

-- =====================================================
-- 1. INSERTAR ROLES BÁSICOS
-- =====================================================
INSERT INTO roles (nombre, descripcion, permisos) VALUES
    ('admin', 'Administrador del sistema con acceso completo', '{"all": true}'),
    ('colaborador', 'Colaborador del equipo con acceso limitado', '{"read": true, "write": true, "delete": false}'),
    ('cliente', 'Cliente del sistema con acceso solo a sus datos', '{"read": true, "write": false, "delete": false}')
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- 2. INSERTAR USUARIO ADMINISTRADOR
-- =====================================================
INSERT INTO usuarios (email, nombre, apellido, rol_id, activo) VALUES
    ('admin@mtz.cl', 'Administrador', 'Sistema', (SELECT id FROM roles WHERE nombre = 'admin'), true),
    ('carlos@mtz.cl', 'Carlos', 'Administrador', (SELECT id FROM roles WHERE nombre = 'admin'), true),
    ('colaborador@mtz.cl', 'Juan', 'Colaborador', (SELECT id FROM roles WHERE nombre = 'colaborador'), true)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 3. INSERTAR EMPRESAS DE EJEMPLO
-- =====================================================
INSERT INTO empresas_contables (nombre, rut, direccion, telefono, email, representante_legal, giro, estado) VALUES
    ('Empresa Ejemplo SPA', '12345678-9', 'Av. Principal 123, Santiago', '+56912345678', 'contacto@empresa.cl', 'Juan Pérez', 'Servicios Contables', 'activo'),
    ('Comercial ABC Ltda', '98765432-1', 'Calle Comercial 456, Valparaíso', '+56987654321', 'info@comercialabc.cl', 'María González', 'Comercio al por menor', 'activo'),
    ('Servicios XYZ EIRL', '45678912-3', 'Pasaje Servicios 789, Concepción', '+56945678912', 'ventas@serviciosxyz.cl', 'Pedro Rodríguez', 'Servicios de consultoría', 'activo'),
    ('Constructora Delta SpA', '78912345-6', 'Av. Construcción 321, Antofagasta', '+56978912345', 'proyectos@constructora.cl', 'Ana Silva', 'Construcción', 'activo'),
    ('Distribuidora Omega Ltda', '32165498-7', 'Calle Distribución 654, La Serena', '+56932165498', 'logistica@distribuidora.cl', 'Luis Morales', 'Distribución y logística', 'activo')
ON CONFLICT (rut) DO NOTHING;

-- =====================================================
-- 4. INSERTAR ASIGNACIONES DE USUARIOS A EMPRESAS
-- =====================================================
INSERT INTO asignaciones (usuario_id, empresa_id, rol_asignado) VALUES
    ((SELECT id FROM usuarios WHERE email = 'carlos@mtz.cl'), (SELECT id FROM empresas_contables WHERE rut = '12345678-9'), 'admin'),
    ((SELECT id FROM usuarios WHERE email = 'colaborador@mtz.cl'), (SELECT id FROM empresas_contables WHERE rut = '98765432-1'), 'colaborador'),
    ((SELECT id FROM usuarios WHERE email = 'carlos@mtz.cl'), (SELECT id FROM empresas_contables WHERE rut = '45678912-3'), 'admin')
ON CONFLICT (usuario_id, empresa_id) DO NOTHING;

-- =====================================================
-- 5. INSERTAR CONTRATOS DE EJEMPLO
-- =====================================================
INSERT INTO contratos_clientes (numero_contrato, empresa_id, tipo_contrato, fecha_inicio, fecha_fin, monto, estado, descripcion) VALUES
    ('CON-2024-001', (SELECT id FROM empresas_contables WHERE rut = '12345678-9'), 'Servicios Contables', '2024-01-01', '2024-12-31', 5000000, 'activo', 'Contrato anual de servicios contables'),
    ('CON-2024-002', (SELECT id FROM empresas_contables WHERE rut = '98765432-1'), 'Consultoría Tributaria', '2024-02-01', '2024-07-31', 3000000, 'activo', 'Servicios de consultoría tributaria'),
    ('CON-2024-003', (SELECT id FROM empresas_contables WHERE rut = '45678912-3'), 'Auditoría', '2024-03-01', '2024-05-31', 2500000, 'activo', 'Auditoría financiera anual'),
    ('CON-2024-004', (SELECT id FROM empresas_contables WHERE rut = '78912345-6'), 'Servicios Contables', '2024-01-15', '2024-12-15', 4500000, 'activo', 'Servicios contables y tributarios'),
    ('CON-2024-005', (SELECT id FROM empresas_contables WHERE rut = '32165498-7'), 'Consultoría', '2024-04-01', '2024-09-30', 3500000, 'activo', 'Consultoría en gestión empresarial')
ON CONFLICT (numero_contrato) DO NOTHING;

-- =====================================================
-- 6. INSERTAR ANEXOS DE CONTRATOS
-- =====================================================
INSERT INTO anexos_contratos (contrato_id, numero_anexo, descripcion, fecha_anexo, monto_adicional, estado) VALUES
    ((SELECT id FROM contratos_clientes WHERE numero_contrato = 'CON-2024-001'), 'ANEXO-001', 'Ampliación de servicios de nómina', '2024-06-01', 500000, 'activo'),
    ((SELECT id FROM contratos_clientes WHERE numero_contrato = 'CON-2024-002'), 'ANEXO-001', 'Inclusión de servicios de auditoría', '2024-04-15', 800000, 'activo'),
    ((SELECT id FROM contratos_clientes WHERE numero_contrato = 'CON-2024-003'), 'ANEXO-001', 'Ampliación del alcance de auditoría', '2024-04-01', 300000, 'activo')
ON CONFLICT (contrato_id, numero_anexo) DO NOTHING;

-- =====================================================
-- 7. INSERTAR DOCUMENTOS TRIBUTARIOS
-- =====================================================
INSERT INTO documentos_tributarios (empresa_id, tipo_documento, numero_documento, fecha_emision, fecha_vencimiento, monto, estado, descripcion) VALUES
    ((SELECT id FROM empresas_contables WHERE rut = '12345678-9'), 'Boleta Honorarios', 'BH-001', '2024-01-15', '2024-02-15', 500000, 'pagado', 'Servicios contables enero 2024'),
    ((SELECT id FROM empresas_contables WHERE rut = '12345678-9'), 'Factura', 'F-001', '2024-02-01', '2024-03-01', 750000, 'pendiente', 'Servicios de consultoría febrero'),
    ((SELECT id FROM empresas_contables WHERE rut = '98765432-1'), 'Boleta Honorarios', 'BH-002', '2024-01-20', '2024-02-20', 300000, 'pagado', 'Servicios tributarios enero'),
    ((SELECT id FROM empresas_contables WHERE rut = '45678912-3'), 'Factura', 'F-002', '2024-02-10', '2024-03-10', 450000, 'pendiente', 'Servicios de auditoría febrero'),
    ((SELECT id FROM empresas_contables WHERE rut = '78912345-6'), 'Boleta Honorarios', 'BH-003', '2024-01-25', '2024-02-25', 600000, 'pagado', 'Servicios contables enero')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. INSERTAR DECLARACIONES TRIBUTARIAS
-- =====================================================
INSERT INTO declaraciones_tributarias (empresa_id, tipo_declaracion, periodo_ano, periodo_mes, fecha_presentacion, fecha_vencimiento, monto, estado) VALUES
    ((SELECT id FROM empresas_contables WHERE rut = '12345678-9'), 'IVA', 2024, 1, '2024-02-15', '2024-02-20', 150000, 'presentada'),
    ((SELECT id FROM empresas_contables WHERE rut = '12345678-9'), 'IVA', 2024, 2, NULL, '2024-03-20', 180000, 'pendiente'),
    ((SELECT id FROM empresas_contables WHERE rut = '98765432-1'), 'IVA', 2024, 1, '2024-02-18', '2024-02-20', 95000, 'presentada'),
    ((SELECT id FROM empresas_contables WHERE rut = '45678912-3'), 'IVA', 2024, 1, '2024-02-12', '2024-02-20', 220000, 'presentada'),
    ((SELECT id FROM empresas_contables WHERE rut = '78912345-6'), 'IVA', 2024, 1, '2024-02-20', '2024-02-20', 175000, 'presentada'),
    ((SELECT id FROM empresas_contables WHERE rut = '32165498-7'), 'IVA', 2024, 1, '2024-02-16', '2024-02-20', 125000, 'presentada')
ON CONFLICT (empresa_id, tipo_declaracion, periodo_ano, periodo_mes) DO NOTHING;

-- =====================================================
-- 9. INSERTAR VENTAS
-- =====================================================
INSERT INTO ventas (empresa_id, numero_factura, fecha_emision, fecha_vencimiento, cliente_nombre, cliente_rut, monto_neto, iva, monto_total, estado) VALUES
    ((SELECT id FROM empresas_contables WHERE rut = '12345678-9'), 'F-2024-001', '2024-01-15', '2024-02-15', 'Cliente A', '11111111-1', 500000, 95000, 595000, 'emitida'),
    ((SELECT id FROM empresas_contables WHERE rut = '12345678-9'), 'F-2024-002', '2024-02-01', '2024-03-01', 'Cliente B', '22222222-2', 750000, 142500, 892500, 'emitida'),
    ((SELECT id FROM empresas_contables WHERE rut = '98765432-1'), 'F-2024-003', '2024-01-20', '2024-02-20', 'Cliente C', '33333333-3', 300000, 57000, 357000, 'emitida'),
    ((SELECT id FROM empresas_contables WHERE rut = '45678912-3'), 'F-2024-004', '2024-02-10', '2024-03-10', 'Cliente D', '44444444-4', 450000, 85500, 535500, 'emitida'),
    ((SELECT id FROM empresas_contables WHERE rut = '78912345-6'), 'F-2024-005', '2024-01-25', '2024-02-25', 'Cliente E', '55555555-5', 600000, 114000, 714000, 'emitida')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 10. INSERTAR COBRANZAS
-- =====================================================
INSERT INTO cobranzas (empresa_id, venta_id, numero_documento, fecha_emision, fecha_vencimiento, monto, estado, fecha_pago, monto_pagado) VALUES
    ((SELECT id FROM empresas_contables WHERE rut = '12345678-9'), (SELECT id FROM ventas WHERE numero_factura = 'F-2024-001'), 'COB-001', '2024-01-15', '2024-02-15', 595000, 'pagado', '2024-02-10', 595000),
    ((SELECT id FROM empresas_contables WHERE rut = '12345678-9'), (SELECT id FROM ventas WHERE numero_factura = 'F-2024-002'), 'COB-002', '2024-02-01', '2024-03-01', 892500, 'pendiente', NULL, NULL),
    ((SELECT id FROM empresas_contables WHERE rut = '98765432-1'), (SELECT id FROM ventas WHERE numero_factura = 'F-2024-003'), 'COB-003', '2024-01-20', '2024-02-20', 357000, 'pagado', '2024-02-15', 357000),
    ((SELECT id FROM empresas_contables WHERE rut = '45678912-3'), (SELECT id FROM ventas WHERE numero_factura = 'F-2024-004'), 'COB-004', '2024-02-10', '2024-03-10', 535500, 'pendiente', NULL, NULL),
    ((SELECT id FROM empresas_contables WHERE rut = '78912345-6'), (SELECT id FROM ventas WHERE numero_factura = 'F-2024-005'), 'COB-005', '2024-01-25', '2024-02-25', 714000, 'pagado', '2024-02-20', 714000)
ON CONFLICT DO NOTHING;

-- =====================================================
-- MENSAJE DE CONFIRMACIÓN
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Datos iniciales insertados exitosamente';
    RAISE NOTICE '👥 Usuarios creados: admin@mtz.cl, carlos@mtz.cl, colaborador@mtz.cl';
    RAISE NOTICE '🏢 Empresas creadas: 5 empresas de ejemplo';
    RAISE NOTICE '📄 Contratos creados: 5 contratos de ejemplo';
    RAISE NOTICE '📋 Anexos creados: 3 anexos de ejemplo';
    RAISE NOTICE '📊 Documentos tributarios: 5 documentos';
    RAISE NOTICE '📈 Declaraciones: 6 declaraciones tributarias';
    RAISE NOTICE '💰 Ventas: 5 ventas de ejemplo';
    RAISE NOTICE '💳 Cobranzas: 5 cobranzas de ejemplo';
    RAISE NOTICE '🔗 Asignaciones: 3 asignaciones de usuarios a empresas';
END $$;
