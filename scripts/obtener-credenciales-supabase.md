# 🔑 OBTENER CREDENCIALES DE SUPABASE

## 📋 PASOS PARA OBTENER LAS CREDENCIALES

### **PASO 1: Obtener Project Reference**

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto MTZ
3. Ve a **Settings > General**
4. Busca **"Reference ID"**
5. Copia el valor (algo como `abcdefghijklmnop`)

### **PASO 2: Obtener Personal Access Token**

1. Ve a **Settings > Access Tokens**
2. Haz click en **"Generate new token"**
3. Dale un nombre como "Cursor MCP"
4. Selecciona **"Full access"** (para poder crear/modificar tablas)
5. Haz click en **"Generate token"**
6. **Copia el token** (empieza con `sbp_`)

### **PASO 3: Actualizar el archivo de configuración**

1. Abre el archivo `.cursor/mcp.json`
2. Reemplaza `TU_PROJECT_REF_AQUI` con tu Project Reference
3. Reemplaza `TU_ACCESS_TOKEN_AQUI` con tu Personal Access Token

### **Ejemplo de archivo actualizado:**

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

### **PASO 4: Verificar Node.js**

```bash
node --version
npx --version
```

Si no tienes Node.js instalado:

1. Descarga desde: https://nodejs.org/
2. Instala la versión LTS
3. Reinicia tu terminal

### **PASO 5: Reiniciar Cursor**

1. Cierra completamente Cursor
2. Vuelve a abrir Cursor
3. Ve a **Settings > MCP**
4. Deberías ver el servidor Supabase con estado **activo (verde)**

### **PASO 6: Probar la conexión**

Una vez configurado, puedes probar preguntando:

- "Muestra las tablas de mi base de datos"
- "Crea el sistema MTZ completo"
- "Inserta datos de ejemplo"

¡Con esto tendrás acceso directo a tu base de datos desde Cursor!
