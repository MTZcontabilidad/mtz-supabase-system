# 📋 Guía de Configuración - Sistema MTZ v3.0 (Sin Modo Demo)

Esta guía te ayudará a configurar el sistema MTZ v3.0 para que funcione completamente con datos reales de Supabase, sin modo demo.

## 🎯 Objetivo

Configurar el sistema para que:

- ✅ Lea datos reales de Supabase
- ✅ Use autenticación real
- ✅ Tenga al menos 3 registros de prueba
- ✅ Esté estructurado de la mejor manera
- ✅ Permita pruebas rápidas

## 🚀 Pasos de Configuración

### Paso 1: Configurar Supabase

1. **Crear proyecto en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Anota la URL y anon key

2. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env.local en la raíz del proyecto
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
   ```

### Paso 2: Crear Estructura de Base de Datos

1. **Ejecutar esquemas de tablas**

   ```sql
   -- En el SQL Editor de Supabase, ejecutar en orden:

   -- 1. Roles
   -- Ejecutar: database/01_schemas/roles.sql

   -- 2. Usuarios del sistema
   -- Ejecutar: database/01_schemas/usuarios.sql

   -- 3. Empresas
   -- Ejecutar: database/01_schemas/empresas.sql

   -- 4. Ventas y cobranza
   -- Ejecutar: database/01_schemas/ventas_cobranza.sql

   -- 5. RRHH
   -- Ejecutar: database/01_schemas/rrhh.sql

   -- 6. Proyecciones
   -- Ejecutar: database/01_schemas/proyecciones.sql
   ```

### Paso 3: Crear Usuarios de Prueba

1. **Ir a Supabase Dashboard > Authentication > Users**
2. **Hacer clic en "Add User"**
3. **Crear los siguientes usuarios:**

   | Email               | Password     | Rol           |
   | ------------------- | ------------ | ------------- |
   | admin@mtz.cl        | Alohomora33. | Administrador |
   | gerente@mtz.cl      | password123  | Gerente       |
   | analista@mtz.cl     | password123  | Analista      |
   | asistente@mtz.cl    | password123  | Asistente     |
   | cliente@techcorp.cl | password123  | Cliente       |

### Paso 4: Obtener UUIDs de Usuarios

1. **Ejecutar en SQL Editor:**

   ```sql
   SELECT id, email FROM auth.users WHERE email IN (
     'admin@mtz.cl',
     'gerente@mtz.cl',
     'analista@mtz.cl',
     'asistente@mtz.cl',
     'cliente@techcorp.cl'
   );
   ```

2. **Copiar los UUIDs obtenidos**

### Paso 5: Actualizar Script de Datos

1. **Abrir archivo:** `database/insert_test_data.sql`
2. **Reemplazar los UUIDs de ejemplo:**

   ```sql
   -- Cambiar estas líneas:
   ('00000000-0000-0000-0000-000000000001', 'admin@mtz.cl', ...)
   ('00000000-0000-0000-0000-000000000002', 'gerente@mtz.cl', ...)
   -- etc.

   -- Por los UUIDs reales obtenidos en el paso anterior
   ```

### Paso 6: Insertar Datos de Prueba

1. **Ejecutar el script actualizado:**

   ```sql
   -- Ejecutar: database/insert_test_data.sql
   ```

2. **Verificar inserción:**
   ```sql
   -- Verificar que se insertaron los datos
   SELECT 'Roles' as tabla, COUNT(*) as total FROM public.roles
   UNION ALL
   SELECT 'Usuarios Sistema' as tabla, COUNT(*) as total FROM public.usuarios_sistema
   UNION ALL
   SELECT 'Empresas' as tabla, COUNT(*) as total FROM public.empresas;
   ```

### Paso 7: Configurar Seguridad (RLS)

1. **Ejecutar script de seguridad:**
   ```sql
   -- Ejecutar: database/setup_rapido.sql (secciones 6 y 7)
   ```

### Paso 8: Instalar y Ejecutar Frontend

1. **Instalar dependencias:**

   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo:**

   ```bash
   npm run dev
   ```

3. **Acceder al sistema:**
   - URL: `http://localhost:5173`
   - Login: `admin@mtz.cl` / `Alohomora33.`

## 📊 Datos de Prueba Incluidos

### Usuarios (5)

- **Administrador**: admin@mtz.cl
- **Gerente**: gerente@mtz.cl
- **Analista**: analista@mtz.cl
- **Asistente**: asistente@mtz.cl
- **Cliente**: cliente@techcorp.cl

