# 🎯 GUÍA SIMPLE - CÓMO FUNCIONA TU SISTEMA MTZ

## 📋 **¿QUÉ TIENES CONFIGURADO?**

### **🔧 LAS HERRAMIENTAS QUE USAS:**

1. **🌐 GitHub** - Es como una carpeta en internet donde guardas todo tu código
2. **🗄️ Supabase** - Es tu base de datos (como un Excel en internet)
3. **🚀 Vercel** - Es donde se publica tu aplicación web
4. **⚛️ React** - Es el lenguaje que usas para crear páginas web

---

## 🎯 **CÓMO FUNCIONAN JUNTAS:**

```
📁 GitHub (código) → 🚀 Vercel (publicación) → 🗄️ Supabase (datos)
```

**Explicación simple:**

- **GitHub**: Guardas tu código como si fuera un documento
- **Vercel**: Toma tu código y lo convierte en una página web
- **Supabase**: Guarda toda la información (clientes, ventas, etc.)

---

## ✅ **¿QUÉ YA TIENES FUNCIONANDO?**

### **🎉 TODO ESTÁ CONECTADO:**

1. **✅ Supabase**: Tu base de datos está funcionando
   - Tienes 2 clientes guardados
   - Tienes 1 usuario administrador
   - Tienes 4 roles configurados

2. **✅ Servicio MTZ**: El puente entre React y Supabase
   - Puedes crear, leer, actualizar y eliminar datos
   - Todo está conectado y funcionando

3. **✅ React**: Tu aplicación web está lista
   - Tienes una página de ejemplo en `/ejemplo`
   - Puedes ver, agregar y eliminar clientes

4. **✅ Vercel**: Listo para publicar
   - Tu aplicación se puede publicar en internet

---

## 🚀 **CÓMO VER TU APLICACIÓN:**

### **1. En tu computadora (desarrollo):**

```bash
npm run dev
```

Luego ve a: `http://localhost:5173/ejemplo`

### **2. En internet (cuando publiques):**

Tu aplicación estará en: `https://tu-app.vercel.app/ejemplo`

---

## 📝 **CÓMO USAR EL SISTEMA:**

### **🔍 VER DATOS:**

```javascript
// En cualquier componente React
import mtzService from '../lib/mtzService.js';

// Obtener todos los clientes
const clientes = await mtzService.getClientes();

// Obtener estadísticas del dashboard
const dashboard = await mtzService.getDashboardData();
```

### **➕ AGREGAR DATOS:**

```javascript
// Crear un nuevo cliente
await mtzService.createCliente({
  nombre: 'Nuevo Cliente',
  email: 'cliente@ejemplo.com',
  empresa_id: '8b4d1eb6-6408-4324-929d-4e2cbc12e946',
  activo: true,
});
```

### **✏️ ACTUALIZAR DATOS:**

```javascript
// Actualizar un cliente
await mtzService.updateCliente(id, {
  nombre: 'Cliente Actualizado',
  activo: false,
});
```

### **🗑️ ELIMINAR DATOS:**

```javascript
// Eliminar un cliente
await mtzService.deleteCliente(id);
```

---

## 🎯 **FUNCIONES DISPONIBLES:**

### **👥 CLIENTES:**

- `getClientes()` - Ver todos los clientes
- `createCliente()` - Agregar cliente
- `updateCliente()` - Actualizar cliente
- `deleteCliente()` - Eliminar cliente
- `buscarClientes()` - Buscar clientes

### **👤 USUARIOS:**

- `getUsuarios()` - Ver todos los usuarios
- `createUsuario()` - Agregar usuario
- `updateUsuario()` - Actualizar usuario
- `deleteUsuario()` - Eliminar usuario

### **💰 VENTAS:**

- `getVentas()` - Ver todas las ventas
- `createVenta()` - Agregar venta
- `updateVenta()` - Actualizar venta
- `deleteVenta()` - Eliminar venta

### **💳 COBRANZAS:**

- `getCobranzas()` - Ver todas las cobranzas
- `createCobranza()` - Agregar cobranza
- `updateCobranza()` - Actualizar cobranza
- `deleteCobranza()` - Eliminar cobranza

### **📊 DASHBOARD:**

- `getDashboardData()` - Estadísticas generales
- `getEstadisticas()` - Estadísticas detalladas

---

## 🚀 **PRÓXIMOS PASOS:**

### **1. PROBAR LA APLICACIÓN:**

```bash
npm run dev
```

Ve a: `http://localhost:5173/ejemplo`

### **2. CREAR MÁS COMPONENTES:**

- Copia el ejemplo de `ClientesEjemplo.jsx`
- Crea componentes para ventas, cobranzas, etc.

### **3. PUBLICAR EN VERCEL:**

- Sube tu código a GitHub
- Conecta con Vercel
- ¡Tu aplicación estará en internet!

---

## 📞 **¿NECESITAS AYUDA?**

### **🔧 SI ALGO NO FUNCIONA:**

1. **Verificar conexión:**

   ```bash
   node scripts/verificar-todo-sistema.js
   ```

2. **Verificar servicio:**

   ```bash
   node scripts/prueba-servicio-mtz.js
   ```

3. **Revisar errores:**
   - Abre la consola del navegador (F12)
   - Mira si hay errores en rojo

### **📋 ARCHIVOS IMPORTANTES:**

- `src/lib/mtzService.js` - Tu servicio principal
- `src/components/ejemplo/ClientesEjemplo.jsx` - Ejemplo de uso
- `src/pages/Ejemplo/EjemploPage.jsx` - Página de ejemplo
- `scripts/verificar-todo-sistema.js` - Verificar que todo funciona

---

## 🎉 **RESUMEN:**

**¡Tienes todo configurado y funcionando!**

- ✅ **GitHub**: Guardando tu código
- ✅ **Supabase**: Base de datos funcionando
- ✅ **React**: Aplicación web lista
- ✅ **Vercel**: Listo para publicar
- ✅ **Servicio MTZ**: Todo conectado

**Solo necesitas:**

1. Crear más componentes
2. Publicar en Vercel
3. ¡Disfrutar tu aplicación!

---

**¡Tu sistema MTZ está completamente funcional y listo para usar!** 🚀
