// =====================================================================
// 📊 DATOS DE MUESTRA MTZ - SISTEMA COMPLETO
// Archivo centralizado con datos de ejemplo para todas las páginas
// =====================================================================

// =====================================================================
// 📈 DATOS DEL DASHBOARD
// =====================================================================

export const dashboardData = {
  kpis: {
    totalClientes: 156,
    ventasMes: 2850000,
    cobranzaPendiente: 420000,
    nuevosClientes: 12,
    eficiencia: 94.5,
    satisfaccion: 4.8,
    facturasPendientes: 23,
    ingresosAnuales: 28500000,
  },

  graficos: {
    ventasMensuales: [
      { mes: 'Ene', ventas: 2100000, meta: 2000000, crecimiento: 5.2 },
      { mes: 'Feb', ventas: 1950000, meta: 2000000, crecimiento: -2.5 },
      { mes: 'Mar', ventas: 2300000, meta: 2000000, crecimiento: 15.0 },
      { mes: 'Abr', ventas: 2450000, meta: 2200000, crecimiento: 11.4 },
      { mes: 'May', ventas: 2600000, meta: 2200000, crecimiento: 18.2 },
      { mes: 'Jun', ventas: 2850000, meta: 2400000, crecimiento: 18.8 },
    ],

    clientesPorEstado: [
      { name: 'Activos', value: 142, color: '#10B981' },
      { name: 'Inactivos', value: 8, color: '#EF4444' },
      { name: 'Pendientes', value: 6, color: '#F59E0B' },
    ],

    cobranzaMensual: [
      { mes: 'Ene', cobrado: 1800000, pendiente: 300000, vencido: 50000 },
      { mes: 'Feb', cobrado: 1650000, pendiente: 350000, vencido: 75000 },
      { mes: 'Mar', cobrado: 2100000, pendiente: 200000, vencido: 25000 },
      { mes: 'Abr', cobrado: 2200000, pendiente: 250000, vencido: 30000 },
      { mes: 'May', cobrado: 2400000, pendiente: 200000, vencido: 20000 },
      { mes: 'Jun', cobrado: 2600000, pendiente: 250000, vencido: 15000 },
    ],

    rendimientoEquipo: [
      { name: 'Carlos V.', ventas: 1200000, clientes: 18, eficiencia: 96 },
      { name: 'María G.', ventas: 980000, clientes: 15, eficiencia: 92 },
      { name: 'Juan P.', ventas: 850000, clientes: 12, eficiencia: 88 },
      { name: 'Ana L.', ventas: 720000, clientes: 10, eficiencia: 85 },
    ],
  },

  alertas: [
    {
      id: 1,
      tipo: 'warning',
      mensaje: '5 facturas vencidas por más de 30 días',
      icono: 'AlertTriangle',
      fecha: '2024-01-15',
    },
    {
      id: 2,
      tipo: 'info',
      mensaje: 'Nuevo cliente VIP registrado: Tech Solutions Ltda',
      icono: 'User',
      fecha: '2024-01-14',
    },
    {
      id: 3,
      tipo: 'success',
      mensaje: 'Meta de ventas del mes alcanzada al 105%',
      icono: 'CheckCircle',
      fecha: '2024-01-13',
    },
    {
      id: 4,
      tipo: 'info',
      mensaje: '3 declaraciones de IVA próximas a vencer',
      icono: 'Calendar',
      fecha: '2024-01-12',
    },
  ],

  actividad: [
    {
      id: 1,
      accion: 'Nuevo cliente agregado',
      usuario: 'Carlos V.',
      tiempo: '2 min',
      detalles: 'Tech Solutions Ltda - Categoría VIP',
    },
    {
      id: 2,
      accion: 'Factura generada',
      usuario: 'María G.',
      tiempo: '15 min',
      detalles: 'F001-2024 - $595,000',
    },
    {
      id: 3,
      accion: 'Pago recibido',
      usuario: 'Sistema',
      tiempo: '1 hora',
      detalles: 'Transferencia - $892,500',
    },
    {
      id: 4,
      accion: 'Declaración IVA enviada',
      usuario: 'Juan P.',
      tiempo: '2 horas',
      detalles: 'Período Enero 2024',
    },
    {
      id: 5,
      accion: 'Contrato renovado',
      usuario: 'Ana L.',
      tiempo: '3 horas',
      detalles: 'Constructora Edificios SA',
    },
  ],
};

// =====================================================================
// 👥 DATOS DE CLIENTES
// =====================================================================

