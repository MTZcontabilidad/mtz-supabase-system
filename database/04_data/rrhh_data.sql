-- Datos de ejemplo para RRHH

-- Insertar empleados de ejemplo
INSERT INTO empleados (nombre, apellido, email, telefono, departamento, cargo, fecha_ingreso, salario_base, estado) VALUES
('Carlos', 'González', 'carlos.gonzalez@mtz.com', '+56912345678', 'Administración', 'Gerente General', '2020-01-15', 2500000, 'activo'),
('María', 'Rodríguez', 'maria.rodriguez@mtz.com', '+56923456789', 'Ventas', 'Gerente de Ventas', '2020-03-20', 2200000, 'activo'),
('Juan', 'Pérez', 'juan.perez@mtz.com', '+56934567890', 'Compras', 'Supervisor de Compras', '2020-06-10', 1800000, 'activo'),
('Ana', 'Silva', 'ana.silva@mtz.com', '+56945678901', 'Contabilidad', 'Contador Senior', '2020-08-05', 1600000, 'activo'),
('Luis', 'Martínez', 'luis.martinez@mtz.com', '+56956789012', 'Tecnología', 'Desarrollador Senior', '2021-01-10', 1900000, 'activo'),
('Carmen', 'López', 'carmen.lopez@mtz.com', '+56967890123', 'RRHH', 'Analista de RRHH', '2021-02-15', 1500000, 'activo'),
('Roberto', 'Herrera', 'roberto.herrera@mtz.com', '+56978901234', 'Operaciones', 'Coordinador de Operaciones', '2021-04-20', 1700000, 'activo'),
('Patricia', 'Vargas', 'patricia.vargas@mtz.com', '+56989012345', 'Marketing', 'Especialista de Marketing', '2021-06-12', 1400000, 'activo'),
('Fernando', 'Morales', 'fernando.morales@mtz.com', '+56990123456', 'Ventas', 'Ejecutivo de Ventas', '2021-08-08', 1200000, 'activo'),
('Sofia', 'Rojas', 'sofia.rojas@mtz.com', '+56901234567', 'Compras', 'Analista de Compras', '2021-09-25', 1300000, 'activo'),
('Diego', 'Castro', 'diego.castro@mtz.com', '+56912345670', 'Tecnología', 'Desarrollador Junior', '2021-11-30', 1100000, 'activo'),
('Valentina', 'Muñoz', 'valentina.munoz@mtz.com', '+56923456701', 'Contabilidad', 'Asistente Contable', '2022-01-15', 1000000, 'activo'),
('Miguel', 'Torres', 'miguel.torres@mtz.com', '+56934567012', 'Operaciones', 'Asistente de Operaciones', '2022-03-10', 950000, 'activo'),
('Camila', 'Flores', 'camila.flores@mtz.com', '+56945670123', 'Marketing', 'Asistente de Marketing', '2022-05-20', 900000, 'activo'),
('Andrés', 'Reyes', 'andres.reyes@mtz.com', '+56956701234', 'Ventas', 'Asistente de Ventas', '2022-07-08', 850000, 'activo'),
('Daniela', 'Moreno', 'daniela.moreno@mtz.com', '+56967012345', 'RRHH', 'Asistente de RRHH', '2022-09-12', 800000, 'activo'),
('Felipe', 'Jiménez', 'felipe.jimenez@mtz.com', '+56970123456', 'Tecnología', 'Practicante', '2022-11-05', 600000, 'activo'),
('Natalia', 'Ruiz', 'natalia.ruiz@mtz.com', '+56901234560', 'Compras', 'Practicante', '2023-01-20', 550000, 'activo'),
('Gabriel', 'Ortiz', 'gabriel.ortiz@mtz.com', '+56912345601', 'Contabilidad', 'Practicante', '2023-03-15', 500000, 'activo'),
('Isabella', 'Cruz', 'isabella.cruz@mtz.com', '+56923456012', 'Marketing', 'Practicante', '2023-05-10', 450000, 'activo');

