-- =====================================================================
-- 🎭 INSERTAR ROLES PREDEFINIDOS DEL SISTEMA
-- Archivo: 04_data/insert_roles.sql
-- Propósito: Crear los 4 roles principales del sistema MTZ
-- Dependencias: public.roles
-- =====================================================================

-- Insertar roles del sistema con permisos específicos
INSERT INTO public.roles (nombre, descripcion, permisos) VALUES 

-- ROL ADMINISTRADOR: Acceso total al sistema
('administrador', 'Acceso completo al sistema MTZ - Director/Gerente', '{
    "clientes": {"read": true, "write": true, "delete": true, "export": true},
    "usuarios": {"read": true, "write": true, "delete": true, "roles": true},
    "reportes": {"read": true, "write": true, "delete": true, "export": true},
    "configuracion": {"read": true, "write": true, "backup": true},
    "asignaciones": {"read": true, "write": true, "delete": true, "assign": true},
    "dashboard": {"read": true, "analytics": true, "all_stats": true}
}'),

-- ROL COLABORADOR: Empleado interno con acceso amplio
('colaborador', 'Empleado interno MTZ con acceso completo a clientes', '{
    "clientes": {"read": true, "write": true, "delete": false, "export": true},
    "usuarios": {"read": true, "write": false, "delete": false, "roles": false},
    "reportes": {"read": true, "write": true, "delete": false, "export": true},
    "configuracion": {"read": true, "write": false, "backup": false},
    "asignaciones": {"read": true, "write": true, "delete": false, "assign": true},
    "dashboard": {"read": true, "analytics": true, "all_stats": true}
}'),

-- ROL EXTERNO: Contador externo con acceso limitado
('externo', 'Contador externo con acceso solo a clientes asignados', '{
    "clientes": {"read": false, "write": false, "delete": false, "export": false},
    "usuarios": {"read": false, "write": false, "delete": false, "roles": false},
    "reportes": {"read": true, "write": true, "delete": false, "export": true},
    "configuracion": {"read": false, "write": false, "backup": false},
    "asignaciones": {"read": true, "write": false, "delete": false, "assign": false},
    "dashboard": {"read": true, "analytics": false, "all_stats": false}
}'),

-- ROL CLIENTE: Usuario cliente con acceso solo a su empresa
('cliente', 'Usuario cliente con acceso solo a su empresa', '{
    "clientes": {"read": true, "write": false, "delete": false, "export": false},
    "usuarios": {"read": false, "write": false, "delete": false, "roles": false},
    "reportes": {"read": true, "write": false, "delete": false, "export": false},
    "configuracion": {"read": false, "write": false, "backup": false},
    "asignaciones": {"read": false, "write": false, "delete": false, "assign": false},
    "dashboard": {"read": true, "analytics": false, "all_stats": false}
}')

-- Evitar duplicados en caso de re-ejecución
ON CONFLICT (nombre) DO UPDATE SET
    descripcion = EXCLUDED.descripcion,
    permisos = EXCLUDED.permisos,
    updated_at = NOW();

-- Verificar que los roles se crearon correctamente
DO $$
DECLARE
    role_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO role_count FROM public.roles;
    
    IF role_count >= 4 THEN
        RAISE NOTICE '✅ % roles creados exitosamente en el sistema MTZ', role_count;
    ELSE
        RAISE EXCEPTION '❌ Error: Solo se crearon % roles, se esperaban al menos 4', role_count;
    END IF;
END
$$;

-- Comentarios para documentación
COMMENT ON TABLE public.roles IS 'Roles del sistema: administrador (completo), colaborador (empleado), externo (contador), cliente (empresa)';

-- ✅ ROLES DEL SISTEMA MTZ INSERTADOS EXITOSAMENTE