export const clientesData = [
  {
    id: 1,
    razon_social: 'Tech Solutions Ltda',
    rut: '76.123.456-7',
    email: 'contacto@techsolutions.cl',
    telefono: '+56 2 2345 6789',
    direccion: 'Av. Providencia 1234, Providencia, Santiago',
    categoria: 'VIP',
    estado: 'Activo',
    total_facturado: 8500000,
    numero_facturas: 12,
    promedio_factura: 708333,
    fecha_registro: '2023-01-15',
    ultima_actividad: '2024-01-15',
    rubro: 'Tecnología',
    observaciones: 'Cliente estratégico, excelente historial de pagos',
  },
  {
    id: 2,
    razon_social: 'Constructora Edificios SA',
    rut: '78.234.567-8',
    email: 'ventas@edificios.cl',
    telefono: '+56 2 3456 7890',
    direccion: 'Av. Apoquindo 3456, Las Condes, Santiago',
    categoria: 'Premium',
    estado: 'Activo',
    total_facturado: 6500000,
    numero_facturas: 8,
    promedio_factura: 812500,
    fecha_registro: '2023-03-20',
    ultima_actividad: '2024-01-14',
    rubro: 'Construcción',
    observaciones: 'Cliente del sector construcción, contratos a largo plazo',
  },
  {
    id: 3,
    razon_social: 'Restaurante El Buen Sabor',
    rut: '79.345.678-9',
    email: 'info@elbuensabor.cl',
    telefono: '+56 2 4567 8901',
    direccion: 'Av. Vitacura 9012, Vitacura, Santiago',
    categoria: 'Regular',
    estado: 'Activo',
    total_facturado: 3200000,
    numero_facturas: 15,
    promedio_factura: 213333,
    fecha_registro: '2023-06-10',
    ultima_actividad: '2024-01-13',
    rubro: 'Gastronomía',
    observaciones: 'Cliente del sector gastronómico, pagos regulares',
  },
  {
    id: 4,
    razon_social: 'Farmacia Salud Total',
    rut: '80.456.789-0',
    email: 'farmacia@saludtotal.cl',
    telefono: '+56 2 5678 9012',
    direccion: 'Av. Providencia 7890, Providencia, Santiago',
    categoria: 'Regular',
    estado: 'Activo',
    total_facturado: 2800000,
    numero_facturas: 10,
    promedio_factura: 280000,
    fecha_registro: '2023-08-05',
    ultima_actividad: '2024-01-12',
    rubro: 'Salud',
    observaciones: 'Cliente del sector salud, facturación mensual',
  },
  {
    id: 5,
    razon_social: 'Servicios Omega EIRL',
    rut: '81.567.890-1',
    email: 'consultoria@omega.cl',
    telefono: '+56 2 6789 0123',
    direccion: 'Av. Apoquindo 2345, Las Condes, Santiago',
    categoria: 'Premium',
    estado: 'Activo',
    total_facturado: 5200000,
    numero_facturas: 6,
    promedio_factura: 866667,
    fecha_registro: '2023-10-15',
    ultima_actividad: '2024-01-11',
    rubro: 'Consultoría',
    observaciones:
      'Cliente de servicios profesionales, proyectos especializados',
  },
  {
    id: 6,
    razon_social: 'Comercial Delta Ltda',
    rut: '82.678.901-2',
    email: 'info@delta.cl',
    telefono: '+56 2 7890 1234',
    direccion: 'Calle Comercial 890, Las Condes, Santiago',
    categoria: 'Regular',
    estado: 'Inactivo',
    total_facturado: 1800000,
    numero_facturas: 8,
    promedio_factura: 225000,
    fecha_registro: '2023-12-01',
    ultima_actividad: '2023-12-15',
    rubro: 'Comercio',
    observaciones: 'Cliente inactivo desde diciembre 2023',
  },
];

// =====================================================================
// 💰 DATOS DE VENTAS
// =====================================================================

