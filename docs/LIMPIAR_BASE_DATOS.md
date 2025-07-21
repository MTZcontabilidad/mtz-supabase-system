# 🧹 LIMPIAR BASE DE DATOS - SISTEMA MTZ

## 📋 RESUMEN

Este documento explica cómo limpiar completamente la base de datos de Supabase, manteniendo solo el usuario administrador `mtzcontabilidad@gmail.com`.

## 🎯 OPCIONES DISPONIBLES

### **Opción 1: Eliminar Todo (Tablas + Datos)**

- Elimina todas las tablas completamente
- Mantiene solo el usuario admin en `auth.users`
- Necesitarás recrear las tablas después

### **Opción 2: Limpiar Solo Datos**

- Mantiene todas las tablas
- Elimina solo los datos
- Mantiene el usuario admin y roles básicos

---

## 🚀 PASOS PARA LIMPIAR LA BASE DE DATOS

### **PASO 1: Acceder al SQL Editor de Supabase**

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto MTZ
3. Ve a **SQL Editor** en el menú lateral
4. Haz click en **"New query"**

### **PASO 2: Ejecutar Script de Limpieza**

#### **Opción A: Eliminar Todo (Recomendado para empezar desde cero)**

1. Copia todo el contenido del archivo `scripts/limpiar-base-datos.sql`
2. Pégalo en el SQL Editor
3. Haz click en **"Run"**

**Archivo a usar:** `scripts/limpiar-base-datos.sql`

#### **Opción B: Limpiar Solo Datos (Mantener estructura)**

1. Copia todo el contenido del archivo `scripts/limpiar-solo-datos.sql`
2. Pégalo en el SQL Editor
3. Haz click en **"Run"**

**Archivo a usar:** `scripts/limpiar-solo-datos.sql`

### **PASO 3: Verificar Limpieza**

1. Crea una nueva query en el SQL Editor
2. Copia todo el contenido del archivo `scripts/verificar-estado.sql`
3. Pégalo en el SQL Editor
4. Haz click en **"Run"**

**Archivo a usar:** `scripts/verificar-estado.sql`

---

## 📊 QUÉ SE ELIMINARÁ

### **Datos Eliminados:**

- ✅ Todos los clientes
- ✅ Todas las ventas
- ✅ Todas las cobranzas
- ✅ Todas las compras
- ✅ Todos los contratos
- ✅ Todos los empleados (RRHH)
- ✅ Todas las proyecciones
- ✅ Todas las asignaciones
- ✅ Todas las empresas
- ✅ Todos los usuarios excepto admin
- ✅ Todos los roles excepto admin

### **Lo Que Se Mantiene:**

- ✅ Usuario admin: `mtzcontabilidad@gmail.com`
- ✅ Rol admin
- ✅ Estructura de tablas (si usas Opción B)

---

## 🔍 VERIFICACIÓN POST-LIMPIEZA

### **Después de ejecutar el script, deberías ver:**

#### **Si usaste "Eliminar Todo":**

```sql
-- Solo debería quedar:
- usuarios_sistema: 1 registro (admin)
- roles: 1 registro (admin)
- auth.users: 1 registro (admin)
```

#### **Si usaste "Limpiar Solo Datos":**

```sql
-- Debería quedar:
- usuarios_sistema: 1 registro (admin)
- roles: 4 registros (admin, colaborador, cliente, externo)
- Todas las tablas vacías pero existentes
```

### **Verificación del Usuario Admin:**

```sql
SELECT * FROM public.usuarios_sistema
WHERE email = 'mtzcontabilidad@gmail.com';
```

**Resultado esperado:**

- Email: mtzcontabilidad@gmail.com
- Rol: admin
- Activo: true
- ID: 535cc07b-416b-4e8c-98de-583694361d42

---

## 🚨 ADVERTENCIAS IMPORTANTES

### **⚠️ ACCIÓN IRREVERSIBLE**

- Esta operación **NO SE PUEDE DESHACER**
- Todos los datos se perderán permanentemente
- Haz una copia de seguridad si necesitas los datos

### **⚠️ CONFIRMACIÓN REQUERIDA**

- Asegúrate de que realmente quieres eliminar todo
- Verifica que tienes el usuario admin correcto
- Confirma que no hay datos importantes

### **⚠️ APLICACIÓN**

- La aplicación seguirá funcionando
- El login con `mtzcontabilidad@gmail.com` seguirá funcionando
- Los módulos estarán vacíos hasta que agregues nuevos datos

---

## 🔄 DESPUÉS DE LA LIMPIEZA

### **Si eliminaste todo (Opción A):**

1. **Recrear tablas:** Ejecuta `scripts/sql-crear-tablas.sql`
2. **Insertar datos:** Ejecuta `scripts/sql-datos-ejemplo.sql` (opcional)
3. **Verificar:** Ejecuta `scripts/verificar-estado.sql`

### **Si limpiaste solo datos (Opción B):**

1. **Verificar estructura:** Las tablas ya están listas
2. **Insertar datos:** Ejecuta `scripts/sql-datos-ejemplo.sql` (opcional)
3. **Verificar:** Ejecuta `scripts/verificar-estado.sql`

---

## 🎯 PRÓXIMOS PASOS

### **1. Probar Login**

- Ve a: http://localhost:5176/login
- Usa: `mtzcontabilidad@gmail.com` / `Alohomora33.`
- Verifica que funciona correctamente

### **2. Verificar Dashboard**

- El dashboard debería estar vacío
- No debería haber errores
- La navegación debería funcionar

### **3. Agregar Datos Nuevos**

- Usa la aplicación para agregar clientes
- Crea ventas y otros registros
- Verifica que todo funciona

---

## 📞 SOLUCIÓN DE PROBLEMAS

### **Error: "permission denied"**

- Verifica que tienes permisos de administrador en Supabase
- Usa la clave de servicio si es necesario

### **Error: "relation does not exist"**

- Algunas tablas ya fueron eliminadas
- Ejecuta el script completo sin interrupciones

### **Usuario admin no encontrado**

- Verifica que el email es correcto: `mtzcontabilidad@gmail.com`
- Confirma que el usuario existe en `auth.users`

### **Login no funciona**

- Verifica que el usuario admin está en `usuarios_sistema`
- Confirma que el rol admin existe
- Revisa las políticas de RLS

---

## ✅ CHECKLIST DE LIMPIEZA

- [ ] Script de limpieza ejecutado
- [ ] Verificación de estado ejecutada
- [ ] Solo usuario admin presente
- [ ] Login funcionando correctamente
- [ ] Dashboard accesible
- [ ] No errores en la aplicación
- [ ] Estructura lista para nuevos datos

---

## 🎉 RESULTADO FINAL

Después de la limpieza tendrás:

- ✅ **Base de datos limpia**
- ✅ **Solo usuario admin**
- ✅ **Aplicación funcionando**
- ✅ **Listo para nuevos datos**
- ✅ **Estructura optimizada**

**¡Sistema MTZ listo para empezar desde cero!** 🚀
