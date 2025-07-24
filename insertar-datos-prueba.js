import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con credenciales reales
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para insertar datos de prueba
async function insertarDatosPrueba() {
  console.log('📝 Insertando datos de prueba en Supabase...\n');

  // Datos de prueba para RRHH
  const empleadosData = [
    {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@mtz.com',
      telefono: '+56 9 1234 5678',
      departamento: 'Administración',
      cargo: 'Gerente',
      fecha_ingreso: '2023-01-15',
      salario_base: 1500000,
      estado: 'activo'
    },
    {
      nombre: 'María',
      apellido: 'González',
      email: 'maria.gonzalez@mtz.com',
      telefono: '+56 9 2345 6789',
      departamento: 'Contabilidad',
      cargo: 'Analista',
      fecha_ingreso: '2023-03-20',
      salario_base: 1200000,
      estado: 'activo'
    },
    {
      nombre: 'Carlos',
      apellido: 'López',
      email: 'carlos.lopez@mtz.com',
      telefono: '+56 9 3456 7890',
      departamento: 'Ventas',
      cargo: 'Vendedor',
      fecha_ingreso: '2023-06-10',
      salario_base: 900000,
      estado: 'activo'
    },
    {
      nombre: 'Ana',
      apellido: 'Martínez',
      email: 'ana.martinez@mtz.com',
      telefono: '+56 9 4567 8901',
      departamento: 'Recursos Humanos',
      cargo: 'Especialista',
      fecha_ingreso: '2023-08-15',
      salario_base: 1100000,
      estado: 'activo'
    },
    {
      nombre: 'Roberto',
      apellido: 'Silva',
      email: 'roberto.silva@mtz.com',
      telefono: '+56 9 5678 9012',
      departamento: 'Tecnología',
      cargo: 'Desarrollador',
      fecha_ingreso: '2023-10-01',
      salario_base: 1300000,
      estado: 'activo'
    }
  ];

  // Datos de prueba para Cobranzas
  const cobranzasData = [
    {
      numero_factura: 'F001-2024',
      cliente: 'Empresa ABC Ltda.',
      descripcion: 'Servicios de contabilidad mensual',
      monto_total: 595000,
      monto_pagado: 595000,
      monto_pendiente: 0,
      estado: 'Pagada',
      fecha_emision: '2024-01-15',
      fecha_vencimiento: '2024-02-15',
      fecha_pago: '2024-02-10',
      forma_pago: 'Transferencia',
      dias_vencimiento: 0
    },
    {
      numero_factura: 'F002-2024',
      cliente: 'Comercial XYZ SpA',
      descripcion: 'Declaración de IVA',
      monto_total: 357000,
      monto_pagado: 0,
      monto_pendiente: 357000,
      estado: 'Pendiente',
      fecha_emision: '2024-01-20',
      fecha_vencimiento: '2024-02-20',
      fecha_pago: null,
      forma_pago: 'Efectivo',
      dias_vencimiento: 15
    },
    {
      numero_factura: 'F003-2024',
      cliente: 'Servicios LTDA',
      descripcion: 'Auditoría anual',
      monto_total: 952000,
      monto_pagado: 0,
      monto_pendiente: 952000,
      estado: 'Vencida',
      fecha_emision: '2024-01-10',
      fecha_vencimiento: '2024-02-10',
      fecha_pago: null,
      forma_pago: 'Cheque',
      dias_vencimiento: -5
    },
    {
      numero_factura: 'F004-2024',
      cliente: 'Empresa ABC Ltda.',
      descripcion: 'Servicios de consultoría',
      monto_total: 450000,
      monto_pagado: 0,
      monto_pendiente: 450000,
      estado: 'Pendiente',
      fecha_emision: '2024-02-01',
      fecha_vencimiento: '2024-03-01',
      fecha_pago: null,
      forma_pago: 'Transferencia',
      dias_vencimiento: 20
    },
    {
      numero_factura: 'F005-2024',
      cliente: 'Comercial XYZ SpA',
      descripcion: 'Declaración de renta',
      monto_total: 680000,
      monto_pagado: 680000,
      monto_pendiente: 0,
      estado: 'Pagada',
      fecha_emision: '2024-02-05',
      fecha_vencimiento: '2024-03-05',
      fecha_pago: '2024-03-01',
      forma_pago: 'Efectivo',
      dias_vencimiento: 0
    }
  ];

  try {
    // Insertar empleados
    console.log('👥 Insertando empleados...');
    const { data: empleadosInsertados, error: errorEmpleados } = await supabase
      .from('rrhh')
      .insert(empleadosData)
      .select();

    if (errorEmpleados) {
      console.log('❌ Error insertando empleados:', errorEmpleados.message);
    } else {
      console.log(`✅ ${empleadosInsertados.length} empleados insertados`);
    }

    // Insertar cobranzas
    console.log('\n💰 Insertando cobranzas...');
    const { data: cobranzasInsertadas, error: errorCobranzas } = await supabase
      .from('cobranzas')
      .insert(cobranzasData)
      .select();

    if (errorCobranzas) {
      console.log('❌ Error insertando cobranzas:', errorCobranzas.message);
    } else {
      console.log(`✅ ${cobranzasInsertadas.length} cobranzas insertadas`);
    }

    console.log('\n🎉 Datos de prueba insertados exitosamente!');
    console.log('\n📊 RESUMEN:');
    console.log(`  - Empleados: ${empleadosInsertados?.length || 0} insertados`);
    console.log(`  - Cobranzas: ${cobranzasInsertadas?.length || 0} insertadas`);

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar inserción de datos
insertarDatosPrueba().catch(console.error);
