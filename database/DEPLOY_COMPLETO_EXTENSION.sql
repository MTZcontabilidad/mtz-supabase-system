-- =====================================================================
-- 🚀 DEPLOY COMPLETO - SISTEMA MTZ v3.0 CON EXTENSIÓN SUPABASE
-- =====================================================================
-- Script completo para configurar todo el sistema desde cero
-- Ejecutar usando la extensión de Supabase en Cursor

-- =====================================================================
-- 📋 PASO 1: CREAR TABLAS PRINCIPALES
-- =====================================================================

-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS public.roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    permisos JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de usuarios del sistema
CREATE TABLE IF NOT EXISTS public.usuarios_sistema (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre_completo VARCHAR(255) NOT NULL,
    rol_id INTEGER REFERENCES public.roles(id),
    activo BOOLEAN DEFAULT true,
    telefono VARCHAR(20),
    cargo VARCHAR(100),
    departamento VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de empresas
CREATE TABLE IF NOT EXISTS public.empresas (
    id SERIAL PRIMARY KEY,
    razon_social VARCHAR(255) NOT NULL,
    nombre_fantasia VARCHAR(255),
    rut VARCHAR(20) UNIQUE NOT NULL,
    giro TEXT,
    direccion TEXT,
    comuna VARCHAR(100),
    ciudad VARCHAR(100),
    region VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(255),
    sitio_web VARCHAR(255),
    tipo_empresa VARCHAR(50) DEFAULT 'cliente',
    estado VARCHAR(50) DEFAULT 'activa',
    fecha_creacion DATE,
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de ventas
CREATE TABLE IF NOT EXISTS public.ventas (
    id SERIAL PRIMARY KEY,
    numero_factura VARCHAR(50) UNIQUE NOT NULL,
    cliente_id VARCHAR(20) REFERENCES public.empresas(rut),
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    monto_neto DECIMAL(15,2) NOT NULL,
    iva DECIMAL(15,2) NOT NULL,
    monto_total DECIMAL(15,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'Emitida',
    tipo_servicio VARCHAR(100),
    descripcion TEXT,
    emitida_por_id UUID REFERENCES public.usuarios_sistema(id),
    metodo_pago VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de cobranzas
CREATE TABLE IF NOT EXISTS public.cobranzas (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER REFERENCES public.ventas(id),
    cliente_id VARCHAR(20) REFERENCES public.empresas(rut),
    numero_factura VARCHAR(50),
    monto_pendiente DECIMAL(15,2) NOT NULL,
    fecha_vencimiento DATE,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    prioridad VARCHAR(20) DEFAULT 'Media',
    descripcion TEXT,
    asignado_a_id UUID REFERENCES public.usuarios_sistema(id),
    metodo_pago VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de servicios
CREATE TABLE IF NOT EXISTS public.servicios (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio_base DECIMAL(15,2) NOT NULL,
    categoria VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de detalles de venta
CREATE TABLE IF NOT EXISTS public.detalles_venta (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER REFERENCES public.ventas(id),
    servicio_id INTEGER REFERENCES public.servicios(id),
    descripcion TEXT,
    cantidad INTEGER DEFAULT 1,
    precio_unitario DECIMAL(15,2) NOT NULL,
    descuento DECIMAL(15,2) DEFAULT 0,
    subtotal DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de proyecciones
CREATE TABLE IF NOT EXISTS public.proyecciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    monto_proyectado DECIMAL(15,2) NOT NULL,
    monto_real DECIMAL(15,2),
    estado VARCHAR(50) DEFAULT 'Activa',
    tipo_proyeccion VARCHAR(100),
    responsable_id UUID REFERENCES public.usuarios_sistema(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de empleados
CREATE TABLE IF NOT EXISTS public.empleados (
    id SERIAL PRIMARY KEY,
    rut VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20),
    fecha_contratacion DATE,
    cargo VARCHAR(100),
    departamento VARCHAR(100),
    salario_base DECIMAL(15,2),
    estado VARCHAR(50) DEFAULT 'Activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de nóminas
CREATE TABLE IF NOT EXISTS public.nominas (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER REFERENCES public.empleados(id),
    mes INTEGER NOT NULL,
    año INTEGER NOT NULL,
    salario_bruto DECIMAL(15,2) NOT NULL,
    descuentos DECIMAL(15,2) DEFAULT 0,
    salario_liquido DECIMAL(15,2) NOT NULL,
    fecha_pago DATE,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- 📋 PASO 2: HABILITAR RLS (ROW LEVEL SECURITY)
-- =====================================================================

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cobranzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalles_venta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyecciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nominas ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- 📋 PASO 3: CREAR POLÍTICAS RLS
-- =====================================================================

-- Política para roles (todos pueden leer)
CREATE POLICY "Roles visibles para todos" ON public.roles
FOR SELECT USING (true);

-- Política para usuarios_sistema (solo admins pueden ver todos)
CREATE POLICY "Admin puede ver todos los usuarios" ON public.usuarios_sistema
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.usuarios_sistema
    WHERE id = auth.uid() AND rol_id = 1
  )
);

-- Política para empresas (todos pueden leer, admins pueden escribir)
CREATE POLICY "Empresas visibles para todos" ON public.empresas
FOR SELECT USING (true);

CREATE POLICY "Admin puede gestionar empresas" ON public.empresas
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.usuarios_sistema
    WHERE id = auth.uid() AND rol_id = 1
  )
);

-- Política para ventas (todos pueden leer, admins pueden escribir)
CREATE POLICY "Ventas visibles para todos" ON public.ventas
FOR SELECT USING (true);

CREATE POLICY "Admin puede gestionar ventas" ON public.ventas
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.usuarios_sistema
    WHERE id = auth.uid() AND rol_id = 1
  )
);

-- Política para cobranzas (todos pueden leer, admins pueden escribir)
CREATE POLICY "Cobranzas visibles para todos" ON public.cobranzas
FOR SELECT USING (true);

CREATE POLICY "Admin puede gestionar cobranzas" ON public.cobranzas
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.usuarios_sistema
    WHERE id = auth.uid() AND rol_id = 1
  )
);

-- Política para servicios (todos pueden leer)
CREATE POLICY "Servicios visibles para todos" ON public.servicios
FOR SELECT USING (true);

-- =====================================================================
-- 📋 PASO 4: INSERTAR ROLES
-- =====================================================================

INSERT INTO public.roles (nombre, descripcion, permisos, created_at, updated_at) VALUES
('Administrador', 'Acceso completo al sistema', '{"*": true}', NOW(), NOW()),
('Gerente', 'Gestión de operaciones y reportes', '{"clientes": {"read": true, "write": true}, "ventas": {"read": true, "write": true}, "cobranza": {"read": true, "write": true}, "reportes": {"read": true}}', NOW(), NOW()),
('Analista', 'Análisis y reportes', '{"clientes": {"read": true}, "ventas": {"read": true}, "cobranza": {"read": true}, "reportes": {"read": true}}', NOW(), NOW()),
('Asistente', 'Tareas administrativas', '{"clientes": {"read": true}, "ventas": {"read": true}}', NOW(), NOW()),
('Cliente', 'Acceso limitado al portal', '{"clientes": {"read": true}, "ventas": {"read": true}}', NOW(), NOW())
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================================
-- 📋 PASO 5: INSERTAR DATOS DE PRUEBA
-- =====================================================================

-- Insertar empresas de prueba
INSERT INTO public.empresas (razon_social, nombre_fantasia, rut, giro, direccion, comuna, ciudad, region, telefono, email, sitio_web, tipo_empresa, estado, fecha_creacion, observaciones, created_at, updated_at) VALUES
('TechCorp Solutions Ltda.', 'TechCorp', '76.123.456-7', 'Desarrollo de Software y Consultoría Tecnológica', 'Av. Providencia 1234', 'Providencia', 'Santiago', 'Metropolitana', '+56 2 2345 6789', 'contacto@techcorp.cl', 'https://techcorp.cl', 'cliente', 'activa', '2023-01-15', 'Cliente estratégico, excelente historial de pagos', NOW(), NOW()),
('Constructora Norte Ltda.', 'Constructora Norte', '78.987.654-3', 'Construcción y Edificación', 'Av. Las Condes 5678', 'Las Condes', 'Santiago', 'Metropolitana', '+56 2 3456 7890', 'info@constructoranorte.cl', 'https://constructoranorte.cl', 'cliente', 'activa', '2023-03-20', 'Cliente del sector construcción, contratos a largo plazo', NOW(), NOW()),
('Distribuidora Sur SPA', 'Distribuidora Sur', '79.456.789-1', 'Distribución y Logística', 'Camino a Melipilla 9012', 'Melipilla', 'Santiago', 'Metropolitana', '+56 2 4567 8901', 'ventas@distribuidorasur.cl', 'https://distribuidorasur.cl', 'cliente', 'activa', '2023-06-10', 'Cliente del sector logístico, pagos regulares', NOW(), NOW()),
('Consultoría Financiera ABC', 'Consultoría ABC', '76.789.123-4', 'Consultoría Financiera y Tributaria', 'Av. Apoquindo 3456', 'Las Condes', 'Santiago', 'Metropolitana', '+56 2 5678 9012', 'admin@consultoriaabc.cl', 'https://consultoriaabc.cl', 'cliente', 'activa', '2023-08-05', 'Cliente de servicios profesionales, proyectos especializados', NOW(), NOW()),
('Restaurante El Buen Sabor', 'El Buen Sabor', '77.321.654-9', 'Gastronomía y Restauración', 'Av. Vitacura 7890', 'Vitacura', 'Santiago', 'Metropolitana', '+56 2 6789 0123', 'reservas@elbuensabor.cl', 'https://elbuensabor.cl', 'cliente', 'activa', '2023-10-15', 'Cliente del sector gastronómico, facturación mensual', NOW(), NOW())
ON CONFLICT (rut) DO NOTHING;

-- Insertar servicios del catálogo
INSERT INTO public.servicios (codigo, nombre, descripcion, precio_base, categoria, activo, created_at, updated_at) VALUES
('SERV-001', 'Contabilidad Mensual', 'Servicios de contabilidad mensual incluyendo balance y estado de resultados', 500000, 'Contabilidad', true, NOW(), NOW()),
('SERV-002', 'Declaración IVA', 'Declaración mensual de IVA y F29', 350000, 'Tributario', true, NOW(), NOW()),
('SERV-003', 'Nómina y Remuneraciones', 'Procesamiento de nómina y cálculo de remuneraciones', 250000, 'Contabilidad', true, NOW(), NOW()),
('SERV-004', 'Asesoría Tributaria', 'Asesoría especializada en temas tributarios', 400000, 'Asesoría', true, NOW(), NOW()),
('SERV-005', 'Auditoría Financiera', 'Auditoría financiera anual completa', 2000000, 'Auditoría', true, NOW(), NOW())
ON CONFLICT (codigo) DO NOTHING;

-- =====================================================================
-- 📋 PASO 6: VERIFICACIÓN FINAL
-- =====================================================================

-- Mostrar resumen de configuración
SELECT
  'CONFIGURACIÓN COMPLETADA' as estado,
  COUNT(*) as total_tablas
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'roles',
  'usuarios_sistema',
  'empresas',
  'ventas',
  'cobranzas',
  'servicios',
  'detalles_venta',
  'proyecciones',
  'empleados',
  'nominas'
);

-- Mostrar datos insertados
SELECT 'Roles' as tabla, COUNT(*) as total FROM public.roles
UNION ALL
SELECT 'Empresas' as tabla, COUNT(*) as total FROM public.empresas
UNION ALL
SELECT 'Servicios' as tabla, COUNT(*) as total FROM public.servicios;

-- =====================================================================
-- 📋 INSTRUCCIONES FINALES
-- =====================================================================

-- NOTA: Después de ejecutar este script, necesitas:

-- 1. Crear el usuario administrador en Authentication > Users:
--    Email: mtzcontabilidad@gmail.com
--    Password: Alohomora33@
--    Role: admin (en user_metadata)

-- 2. Obtener el UUID del usuario y ejecutar:
--    INSERT INTO public.usuarios_sistema (id, email, nombre_completo, rol_id, activo, telefono, cargo, departamento, created_at, updated_at)
--    VALUES ('UUID_DEL_USUARIO', 'mtzcontabilidad@gmail.com', 'Administrador MTZ', 1, true, '+56 9 1234 5678', 'Administrador General', 'Administración', NOW(), NOW());

-- 3. Ejecutar el script database/insert_test_data.sql para agregar más datos de prueba
