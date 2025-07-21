# Configuración de Supabase - MTZ Sistema

## 📋 Descripción General

Este documento contiene la configuración completa de Supabase para el sistema MTZ, incluyendo la configuración de la base de datos, autenticación, políticas de seguridad y variables de entorno.

## 🔧 Configuración de Variables de Entorno

### Archivo .env.local

```env
VITE_SUPABASE_URL=https://bwgnmastihgndmtbqvkj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9Wdd
```

### Verificación de Configuración

```javascript
// Verificar que las variables estén configuradas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno no configuradas');
}
```

## 🗄️ Estructura de Base de Datos

### Tablas Principales

```sql
-- Tabla de usuarios del sistema
CREATE TABLE usuarios_sistema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  rol_id UUID REFERENCES roles(id),
  empresa_id UUID REFERENCES empresas(id),
  estado VARCHAR(50) DEFAULT 'Activo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de empresas
CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  rut VARCHAR(20) UNIQUE NOT NULL,
  direccion TEXT,
  telefono VARCHAR(50),
  email VARCHAR(255),
  estado VARCHAR(50) DEFAULT 'Activo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔒 Políticas de Seguridad (RLS)

### Habilitar RLS

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
```

### Políticas de Usuarios

```sql
-- Política para usuarios autenticados
CREATE POLICY "Usuarios pueden ver su propio perfil" ON usuarios_sistema
  FOR SELECT USING (auth.uid() = id);

-- Política para administradores
CREATE POLICY "Admins pueden gestionar usuarios" ON usuarios_sistema
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios_sistema u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.id = auth.uid() AND r.nombre = 'Administrador'
    )
  );
```

## 🚀 Configuración del Cliente Supabase

### Cliente Principal

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
```

### Configuración de Autenticación

```javascript
// Configuración de autenticación
const authConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
};
```

## 📊 Funciones de Base de Datos

### Función para Obtener Rol de Usuario

```sql
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TABLE(rol_nombre VARCHAR, permisos JSONB) AS $$
BEGIN
  RETURN QUERY
  SELECT r.nombre, r.permisos
  FROM usuarios_sistema u
  JOIN roles r ON u.rol_id = r.id
  WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Función para Verificar Permisos

```sql
CREATE OR REPLACE FUNCTION check_user_permission(
  user_id UUID,
  required_permission VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  user_permissions JSONB;
BEGIN
  SELECT permisos INTO user_permissions
  FROM get_user_role(user_id);

  RETURN user_permissions->required_permission = 'true';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🔍 Verificación de Configuración

### Script de Verificación

```javascript
// Script para verificar la configuración
async function verificarConfiguracion() {
  try {
    // Verificar conexión
    const { data, error } = await supabase
      .from('usuarios_sistema')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Error de conexión:', error.message);
      return false;
    }

    console.log('✅ Conexión exitosa');
    return true;
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}
```

## 📝 Notas Importantes

1. **Seguridad**: Todas las tablas tienen RLS habilitado
2. **Autenticación**: Usar siempre el cliente autenticado para operaciones sensibles
3. **Variables de Entorno**: Nunca commitear las claves en el repositorio
4. **Backup**: Realizar backups regulares de la configuración

## 🛠️ Comandos Útiles

### Verificar Estado de RLS

```sql
-- Verificar qué tablas tienen RLS habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### Listar Políticas

```sql
-- Listar todas las políticas de una tabla
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

---

**Última actualización**: 20 de Julio, 2025
**Versión**: 3.0.0
**Autor**: Equipo MTZ
