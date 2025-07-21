-- Datos de ejemplo para Proyecciones Financieras

-- Insertar proyecciones de ventas
INSERT INTO proyecciones (nombre, descripcion, tipo, año, mes_inicio, mes_fin, monto_objetivo, monto_real, estado, notas) VALUES
('Proyección Ventas Q1 2024', 'Proyección de ventas para el primer trimestre del 2024', 'ventas', 2024, 1, 3, 15000000, 14250000, 'en_progreso', 'Cumplimiento al 95% del objetivo'),
('Proyección Ventas Q2 2024', 'Proyección de ventas para el segundo trimestre del 2024', 'ventas', 2024, 4, 6, 18000000, 0, 'planificado', 'Objetivo ambicioso para el segundo trimestre'),
('Proyección Ventas Q3 2024', 'Proyección de ventas para el tercer trimestre del 2024', 'ventas', 2024, 7, 9, 16000000, 0, 'planificado', 'Expectativa de crecimiento moderado'),
('Proyección Ventas Q4 2024', 'Proyección de ventas para el cuarto trimestre del 2024', 'ventas', 2024, 10, 12, 20000000, 0, 'planificado', 'Cierre fuerte del año'),
('Proyección Ventas Q1 2023', 'Proyección de ventas para el primer trimestre del 2023', 'ventas', 2023, 1, 3, 12000000, 11800000, 'completado', 'Cumplimiento exitoso del 98.3%'),
('Proyección Ventas Q2 2023', 'Proyección de ventas para el segundo trimestre del 2023', 'ventas', 2023, 4, 6, 14000000, 13500000, 'completado', 'Ligeramente por debajo del objetivo'),
('Proyección Ventas Q3 2023', 'Proyección de ventas para el tercer trimestre del 2023', 'ventas', 2023, 7, 9, 13000000, 13200000, 'completado', 'Superó expectativas en 1.5%'),
('Proyección Ventas Q4 2023', 'Proyección de ventas para el cuarto trimestre del 2023', 'ventas', 2023, 10, 12, 16000000, 15800000, 'completado', 'Cierre sólido del año');

-- Insertar proyecciones de cobranza
INSERT INTO proyecciones (nombre, descripcion, tipo, año, mes_inicio, mes_fin, monto_objetivo, monto_real, estado, notas) VALUES
('Cobranza Enero 2024', 'Proyección de cobranza para enero 2024', 'cobranza', 2024, 1, 1, 8000000, 7500000, 'en_progreso', 'Algunas cuentas pendientes de pago'),
('Cobranza Febrero 2024', 'Proyección de cobranza para febrero 2024', 'cobranza', 2024, 2, 2, 8500000, 8200000, 'en_progreso', 'Mejor comportamiento de pagos'),
('Cobranza Marzo 2024', 'Proyección de cobranza para marzo 2024', 'cobranza', 2024, 3, 3, 9000000, 0, 'planificado', 'Expectativa de mejora en cobranza'),
('Cobranza Q1 2024', 'Proyección de cobranza para el primer trimestre 2024', 'cobranza', 2024, 1, 3, 25500000, 15700000, 'en_progreso', 'Cumplimiento al 61.6% del trimestre'),
('Cobranza Q4 2023', 'Proyección de cobranza para el cuarto trimestre 2023', 'cobranza', 2023, 10, 12, 22000000, 21800000, 'completado', 'Excelente gestión de cobranza'),
('Cobranza Q3 2023', 'Proyección de cobranza para el tercer trimestre 2023', 'cobranza', 2023, 7, 9, 20000000, 19500000, 'completado', 'Cumplimiento del 97.5%');

-- Insertar proyecciones de compras
INSERT INTO proyecciones (nombre, descripcion, tipo, año, mes_inicio, mes_fin, monto_objetivo, monto_real, estado, notas) VALUES
('Compras Q1 2024', 'Proyección de compras para el primer trimestre 2024', 'compras', 2024, 1, 3, 6000000, 5800000, 'en_progreso', 'Control de gastos efectivo'),
('Compras Q2 2024', 'Proyección de compras para el segundo trimestre 2024', 'compras', 2024, 4, 6, 7000000, 0, 'planificado', 'Incremento planificado en compras'),
('Compras Q3 2024', 'Proyección de compras para el tercer trimestre 2024', 'compras', 2024, 7, 9, 6500000, 0, 'planificado', 'Mantenimiento de niveles de compra'),
('Compras Q4 2024', 'Proyección de compras para el cuarto trimestre 2024', 'compras', 2024, 10, 12, 7500000, 0, 'planificado', 'Preparación para cierre de año'),
('Compras Q4 2023', 'Proyección de compras para el cuarto trimestre 2023', 'compras', 2023, 10, 12, 5500000, 5400000, 'completado', 'Eficiencia en compras del 98.2%'),
('Compras Q3 2023', 'Proyección de compras para el tercer trimestre 2023', 'compras', 2023, 7, 9, 5000000, 5200000, 'completado', 'Ligeramente por encima del presupuesto');

