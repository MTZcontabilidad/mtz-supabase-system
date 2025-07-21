# 🏗️ CREAR TABLAS EN SUPABASE - SISTEMA MTZ

## 📋 RESUMEN

Este documento explica cómo crear todas las tablas necesarias para el sistema MTZ en Supabase.

## 🎯 OBJETIVO

Crear la estructura completa de la base de datos con:

- ✅ 11 tablas principales
- ✅ Índices de optimización
- ✅ Datos iniciales
- ✅ Políticas de seguridad (RLS)
- ✅ Datos de ejemplo

---

## 🚀 PASOS PARA CREAR LAS TABLAS

### **PASO 1: Acceder al SQL Editor de Supabase**

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto MTZ
3. Ve a **SQL Editor** en el menú lateral
4. Haz click en **"New query"**

### **PASO 2: Ejecutar Script de Creación de Tablas**

1. Copia todo el contenido del archivo `scripts/sql-crear-tablas.sql`
2. Pégalo en el SQL Editor
3. Haz click en **"Run"**

**Archivo a usar:** `scripts/sql-crear-tablas.sql`

### **PASO 3: Ejecutar Script de Datos de Ejemplo**

1. Crea una nueva query en el SQL Editor
2. Copia todo el contenido del archivo `scripts/sql-datos-ejemplo.sql`
3. Pégalo en el SQL Editor
4. Haz click en **"Run"**

**Archivo a usar:** `scripts/sql-datos-ejemplo.sql`

---

## 📊 TABLAS QUE SE CREARÁN

### **1. roles**

- Almacena los roles del sistema (admin, colaborador, cliente, externo)
- Incluye permisos en formato JSONB

### **2. usuarios_sistema**

- Extiende auth.users con datos específicos de MTZ
- Vincula usuarios con roles y empresas

### **3. empresas**

- Información de empresas/clientes
- Datos fiscales y de contacto

### **4. clientes**

- Información detallada de clientes
- Vinculados a empresas

### **5. ventas**

- Registro de facturas y ventas
- Montos, fechas, estados

### **6. cobranzas**

- Registro de pagos recibidos
- Vinculado a ventas

### **7. compras**

- Registro de facturas de proveedores
- Gastos y compras

### **8. contratos**

- Contratos de servicios con clientes
- Montos mensuales y fechas

### **9. rrhh**

- Información de empleados
- Sueldos y cargos

### **10. proyecciones**

- Proyecciones financieras
- Ventas y gastos futuros

### **11. asignaciones**

- Asignación de usuarios a clientes
- Tipos de asignación

---

## 🔐 SEGURIDAD IMPLEMENTADA

### **Row Level Security (RLS)**

- Todas las tablas tienen RLS habilitado
- Políticas básicas de acceso configuradas

### **Políticas de Acceso**

- Administradores: Acceso completo a todas las tablas
- Colaboradores: Acceso limitado según permisos
- Clientes: Acceso solo a sus datos

### **Índices de Optimización**

- Índices en campos de búsqueda frecuente
- Optimización para consultas rápidas

---

## 📈 DATOS INICIALES

### **Roles Creados:**

- **admin**: Acceso completo al sistema
- **colaborador**: Acceso a módulos de gestión
- **cliente**: Acceso a portal de cliente
- **externo**: Acceso limitado

### **Empresa Demo:**

- **RUT**: 76.123.456-7
- **Razón Social**: MTZ Consultores Tributarios SpA
- **Email**: mtzcontabilidad@gmail.com

### **Usuario Admin:**

- **Email**: mtzcontabilidad@gmail.com
- **Rol**: Administrador
- **ID**: 535cc07b-416b-4e8c-98de-583694361d42

---

## 📊 DATOS DE EJEMPLO

### **Clientes:**

- 5 clientes de ejemplo con diferentes categorías
- Datos completos de contacto

### **Ventas:**

- 5 facturas de ejemplo
- Diferentes estados y montos

### **Cobranzas:**

- 3 cobranzas de ejemplo
- Diferentes métodos de pago

### **Contratos:**

- 3 contratos de servicios
- Diferentes tipos de servicio

### **RRHH:**

- 3 empleados de ejemplo
- Diferentes cargos y departamentos

### **Proyecciones:**

- 6 proyecciones financieras
- Ventas y gastos por trimestre

---

## ✅ VERIFICACIÓN

### **Después de ejecutar los scripts, verifica:**

1. **Tablas creadas:**

   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

2. **Roles insertados:**

   ```sql
   SELECT * FROM public.roles;
   ```

3. **Usuario admin:**

   ```sql
   SELECT * FROM public.usuarios_sistema
   WHERE email = 'mtzcontabilidad@gmail.com';
   ```

4. **Empresa demo:**

   ```sql
   SELECT * FROM public.empresas
   WHERE rut = '76.123.456-7';
   ```

5. **Datos de ejemplo:**
   ```sql
   SELECT COUNT(*) as total_clientes FROM public.clientes;
   SELECT COUNT(*) as total_ventas FROM public.ventas;
   ```

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### **Error: "relation already exists"**

- Las tablas usan `CREATE TABLE IF NOT EXISTS`
- No debería dar error si ya existen

### **Error: "permission denied"**

- Verifica que tengas permisos de administrador en Supabase
- Usa la clave de servicio si es necesario

### **Error: "foreign key constraint"**

- Las tablas se crean en el orden correcto
- Si hay error, ejecuta los scripts en orden

### **Error: "duplicate key"**

- Los INSERT usan `ON CONFLICT DO NOTHING`
- No debería dar error por duplicados

---

## 🎯 PRÓXIMOS PASOS

### **Después de crear las tablas:**

1. **Confirmar email del usuario admin**
   - Revisa tu email: mtzcontabilidad@gmail.com
   - Confirma la cuenta de Supabase

2. **Probar login en la aplicación**
   - Ve a: http://localhost:5176/login
   - Usa las credenciales: mtzcontabilidad@gmail.com / Alohomora33.

3. **Verificar funcionalidades**
   - Dashboard con datos
   - Gestión de clientes
   - Reportes y estadísticas

4. **Configurar políticas avanzadas**
   - Políticas específicas por rol
   - Auditoría de acceso

---

## 📞 SOPORTE

Si tienes problemas:

1. **Revisa los logs** en la consola de Supabase
2. **Verifica las políticas** de RLS
3. **Comprueba las relaciones** entre tablas
4. **Consulta la documentación** de Supabase

---

## ✅ CHECKLIST FINAL

- [ ] Script de tablas ejecutado
- [ ] Script de datos ejecutado
- [ ] Roles creados correctamente
- [ ] Usuario admin configurado
- [ ] Empresa demo insertada
- [ ] Datos de ejemplo cargados
- [ ] RLS habilitado
- [ ] Políticas configuradas
- [ ] Login funcionando
- [ ] Dashboard con datos

**¡Sistema MTZ completamente configurado!** 🎉
