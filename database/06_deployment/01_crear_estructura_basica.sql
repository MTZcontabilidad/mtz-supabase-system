-- =====================================================
-- SCRIPT 1: CREAR ESTRUCTURA BÁSICA DEL SISTEMA MTZ
-- =====================================================
-- Este script crea las tablas principales con claves primarias correctas
-- y relaciones bien definidas

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABLA DE ROLES (debe ir primero)
-- =====================================================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    permisos JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TABLA DE USUARIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    rol_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TABLA DE EMPRESAS CONTABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS empresas_contables (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    rut VARCHAR(20) UNIQUE NOT NULL,
    direccion TEXT,
    telefono VARCHAR(50),
    email VARCHAR(255),
    representante_legal VARCHAR(255),
    giro VARCHAR(255),
    fecha_inicio_operaciones DATE,
    estado VARCHAR(50) DEFAULT 'activo',
    google_drive_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TABLA DE ASIGNACIONES (relaciona usuarios con empresas)
-- =====================================================
CREATE TABLE IF NOT EXISTS asignaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    empresa_id INTEGER REFERENCES empresas_contables(id) ON DELETE CASCADE,
    rol_asignado VARCHAR(100) DEFAULT 'colaborador',
    fecha_asignacion DATE DEFAULT CURRENT_DATE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, empresa_id)
);