-- Insertar proyecciones de gastos
INSERT INTO proyecciones (nombre, descripcion, tipo, año, mes_inicio, mes_fin, monto_objetivo, monto_real, estado, notas) VALUES
('Gastos Operacionales Q1 2024', 'Proyección de gastos operacionales Q1 2024', 'gastos', 2024, 1, 3, 4000000, 3800000, 'en_progreso', 'Control de gastos exitoso'),
('Gastos Operacionales Q2 2024', 'Proyección de gastos operacionales Q2 2024', 'gastos', 2024, 4, 6, 4200000, 0, 'planificado', 'Mantenimiento de gastos controlados'),
('Gastos Operacionales Q3 2024', 'Proyección de gastos operacionales Q3 2024', 'gastos', 2024, 7, 9, 4100000, 0, 'planificado', 'Optimización de gastos'),
('Gastos Operacionales Q4 2024', 'Proyección de gastos operacionales Q4 2024', 'gastos', 2024, 10, 12, 4500000, 0, 'planificado', 'Gastos de cierre de año'),
('Gastos Operacionales Q4 2023', 'Proyección de gastos operacionales Q4 2023', 'gastos', 2023, 10, 12, 3500000, 3450000, 'completado', 'Excelente control de gastos'),
('Gastos Operacionales Q3 2023', 'Proyección de gastos operacionales Q3 2023', 'gastos', 2023, 7, 9, 3200000, 3300000, 'completado', 'Ligeramente por encima del presupuesto');

-- Insertar proyecciones de ingresos
INSERT INTO proyecciones (nombre, descripcion, tipo, año, mes_inicio, mes_fin, monto_objetivo, monto_real, estado, notas) VALUES
('Ingresos Q1 2024', 'Proyección de ingresos totales Q1 2024', 'ingresos', 2024, 1, 3, 14000000, 13300000, 'en_progreso', 'Cumplimiento al 95% del objetivo'),
('Ingresos Q2 2024', 'Proyección de ingresos totales Q2 2024', 'ingresos', 2024, 4, 6, 16500000, 0, 'planificado', 'Crecimiento esperado en ingresos'),
('Ingresos Q3 2024', 'Proyección de ingresos totales Q3 2024', 'ingresos', 2024, 7, 9, 15000000, 0, 'planificado', 'Estabilidad en ingresos'),
('Ingresos Q4 2024', 'Proyección de ingresos totales Q4 2024', 'ingresos', 2024, 10, 12, 18500000, 0, 'planificado', 'Cierre fuerte del año'),
('Ingresos Q4 2023', 'Proyección de ingresos totales Q4 2023', 'ingresos', 2023, 10, 12, 15000000, 15200000, 'completado', 'Superó expectativas en 1.3%'),
('Ingresos Q3 2023', 'Proyección de ingresos totales Q3 2023', 'ingresos', 2023, 7, 9, 12500000, 12800000, 'completado', 'Excelente rendimiento');

-- Insertar proyecciones de utilidades
INSERT INTO proyecciones (nombre, descripcion, tipo, año, mes_inicio, mes_fin, monto_objetivo, monto_real, estado, notas) VALUES
('Utilidades Q1 2024', 'Proyección de utilidades netas Q1 2024', 'utilidades', 2024, 1, 3, 4000000, 3700000, 'en_progreso', 'Cumplimiento al 92.5% del objetivo'),
('Utilidades Q2 2024', 'Proyección de utilidades netas Q2 2024', 'utilidades', 2024, 4, 6, 5300000, 0, 'planificado', 'Crecimiento esperado en utilidades'),
('Utilidades Q3 2024', 'Proyección de utilidades netas Q3 2024', 'utilidades', 2024, 7, 9, 4400000, 0, 'planificado', 'Mantenimiento de rentabilidad'),
('Utilidades Q4 2024', 'Proyección de utilidades netas Q4 2024', 'utilidades', 2024, 10, 12, 6500000, 0, 'planificado', 'Cierre rentable del año'),
('Utilidades Q4 2023', 'Proyección de utilidades netas Q4 2023', 'utilidades', 2023, 10, 12, 6000000, 6250000, 'completado', 'Superó expectativas en 4.2%'),
('Utilidades Q3 2023', 'Proyección de utilidades netas Q3 2023', 'utilidades', 2023, 7, 9, 4300000, 4500000, 'completado', 'Excelente rentabilidad');

-- Insertar algunas proyecciones atrasadas para mostrar diferentes estados
INSERT INTO proyecciones (nombre, descripcion, tipo, año, mes_inicio, mes_fin, monto_objetivo, monto_real, estado, notas) VALUES
('Proyección Especial Q1 2024', 'Proyección especial que se encuentra atrasada', 'ventas', 2024, 1, 3, 5000000, 2000000, 'atrasado', 'Requiere atención inmediata'),
('Proyección Cancelada 2024', 'Proyección que fue cancelada por cambios en el mercado', 'ingresos', 2024, 4, 6, 3000000, 0, 'cancelado', 'Cancelada por cambios estratégicos');

-- Comentarios para documentación
COMMENT ON TABLE proyecciones IS 'Proyecciones financieras de la empresa MTZ con diferentes tipos y períodos';
COMMENT ON COLUMN proyecciones.porcentaje_cumplimiento IS 'Porcentaje calculado automáticamente basado en monto_real vs monto_objetivo';
