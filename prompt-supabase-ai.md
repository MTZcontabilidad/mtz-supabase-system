# 🤖 PROMPT PARA IA DE SUPABASE - SISTEMA MTZ

## 📋 INSTRUCCIONES PARA LA IA DE SUPABASE

Copia y pega este prompt completo en la IA de Supabase para crear el sistema MTZ desde cero:

---

**PROMPT PARA IA DE SUPABASE:**

```
Necesito crear un sistema completo de gestión empresarial llamado "MTZ" en Supabase. El usuario administrador es mtzcontabilidad@gmail.com con UID aa43bcf5-4eb9-46bb-8403-1028b83cbab9.

Crea las siguientes tablas con sus relaciones, índices, RLS y políticas de seguridad:

1. **roles** - Roles del sistema con permisos granulares
2. **usuarios_sistema** - Usuarios con perfiles y roles
3. **empresas** - Empresas y clientes
4. **clientes** - Clientes individuales vinculados a empresas
5. **ventas** - Facturas y ventas
6. **cobranzas** - Pagos recibidos
7. **compras** - Facturas de proveedores
8. **contratos** - Contratos de servicios
9. **rrhh** - Empleados y recursos humanos
10. **proyecciones** - Proyecciones financieras
11. **asignaciones** - Asignación de usuarios a clientes

Requisitos específicos:

**ESTRUCTURA DE TABLAS:**
- Usa SERIAL para IDs autoincrementales
- Usa UUID para usuarios_sistema.id (referencia a auth.users)
- Incluye created_at y updated_at en todas las tablas
- Usa DECIMAL(15,2) para montos monetarios
- Incluye índices en campos importantes (email, rut, fechas, estados)
- Usa JSONB para permisos y preferencias

**RELACIONES:**
- usuarios_sistema.id → auth.users(id) ON DELETE CASCADE
- usuarios_sistema.rol_id → roles(id)
- clientes.empresa_id → empresas(id)
- ventas.cliente_id → clientes(id)
- cobranzas.venta_id → ventas(id)
- cobranzas.cliente_id → clientes(id)
- compras.proveedor_id → empresas(id)
- contratos.cliente_id → clientes(id)
- rrhh.empresa_id → empresas(id)
- proyecciones.empresa_id → empresas(id)
- asignaciones.usuario_id → usuarios_sistema(id)
- asignaciones.cliente_id → clientes(id)

**SEGURIDAD:**
- Habilita RLS en todas las tablas
- Crea políticas básicas de acceso completo para administradores
- Usa políticas granulares basadas en roles

**DATOS INICIALES:**
- Insertar roles: admin, colaborador, cliente, externo
- Insertar empresa demo: MTZ Consultores Tributarios SpA
- Insertar usuario admin: mtzcontabilidad@gmail.com con rol admin

**FUNCIONALIDADES ESPECÍFICAS:**
- Sistema de roles con permisos JSONB
- Gestión de clientes por empresa
- Facturación y cobranza
- Contratos de servicios
- RRHH y empleados
- Proyecciones financieras
- Asignación de usuarios a clientes

Crea el script SQL completo con:
1. Creación de todas las tablas
2. Índices y comentarios
3. Habilitación de RLS
4. Políticas de seguridad básicas
5. Datos iniciales
6. Verificación final

El script debe ser ejecutable directamente en el SQL Editor de Supabase.
```

---

## 🎯 CÓMO USAR ESTE PROMPT

### **PASO 1: Acceder a la IA de Supabase**

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto MTZ
3. Ve a **SQL Editor**
4. Haz click en **"Ask AI"** o el botón de IA

### **PASO 2: Copiar y Pegar el Prompt**

1. Copia todo el contenido del prompt de arriba
2. Pégalo en el chat de la IA de Supabase
3. Haz click en **"Send"** o **"Submit"**

### **PASO 3: Revisar y Ejecutar**

1. La IA generará el script SQL completo
2. Revisa el script generado
3. Haz click en **"Run"** para ejecutarlo

### **PASO 4: Verificar**

1. Ejecuta el script de verificación que te proporcione la IA
2. Confirma que todas las tablas se crearon correctamente

---

## 📊 ESTRUCTURA ESPERADA

### **Tablas que se crearán:**

- ✅ **roles** - Roles del sistema
- ✅ **usuarios_sistema** - Usuarios con perfiles
- ✅ **empresas** - Empresas y clientes
- ✅ **clientes** - Clientes individuales
- ✅ **ventas** - Facturas y ventas
- ✅ **cobranzas** - Pagos recibidos
- ✅ **compras** - Facturas de proveedores
- ✅ **contratos** - Contratos de servicios
- ✅ **rrhh** - Empleados
- ✅ **proyecciones** - Proyecciones financieras
- ✅ **asignaciones** - Asignación de usuarios

### **Datos iniciales:**

- ✅ **4 roles** (admin, colaborador, cliente, externo)
- ✅ **1 empresa** (MTZ Consultores Tributarios SpA)
- ✅ **1 usuario admin** (mtzcontabilidad@gmail.com)

---

## 🔍 VERIFICACIONES POST-CREACIÓN

### **Después de ejecutar el script de la IA:**

#### **1. Verificar tablas creadas:**

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

#### **2. Verificar usuario admin:**

```sql
SELECT * FROM public.usuarios_sistema
WHERE email = 'mtzcontabilidad@gmail.com';
```

#### **3. Verificar roles:**

```sql
SELECT * FROM public.roles;
```

#### **4. Verificar empresa:**

```sql
SELECT * FROM public.empresas;
```

---

## 🎉 RESULTADO FINAL

Después de usar este prompt con la IA de Supabase tendrás:

- ✅ **Sistema MTZ completamente funcional**
- ✅ **Todas las tablas creadas con relaciones**
- ✅ **RLS y políticas de seguridad**
- ✅ **Usuario admin configurado**
- ✅ **Datos iniciales insertados**
- ✅ **Listo para usar en la aplicación**

**¡Sistema MTZ creado automáticamente por la IA de Supabase!** 🚀

---

## 📞 SOPORTE

Si la IA no genera exactamente lo que necesitas:

1. **Refina el prompt** con más detalles específicos
2. **Pide modificaciones** al script generado
3. **Solicita verificación** del sistema creado
4. **Pide datos de ejemplo** adicionales

**¡La IA de Supabase te ayudará a crear el sistema completo de manera eficiente!** 🤖