-- =====================================================
-- 5. TABLA DE CONTRATOS DE CLIENTES
-- =====================================================
CREATE TABLE IF NOT EXISTS contratos_clientes (
    id SERIAL PRIMARY KEY,
    numero_contrato VARCHAR(100) UNIQUE NOT NULL,
    empresa_id INTEGER REFERENCES empresas_contables(id) ON DELETE CASCADE,
    tipo_contrato VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    monto DECIMAL(15,2) NOT NULL,
    moneda VARCHAR(10) DEFAULT 'CLP',
    estado VARCHAR(50) DEFAULT 'activo',
    descripcion TEXT,
    google_drive_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. TABLA DE ANEXOS DE CONTRATOS
-- =====================================================
CREATE TABLE IF NOT EXISTS anexos_contratos (
    id SERIAL PRIMARY KEY,
    contrato_id INTEGER REFERENCES contratos_clientes(id) ON DELETE CASCADE,
    numero_anexo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_anexo DATE NOT NULL,
    monto_adicional DECIMAL(15,2) DEFAULT 0,
    moneda VARCHAR(10) DEFAULT 'CLP',
    estado VARCHAR(50) DEFAULT 'activo',
    google_drive_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(contrato_id, numero_anexo)
);

-- =====================================================
-- 7. TABLA DE DOCUMENTOS TRIBUTARIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS documentos_tributarios (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas_contables(id) ON DELETE CASCADE,
    tipo_documento VARCHAR(100) NOT NULL,
    numero_documento VARCHAR(100),
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE,
    monto DECIMAL(15,2),
    moneda VARCHAR(10) DEFAULT 'CLP',
    estado VARCHAR(50) DEFAULT 'pendiente',
    descripcion TEXT,
    google_drive_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. TABLA DE DECLARACIONES TRIBUTARIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS declaraciones_tributarias (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas_contables(id) ON DELETE CASCADE,
    tipo_declaracion VARCHAR(100) NOT NULL,
    periodo_ano INTEGER NOT NULL,
    periodo_mes INTEGER NOT NULL,
    fecha_presentacion DATE,
    fecha_vencimiento DATE NOT NULL,
    monto DECIMAL(15,2),
    moneda VARCHAR(10) DEFAULT 'CLP',
    estado VARCHAR(50) DEFAULT 'pendiente',
    observaciones TEXT,
    google_drive_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(empresa_id, tipo_declaracion, periodo_ano, periodo_mes)
);

-- =====================================================
-- 9. TABLA DE VENTAS
-- =====================================================
CREATE TABLE IF NOT EXISTS ventas (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas_contables(id) ON DELETE CASCADE,
    numero_factura VARCHAR(100),
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE,
    cliente_nombre VARCHAR(255),
    cliente_rut VARCHAR(20),
    monto_neto DECIMAL(15,2) NOT NULL,
    iva DECIMAL(15,2) DEFAULT 0,
    monto_total DECIMAL(15,2) NOT NULL,
    moneda VARCHAR(10) DEFAULT 'CLP',
    estado VARCHAR(50) DEFAULT 'emitida',
    descripcion TEXT,
    google_drive_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. TABLA DE COBRANZAS
-- =====================================================
CREATE TABLE IF NOT EXISTS cobranzas (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas_contables(id) ON DELETE CASCADE,
    venta_id INTEGER REFERENCES ventas(id) ON DELETE SET NULL,
    numero_documento VARCHAR(100),
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    monto DECIMAL(15,2) NOT NULL,
    moneda VARCHAR(10) DEFAULT 'CLP',
    estado VARCHAR(50) DEFAULT 'pendiente',
    fecha_pago DATE,
    monto_pagado DECIMAL(15,2),
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREAR ÍNDICES PARA OPTIMIZAR RENDIMIENTO
-- =====================================================

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol_id ON usuarios(rol_id);

-- Índices para empresas
CREATE INDEX IF NOT EXISTS idx_empresas_rut ON empresas_contables(rut);
CREATE INDEX IF NOT EXISTS idx_empresas_estado ON empresas_contables(estado);

-- Índices para contratos
CREATE INDEX IF NOT EXISTS idx_contratos_empresa_id ON contratos_clientes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_contratos_estado ON contratos_clientes(estado);
CREATE INDEX IF NOT EXISTS idx_contratos_fecha_inicio ON contratos_clientes(fecha_inicio);

-- Índices para anexos
CREATE INDEX IF NOT EXISTS idx_anexos_contrato_id ON anexos_contratos(contrato_id);

-- Índices para documentos tributarios
CREATE INDEX IF NOT EXISTS idx_documentos_empresa_id ON documentos_tributarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_documentos_fecha_emision ON documentos_tributarios(fecha_emision);

-- Índices para declaraciones
CREATE INDEX IF NOT EXISTS idx_declaraciones_empresa_id ON declaraciones_tributarias(empresa_id);
CREATE INDEX IF NOT EXISTS idx_declaraciones_periodo ON declaraciones_tributarias(periodo_ano, periodo_mes);

-- Índices para ventas
CREATE INDEX IF NOT EXISTS idx_ventas_empresa_id ON ventas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha_emision ON ventas(fecha_emision);

-- Índices para cobranzas
CREATE INDEX IF NOT EXISTS idx_cobranzas_empresa_id ON cobranzas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_cobranzas_fecha_vencimiento ON cobranzas(fecha_vencimiento);

-- =====================================================
-- CREAR TRIGGERS PARA ACTUALIZAR updated_at
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas_contables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contratos_updated_at BEFORE UPDATE ON contratos_clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_anexos_updated_at BEFORE UPDATE ON anexos_contratos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documentos_updated_at BEFORE UPDATE ON documentos_tributarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_declaraciones_updated_at BEFORE UPDATE ON declaraciones_tributarias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ventas_updated_at BEFORE UPDATE ON ventas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cobranzas_updated_at BEFORE UPDATE ON cobranzas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas_contables ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE anexos_contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_tributarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE declaraciones_tributarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cobranzas ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- MENSAJE DE CONFIRMACIÓN
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Estructura básica creada exitosamente';
    RAISE NOTICE '📋 Tablas creadas: roles, usuarios, empresas_contables, asignaciones, contratos_clientes, anexos_contratos, documentos_tributarios, declaraciones_tributarias, ventas, cobranzas';
    RAISE NOTICE '🔒 RLS habilitado en todas las tablas';
    RAISE NOTICE '📊 Índices creados para optimizar rendimiento';
    RAISE NOTICE '🔄 Triggers configurados para updated_at';
END $$;
