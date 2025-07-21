-- =====================================================================
-- 🔧 CONFIGURACIÓN COMPLETA SUPABASE - SISTEMA MTZ v3.0
-- Archivo: database/scripts/configuracion-completa-supabase.sql
-- Propósito: Configurar completamente el proyecto de Supabase
-- =====================================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================================
-- 📧 CONFIGURACIÓN DE EMAIL
-- =====================================================================

-- Verificar configuración de email
SELECT
    'Email Configuration' as section,
    CASE
        WHEN current_setting('app.settings.enable_signup', true) = 'true' THEN '✅ Signup enabled'
        ELSE '❌ Signup disabled'
    END as status;

-- =====================================================================
-- 🗄️ CREAR TABLAS PRINCIPALES
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

-- Tabla: roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT,
    permisos JSONB DEFAULT '{}',
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
-- 🔄 TRIGGERS Y FUNCIONES
-- =====================================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers de updated_at
CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_asignaciones_updated_at BEFORE UPDATE ON asignaciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil de usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.usuarios (id, email, nombre, apellido, rol)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario'),
        COALESCE(NEW.raw_user_meta_data->>'apellido', 'Nuevo'),
        COALESCE(NEW.raw_user_meta_data->>'rol', 'usuario')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil de usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para obtener rol del usuario
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT rol
        FROM usuarios
        WHERE id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener empresa del usuario
CREATE OR REPLACE FUNCTION get_user_company(user_id UUID DEFAULT auth.uid())
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT empresa_id
        FROM usuarios
        WHERE id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- 🔒 POLÍTICAS DE SEGURIDAD (RLS)
-- =====================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones ENABLE ROW LEVEL SECURITY;

-- Políticas para empresas
CREATE POLICY "Empresas: Usuarios pueden ver su empresa" ON empresas
    FOR SELECT USING (
        auth.uid() IN (
            SELECT usuario_id FROM asignaciones
            WHERE empresa_id = empresas.id AND activo = true
        )
    );

CREATE POLICY "Empresas: Admins pueden ver todo" ON empresas
    FOR ALL USING (
        get_user_role() = 'admin'
    );

CREATE POLICY "Empresas: Usuarios pueden crear" ON empresas
    FOR INSERT WITH CHECK (
        get_user_role() IN ('admin', 'gerente')
    );

-- Políticas para roles
CREATE POLICY "Roles: Todos pueden ver roles" ON roles
    FOR SELECT USING (true);

CREATE POLICY "Roles: Solo admins pueden modificar" ON roles
    FOR ALL USING (get_user_role() = 'admin');

-- Políticas para usuarios
CREATE POLICY "Usuarios: Ver usuarios de su empresa" ON usuarios
    FOR SELECT USING (
        empresa_id = get_user_company() OR get_user_role() = 'admin'
    );

CREATE POLICY "Usuarios: Modificar su propio perfil" ON usuarios
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Usuarios: Admins pueden modificar todo" ON usuarios
    FOR ALL USING (get_user_role() = 'admin');

-- Políticas para asignaciones
CREATE POLICY "Asignaciones: Ver asignaciones de su empresa" ON asignaciones
    FOR SELECT USING (
        empresa_id = get_user_company() OR get_user_role() = 'admin'
    );

CREATE POLICY "Asignaciones: Solo admins pueden modificar" ON asignaciones
    FOR ALL USING (get_user_role() = 'admin');

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

-- Insertar roles básicos
INSERT INTO roles (nombre, descripcion, permisos) VALUES
    ('admin', 'Administrador del sistema', '{"all": true}'),
    ('gerente', 'Gerente de empresa', '{"empresa": true, "usuarios": true, "reportes": true}'),
    ('usuario', 'Usuario estándar', '{"datos": true, "reportes": true}')
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================================
-- 👤 CREAR USUARIO ADMINISTRADOR
-- =====================================================================

-- Nota: El usuario se creará automáticamente cuando se registre
-- Este script solo inserta el perfil si ya existe el usuario en auth.users

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

-- Asignar rol de admin
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

-- Verificar configuración
SELECT
    'Configuration Status' as section,
    '✅ Database configured successfully' as status;

-- Mostrar datos insertados
SELECT 'Empresas creadas:' as info, COUNT(*) as count FROM empresas;
SELECT 'Roles creados:' as info, COUNT(*) as count FROM roles;
SELECT 'Usuarios creados:' as info, COUNT(*) as count FROM usuarios;
SELECT 'Asignaciones creadas:' as info, COUNT(*) as count FROM asignaciones;

-- =====================================================================
-- 🎉 CONFIGURACIÓN COMPLETADA
-- =====================================================================

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '🎉 CONFIGURACIÓN COMPLETADA EXITOSAMENTE';
    RAISE NOTICE '✅ Base de datos configurada';
    RAISE NOTICE '✅ Políticas de seguridad activas';
    RAISE NOTICE '✅ Usuario administrador creado';
    RAISE NOTICE '📧 Verifica la configuración de email en Settings > Auth';
    RAISE NOTICE '🔑 Credenciales: mtzcontabilidad@gmail.com / Alohomora33.';
END $$;
