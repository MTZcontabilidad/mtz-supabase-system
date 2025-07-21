# 🏗️ CREAR TABLAS DESDE CERO - SISTEMA MTZ

## 📋 RESUMEN

Este documento explica cómo crear toda la estructura de la base de datos desde cero en Supabase, después de haber eliminado todas las tablas.

**Usuario Admin:** `mtzcontabilidad@gmail.com` / `Alohomora33.`

---

## 🎯 SITUACIÓN ACTUAL

- ✅ Base de datos limpia (sin tablas)
- ⚠️ Usuario admin puede no existir en `auth.users`
- ✅ Necesitamos crear toda la estructura desde cero

---

## 📁 ARCHIVOS SQL CREADOS

### **1. Estructura Completa**

- **Archivo**: `scripts/01-crear-estructura-completa.sql`
- **Función**: Crea todas las tablas, índices, RLS y datos iniciales
- **Incluye**: Roles, empresa demo, políticas de seguridad

### **2. Usuario Administrador (Verificación)**

- **Archivo**: `scripts/02-verificar-y-crear-usuario-admin.sql`
- **Función**: Verifica si el usuario existe y crea el perfil
- **Incluye**: Manejo de errores si el usuario no existe

### **3. Usuario Administrador (Alternativo)**

- **Archivo**: `scripts/02-crear-usuario-admin-alternativo.sql`
- **Función**: Usa el primer usuario disponible si el admin no existe
- **Incluye**: Creación automática con cualquier usuario existente

### **4. Datos de Ejemplo (Opcional)**

- **Archivo**: `scripts/03-datos-ejemplo-opcional.sql`
- **Función**: Inserta datos de prueba para testing
- **Incluye**: Clientes, ventas, cobranzas, etc.

### **5. Verificación Final**

- **Archivo**: `scripts/04-verificacion-final.sql`
- **Función**: Verifica que todo está funcionando correctamente
- **Incluye**: Validación completa del sistema

---

## 🚀 PASOS PARA CREAR LA BASE DE DATOS

### **PASO 1: Acceder al SQL Editor de Supabase**

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto MTZ
3. Ve a **SQL Editor** en el menú lateral
4. Haz click en **"New query"**

### **PASO 2: Crear Estructura Completa**

1. Copia todo el contenido del archivo `scripts/01-crear-estructura-completa.sql`
2. Pégalo en el SQL Editor
3. Haz click en **"Run"**

**Resultado esperado:**

- ✅ 11 tablas creadas
- ✅ 4 roles insertados (admin, colaborador, cliente, externo)
- ✅ 1 empresa demo insertada
- ✅ RLS habilitado en todas las tablas
- ✅ Políticas de seguridad básicas creadas

### **PASO 3: Verificar y Crear Usuario Administrador**

**OPCIÓN A: Si quieres usar el usuario admin específico**

1. Crea una nueva query en el SQL Editor
2. Copia todo el contenido del archivo `scripts/02-verificar-y-crear-usuario-admin.sql`
3. Pégalo en el SQL Editor
4. Haz click en **"Run"**

**OPCIÓN B: Si quieres usar cualquier usuario disponible**

1. Crea una nueva query en el SQL Editor
2. Copia todo el contenido del archivo `scripts/02-crear-usuario-admin-alternativo.sql`
3. Pégalo en el SQL Editor
4. Haz click en **"Run"**

**Resultado esperado:**

- ✅ Usuario admin creado en `usuarios_sistema`
- ✅ Vinculado con el rol admin
- ✅ Configuración completa del perfil
- ✅ Email del usuario para login

### **PASO 4: Verificación Final**

1. Crea una nueva query en el SQL Editor
2. Copia todo el contenido del archivo `scripts/04-verificacion-final.sql`
3. Pégalo en el SQL Editor
4. Haz click en **"Run"**

**Resultado esperado:**

- ✅ Todas las verificaciones en verde
- ✅ Mensaje: "🎉 ¡SISTEMA MTZ LISTO PARA USAR!"

### **PASO 5: Datos de Ejemplo (OPCIONAL)**

**Solo si quieres datos de prueba:**

1. Crea una nueva query en el SQL Editor
2. Copia todo el contenido del archivo `scripts/03-datos-ejemplo-opcional.sql`
3. Pégalo en el SQL Editor
4. Haz click en **"Run"**

**Resultado esperado:**

- ✅ 5 clientes de ejemplo
- ✅ 5 ventas de ejemplo
- ✅ 3 cobranzas de ejemplo
- ✅ Y más datos de prueba

---

## 🚨 SOLUCIÓN DEL ERROR DE USUARIO ADMIN

### **Error: "violates foreign key constraint"**

Si obtienes este error:

```
ERROR: 23503: insert or update on table "usuarios_sistema" violates foreign key constraint "usuarios_sistema_id_fkey"
DETAIL: Key (id)=(535cc07b-416b-4e8c-98de-583694361d42) is not present in table "users".
```

**Significa que el usuario `mtzcontabilidad@gmail.com` no existe en `auth.users`**

### **Soluciones:**

#### **Solución 1: Crear el usuario admin en Supabase Auth**

1. Ve a **Authentication > Users** en Supabase
2. Haz click en **"Add user"**
3. Email: `mtzcontabilidad@gmail.com`
4. Password: `Alohomora33.`
5. Marca **"Auto-confirm"**
6. Haz click en **"Create user"**
7. Ejecuta el script `02-verificar-y-crear-usuario-admin.sql`

