-- Datos de ejemplo para Empresas

-- Insertar empresas cliente
INSERT INTO empresas (razon_social, nombre_fantasia, rut, giro, direccion, comuna, ciudad, region, telefono, email, sitio_web, tipo_empresa, estado, fecha_creacion, observaciones) VALUES
('Sociedad Comercial ABC Limitada', 'ABC Comercial', '76.123.456-7', 'Comercio al por mayor de productos alimenticios', 'Av. Providencia 1234', 'Providencia', 'Santiago', 'Región Metropolitana', '+56223456789', 'contacto@abc.com', 'www.abc.com', 'cliente', 'activa', '2020-01-15', 'Cliente importante del sector alimenticio'),
('Empresa Industrial XYZ SPA', 'XYZ Industrial', '78.234.567-8', 'Fabricación de productos metálicos', 'Camino Industrial 567', 'Maipú', 'Santiago', 'Región Metropolitana', '+56234567890', 'ventas@xyz.cl', 'www.xyz.cl', 'cliente', 'activa', '2020-03-20', 'Cliente industrial con buen historial de pagos'),
('Comercial Delta Ltda.', 'Delta Comercial', '79.345.678-9', 'Comercio al por menor de productos de consumo', 'Calle Comercial 890', 'Las Condes', 'Santiago', 'Región Metropolitana', '+56245678901', 'info@delta.cl', 'www.delta.cl', 'cliente', 'activa', '2020-06-10', 'Cliente retail con múltiples sucursales'),
('Servicios Omega EIRL', 'Omega Servicios', '80.456.789-0', 'Servicios de consultoría empresarial', 'Av. Apoquindo 2345', 'Las Condes', 'Santiago', 'Región Metropolitana', '+56256789012', 'consultoria@omega.cl', 'www.omega.cl', 'cliente', 'activa', '2020-08-05', 'Cliente de servicios profesionales'),
('Constructora Beta S.A.', 'Beta Construcciones', '81.567.890-1', 'Construcción de edificios residenciales', 'Camino de la Construcción 123', 'Ñuñoa', 'Santiago', 'Región Metropolitana', '+56267890123', 'proyectos@beta.cl', 'www.beta.cl', 'cliente', 'activa', '2020-10-15', 'Cliente del sector construcción'),
('Distribuidora Gamma Ltda.', 'Gamma Distribuciones', '82.678.901-2', 'Transporte de carga por carretera', 'Ruta 5 Norte Km 15', 'Lampa', 'Santiago', 'Región Metropolitana', '+56278901234', 'logistica@gamma.cl', 'www.gamma.cl', 'cliente', 'activa', '2021-01-20', 'Cliente de logística y distribución'),
('Tecnología Sigma SPA', 'Sigma Tech', '83.789.012-3', 'Desarrollo de software', 'Av. Vitacura 3456', 'Vitacura', 'Santiago', 'Región Metropolitana', '+56289012345', 'soporte@sigmatech.cl', 'www.sigmatech.cl', 'cliente', 'activa', '2021-03-12', 'Cliente tecnológico con proyectos innovadores'),
('Agropecuaria Epsilon Ltda.', 'Epsilon Agro', '84.890.123-4', 'Cultivo de cereales', 'Camino Rural 789', 'Melipilla', 'Melipilla', 'Región Metropolitana', '+56290123456', 'ventas@epsilonagro.cl', 'www.epsilonagro.cl', 'cliente', 'activa', '2021-05-25', 'Cliente del sector agrícola'),
('Comercial Zeta S.A.', 'Zeta Comercial', '85.901.234-5', 'Comercio al por mayor de productos químicos', 'Av. Industrial 4567', 'San Bernardo', 'Santiago', 'Región Metropolitana', '+56201234567', 'quimicos@zeta.cl', 'www.zeta.cl', 'cliente', 'activa', '2021-07-08', 'Cliente del sector químico'),
('Servicios Theta EIRL', 'Theta Servicios', '86.012.345-6', 'Servicios de limpieza industrial', 'Calle Servicios 1234', 'Puente Alto', 'Santiago', 'Región Metropolitana', '+56212345678', 'limpieza@theta.cl', 'www.theta.cl', 'cliente', 'activa', '2021-09-15', 'Cliente de servicios de limpieza');