export const ventasData = [
  {
    id: 1,
    numero_factura: 'F001-2024',
    fecha_emision: '2024-01-15',
    fecha_vencimiento: '2024-02-15',
    cliente: 'Tech Solutions Ltda',
    descripcion: 'Servicios de contabilidad mensual - Enero 2024',
    monto_subtotal: 500000,
    monto_iva: 95000,
    monto_total: 595000,
    estado: 'Pendiente',
    forma_pago: 'Transferencia',
    dias_vencimiento: 30,
    categoria: 'Contabilidad',
  },
  {
    id: 2,
    numero_factura: 'F002-2024',
    fecha_emision: '2024-01-10',
    fecha_vencimiento: '2024-02-10',
    cliente: 'Constructora Edificios SA',
    descripcion: 'Declaración IVA - Diciembre 2023',
    monto_subtotal: 750000,
    monto_iva: 142500,
    monto_total: 892500,
    estado: 'Pagada',
    forma_pago: 'Efectivo',
    dias_vencimiento: 0,
    categoria: 'Tributario',
  },
  {
    id: 3,
    numero_factura: 'F003-2024',
    fecha_emision: '2024-01-08',
    fecha_vencimiento: '2024-02-08',
    cliente: 'Restaurante El Buen Sabor',
    descripcion: 'Servicios de nómina y remuneraciones - Enero 2024',
    monto_subtotal: 1200000,
    monto_iva: 228000,
    monto_total: 1428000,
    estado: 'Vencida',
    forma_pago: 'Cheque',
    dias_vencimiento: -7,
    categoria: 'Contabilidad',
  },
  {
    id: 4,
    numero_factura: 'F004-2024',
    fecha_emision: '2024-01-05',
    fecha_vencimiento: '2024-02-05',
    cliente: 'Farmacia Salud Total',
    descripcion: 'Asesoría tributaria especializada',
    monto_subtotal: 350000,
    monto_iva: 66500,
    monto_total: 416500,
    estado: 'Pendiente',
    forma_pago: 'Transferencia',
    dias_vencimiento: 20,
    categoria: 'Asesoría',
  },
  {
    id: 5,
    numero_factura: 'F005-2024',
    fecha_emision: '2024-01-03',
    fecha_vencimiento: '2024-02-03',
    cliente: 'Servicios Omega EIRL',
    descripcion: 'Auditoría financiera anual 2023',
    monto_subtotal: 2500000,
    monto_iva: 475000,
    monto_total: 2975000,
    estado: 'Pendiente',
    forma_pago: 'Transferencia',
    dias_vencimiento: 18,
    categoria: 'Auditoría',
  },
];

// =====================================================================
// 💳 DATOS DE COBRANZAS
// =====================================================================

export const cobranzasData = [
  {
    id: 1,
    factura_id: 1,
    numero_factura: 'F001-2024',
    cliente: 'Tech Solutions Ltda',
    monto_total: 595000,
    fecha_vencimiento: '2024-02-15',
    estado: 'Pendiente',
    dias_vencimiento: 30,
    metodo_pago: 'Transferencia',
    fecha_pago: null,
    observaciones: 'Cliente confiable, pago esperado a tiempo',
  },
  {
    id: 2,
    factura_id: 2,
    numero_factura: 'F002-2024',
    cliente: 'Constructora Edificios SA',
    monto_total: 892500,
    fecha_vencimiento: '2024-02-10',
    estado: 'Pagada',
    dias_vencimiento: 0,
    metodo_pago: 'Efectivo',
    fecha_pago: '2024-01-12',
    observaciones: 'Pago recibido antes del vencimiento',
  },
  {
    id: 3,
    factura_id: 3,
    numero_factura: 'F003-2024',
    cliente: 'Restaurante El Buen Sabor',
    monto_total: 1428000,
    fecha_vencimiento: '2024-02-08',
    estado: 'Vencida',
    dias_vencimiento: -7,
    metodo_pago: 'Cheque',
    fecha_pago: null,
    observaciones: 'Requiere seguimiento urgente',
  },
  {
    id: 4,
    factura_id: 4,
    numero_factura: 'F004-2024',
    cliente: 'Farmacia Salud Total',
    monto_total: 416500,
    fecha_vencimiento: '2024-02-05',
    estado: 'Pendiente',
    dias_vencimiento: 20,
    metodo_pago: 'Transferencia',
    fecha_pago: null,
    observaciones: 'Pago regular, sin problemas',
  },
];

// =====================================================================
// 🛒 DATOS DE COMPRAS
// =====================================================================

