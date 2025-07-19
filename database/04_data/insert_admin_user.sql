-- =====================================================================
-- 👑 INSERTAR USUARIO ADMINISTRADOR CARLOS VILLAGRA
-- Archivo: 04_data/insert_admin_user.sql
-- Propósito: Configurar Carlos Villagra como administrador principal
-- Dependencias: public.usuarios_sistema, public.roles, auth.users
-- =====================================================================

-- Insertar/actualizar Carlos Villagra como administrador principal
INSERT INTO public.usuarios_sistema (
    id, 
    email, 
    nombre_completo, 
    rol_id, 
    activo, 
    cargo, 
    departamento,
    telefono,
    notas,
    preferencias,
    timezone
) VALUES (
    'aa43bcf5-4eb9-46bb-8403-1028b83cbab9', -- ID real del usuario en auth.users
    'mtzcontabilidad@gmail.com',
    'Carlos Villagra',
    (SELECT id FROM public.roles WHERE nombre = 'administrador'),
    true,
    'Director General',
    'Administración',
    '+56 9 8765 4321',
    'Usuario principal administrador del sistema MTZ Ouroborus AI v3.0 - Acceso completo a todas las funcionalidades',
    '{"theme": "dark", "language": "es", "notifications": true, "dashboard_widgets": ["clients", "revenue", "tasks", "analytics"]}',
    'America/Santiago'
) 

-- Manejar conflictos actualizando información si ya existe
ON CONFLICT (id) DO UPDATE SET
    rol_id = (SELECT id FROM public.roles WHERE nombre = 'administrador'),
    nombre_completo = 'Carlos Villagra',
    cargo = 'Director General',
    departamento = 'Administración',
    activo = true,
    telefono = COALESCE(EXCLUDED.telefono, usuarios_sistema.telefono),
    notas = EXCLUDED.notas,
    preferencias = EXCLUDED.preferencias,
    updated_at = NOW();

-- Verificar que Carlos fue configurado correctamente como administrador
DO $$
DECLARE
    user_role TEXT;
    user_name TEXT;
BEGIN
    SELECT u.nombre_completo, r.nombre 
    INTO user_name, user_role
    FROM public.usuarios_sistema u
    JOIN public.roles r ON u.rol_id = r.id
    WHERE u.email = 'mtzcontabilidad@gmail.com';
    
    IF user_role = 'administrador' THEN
        RAISE NOTICE '✅ % configurado exitosamente como % del sistema MTZ', user_name, user_role;
    ELSE
        RAISE EXCEPTION '❌ Error: Carlos Villagra no fue configurado como administrador. Rol actual: %', COALESCE(user_role, 'SIN ROL');
    END IF;
END
$$;

-- Actualizar fecha de último acceso para activar cuenta
UPDATE public.usuarios_sistema 
SET fecha_ultimo_acceso = NOW()
WHERE email = 'mtzcontabilidad@gmail.com';

-- Comentarios para documentación
COMMENT ON TABLE public.usuarios_sistema IS 'Carlos Villagra (mtzcontabilidad@gmail.com) configurado como administrador principal';

-- ✅ CARLOS VILLAGRA CONFIGURADO COMO ADMINISTRADOR EXITOSAMENTE
