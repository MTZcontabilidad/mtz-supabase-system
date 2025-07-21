-- =====================================================================
-- 🚀 SETUP RÁPIDO - SISTEMA MTZ v3.0
-- Archivo: database/scripts/setup-rapido.sql
-- Propósito: Configurar rápidamente las tablas faltantes
-- =====================================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 🗄️ CREAR TABLAS FALTANTES
-- =====================================================================

-- Tabla: empresas
CREATE TABLE IF NOT EXISTS empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    ruc TEXT UNIQUE,
    direccion TEXT,
    telefono TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: usuarios (perfil extendido)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    rol TEXT DEFAULT 'usuario',
    empresa_id UUID REFERENCES empresas(id),
    telefono TEXT,
    cargo TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: asignaciones (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS asignaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    rol_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, empresa_id, rol_id)
);

-- =====================================================================
-- 🔒 CONFIGURAR RLS (Row Level Security)
-- =====================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para empresas
CREATE POLICY "Empresas: Permitir todo temporalmente" ON empresas
    FOR ALL USING (true);

-- Políticas básicas para usuarios
CREATE POLICY "Usuarios: Permitir todo temporalmente" ON usuarios
    FOR ALL USING (true);

-- Políticas básicas para asignaciones
CREATE POLICY "Asignaciones: Permitir todo temporalmente" ON asignaciones
    FOR ALL USING (true);

-- =====================================================================
-- 📊 INSERTAR DATOS INICIALES
-- =====================================================================

-- Insertar empresa principal
INSERT INTO empresas (nombre, ruc, direccion, telefono, email)
VALUES (
    'MTZ Consultores',
    '20123456789',
    'Av. Principal 123, Lima',
    '+51 1 234 5678',
    'info@mtzconsultores.com'
) ON CONFLICT (ruc) DO NOTHING;

-- =====================================================================
-- 👤 CREAR USUARIO ADMINISTRADOR
-- =====================================================================

-- Insertar usuario administrador (si no existe)
INSERT INTO usuarios (id, email, nombre, apellido, rol, empresa_id)
SELECT
    auth.uid(),
    'mtzcontabilidad@gmail.com',
    'Carlos',
    'Villagra',
    'admin',
    e.id
FROM empresas e
WHERE e.nombre = 'MTZ Consultores'
AND NOT EXISTS (
    SELECT 1 FROM usuarios u WHERE u.email = 'mtzcontabilidad@gmail.com'
);

-- =====================================================================
-- 🔗 CREAR ASIGNACIÓN DE ROL
-- =====================================================================

-- Asignar rol de admin al usuario
INSERT INTO asignaciones (usuario_id, empresa_id, rol_id)
SELECT
    u.id,
    u.empresa_id,
    r.id
FROM usuarios u
JOIN roles r ON r.nombre = 'admin'
WHERE u.email = 'mtzcontabilidad@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM asignaciones a
    WHERE a.usuario_id = u.id AND a.rol_id = r.id
);

-- =====================================================================
-- ✅ VERIFICACIÓN FINAL
-- =====================================================================

-- Mostrar datos insertados
SELECT 'Empresas creadas:' as info, COUNT(*) as count FROM empresas;
SELECT 'Usuarios creados:' as info, COUNT(*) as count FROM usuarios;
SELECT 'Asignaciones creadas:' as info, COUNT(*) as count FROM asignaciones;

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '🎉 SETUP RÁPIDO COMPLETADO EXITOSAMENTE';
    RAISE NOTICE '✅ Tablas creadas';
    RAISE NOTICE '✅ RLS configurado';
    RAISE NOTICE '✅ Datos iniciales insertados';
    RAISE NOTICE '✅ Usuario administrador creado';
    RAISE NOTICE '🔑 Credenciales: mtzcontabilidad@gmail.com / Alohomora33.';
END $$;
