-- SCRIPT 3 CORREGIDO - Modificar Tabla Clientes (Multi-tenant)
-- Script correcto para Dashboard MTZ

-- AGREGAR COLUMNAS PARA MULTI-TENANT (SCRIPT 3 CORREGIDO)

-- Agregar columna empresa_contable_id si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clientes_contables'
    AND column_name = 'empresa_contable_id'
  ) THEN
    ALTER TABLE public.clientes_contables
    ADD COLUMN empresa_contable_id UUID;
  END IF;
END $$;

-- Agregar columna usuario_asignado si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clientes_contables'
    AND column_name = 'usuario_asignado'
  ) THEN
    ALTER TABLE public.clientes_contables
    ADD COLUMN usuario_asignado UUID;
  END IF;
END $$;

-- Crear usuario demo para MTZ System
-- Habilitar extensión pgcrypto si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insertar usuario demo
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  user_metadata,
  raw_app_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  'admin@mtz.cl',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Administrador MTZ", "role": "admin"}'::jsonb,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  false,
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Verificar que el usuario se creó correctamente
SELECT 
  id,
  email,
  user_metadata,
  created_at
FROM auth.users 
WHERE email = 'admin@mtz.cl';

-- Crear perfil de usuario para el admin
INSERT INTO public.perfiles_usuario (
  id,
  nombre_completo,
  email,
  rol,
  empresa_contable,
  activo,
  configuracion
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@mtz.cl'),
  'Administrador MTZ',
  'admin@mtz.cl',
  'admin',
  'MTZ Contabilidad',
  true,
  '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Verificar perfil creado
SELECT 
  p.id,
  p.nombre_completo,
  p.email,
  p.rol,
  p.empresa_contable,
  p.activo
FROM public.perfiles_usuario p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'admin@mtz.cl'; 