### Empresas/Clientes (5)

- TechCorp Solutions Ltda.
- Constructora Norte Ltda.
- Distribuidora Sur SPA
- Consultoría Financiera ABC
- Restaurante El Buen Sabor

### Ventas (5)

- F001-2024: $595,000 (Pendiente)
- F002-2024: $892,500 (Pagada)
- F003-2024: $1,428,000 (Vencida)
- F004-2024: $416,500 (Pendiente)
- F005-2024: $297,500 (Pendiente)

### Cobranzas (5)

- Seguimiento de pagos pendientes
- Estados: Pendiente, Pagado, Vencido
- Prioridades: Alta, Media, Baja

### Servicios (5)

- Contabilidad Mensual
- Declaración IVA
- Nómina y Remuneraciones
- Asesoría Tributaria
- Auditoría Financiera

### Empleados (5)

- Pedro Martínez (Desarrollador)
- Laura Fernández (Contadora)
- Roberto Silva (Vendedor)
- Carmen González (Asistente)
- Diego Rodríguez (Analista)

### Proyecciones (3)

- Ventas Q1 2024
- Cobranza Q1 2024
- Ingresos 2024

## 🔐 Sistema de Autenticación

### Flujo de Login

1. Usuario ingresa credenciales
2. Sistema valida contra Supabase Auth
3. Carga perfil desde `usuarios_sistema`
4. Asigna rol y permisos
5. Redirige según rol

### Roles y Permisos

- **Administrador**: Acceso completo
- **Gerente**: Gestión operativa
- **Analista**: Análisis y reportes
- **Asistente**: Tareas administrativas
- **Cliente**: Portal limitado

## 📱 Funcionalidades Disponibles

### Dashboard

- ✅ KPIs en tiempo real
- ✅ Gráficos de ventas
- ✅ Distribución de clientes
- ✅ Alertas automáticas
- ✅ Actividad reciente

### Gestión de Clientes

- ✅ Listado de empresas
- ✅ Información detallada
- ✅ Estados y categorías
- ✅ Búsqueda y filtros

### Ventas y Cobranzas

- ✅ Facturas emitidas
- ✅ Estados de pago
- ✅ Seguimiento de cobranzas
- ✅ Métodos de pago

### RRHH

- ✅ Gestión de empleados
- ✅ Nóminas mensuales
- ✅ Salarios y bonificaciones
- ✅ Estados de empleados

### Proyecciones

- ✅ Proyecciones financieras
- ✅ Seguimiento de objetivos
- ✅ Análisis de cumplimiento
- ✅ Reportes de tendencias

## 🛠️ Troubleshooting

### Error: "No hay datos disponibles"

- Verificar que se ejecutó `insert_test_data.sql`
- Verificar que los UUIDs son correctos
- Verificar permisos de RLS

### Error: "Invalid login credentials"

- Verificar que el usuario existe en Supabase Auth
- Verificar que existe en `usuarios_sistema`
- Verificar que el rol_id es correcto

### Error: "Permission denied"

- Verificar políticas de RLS
- Verificar permisos del rol
- Verificar que el usuario está autenticado

### Error: "Table does not exist"

- Verificar que se ejecutaron los esquemas
- Verificar nombres de tablas
- Verificar schema (public)

## 📈 Verificación de Configuración

### Consultas de Verificación

```sql
-- Verificar tablas creadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('roles', 'usuarios_sistema', 'empresas', 'ventas', 'cobranzas');

-- Verificar datos insertados
SELECT 'Roles' as tabla, COUNT(*) as total FROM public.roles
UNION ALL
SELECT 'Usuarios' as tabla, COUNT(*) as total FROM public.usuarios_sistema
UNION ALL
SELECT 'Empresas' as tabla, COUNT(*) as total FROM public.empresas;

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

### Indicadores de Éxito

- ✅ Dashboard muestra datos reales
- ✅ Login funciona con credenciales
- ✅ Navegación entre módulos
- ✅ Datos se cargan desde Supabase
- ✅ No hay errores en consola

## 🚀 Próximos Pasos

1. **Personalizar datos** según necesidades
2. **Configurar notificaciones** por email
3. **Implementar reportes** avanzados
4. **Configurar backup** automático
5. **Optimizar performance** de consultas

## 📞 Soporte

- **Email**: mtzcontabilidad@gmail.com
- **Documentación**: Ver archivos en `docs/`
- **Issues**: Usar GitHub Issues

---

**✅ Sistema configurado exitosamente sin modo demo**
