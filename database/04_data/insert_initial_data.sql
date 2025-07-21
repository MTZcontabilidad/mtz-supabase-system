-- =====================================================================
-- 📊 INSERTAR DATOS INICIALES - MTZ v3.0
-- =====================================================================

-- Limpiar datos existentes (opcional)
-- DELETE FROM usuarios WHERE email = 'mtzcontabilidad@gmail.com';
-- DELETE FROM roles WHERE nombre IN ('admin', 'supervisor', 'usuario', 'invitado');
-- DELETE FROM empresas WHERE ruc = '12345678-9';

-- =====================================================================
-- INSERTAR ROLES
-- =====================================================================

INSERT INTO roles (id, nombre, descripcion, permisos, created_at, updated_at) VALUES
(1, 'admin', 'Administrador del sistema',
  '{"clientes": {"read": true, "write": true, "delete": true}, "ventas": {"read": true, "write": true, "delete": true}, "cobranza": {"read": true, "write": true, "delete": true}, "compras": {"read": true, "write": true, "delete": true}, "contratos": {"read": true, "write": true, "delete": true}, "reportes": {"read": true, "write": true, "delete": true}, "analytics": {"read": true, "write": true, "delete": true}, "configuracion": {"read": true, "write": true, "delete": true}}',
  NOW(), NOW()
),
(2, 'supervisor', 'Supervisor de operaciones',
  '{"clientes": {"read": true, "write": true, "delete": false}, "ventas": {"read": true, "write": true, "delete": false}, "cobranza": {"read": true, "write": true, "delete": false}, "compras": {"read": true, "write": true, "delete": false}, "contratos": {"read": true, "write": true, "delete": false}, "reportes": {"read": true, "write": false, "delete": false}, "analytics": {"read": true, "write": false, "delete": false}, "configuracion": {"read": true, "write": false, "delete": false}}',
  NOW(), NOW()
),
(3, 'usuario', 'Usuario estándar',
  '{"clientes": {"read": true, "write": false, "delete": false}, "ventas": {"read": true, "write": true, "delete": false}, "cobranza": {"read": true, "write": false, "delete": false}, "compras": {"read": true, "write": false, "delete": false}, "contratos": {"read": true, "write": false, "delete": false}, "reportes": {"read": true, "write": false, "delete": false}, "analytics": {"read": true, "write": false, "delete": false}, "configuracion": {"read": false, "write": false, "delete": false}}',
  NOW(), NOW()
),
(4, 'invitado', 'Usuario invitado',
  '{"clientes": {"read": false, "write": false, "delete": false}, "ventas": {"read": false, "write": false, "delete": false}, "cobranza": {"read": false, "write": false, "delete": false}, "compras": {"read": false, "write": false, "delete": false}, "contratos": {"read": false, "write": false, "delete": false}, "reportes": {"read": false, "write": false, "delete": false}, "analytics": {"read": false, "write": false, "delete": false}, "configuracion": {"read": false, "write": false, "delete": false}}',
  NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  permisos = EXCLUDED.permisos,
  updated_at = NOW();

-- =====================================================================
-- INSERTAR EMPRESA
-- =====================================================================

INSERT INTO empresas (id, nombre, ruc, direccion, telefono, email, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  'MTZ Contabilidad',
  '12345678-9',
  'Av. Principal 123, Santiago',
  '+56 2 2345 6789',
  'contacto@mtzcontabilidad.cl',
  NOW(),
  NOW()
)
ON CONFLICT (ruc) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  direccion = EXCLUDED.direccion,
  telefono = EXCLUDED.telefono,
  email = EXCLUDED.email,
  updated_at = NOW();

-- =====================================================================
-- INSERTAR USUARIO ADMIN
-- =====================================================================

-- Obtener el ID de la empresa
DO $$
DECLARE
  empresa_id UUID;
  admin_user_id UUID;
BEGIN
  -- Obtener ID de la empresa
  SELECT id INTO empresa_id FROM empresas WHERE ruc = '12345678-9' LIMIT 1;

  -- Obtener ID del usuario de auth.users (debe existir previamente)
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'mtzcontabilidad@gmail.com' LIMIT 1;

  -- Insertar usuario admin si existe en auth.users
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO usuarios (id, email, nombre, apellido, rol_id, empresa_id, telefono, cargo, activo, created_at, updated_at) VALUES
    (
      admin_user_id,
      'mtzcontabilidad@gmail.com',
      'Carlos',
      'Villagra',
      1, -- rol admin
      empresa_id,
      '+56 9 1234 5678',
      'Administrador General',
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      nombre = EXCLUDED.nombre,
      apellido = EXCLUDED.apellido,
      rol_id = EXCLUDED.rol_id,
      empresa_id = EXCLUDED.empresa_id,
      telefono = EXCLUDED.telefono,
      cargo = EXCLUDED.cargo,
      activo = EXCLUDED.activo,
      updated_at = NOW();
  END IF;
END $$;

-- =====================================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- =====================================================================

-- Verificar roles
SELECT 'Roles insertados:' as info;
SELECT id, nombre, descripcion FROM roles ORDER BY id;

-- Verificar empresa
SELECT 'Empresa insertada:' as info;
SELECT id, nombre, ruc, email FROM empresas;

-- Verificar usuario admin
SELECT 'Usuario admin:' as info;
SELECT
  u.id,
  u.email,
  u.nombre,
  u.apellido,
  r.nombre as rol,
  e.nombre as empresa
FROM usuarios u
JOIN roles r ON u.rol_id = r.id
JOIN empresas e ON u.empresa_id = e.id
WHERE u.email = 'mtzcontabilidad@gmail.com';
