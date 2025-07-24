import { useState, useCallback, useEffect } from 'react';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import SimpleModal from '../../components/ui/SimpleModal.jsx';
import dataService from '../../services/dataService.js';

// Hook de Toast simplificado
const useToast = () => {
  const showToast = (message, type = 'info') => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  };
  return { showToast };
};
import {
  Calculator,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

const IVAPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ivaData, setIvaData] = useState({
    declaraciones: [],
    resumen: {
      saldo_actual: 0,
      total_iva_debitado: 0,
      total_iva_creditado: 0,
      total_iva_pagado: 0,
      total_declaraciones: 0,
      declaraciones_pagadas: 0,
      declaraciones_pendientes: 0,
      declaraciones_vencidas: 0
    },
    proximasFechas: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const { showToast } = useToast();

  // Cargar datos de IVA
  const cargarDatosIVA = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Intentar cargar datos reales de Supabase
      let ventas = [];
      let compras = [];

      try {
        [ventas, compras] = await Promise.all([
          dataService.getVentas(),
          dataService.getCompras()
        ]);
      } catch (error) {
        console.log('Usando datos mock para IVA');
        const mockData = dataService.getDatosMock();
        ventas = mockData.ventas;
        compras = mockData.compras;
      }

      // Calcular IVA de ventas (19% de IVA debitado)
      const ivaDebitado = ventas.reduce((total, venta) => {
        return total + (venta.monto_total * 0.19);
      }, 0);

      // Calcular IVA de compras (19% de IVA creditado)
      const ivaCreditado = compras.reduce((total, compra) => {
        return total + (compra.monto_total * 0.19);
      }, 0);

      // Calcular saldo actual
      const saldoActual = ivaDebitado - ivaCreditado;

      // Generar declaraciones de ejemplo basadas en los datos
      const declaracionesEjemplo = [
        {
          id: 1,
          tipo: 'IVA Mensual',
          periodo: 'Diciembre 2024',
          periodo_mes: 12,
          periodo_ano: 2024,
          fecha_declaracion: '2024-12-20',
          fecha_vencimiento: '2024-12-25',
          estado: 'Pagado',
          iva_debitado: ivaDebitado * 0.4,
          iva_creditado: ivaCreditado * 0.4,
          iva_pagado: (ivaDebitado - ivaCreditado) * 0.4,
          observaciones: 'Declaración mensual de IVA',
        },
        {
          id: 2,
          tipo: 'IVA Mensual',
          periodo: 'Noviembre 2024',
          periodo_mes: 11,
          periodo_ano: 2024,
          fecha_declaracion: '2024-11-20',
          fecha_vencimiento: '2024-11-25',
          estado: 'Pagado',
          iva_debitado: ivaDebitado * 0.3,
          iva_creditado: ivaCreditado * 0.3,
          iva_pagado: (ivaDebitado - ivaCreditado) * 0.3,
          observaciones: 'Declaración mensual de IVA',
        },
        {
          id: 3,
          tipo: 'IVA Mensual',
          periodo: 'Enero 2025',
          periodo_mes: 1,
          periodo_ano: 2025,
          fecha_declaracion: null,
          fecha_vencimiento: '2025-01-25',
          estado: 'Pendiente',
          iva_debitado: ivaDebitado * 0.3,
          iva_creditado: ivaCreditado * 0.3,
          iva_pagado: 0,
          observaciones: 'Próxima declaración',
        },
      ];

      // Calcular resumen
      const totalDeclaraciones = declaracionesEjemplo.length;
      const declaracionesPagadas = declaracionesEjemplo.filter(d => d.estado === 'Pagado').length;
      const declaracionesPendientes = declaracionesEjemplo.filter(d => d.estado === 'Pendiente').length;
      const declaracionesVencidas = declaracionesEjemplo.filter(d => d.estado === 'Vencido').length;

      // Generar próximas fechas
      const proximasFechas = [
        {
          tipo: 'IVA Mensual',
          periodo: 'Enero 2025',
          fecha_vencimiento: '2025-01-25',
          dias_restantes: 5,
          estado: 'Pendiente'
        },
        {
          tipo: 'IVA Mensual',
          periodo: 'Febrero 2025',
          fecha_vencimiento: '2025-02-25',
          dias_restantes: 35,
          estado: 'No Iniciado'
        }
      ];

      setIvaData({
        declaraciones: declaracionesEjemplo,
        resumen: {
          saldo_actual: saldoActual,
          total_iva_debitado: ivaDebitado,
          total_iva_creditado: ivaCreditado,
          total_iva_pagado: declaracionesEjemplo.reduce((total, d) => total + d.iva_pagado, 0),
          total_declaraciones: totalDeclaraciones,
          declaraciones_pagadas: declaracionesPagadas,
          declaraciones_pendientes: declaracionesPendientes,
          declaraciones_vencidas: declaracionesVencidas
        },
        proximasFechas: proximasFechas,
      });

      showToast('Datos de IVA cargados exitosamente', 'success');
    } catch (error) {
      console.error('❌ Error cargando datos de IVA:', error);
      setError(`Error cargando datos de IVA: ${error.message}`);
      showToast('Error cargando datos de IVA', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    cargarDatosIVA();
  }, [cargarDatosIVA]);

  // Función para calcular IVA del período
  const calcularIVA = useCallback(async (mes, ano) => {
    try {
      setLoading(true);

      // Obtener ventas y compras del período
      const ventas = await dataService.getVentas();
      const compras = await dataService.getCompras();

      // Filtrar por período (simulado)
      const ventasPeriodo = ventas.filter(v => v.fecha_venta?.includes(`${ano}-${mes.toString().padStart(2, '0')}`));
      const comprasPeriodo = compras.filter(c => c.fecha_compra?.includes(`${ano}-${mes.toString().padStart(2, '0')}`));

      // Calcular IVA
      const ivaDebitado = ventasPeriodo.reduce((total, v) => total + (v.monto_total * 0.19), 0);
      const ivaCreditado = comprasPeriodo.reduce((total, c) => total + (c.monto_total * 0.19), 0);
      const saldoIVA = ivaDebitado - ivaCreditado;

      setSelectedPeriod({
        mes,
        ano,
        ivaDebitado,
        ivaCreditado,
        saldoIVA,
        ventas: ventasPeriodo.length,
        compras: comprasPeriodo.length
      });

      setShowModal(true);
      showToast('Cálculo de IVA completado', 'success');
    } catch (error) {
      console.error('Error calculando IVA:', error);
      showToast('Error calculando IVA', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Función para generar declaración
  const generarDeclaracion = useCallback(async (mes, ano) => {
    try {
      await calcularIVA(mes, ano);
      showToast('Declaración generada exitosamente', 'success');
    } catch (error) {
      console.error('Error generando declaración:', error);
      showToast('Error generando declaración', 'error');
    }
  }, [calcularIVA, showToast]);

  // Función para formatear moneda
  const formatCurrency = amount => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Función para formatear fecha
  const formatDate = dateString => {
    if (!dateString) return 'No declarado';
    return new Date(dateString).toLocaleDateString('es-CL');
  };

  // Obtener color del estado
  const getEstadoColor = estado => {
    switch (estado) {
      case 'Pagado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Vencido':
        return 'destructive';
      case 'No Iniciado':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Obtener icono del estado
  const getEstadoIcon = estado => {
    switch (estado) {
      case 'Pagado':
        return CheckCircle;
      case 'Pendiente':
        return Clock;
      case 'Vencido':
        return AlertCircle;
      case 'No Iniciado':
        return FileText;
      default:
        return FileText;
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-8'>
        <div className='text-red-600 text-lg mb-2'>
          Error cargando datos de IVA
        </div>
        <div className='text-gray-600'>{error}</div>
        <button
          onClick={cargarDatosIVA}
          className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-900'>Gestión de IVA</h1>
        <div className='flex gap-2'>
          <Button variant='outline'>
            <Upload className='h-4 w-4 mr-2' />
            Importar Declaración
          </Button>
          <Button variant='outline'>
            <Download className='h-4 w-4 mr-2' />
            Exportar Datos
          </Button>
          <Button onClick={cargarDatosIVA} variant='outline'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Actualizar
          </Button>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <div className='flex items-center'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Calculator className='h-6 w-6 text-blue-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Saldo Actual</p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatCurrency(ivaData.resumen.saldo_actual)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className='flex items-center'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <TrendingUp className='h-6 w-6 text-green-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>IVA Debitado</p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatCurrency(ivaData.resumen.total_iva_debitado)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className='flex items-center'>
            <div className='p-2 bg-red-100 rounded-lg'>
              <TrendingDown className='h-6 w-6 text-red-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>IVA Creditado</p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatCurrency(ivaData.resumen.total_iva_creditado)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className='flex items-center'>
            <div className='p-2 bg-purple-100 rounded-lg'>
              <DollarSign className='h-6 w-6 text-purple-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Total Pagado</p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatCurrency(ivaData.resumen.total_iva_pagado)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Próximas Fechas */}
      <Card>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Próximas Fechas de Vencimiento
        </h3>
        <div className='space-y-3'>
          {ivaData.proximasFechas.map((fecha, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
            >
              <div className='flex items-center'>
                <Calendar className='h-5 w-5 text-blue-600 mr-3' />
                <div>
                  <p className='font-medium text-gray-900'>{fecha.tipo}</p>
                  <p className='text-sm text-gray-600'>
                    Período: {fecha.periodo}
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='font-medium text-gray-900'>
                  {formatDate(fecha.fecha_vencimiento)}
                </p>
                <Badge
                  variant={
                    fecha.dias_restantes <= 7 ? 'destructive' : 'warning'
                  }
                  className='mt-1'
                >
                  {fecha.dias_restantes} días restantes
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Declaraciones */}
      <Card>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Historial de Declaraciones
        </h3>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Período
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  IVA Debitado
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  IVA Creditado
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  IVA Pagado
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Fecha Declaración
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {ivaData.declaraciones.map(declaracion => {
                const EstadoIcon = getEstadoIcon(declaracion.estado);
                return (
                  <tr key={declaracion.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {declaracion.periodo}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {declaracion.tipo}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900 font-semibold'>
                        {formatCurrency(declaracion.iva_debitado)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900 font-semibold'>
                        {formatCurrency(declaracion.iva_creditado)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-green-600 font-semibold'>
                        {formatCurrency(declaracion.iva_pagado)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {formatDate(declaracion.fecha_declaracion)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <EstadoIcon className='h-4 w-4 mr-2' />
                        <Badge variant={getEstadoColor(declaracion.estado)}>
                          {declaracion.estado}
                        </Badge>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Resumen Estadístico */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Resumen de Declaraciones
          </h3>
          <div className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Total Declaraciones:</span>
              <span className='font-semibold'>
                {ivaData.resumen.total_declaraciones}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Pagadas:</span>
              <span className='font-semibold text-green-600'>
                {ivaData.resumen.declaraciones_pagadas}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Pendientes:</span>
              <span className='font-semibold text-yellow-600'>
                {ivaData.resumen.declaraciones_pendientes}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Vencidas:</span>
              <span className='font-semibold text-red-600'>
                {ivaData.resumen.declaraciones_vencidas}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Cálculo de IVA
          </h3>
          <div className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>IVA Debitado:</span>
              <span className='font-semibold text-blue-600'>
                {formatCurrency(ivaData.resumen.total_iva_debitado)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>IVA Creditado:</span>
              <span className='font-semibold text-red-600'>
                {formatCurrency(ivaData.resumen.total_iva_creditado)}
              </span>
            </div>
            <div className='border-t pt-2'>
              <div className='flex justify-between font-bold'>
                <span>Saldo a Pagar:</span>
                <span
                  className={
                    ivaData.resumen.saldo_actual >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {formatCurrency(ivaData.resumen.saldo_actual)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Acciones Rápidas
          </h3>
          <div className='space-y-3'>
            <Button
              variant='outline'
              className='w-full justify-start'
              onClick={() => calcularIVA(1, 2025)}
            >
              <Calculator className='h-4 w-4 mr-2' />
              Calcular IVA del Período
            </Button>
            <Button
              variant='outline'
              className='w-full justify-start'
              onClick={() => generarDeclaracion(1, 2025)}
            >
              <FileText className='h-4 w-4 mr-2' />
              Generar Declaración
            </Button>
            <Button variant='outline' className='w-full justify-start'>
              <Upload className='h-4 w-4 mr-2' />
              Subir Comprobantes
            </Button>
            <Button variant='outline' className='w-full justify-start'>
              <Download className='h-4 w-4 mr-2' />
              Descargar Reporte
            </Button>
          </div>
        </Card>
      </div>

      {/* Modal de Cálculo de IVA */}
      <SimpleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Cálculo de IVA del Período"
      >
        {selectedPeriod && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">IVA Debitado</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(selectedPeriod.ivaDebitado)}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedPeriod.ventas} ventas
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-900">IVA Creditado</h4>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(selectedPeriod.ivaCreditado)}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedPeriod.compras} compras
                </p>
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Saldo a Pagar</h4>
              <p className={`text-3xl font-bold ${selectedPeriod.saldoIVA >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(selectedPeriod.saldoIVA)}
              </p>
              <p className="text-sm text-gray-600">
                Período: {selectedPeriod.mes}/{selectedPeriod.ano}
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </Button>
              <Button
                onClick={() => {
                  showToast('Declaración enviada al SII', 'success');
                  setShowModal(false);
                }}
              >
                Enviar al SII
              </Button>
            </div>
          </div>
        )}
      </SimpleModal>
    </div>
  );
};

export default IVAPage;