export const comprasData = [
  {
    id: 1,
    numero_factura: 'FC001-2024',
    fecha_compra: '2024-01-15',
    proveedor: 'Office Solutions Ltda',
    descripcion: 'Materiales de oficina y papelería',
    monto_subtotal: 150000,
    monto_iva: 28500,
    monto_total: 178500,
    estado: 'Pagada',
    categoria: 'Insumos',
    forma_pago: 'Transferencia',
    fecha_pago: '2024-01-20',
  },
  {
    id: 2,
    numero_factura: 'FC002-2024',
    fecha_compra: '2024-01-10',
    proveedor: 'Tech Supplies SA',
    descripcion: 'Equipos informáticos y software',
    monto_subtotal: 850000,
    monto_iva: 161500,
    monto_total: 1011500,
    estado: 'Pendiente',
    categoria: 'Equipos',
    forma_pago: 'Transferencia',
    fecha_pago: null,
  },
  {
    id: 3,
    numero_factura: 'FC003-2024',
    fecha_compra: '2024-01-08',
    proveedor: 'Servicios Profesionales EIRL',
    descripcion: 'Servicios de consultoría externa',
    monto_subtotal: 500000,
    monto_iva: 95000,
    monto_total: 595000,
    estado: 'Pagada',
    categoria: 'Servicios',
    forma_pago: 'Transferencia',
    fecha_pago: '2024-01-15',
  },
  {
    id: 4,
    numero_factura: 'FC004-2024',
    fecha_compra: '2024-01-05',
    proveedor: 'Marketing Digital Ltda',
    descripcion: 'Servicios de marketing y publicidad',
    monto_subtotal: 300000,
    monto_iva: 57000,
    monto_total: 357000,
    estado: 'Pendiente',
    categoria: 'Marketing',
    forma_pago: 'Transferencia',
    fecha_pago: null,
  },
];

// =====================================================================
// 📊 DATOS DE REPORTES
// =====================================================================

export const reportesData = {
  ingresos_totales: 2850000,
  crecimiento_ingresos: 15.5,
  clientes_activos: 156,
  crecimiento_clientes: 8.2,
  ventas_mes: 2850000,
  crecimiento_ventas: 18.8,
  reportesHoy: 12,

  graficos: {
    ventas: [
      { mes: 'Ene', ventas: 2100000 },
      { mes: 'Feb', ventas: 1950000 },
      { mes: 'Mar', ventas: 2300000 },
      { mes: 'Abr', ventas: 2450000 },
      { mes: 'May', ventas: 2600000 },
      { mes: 'Jun', ventas: 2850000 },
    ],
    clientes: [
      { name: 'Clientes Activos', valor: 142 },
      { name: 'Clientes Inactivos', valor: 8 },
      { name: 'Clientes Pendientes', valor: 6 },
    ],
  },

  reportesDisponibles: [
    {
      id: 1,
      nombre: 'Reporte de Ventas Mensual',
      descripcion: 'Análisis detallado de ventas por mes',
      categoria: 'Ventas',
      formato: 'PDF',
      icono: 'BarChart3',
      ultima_generacion: '2024-01-15',
    },
    {
      id: 2,
      nombre: 'Estado de Cobranzas',
      descripcion: 'Resumen de cobranzas pendientes y vencidas',
      categoria: 'Cobranza',
      formato: 'Excel',
      icono: 'DollarSign',
      ultima_generacion: '2024-01-14',
    },
    {
      id: 3,
      nombre: 'Análisis de Clientes',
      descripcion: 'Segmentación y comportamiento de clientes',
      categoria: 'Clientes',
      formato: 'PDF',
      icono: 'Users',
      ultima_generacion: '2024-01-13',
    },
  ],
};

// =====================================================================
// ⚙️ DATOS DE CONFIGURACIONES
// =====================================================================

export const configuracionesData = [
  {
    id: 1,
    nombre: 'Tema Oscuro',
    categoria: 'Apariencia',
    tipo: 'Booleano',
    valor: 'false',
    valor_por_defecto: 'false',
    descripcion: 'Activar tema oscuro en la interfaz',
    editable: true,
  },
  {
    id: 2,
    nombre: 'Límite de Usuarios',
    categoria: 'Seguridad',
    tipo: 'Número',
    valor: '100',
    valor_por_defecto: '100',
    descripcion: 'Número máximo de usuarios permitidos',
    editable: true,
  },
  {
    id: 3,
    nombre: 'Tiempo de Inactividad',
    categoria: 'Seguridad',
    tipo: 'Número',
    valor: '30',
    valor_por_defecto: '30',
    descripcion: 'Tiempo en minutos para considerar un usuario inactivo',
    editable: true,
  },
  {
    id: 4,
    nombre: 'Notificaciones por Email',
    categoria: 'Notificaciones',
    tipo: 'Booleano',
    valor: 'true',
    valor_por_defecto: 'true',
    descripcion: 'Enviar notificaciones por correo electrónico',
    editable: true,
  },
  {
    id: 5,
    nombre: 'Backup Automático',
    categoria: 'Backup',
    tipo: 'Booleano',
    valor: 'true',
    valor_por_defecto: 'true',
    descripcion: 'Realizar backup automático diario',
    editable: true,
  },
];

// =====================================================================
// 👨‍💼 DATOS DE RRHH
// =====================================================================

