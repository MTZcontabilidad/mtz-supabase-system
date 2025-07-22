# 🚀 Sistema MTZ v3.0 - Sin Modo Demo

Sistema integral de gestión empresarial para MTZ Consultores Tributarios, configurado para leer datos reales de Supabase.

## ✨ Características

- **Autenticación real** con Supabase Auth
- **Datos reales** desde Supabase Database
- **Roles y permisos** granulares
- **Dashboard en tiempo real** con métricas reales
- **Gestión de clientes, ventas y cobranzas**
- **Sistema de RRHH** completo
- **Proyecciones financieras**
- **Interfaz moderna** con Tailwind CSS
- **Sistema de seguridad mejorado** con validaciones y alertas
- **Notas de seguridad** en todas las páginas críticas

## 🛠️ Configuración Rápida

### 1. Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase

### 2. Configurar Supabase

1. **Crear proyecto en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Guarda la URL y anon key

2. **Configurar variables de entorno**

   ```bash
   # Crear archivo .env.local
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_anon_key
   ```

3. **Ejecutar scripts de base de datos**
   ```sql
   -- En el SQL Editor de Supabase, ejecutar:
   -- 1. Los esquemas en database/01_schemas/
   -- 2. El script setup_rapido.sql
   -- 3. El script insert_test_data.sql (después de crear usuarios)
   ```

### 3. Crear Usuarios de Prueba

En Supabase Dashboard > Authentication > Users > Add User:

```
1. mtzcontabilidad@gmail.com / Alohomora33@ (ADMINISTRADOR PRINCIPAL)
2. gerente@mtz.cl / password123
3. analista@mtz.cl / password123
4. asistente@mtz.cl / password123
5. cliente@techcorp.cl / password123
```

**Nota:** El usuario `mtzcontabilidad@gmail.com` es el administrador principal del sistema.

### 4. Instalar Dependencias

```bash
npm install
```

### 5. Ejecutar el Proyecto

```bash
npm run dev
```

## 📊 Estructura de Datos

### Tablas Principales

- **`roles`** - Roles del sistema con permisos JSONB
- **`usuarios_sistema`** - Perfiles de usuarios extendidos
- **`empresas`** - Clientes y proveedores
- **`ventas`** - Facturas emitidas
- **`cobranzas`** - Gestión de pagos pendientes
- **`servicios`** - Catálogo de servicios
- **`empleados`** - Gestión de RRHH
- **`proyecciones`** - Proyecciones financieras

### Datos de Prueba Incluidos

- 5 roles del sistema
- 5 usuarios de prueba
- 5 empresas/clientes
- 5 ventas con detalles
- 5 cobranzas
- 5 servicios del catálogo
- 5 empleados con nóminas
- 3 proyecciones financieras

## 🔐 Autenticación y Permisos

### Roles Disponibles

1. **Administrador** - Acceso completo al sistema
2. **Gerente** - Gestión de operaciones y reportes
3. **Analista** - Análisis y reportes
4. **Asistente** - Tareas administrativas
5. **Cliente** - Acceso limitado al portal

### Sistema de Permisos

Los permisos se manejan en formato JSONB en la tabla `roles`:

```json
{
  "clientes": { "read": true, "write": true },
  "ventas": { "read": true, "write": true },
  "cobranza": { "read": true, "write": true },
  "reportes": { "read": true }
}
```

## 📱 Funcionalidades

### Dashboard

- KPIs en tiempo real desde Supabase
- Gráficos de ventas mensuales
- Distribución de clientes
- Alertas automáticas
- Actividad reciente

### Gestión de Clientes

- Listado de empresas/clientes
- Información detallada
- Historial de facturación
- Estados y categorías
- **Nota de seguridad:** Los datos son reales, no simulados

### Ventas y Cobranzas

- Facturas emitidas
- Estados de pago
- Seguimiento de cobranzas
- Métodos de pago
- **Nota de seguridad:** Los datos son reales, no simulados

### RRHH

- Gestión de empleados
- Nóminas mensuales
- Salarios y bonificaciones
- Estados de empleados
- **Nota de seguridad:** Los datos son reales, no simulados

### Proyecciones

- Proyecciones financieras
- Seguimiento de objetivos
- Análisis de cumplimiento
- Reportes de tendencias
- **Nota de seguridad:** Los datos son reales, no simulados

### Página de Ejemplo

- **Solo para demostración**
- Los datos pueden ser simulados o reales según el componente
- **No afecta la base de datos principal**
- Consultar a un programador si hay dudas

## 🏗️ Arquitectura

### Frontend

- **React 18** con Vite
- **React Router** para navegación
- **React Hook Form** con Zod para validación
- **Tailwind CSS** para estilos
- **Lucide React** para iconos

### Backend

- **Supabase** como backend completo
- **PostgreSQL** para base de datos
- **Row Level Security (RLS)** para seguridad
- **Supabase Auth** para autenticación

### Estructura de Archivos

```
src/
├── components/          # Componentes reutilizables
├── pages/              # Páginas de la aplicación
├── hooks/              # Hooks personalizados
├── contexts/           # Contextos de React
├── lib/                # Servicios y configuración
├── utils/              # Utilidades
└── styles/             # Estilos globales

database/
├── 01_schemas/         # Esquemas de tablas
├── 02_functions/       # Funciones de base de datos
├── 03_security/        # Políticas de seguridad
├── 04_data/            # Datos de prueba
└── scripts/            # Scripts de configuración
```

## 🔧 Desarrollo

### Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construcción
npm run preview      # Vista previa
npm run test         # Tests
npm run lint         # Linting
```

### Variables de Entorno

```bash
VITE_SUPABASE_URL=           # URL de Supabase
VITE_SUPABASE_ANON_KEY=      # Anon Key de Supabase
VITE_GA_TRACKING_ID=         # Google Analytics (opcional)
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Otros Proveedores

El proyecto es compatible con cualquier proveedor que soporte aplicaciones React estáticas.

## 📝 Notas Importantes

### Sin Modo Demo

- El sistema **NO** incluye modo demo
- Todos los datos provienen de Supabase
- Se requieren datos reales para funcionar
- Incluye datos de prueba para desarrollo

### Seguridad Mejorada

- Row Level Security (RLS) habilitado
- Políticas de acceso configuradas
- Autenticación obligatoria
- Permisos granulares por rol
- **Notas de seguridad en todas las páginas críticas**
- **Validaciones mejoradas para evitar pérdida de datos**
- **Alertas de confirmación antes de acciones destructivas**

### Performance

- Lazy loading de componentes
- Optimización de consultas
- Caché de datos
- Compresión de assets

### Estado Final Optimizado

- ✅ **Todas las páginas revisadas y actualizadas**
- ✅ **Notas de seguridad implementadas**
- ✅ **Sistema de validaciones mejorado**
- ✅ **Documentación completa**
- ✅ **Listo para producción**

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

- **Email**: mtzcontabilidad@gmail.com
- **Documentación**: Ver archivos en `docs/`
- **Issues**: Usar GitHub Issues

---

**MTZ Consultores Tributarios** - Sistema de Gestión Empresarial v3.0

**Estado:** ✅ Listo para producción - Optimizado y seguro
