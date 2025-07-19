-- =====================================================================
-- 🎭 INSERCIÓN DE ROLES MEJORADOS CON PERMISOS GRANULARES
-- Archivo: 04_data/insert_roles_mejorados.sql
-- Propósito: Definir roles con permisos específicos para cada funcionalidad
-- =====================================================================

-- Limpiar roles existentes
DELETE FROM public.roles WHERE nombre IN ('administrador', 'colaborador', 'usuario');

-- Insertar rol ADMINISTRADOR (acceso completo)
INSERT INTO public.roles (nombre, descripcion, permisos) VALUES (
    'administrador',
    'Acceso completo al sistema. Puede gestionar usuarios, clientes, cobranzas y requerimientos.',
    '{
        "dashboard": {"read": true, "write": true, "delete": true},
        "clientes": {"read": true, "write": true, "delete": true, "assign": true},
        "cobranza": {"read": true, "write": true, "delete": true, "approve": true},
        "requerimientos": {"read": true, "write": true, "delete": true, "assign": true},
        "usuarios": {"read": true, "write": true, "delete": true, "assign_roles": true},
        "reportes": {"read": true, "write": true, "export": true},
        "analytics": {"read": true, "write": true},
        "configuracion": {"read": true, "write": true, "system": true},
        "asignaciones": {"read": true, "write": true, "delete": true, "manage": true}
    }'
);

-- Insertar rol COLABORADOR (acceso limitado)
INSERT INTO public.roles (nombre, descripcion, permisos) VALUES (
    'colaborador',
    'Colaborador interno con acceso a clientes asignados y funcionalidades básicas.',
    '{
        "dashboard": {"read": true, "write": false, "delete": false},
        "clientes": {"read": true, "write": true, "delete": false, "assign": false},
        "cobranza": {"read": true, "write": true, "delete": false, "approve": false},
        "requerimientos": {"read": true, "write": true, "delete": false, "assign": false},
        "usuarios": {"read": false, "write": false, "delete": false, "assign_roles": false},
        "reportes": {"read": true, "write": false, "export": true},
        "analytics": {"read": true, "write": false},
        "configuracion": {"read": false, "write": false, "system": false},
        "asignaciones": {"read": true, "write": true, "delete": false, "manage": false}
    }'
);

-- Insertar rol USUARIO (acceso restringido)
INSERT INTO public.roles (nombre, descripcion, permisos) VALUES (
    'usuario',
    'Usuario externo con acceso solo a clientes específicos asignados.',
    '{
        "dashboard": {"read": true, "write": false, "delete": false},
        "clientes": {"read": true, "write": false, "delete": false, "assign": false},
        "cobranza": {"read": true, "write": false, "delete": false, "approve": false},
        "requerimientos": {"read": true, "write": true, "delete": false, "assign": false},
        "usuarios": {"read": false, "write": false, "delete": false, "assign_roles": false},
        "reportes": {"read": true, "write": false, "export": false},
        "analytics": {"read": false, "write": false},
        "configuracion": {"read": false, "write": false, "system": false},
        "asignaciones": {"read": false, "write": false, "delete": false, "manage": false}
    }'
);

-- ✅ ROLES MEJORADOS INSERTADOS EXITOSAMENTE