export const rrhhData = [
  {
    id: 1,
    nombre: 'Carlos',
    apellido: 'González',
    email: 'carlos.gonzalez@mtz.com',
    telefono: '+56912345678',
    departamento: 'Administración',
    cargo: 'Gerente General',
    fecha_ingreso: '2020-01-15',
    salario_base: 2500000,
    estado: 'activo',
    evaluacion: 4.8,
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'Rodríguez',
    email: 'maria.rodriguez@mtz.com',
    telefono: '+56923456789',
    departamento: 'Ventas',
    cargo: 'Gerente de Ventas',
    fecha_ingreso: '2020-03-20',
    salario_base: 2200000,
    estado: 'activo',
    evaluacion: 4.6,
  },
  {
    id: 3,
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@mtz.com',
    telefono: '+56934567890',
    departamento: 'Compras',
    cargo: 'Supervisor de Compras',
    fecha_ingreso: '2020-06-10',
    salario_base: 1800000,
    estado: 'activo',
    evaluacion: 4.4,
  },
  {
    id: 4,
    nombre: 'Ana',
    apellido: 'Silva',
    email: 'ana.silva@mtz.com',
    telefono: '+56945678901',
    departamento: 'Contabilidad',
    cargo: 'Contador Senior',
    fecha_ingreso: '2020-08-05',
    salario_base: 1600000,
    estado: 'activo',
    evaluacion: 4.7,
  },
  {
    id: 5,
    nombre: 'Luis',
    apellido: 'Martínez',
    email: 'luis.martinez@mtz.com',
    telefono: '+56956789012',
    departamento: 'Tecnología',
    cargo: 'Desarrollador Senior',
    fecha_ingreso: '2021-01-10',
    salario_base: 1900000,
    estado: 'activo',
    evaluacion: 4.5,
  },
];

// =====================================================================
// 📋 DATOS DE IVA
// =====================================================================

export const ivaData = {
  declaraciones: [
    {
      id: 1,
      periodo: '2024-01',
      fecha_vencimiento: '2024-02-20',
      fecha_declaracion: '2024-02-15',
      iva_debitado: 15000000,
      iva_creditado: 12000000,
      iva_pagado: 3000000,
      estado: 'Pagado',
      tipo: 'Mensual',
    },
    {
      id: 2,
      periodo: '2024-02',
      fecha_vencimiento: '2024-03-20',
      fecha_declaracion: null,
      iva_debitado: 18000000,
      iva_creditado: 14000000,
      iva_pagado: 0,
      estado: 'Pendiente',
      tipo: 'Mensual',
    },
    {
      id: 3,
      periodo: '2024-03',
      fecha_vencimiento: '2024-04-20',
      fecha_declaracion: null,
      iva_debitado: 0,
      iva_creditado: 0,
      iva_pagado: 0,
      estado: 'No Iniciado',
      tipo: 'Mensual',
    },
  ],

  resumen: {
    total_declaraciones: 12,
    declaraciones_pagadas: 10,
    declaraciones_pendientes: 1,
    declaraciones_vencidas: 1,
    total_iva_pagado: 45000000,
    total_iva_debitado: 180000000,
    total_iva_creditado: 150000000,
    saldo_actual: 30000000,
  },

  proximasFechas: [
    {
      periodo: '2024-02',
      fecha_vencimiento: '2024-03-20',
      dias_restantes: 5,
      tipo: 'Declaración Mensual',
    },
    {
      periodo: '2024-03',
      fecha_vencimiento: '2024-04-20',
      dias_restantes: 35,
      tipo: 'Declaración Mensual',
    },
  ],
};

// =====================================================================
// 📊 FUNCIONES UTILITARIAS
// =====================================================================

export const formatCurrency = amount => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = date => {
  return new Date(date).toLocaleDateString('es-CL');
};

export const formatNumber = number => {
  return new Intl.NumberFormat('es-CL').format(number);
};

export const getStatusColor = status => {
  const colors = {
    Activo: 'green',
    Inactivo: 'red',
    Pendiente: 'yellow',
    Pagado: 'green',
    Vencido: 'red',
    activo: 'green',
    inactivo: 'red',
    pendiente: 'yellow',
    pagado: 'green',
    vencido: 'red',
  };
  return colors[status] || 'gray';
};

export const getStatusLabel = status => {
  const labels = {
    Activo: 'Activo',
    Inactivo: 'Inactivo',
    Pendiente: 'Pendiente',
    Pagado: 'Pagado',
    Vencido: 'Vencido',
    activo: 'Activo',
    inactivo: 'Inactivo',
    pendiente: 'Pendiente',
    pagado: 'Pagado',
    vencido: 'Vencido',
  };
  return labels[status] || status;
};