-- Insertar empresas proveedor
INSERT INTO empresas (razon_social, nombre_fantasia, rut, giro, direccion, comuna, ciudad, region, telefono, email, sitio_web, tipo_empresa, estado, fecha_creacion, observaciones) VALUES
('Proveedora Alfa Ltda.', 'Alfa Proveedores', '87.123.456-7', 'Comercio al por mayor de materias primas', 'Av. Proveedores 567', 'Quilicura', 'Santiago', 'Región Metropolitana', '+56223456789', 'ventas@alfa.cl', 'www.alfa.cl', 'proveedor', 'activa', '2019-02-10', 'Proveedor confiable de materias primas'),
('Suministros Beta SPA', 'Beta Suministros', '88.234.567-8', 'Comercio al por mayor de equipos industriales', 'Camino Industrial 890', 'Colina', 'Santiago', 'Región Metropolitana', '+56234567890', 'equipos@beta.cl', 'www.betasuministros.cl', 'proveedor', 'activa', '2019-04-15', 'Proveedor de equipos industriales'),
('Distribuidora Gamma S.A.', 'Gamma Distribuidora', '89.345.678-9', 'Distribución de productos de consumo', 'Ruta 68 Km 25', 'Casablanca', 'Valparaíso', 'Valparaíso', '+56323456789', 'distribucion@gamma.cl', 'www.gammadist.cl', 'proveedor', 'activa', '2019-06-20', 'Proveedor regional de distribución'),
('Tecnología Delta Ltda.', 'Delta Tech', '90.456.789-0', 'Venta de equipos tecnológicos', 'Av. Tecnológica 1234', 'Providencia', 'Santiago', 'Región Metropolitana', '+56245678901', 'tecnologia@delta.cl', 'www.deltatech.cl', 'proveedor', 'activa', '2019-08-12', 'Proveedor de tecnología y equipos'),
('Servicios Omega EIRL', 'Omega Servicios Profesionales', '91.567.890-1', 'Servicios de mantenimiento industrial', 'Calle Mantenimiento 567', 'Maipú', 'Santiago', 'Región Metropolitana', '+56256789012', 'mantenimiento@omega.cl', 'www.omegaservicios.cl', 'proveedor', 'activa', '2019-10-25', 'Proveedor de servicios de mantenimiento');

-- Insertar empresas cliente-proveedor
INSERT INTO empresas (razon_social, nombre_fantasia, rut, giro, direccion, comuna, ciudad, region, telefono, email, sitio_web, tipo_empresa, estado, fecha_creacion, observaciones) VALUES
('Comercial Integrada Sigma Ltda.', 'Sigma Integrada', '92.678.901-2', 'Comercio al por mayor y menor de productos diversos', 'Av. Integrada 789', 'Las Condes', 'Santiago', 'Región Metropolitana', '+56267890123', 'integrada@sigma.cl', 'www.sigmaintegrada.cl', 'cliente_proveedor', 'activa', '2020-12-05', 'Empresa que actúa como cliente y proveedor'),
('Servicios Múltiples Zeta SPA', 'Zeta Múltiples', '93.789.012-3', 'Servicios diversos y comercio', 'Calle Múltiple 1234', 'Ñuñoa', 'Santiago', 'Región Metropolitana', '+56278901234', 'multiservicios@zeta.cl', 'www.zetamultiples.cl', 'cliente_proveedor', 'activa', '2021-02-18', 'Empresa con múltiples líneas de negocio');

-- Insertar empresas competidor
INSERT INTO empresas (razon_social, nombre_fantasia, rut, giro, direccion, comuna, ciudad, region, telefono, email, sitio_web, tipo_empresa, estado, fecha_creacion, observaciones) VALUES
('Competencia Directa Ltda.', 'Competencia Directa', '94.890.123-4', 'Servicios contables y financieros', 'Av. Competencia 567', 'Providencia', 'Santiago', 'Región Metropolitana', '+56289012345', 'info@competenciadirecta.cl', 'www.competenciadirecta.cl', 'competidor', 'activa', '2021-11-30', 'Competidor directo en servicios contables'),
('Rival Empresarial S.A.', 'Rival Empresarial', '95.901.234-5', 'Consultoría empresarial y servicios financieros', 'Calle Rival 890', 'Las Condes', 'Santiago', 'Región Metropolitana', '+56290123456', 'contacto@rival.cl', 'www.rival.cl', 'competidor', 'activa', '2022-01-15', 'Competidor en consultoría empresarial');

-- Insertar algunas empresas inactivas
INSERT INTO empresas (razon_social, nombre_fantasia, rut, giro, direccion, comuna, ciudad, region, telefono, email, sitio_web, tipo_empresa, estado, fecha_creacion, observaciones) VALUES
('Empresa Inactiva Ltda.', 'Inactiva Comercial', '96.012.345-6', 'Comercio al por menor', 'Calle Inactiva 123', 'Santiago Centro', 'Santiago', 'Región Metropolitana', '+56201234567', 'info@inactiva.cl', 'www.inactiva.cl', 'cliente', 'inactiva', '2020-05-10', 'Empresa que suspendió operaciones'),
('Compañía Suspendida SPA', 'Suspendida SPA', '97.123.456-7', 'Servicios de transporte', 'Av. Suspendida 456', 'San Miguel', 'Santiago', 'Región Metropolitana', '+56212345678', 'transporte@suspendida.cl', 'www.suspendida.cl', 'proveedor', 'suspendida', '2021-04-20', 'Empresa suspendida temporalmente');

-- Comentarios para documentación
COMMENT ON TABLE empresas IS 'Empresas del sistema MTZ con diferentes tipos y estados';
COMMENT ON COLUMN empresas.tipo_empresa IS 'Tipo de relación: cliente, proveedor, cliente_proveedor, competidor, otro';
COMMENT ON COLUMN empresas.estado IS 'Estado de la empresa: activa, inactiva, suspendida, en_liquidacion';