#### **Solución 2: Usar usuario existente (Recomendado)**

1. Ejecuta el script `02-crear-usuario-admin-alternativo.sql`
2. Este script usará el primer usuario disponible en `auth.users`
3. Te mostrará el email del usuario que se usó como admin

#### **Solución 3: Verificar usuarios existentes**

1. Ejecuta este query para ver usuarios disponibles:

```sql
SELECT id, email, created_at FROM auth.users ORDER BY created_at;
```

2. Usa el email de un usuario existente
3. Ejecuta el script correspondiente

---

## 📊 ESTRUCTURA CREADA

### **Tablas Principales:**

1. **roles** - Roles del sistema con permisos
2. **usuarios_sistema** - Usuarios con perfiles y roles
3. **empresas** - Empresas y clientes
4. **clientes** - Clientes individuales
5. **ventas** - Facturas y ventas
6. **cobranzas** - Pagos recibidos
7. **compras** - Facturas de proveedores
8. **contratos** - Contratos de servicios
9. **rrhh** - Empleados y recursos humanos
10. **proyecciones** - Proyecciones financieras
11. **asignaciones** - Asignación de usuarios a clientes

### **Roles Creados:**

- **admin** - Acceso completo al sistema
- **colaborador** - Acceso a módulos de gestión
- **cliente** - Acceso al portal de cliente
- **externo** - Acceso limitado

### **Empresa Demo:**

- **RUT**: 76.123.456-7
- **Razón Social**: MTZ Consultores Tributarios SpA
- **Email**: mtzcontabilidad@gmail.com

---

## 🔍 VERIFICACIONES IMPORTANTES

### **Después del PASO 2 (Estructura):**

```sql
-- Deberías ver:
- 11 tablas creadas
- 4 roles insertados
- 1 empresa demo
- RLS habilitado
```

### **Después del PASO 3 (Usuario Admin):**

```sql
-- Deberías ver:
- Usuario admin en usuarios_sistema
- Vinculado con rol admin
- Email del usuario (puede ser diferente al esperado)
```

### **Después del PASO 4 (Verificación):**

```sql
-- Deberías ver:
✅ Usuario admin configurado correctamente
✅ Todas las tablas principales creadas (11)
✅ RLS habilitado en todas las tablas (11)
🎉 ¡SISTEMA MTZ LISTO PARA USAR!
```

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DE LA CREACIÓN

### **1. Probar Login**

- Ve a: http://localhost:5176/login
- Usa el email mostrado en el script de usuario admin
- Usa la contraseña del usuario en `auth.users`

### **2. Verificar Dashboard**

- El dashboard debería cargar sin errores
- La navegación debería funcionar
- Los módulos deberían estar accesibles

### **3. Probar Funcionalidades**

- Crear un cliente nuevo
- Crear una venta
- Verificar que los datos se guardan

### **4. Verificar Permisos**

- El usuario admin debería tener acceso completo
- Todos los módulos deberían estar disponibles

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### **Error: "permission denied"**

- Verifica que tienes permisos de administrador en Supabase
- Usa la clave de servicio si es necesario

### **Error: "relation does not exist"**

- Ejecuta los scripts en el orden correcto
- Verifica que no hay errores en el script anterior

### **Error: "duplicate key value"**

- Los scripts usan `ON CONFLICT DO NOTHING`
- Es normal si ya existen algunos datos

### **Error: "foreign key constraint"**

- El usuario no existe en `auth.users`
- Usa el script alternativo o crea el usuario en Auth

### **Login no funciona**

- Verifica que el usuario admin está en `usuarios_sistema`
- Confirma que el rol admin existe
- Revisa las políticas de RLS
- Usa el email correcto mostrado en el script

---

## 📞 VERIFICACIONES ADICIONALES

### **Verificar Usuarios en Auth:**

```sql
SELECT * FROM auth.users ORDER BY created_at;
```

### **Verificar Usuario en Sistema:**

```sql
SELECT * FROM public.usuarios_sistema;
```

### **Verificar Roles:**

```sql
SELECT * FROM public.roles;
```

### **Verificar Tablas:**

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

---

## ✅ CHECKLIST DE CREACIÓN

- [ ] Script 01 ejecutado (estructura completa)
- [ ] Script 02 ejecutado (usuario admin - verificar o alternativo)
- [ ] Script 04 ejecutado (verificación final)
- [ ] Todas las verificaciones en verde
- [ ] Login funcionando correctamente
- [ ] Dashboard accesible
- [ ] No errores en la aplicación
- [ ] Datos de ejemplo insertados (opcional)

---

## 🎉 RESULTADO FINAL

Después de completar todos los pasos tendrás:

- ✅ **Base de datos completamente funcional**
- ✅ **Usuario admin configurado**
- ✅ **Todas las tablas creadas**
- ✅ **RLS y políticas de seguridad**
- ✅ **Aplicación lista para usar**
- ✅ **Datos de ejemplo (opcional)**

**¡Sistema MTZ completamente operativo!** 🚀

---

## 📞 SOPORTE

Si encuentras algún problema:

1. **Revisa los logs** del SQL Editor
2. **Ejecuta la verificación final** para identificar problemas
3. **Verifica el orden** de ejecución de los scripts
4. **Confirma que hay usuarios** en `auth.users`
5. **Usa el script alternativo** si el admin no existe

**¡Todo listo para empezar a usar el sistema MTZ!** 🎯
