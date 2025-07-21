// Script para verificar toda la configuración del sistema MTZ y MCP
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 VERIFICACIÓN COMPLETA DEL SISTEMA MTZ');
console.log('========================================');

// Verificar configuración MCP
function verificarMCP() {
  console.log('\n1. VERIFICANDO CONFIGURACIÓN MCP');
  console.log('--------------------------------');

  const mcpConfigPath = path.join(__dirname, '..', '.cursor', 'mcp.json');

  if (!fs.existsSync(mcpConfigPath)) {
    console.log('❌ ERROR: No se encontró el archivo .cursor/mcp.json');
    return false;
  }

  try {
    const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
    console.log('✅ Archivo de configuración MCP encontrado');

    if (config.mcpServers && config.mcpServers.supabase) {
      const supabaseConfig = config.mcpServers.supabase;

      console.log(
        '📋 Project Ref:',
        supabaseConfig.args
          .find(arg => arg.includes('--project-ref='))
          ?.split('=')[1] || 'NO ENCONTRADO'
      );
      console.log(
        '🔑 Access Token:',
        supabaseConfig.args.find(arg => arg.includes('--access-token='))
          ? '✅ CONFIGURADO'
          : '❌ NO CONFIGURADO'
      );
      console.log(
        '🌐 Environment Token:',
        supabaseConfig.env.SUPABASE_ACCESS_TOKEN
          ? '✅ CONFIGURADO'
          : '❌ NO CONFIGURADO'
      );

      return true;
    } else {
      console.log('❌ ERROR: Configuración de Supabase no encontrada');
      return false;
    }
  } catch (error) {
    console.log('❌ ERROR: No se pudo leer la configuración MCP');
    return false;
  }
}

// Verificar Node.js y NPX
function verificarNodeJS() {
  console.log('\n2. VERIFICANDO NODE.JS Y NPX');
  console.log('-----------------------------');

  try {
    const { execSync } = require('child_process');

    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    const npxVersion = execSync('npx --version', { encoding: 'utf8' }).trim();
    const npmPrefix = execSync('npm config get prefix', {
      encoding: 'utf8',
    }).trim();

    console.log('✅ Node.js version:', nodeVersion);
    console.log('✅ NPM version:', npmVersion);
    console.log('✅ NPX version:', npxVersion);
    console.log('📁 NPM prefix:', npmPrefix);

    return true;
  } catch (error) {
    console.log('❌ ERROR: No se pudo verificar Node.js/NPM');
    return false;
  }
}

// Verificar scripts creados
function verificarScripts() {
  console.log('\n3. VERIFICANDO SCRIPTS CREADOS');
  console.log('------------------------------');

  const scriptsDir = path.join(__dirname);
  const scriptsNecesarios = [
    '01-crear-estructura-completa.sql',
    '02-insertar-datos-iniciales.sql',
    '03-configurar-rls-basico.sql',
    '04-verificacion-final.sql',
    'diagnostico-mcp-final.js',
    'verificar-mcp-supabase.mjs',
  ];

  let todosExisten = true;

  for (const script of scriptsNecesarios) {
    const scriptPath = path.join(scriptsDir, script);
    if (fs.existsSync(scriptPath)) {
      console.log(`✅ ${script}`);
    } else {
      console.log(`❌ ${script} - NO ENCONTRADO`);
      todosExisten = false;
    }
  }

  return todosExisten;
}

// Verificar estructura del proyecto
function verificarEstructura() {
  console.log('\n4. VERIFICANDO ESTRUCTURA DEL PROYECTO');
  console.log('--------------------------------------');

  const projectRoot = path.join(__dirname, '..');
  const directoriosNecesarios = [
    '.cursor',
    'src',
    'database',
    'docs',
    'scripts',
  ];

  let todosExisten = true;

  for (const dir of directoriosNecesarios) {
    const dirPath = path.join(projectRoot, dir);
    if (fs.existsSync(dirPath)) {
      console.log(`✅ ${dir}/`);
    } else {
      console.log(`❌ ${dir}/ - NO ENCONTRADO`);
      todosExisten = false;
    }
  }

  return todosExisten;
}

// Función principal
function verificarTodo() {
  const mcpOk = verificarMCP();
  const nodeOk = verificarNodeJS();
  const scriptsOk = verificarScripts();
  const estructuraOk = verificarEstructura();

  console.log('\n📊 RESUMEN DE VERIFICACIÓN');
  console.log('==========================');
  console.log(`MCP Configuración: ${mcpOk ? '✅ OK' : '❌ ERROR'}`);
  console.log(`Node.js/NPM: ${nodeOk ? '✅ OK' : '❌ ERROR'}`);
  console.log(`Scripts: ${scriptsOk ? '✅ OK' : '❌ ERROR'}`);
  console.log(`Estructura: ${estructuraOk ? '✅ OK' : '❌ ERROR'}`);

  if (mcpOk && nodeOk && scriptsOk && estructuraOk) {
    console.log('\n🎉 TODO ESTÁ CONFIGURADO CORRECTAMENTE');
    console.log('El problema está en la base de datos de Supabase');
    console.log('Necesitas ejecutar los scripts SQL en Supabase Dashboard');
  } else {
    console.log('\n⚠️ HAY PROBLEMAS DE CONFIGURACIÓN');
    console.log('Revisa los errores anteriores');
  }

  console.log('\n🎯 PRÓXIMOS PASOS:');
  console.log('==================');
  console.log('1. Ejecutar scripts SQL en Supabase Dashboard');
  console.log('2. Reiniciar Cursor completamente');
  console.log('3. Verificar Settings > MCP en Cursor');
  console.log('4. Probar el MCP de Supabase');
}

verificarTodo();