-- Insertar algunos empleados en otros estados
INSERT INTO empleados (nombre, apellido, email, telefono, departamento, cargo, fecha_ingreso, salario_base, estado) VALUES
('Ricardo', 'Navarro', 'ricardo.navarro@mtz.com', '+56934560123', 'Ventas', 'Ejecutivo de Ventas', '2021-10-15', 1200000, 'vacaciones'),
('Elena', 'Paredes', 'elena.paredes@mtz.com', '+56945601234', 'Operaciones', 'Coordinador de Operaciones', '2021-12-20', 1700000, 'licencia'),
('Hugo', 'Mendoza', 'hugo.mendoza@mtz.com', '+56956012345', 'Tecnología', 'Desarrollador Senior', '2020-09-10', 1900000, 'inactivo');

-- Insertar nóminas de ejemplo para el último mes
INSERT INTO nominas (empleado_id, mes, año, dias_trabajados, salario_base, bonificaciones, descuentos, salario_neto)
SELECT
    e.id,
    EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month') as mes,
    EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month') as año,
    22 as dias_trabajados,
    e.salario_base,
    CASE
        WHEN e.cargo LIKE '%Gerente%' OR e.cargo LIKE '%Senior%' THEN e.salario_base * 0.1
        WHEN e.cargo LIKE '%Supervisor%' OR e.cargo LIKE '%Coordinador%' THEN e.salario_base * 0.08
        ELSE e.salario_base * 0.05
    END as bonificaciones,
    e.salario_base * 0.07 as descuentos,
    e.salario_base +
    (CASE
        WHEN e.cargo LIKE '%Gerente%' OR e.cargo LIKE '%Senior%' THEN e.salario_base * 0.1
        WHEN e.cargo LIKE '%Supervisor%' OR e.cargo LIKE '%Coordinador%' THEN e.salario_base * 0.08
        ELSE e.salario_base * 0.05
    END) -
    (e.salario_base * 0.07) as salario_neto
FROM empleados e
WHERE e.estado = 'activo';

-- Insertar nóminas del mes actual
INSERT INTO nominas (empleado_id, mes, año, dias_trabajados, salario_base, bonificaciones, descuentos, salario_neto)
SELECT
    e.id,
    EXTRACT(MONTH FROM CURRENT_DATE) as mes,
    EXTRACT(YEAR FROM CURRENT_DATE) as año,
    20 as dias_trabajados,
    e.salario_base,
    CASE
        WHEN e.cargo LIKE '%Gerente%' OR e.cargo LIKE '%Senior%' THEN e.salario_base * 0.1
        WHEN e.cargo LIKE '%Supervisor%' OR e.cargo LIKE '%Coordinador%' THEN e.salario_base * 0.08
        ELSE e.salario_base * 0.05
    END as bonificaciones,
    e.salario_base * 0.07 as descuentos,
    e.salario_base +
    (CASE
        WHEN e.cargo LIKE '%Gerente%' OR e.cargo LIKE '%Senior%' THEN e.salario_base * 0.1
        WHEN e.cargo LIKE '%Supervisor%' OR e.cargo LIKE '%Coordinador%' THEN e.salario_base * 0.08
        ELSE e.salario_base * 0.05
    END) -
    (e.salario_base * 0.07) as salario_neto
FROM empleados e
WHERE e.estado = 'activo'
ON CONFLICT (empleado_id, mes, año) DO NOTHING;

-- Insertar algunas nóminas históricas
INSERT INTO nominas (empleado_id, mes, año, dias_trabajados, salario_base, bonificaciones, descuentos, salario_neto) VALUES
-- Nóminas de hace 2 meses
((SELECT id FROM empleados WHERE email = 'carlos.gonzalez@mtz.com'),
 EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '2 months'),
 EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '2 months'),
 22, 2500000, 250000, 175000, 2575000),
((SELECT id FROM empleados WHERE email = 'maria.rodriguez@mtz.com'),
 EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '2 months'),
 EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '2 months'),
 22, 2200000, 220000, 154000, 2266000),
((SELECT id FROM empleados WHERE email = 'juan.perez@mtz.com'),
 EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '2 months'),
 EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '2 months'),
 22, 1800000, 144000, 126000, 1818000);

-- Comentarios para documentación
COMMENT ON TABLE empleados IS 'Empleados de la empresa MTZ con información personal y laboral';
COMMENT ON TABLE nominas IS 'Nóminas mensuales de los empleados con cálculos de salarios';
