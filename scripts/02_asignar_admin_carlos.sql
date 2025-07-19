-- ===================================================================
-- ASIGNAR ROL ADMINISTRADOR A CARLOS VILLAGRA
-- Ejecutar DESPUÉS de crear el sistema de roles
-- ===================================================================

-- Crear usuario administrador (Carlos Villagra)
-- Nota: Solo funciona si el usuario ya existe en auth.users
DO $$
BEGIN
    -- Verificar si el usuario existe en auth.users
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'mtzcontabilidad@gmail.com') THEN
        -- Insertar o actualizar en usuarios_sistema
        INSERT INTO public.usuarios_sistema (
            id, 
            email, 
            nombre_completo, 
            rol_id, 
            activo,
            cargo,
            telefono,
            notas
        ) 
        SELECT 
            id, 
            email, 
            'Carlos Villagra', 
            (SELECT id FROM public.roles WHERE nombre = 'administrador'),
            true,
            'Director General MTZ Consultores Tributarios',
            '+56 57 2123456',
            'Usuario administrador principal del sistema. Acceso completo a todos los módulos.'
        FROM auth.users 
        WHERE email = 'mtzcontabilidad@gmail.com'
        ON CONFLICT (id) DO UPDATE SET
            rol_id = (SELECT id FROM public.roles WHERE nombre = 'administrador'),
            nombre_completo = 'Carlos Villagra',
            cargo = 'Director General MTZ Consultores Tributarios',
            telefono = '+56 57 2123456',
            updated_at = NOW();
            
        RAISE NOTICE 'Usuario Carlos Villagra configurado como administrador exitosamente';
    ELSE
        RAISE NOTICE 'Usuario mtzcontabilidad@gmail.com no encontrado en auth.users';
    END IF;
END $$;

-- Verificar la configuración
SELECT 
    u.email,
    u.nombre_completo,
    u.cargo,
    r.nombre as rol,
    r.descripcion,
    u.activo,
    u.created_at
FROM public.usuarios_sistema u
JOIN public.roles r ON u.rol_id = r.id
WHERE u.email = 'mtzcontabilidad@gmail.com';