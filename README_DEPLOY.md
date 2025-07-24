# 🚀 DEPLOY SISTEMA MTZ v3.0 - VERCEL

## 📋 **INSTRUCCIONES DE DEPLOY**

### **1. ✅ Preparación del Proyecto**

El proyecto está listo para deploy con las siguientes características:

- ✅ **Build exitoso** - `npm run build` funciona correctamente
- ✅ **Configuración Vercel** - `vercel.json` configurado
- ✅ **Variables de entorno** - Preparadas para Supabase
- ✅ **Rutas SPA** - Configuradas para React Router
- ✅ **Optimizaciones** - Assets comprimidos y optimizados

### **2. 🔧 Variables de Entorno Requeridas**

#### **En Vercel Dashboard:**
```
VITE_SUPABASE_URL=https://bwgnmastihgndmtbqvkj.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

#### **Para obtener las credenciales de Supabase:**
1. Ve a [supabase.com](https://supabase.com)
2. Accede a tu proyecto MTZ
3. Ve a Settings > API
4. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

### **3. 🚀 Deploy en Vercel**

#### **Opción A: Deploy desde GitHub (Recomendado)**

1. **Conecta tu repositorio:**
   - Ve a [vercel.com](https://vercel.com)
   - Crea cuenta o inicia sesión
   - Click "New Project"
   - Importa desde GitHub: `MTZcontabilidad/mtz-supabase-system`

2. **Configura el proyecto:**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm ci
   ```

3. **Agrega variables de entorno:**
   - En la sección "Environment Variables"
   - Agrega las variables de Supabase mencionadas arriba

4. **Deploy:**
   - Click "Deploy"
   - Espera 2-3 minutos
   - ¡Listo!

#### **Opción B: Deploy con Vercel CLI**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login a Vercel
vercel login

# Deploy
vercel

# Para producción
vercel --prod
```

### **4. 🔗 Configuración de Dominio**

#### **Dominio Personalizado (Opcional):**
1. En Vercel Dashboard > Settings > Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel

#### **Dominio Vercel:**
- Automáticamente obtienes: `tu-proyecto.vercel.app`
- Ejemplo: `mtz-sistema-v3.vercel.app`

### **5. ✅ Verificación Post-Deploy**

#### **Checklist de Verificación:**
- ✅ **Página de login** carga correctamente
- ✅ **Autenticación** funciona con Supabase
- ✅ **Dashboard** muestra estadísticas
- ✅ **Navegación** entre páginas funciona
- ✅ **Formularios** funcionan correctamente
- ✅ **Datos** se cargan desde Supabase
- ✅ **Diseño responsive** funciona en móvil

#### **URLs de Prueba:**
```
https://tu-proyecto.vercel.app/login
https://tu-proyecto.vercel.app/dashboard
https://tu-proyecto.vercel.app/clientes
https://tu-proyecto.vercel.app/ventas
https://tu-proyecto.vercel.app/cobranza
https://tu-proyecto.vercel.app/rrhh
https://tu-proyecto.vercel.app/iva
```

### **6. 🔧 Configuración de Supabase**

#### **Verificar en Supabase Dashboard:**
1. **Authentication > Settings:**
   - Agrega tu dominio Vercel a "Site URL"
   - Ejemplo: `https://tu-proyecto.vercel.app`

2. **Database > Policies:**
   - Verifica que las políticas RLS estén activas
   - Confirma que los usuarios pueden acceder a las tablas

3. **API > Settings:**
   - Verifica que las credenciales sean correctas
   - Confirma que el proyecto esté activo

### **7. 🎯 Credenciales de Prueba**

#### **Usuarios de Prueba:**
```
👨‍💼 Administrador: admin@mtz.com / admin123
👔 Gerente: gerente@mtz.com / gerente123
👨‍💻 Vendedor: vendedor@mtz.com / vendedor123
👤 Cliente: cliente@mtz.com / cliente123
```

### **8. 📊 Monitoreo y Analytics**

#### **Vercel Analytics (Opcional):**
1. En Vercel Dashboard > Analytics
2. Activa "Web Analytics"
3. Agrega el script a tu aplicación

#### **Supabase Analytics:**
- Ve a Supabase Dashboard > Analytics
- Monitorea el uso de la base de datos
- Revisa logs de autenticación

### **9. 🔄 Actualizaciones Futuras**

#### **Para actualizar el sistema:**
1. Haz cambios en tu repositorio local
2. Push a GitHub: `git push origin master`
3. Vercel automáticamente hace redeploy
4. ¡Listo!

#### **Para cambios en variables de entorno:**
1. Ve a Vercel Dashboard > Settings > Environment Variables
2. Actualiza las variables necesarias
3. Redeploy manual o automático

### **10. 🆘 Solución de Problemas**

#### **Error: "Build Failed"**
- Verifica que `npm run build` funcione localmente
- Revisa los logs de build en Vercel
- Confirma que todas las dependencias estén en `package.json`

#### **Error: "Supabase Connection Failed"**
- Verifica las variables de entorno en Vercel
- Confirma que las credenciales de Supabase sean correctas
- Revisa que el proyecto Supabase esté activo

#### **Error: "Page Not Found"**
- Verifica la configuración de rutas en `vercel.json`
- Confirma que React Router esté configurado correctamente
- Revisa que todas las rutas estén definidas

### **11. 📞 Soporte**

#### **Recursos Útiles:**
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com/docs)

#### **Contacto:**
- **GitHub Issues**: [MTZcontabilidad/mtz-supabase-system](https://github.com/MTZcontabilidad/mtz-supabase-system/issues)
- **Email**: mtzcontabilidad@gmail.com

---

## 🎉 **¡DEPLOY COMPLETADO!**

**Tu sistema MTZ v3.0 estará disponible en:**
```
https://tu-proyecto.vercel.app
```

**¡El sistema está listo para uso en producción! 🚀**
