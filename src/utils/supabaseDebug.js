// 🔍 UTILIDAD PARA VERIFICAR DATOS REALES DE SUPABASE
// Usar en consola del navegador para ver datos puros

import { supabase } from '../lib/supabase';

/**
 * Obtener datos puros de Supabase sin procesamiento
 */
export const debugSupabase = {
  
  // Ver todos los clientes tal como están en la BD
  async verClientesPuros() {
    console.log('🔍 Consultando datos puros de Supabase...');
    
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('*')
      .order('total_facturado', { ascending: false });
    
    if (error) {
      console.error('❌ Error:', error);
      return null;
    }
    
    console.log('✅ Datos REALES de Supabase:');
    console.table(data);
    
    return data;
  },
  
  // Ver estructura de la tabla
  async verEstructuraTabla() {
    console.log('🏗️ Verificando estructura de tabla...');
    
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error:', error);
      return null;
    }
    
    if (data && data.length > 0) {
      const campos = Object.keys(data[0]);
      console.log('📋 Campos disponibles en la tabla:');
      campos.forEach(campo => {
        console.log(`  - ${campo}: ${typeof data[0][campo]} = ${data[0][campo]}`);
      });
    }
    
    return data;
  },
  
  // Contar registros totales
  async contarRegistros() {
    const { count, error } = await supabase
      .from('clientes_contables')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Error:', error);
      return null;
    }
    
    console.log(`📊 Total de registros en BD: ${count}`);
    return count;
  }
};

// Hacer disponible globalmente en desarrollo
window.debugSupabase = debugSupabase;

console.log('🔧 Debug tools cargadas. Usa:');
console.log('  debugSupabase.verClientesPuros()');
console.log('  debugSupabase.verEstructuraTabla()');
console.log('  debugSupabase.contarRegistros()');
