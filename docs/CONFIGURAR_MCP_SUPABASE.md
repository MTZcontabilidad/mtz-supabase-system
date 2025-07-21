# 🤖 CONFIGURAR MCP DE SUPABASE - SISTEMA MTZ

## 📋 GUÍA COMPLETA DE CONFIGURACIÓN

Esta guía te ayudará a configurar el MCP (Model Context Protocol) de Supabase en Cursor para trabajar directamente con tu base de datos.

---

## 🎯 PASO 1: OBTENER CREDENCIALES DE SUPABASE

### **1.1 Obtener Project Reference**

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto MTZ
3. Ve a **Settings > General**
4. Copia el **Reference ID** (algo como `abcdefghijklmnop`)

### **1.2 Obtener Personal Access Token**

1. Ve a **Settings > Access Tokens**
2. Haz click en **"Generate new token"**
3. Dale un nombre como "Cursor MCP"
4. Selecciona **"Full access"** o **"Read-only"** según necesites
5. Haz click en **"Generate token"**
6. **Copia el token** (es muy importante guardarlo)

---

## 🎯 PASO 2: CREAR DIRECTORIO .cursor

### **2.1 Crear el directorio**

En la raíz de tu proyecto MTZ, crea el directorio `.cursor`:

```bash
mkdir .cursor
```

### **2.2 Verificar que existe**

```bash
ls -la
# Deberías ver .cursor en la lista
```

---

## 🎯 PASO 3: CREAR ARCHIVO DE CONFIGURACIÓN

### **3.1 Crear mcp.json**

Crea el archivo `.cursor/mcp.json` con el siguiente contenido:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=TU_PROJECT_REF_AQUI"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "TU_ACCESS_TOKEN_AQUI"
      }
    }
  }
}
```

### **3.2 Reemplazar valores**

- Reemplaza `TU_PROJECT_REF_AQUI` con tu Project Reference
- Reemplaza `TU_ACCESS_TOKEN_AQUI` con tu Personal Access Token

---

## 🎯 PASO 4: VERIFICAR NODE.JS Y NPX

### **4.1 Verificar Node.js**

```bash
node --version
# Debería mostrar una versión como v18.x.x o superior
```

### **4.2 Verificar NPX**

```bash
npx --version
# Debería mostrar una versión
```

### **4.3 Si Node.js no está instalado**

1. Descarga Node.js desde: https://nodejs.org/
2. Instala la versión LTS
3. Reinicia tu terminal
4. Verifica la instalación con `node --version`

---

## 🎯 PASO 5: CONFIGURAR PATH (SI ES NECESARIO)

### **5.1 Obtener la ruta de Node.js**

```bash
npm config get prefix
# Esto te dará algo como C:\Users\TuUsuario\AppData\Roaming\npm
```

### **5.2 Agregar al PATH**

```bash
setx PATH "%PATH%;C:\Users\TuUsuario\AppData\Roaming\npm"
```

**Nota:** Reemplaza la ruta con la que obtuviste del comando anterior.

---

## 🎯 PASO 6: REINICIAR CURSOR

1. Cierra completamente Cursor
2. Vuelve a abrir Cursor
3. Ve a **Settings > MCP**
4. Deberías ver el servidor Supabase con estado **activo (verde)**

---

## 🎯 PASO 7: VERIFICAR CONFIGURACIÓN

### **7.1 Verificar en Cursor**

1. Ve a **Settings > MCP**
2. Busca "supabase" en la lista
3. Debería mostrar estado **"Active"** en verde

### **7.2 Probar la conexión**

Puedes probar la conexión haciendo preguntas como:

- "Muestra las tablas de mi base de datos"
- "Crea una nueva tabla llamada 'test'"
- "Inserta datos en la tabla 'roles'"

---

## 🎯 ARCHIVO DE CONFIGURACIÓN COMPLETO

Aquí tienes un ejemplo completo del archivo `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=abcdefghijklmnop"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_1234567890abcdefghijklmnopqrstuvwxyz"
      }
    }
  }
}
```

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### **Error: "command not found"**

- Verifica que Node.js esté instalado: `node --version`
- Verifica que NPX esté disponible: `npx --version`
- Agrega Node.js al PATH si es necesario

### **Error: "Invalid project reference"**

- Verifica que el Project Reference sea correcto
- Copia el Reference ID desde Settings > General

### **Error: "Invalid access token"**

- Verifica que el token sea correcto
- Genera un nuevo token si es necesario
- Asegúrate de que el token tenga los permisos correctos

### **Error: "Connection failed"**

- Verifica tu conexión a internet
- Verifica que el proyecto de Supabase esté activo
- Revisa los logs en Settings > MCP

---

## 🎉 FUNCIONALIDADES DISPONIBLES

Una vez configurado, podrás:

### **Consultas de Base de Datos:**

- "Muestra todas las tablas"
- "Describe la estructura de la tabla 'usuarios_sistema'"
- "Cuenta los registros en la tabla 'clientes'"

### **Operaciones de Datos:**

- "Inserta un nuevo cliente"
- "Actualiza el estado de una venta"
- "Elimina registros duplicados"

### **Gestión de Esquemas:**

- "Crea una nueva tabla"
- "Agrega una columna a la tabla existente"
- "Crea un índice en la tabla"

### **Análisis y Reportes:**

- "Genera un reporte de ventas"
- "Analiza el crecimiento de clientes"
- "Calcula estadísticas de cobranza"

---

## 📞 SOPORTE

Si encuentras problemas:

1. **Verifica las credenciales** - Project ref y access token
2. **Revisa los logs** en Settings > MCP
3. **Reinicia Cursor** después de cambios
4. **Verifica Node.js** y NPX
5. **Consulta la documentación** oficial de Supabase MCP

**¡Con el MCP de Supabase configurado, podrás trabajar directamente con tu base de datos desde Cursor!** 🚀
