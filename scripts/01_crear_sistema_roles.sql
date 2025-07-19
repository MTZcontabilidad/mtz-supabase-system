-- ===================================================================
-- SISTEMA DE ROLES Y PERMISOS MTZ OUROBORUS AI
-- Ejecutar en Supabase Dashboard > SQL Editor
-- ===================================================================

-- 1. Crear tabla de roles
CREATE TABLE IF NOT EXISTS public.roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    permisos JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear tabla de usuarios del sistema (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.usuarios_sistema (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255),
    rol_id INTEGER REFERENCES public.roles(id),
    activo BOOLEAN DEFAULT true,
    empresa_asignada VARCHAR(10), -- Para clientes: ID de la empresa que pueden ver
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadatos adicionales
    telefono VARCHAR(20),
    cargo VARCHAR(100),
    fecha_ultimo_acceso TIMESTAMPTZ,
    notas TEXT
);

-- 3. Crear tabla de asignaciones (para externos)
CREATE TABLE IF NOT EXISTS public.asignaciones_trabajo (
    id SERIAL PRIMARY KEY,
    usuario_externo_id UUID REFERENCES public.usuarios_sistema(id),
    cliente_id VARCHAR(10) REFERENCES public.clientes_contables(id_cliente),
    tipo_trabajo VARCHAR(50), -- 'contabilidad', 'tributario', 'auditoria'
    descripcion TEXT,
    fecha_asignacion TIMESTAMPTZ DEFAULT NOW(),
    fecha_vencimiento DATE,
    estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'en_proceso', 'completado'
    asignado_por_id UUID REFERENCES public.usuarios_sistema(id),
    
    UNIQUE(usuario_externo_id, cliente_id, tipo_trabajo)
);

-- 4. Insertar roles predefinidos
INSERT INTO public.roles (nombre, descripcion, permisos) VALUES 
('administrador', 'Acceso completo al sistema MTZ', '{
    "clientes": {"read": true, "write": true, "delete": true},
    "usuarios": {"read": true, "write": true, "delete": true},
    "reportes": {"read": true, "write": true, "delete": true},
    "configuracion": {"read": true, "write": true},
    "asignaciones": {"read": true, "write": true, "delete": true}
}'),
('colaborador', 'Empleado interno MTZ con acceso completo a clientes', '{
    "clientes": {"read": true, "write": true, "delete": false},
    "usuarios": {"read": true, "write": false, "delete": false},
    "reportes": {"read": true, "write": true, "delete": false},
    "configuracion": {"read": true, "write": false},
    "asignaciones": {"read": true, "write": true, "delete": false}
}'),
('externo', 'Contador externo con acceso limitado', '{
    "clientes": {"read": false, "write": false, "delete": false},
    "usuarios": {"read": false, "write": false, "delete": false},
    "reportes": {"read": true, "write": true, "delete": false},
    "configuracion": {"read": false, "write": false},
    "asignaciones": {"read": true, "write": false, "delete": false}
}'),
('cliente', 'Usuario cliente con acceso solo a su empresa', '{
    "clientes": {"read": true, "write": false, "delete": false},
    "usuarios": {"read": false, "write": false, "delete": false},
    "reportes": {"read": true, "write": false, "delete": false},
    "configuracion": {"read": false, "write": false},
    "asignaciones": {"read": false, "write": false, "delete": false}
}');

-- 5. Crear función para obtener rol del usuario
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT r.nombre INTO user_role
    FROM public.usuarios_sistema u
    JOIN public.roles r ON u.rol_id = r.id
    WHERE u.id = user_id AND u.activo = true;
    
    RETURN COALESCE(user_role, 'sin_rol');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Crear función para verificar permisos
CREATE OR REPLACE FUNCTION public.user_has_permission(
    user_id UUID, 
    resource TEXT, 
    action TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    user_permissions JSONB;
BEGIN
    SELECT r.permisos INTO user_permissions
    FROM public.usuarios_sistema u
    JOIN public.roles r ON u.rol_id = r.id
    WHERE u.id = user_id AND u.activo = true;
    
    IF user_permissions IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN COALESCE(
        (user_permissions -> resource ->> action)::boolean, 
        false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Crear trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_usuarios_sistema_updated_at 
    BEFORE UPDATE ON public.usuarios_sistema
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at 
    BEFORE UPDATE ON public.roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();