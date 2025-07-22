import React, { useState, useEffect } from 'react';
import { User, FileText, Calendar, DollarSign, Download, Eye, Search, RefreshCw, ExternalLink, AlertCircle, CheckCircle, Clock, BarChart3, Shield, Building,  } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Input from '../../components/ui/Input.jsx';
import { Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
 } from '../../components/ui/Dialog.jsx';
import { supabase } from '../../lib/supabase.js';
import { formatCurrency, formatDate  } from '../../utils/helpers.js';
import useAuth from '../../hooks/useAuth.js';

/**
 * PortalClientes Component
 * Portal completo para clientes con acceso a su información, documentos y Google Drive
 */
const PortalClientes = () => {
  const { user, userProfile, role } = useAuth();

  // Estados principales
  const [cliente, setCliente] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [declaraciones, setDeclaraciones] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [cobranzas, setCobranzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');

  // Estados de modales
  const [showDocumentoDetails, setShowDocumentoDetails] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState(null);
  const [showDeclaracionDetails, setShowDeclaracionDetails] = useState(false);
  const [selectedDeclaracion, setSelectedDeclaracion] = useState(null);

  // Estados y tipos
  const TIPOS_DOCUMENTO = [
    'factura',
    'boleta',
    'nota_credito',
    'nota_debito',
    'factura_exenta',
  ];
  const ESTADOS_DOCUMENTO = ['pendiente', 'pagado', 'vencido', 'anulado'];
  const TIPOS_DECLARACION = [
    'f29',
    'f50',
    'renta',
    'iva',
    'retencion',
    'patente',
    'municipal',
  ];

  // Cargar datos del cliente
  const cargarDatosCliente = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando datos del cliente...');

      // Buscar cliente por email del usuario
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes_contables')
        .select('*')
        .eq('email', user?.email)
        .single();

      if (clienteError) {
        console.error('❌ Cliente no encontrado:', clienteError);
        setCliente(null);
        return;
      }

      setCliente(clienteData);
      console.log('✅ Cliente cargado:', clienteData.nombre || clienteData.razon_social);

      // Cargar documentos del cliente
      const { data: documentosData, error: documentosError } = await supabase
        .from('documentos_tributarios')
        .select('*')
        .eq('cliente_id', clienteData.id_cliente)
        .order('fecha_emision', { ascending: false });

      if (documentosError) {
        console.log('📝 Error cargando documentos:', documentosError);
        setDocumentos([]);
      } else {
        setDocumentos(documentosData || []);
      }

      // Cargar declaraciones del cliente
      const { data: declaracionesData, error: declaracionesError } =
        await supabase
          .from('declaraciones_tributarias')
          .select('*')
          .eq('cliente_id', clienteData.id_cliente)
          .order('periodo_ano DESC, periodo_mes DESC');

      if (declaracionesError) {
        console.log('📝 Error cargando declaraciones:', declaracionesError);
        setDeclaraciones([]);
      } else {
        setDeclaraciones(declaracionesData || []);
      }

      // Cargar ventas del cliente
      const { data: ventasData, error: ventasError } = await supabase
        .from('ventas')
        .select('*')
        .eq('cliente_id', clienteData.id_cliente)
        .order('fecha_emision', { ascending: false });

      if (ventasError) {
        console.log('📝 Error cargando ventas:', ventasError);
        setVentas([]);
      } else {
        setVentas(ventasData || []);
      }

      // Cargar cobranzas del cliente
      const { data: cobranzasData, error: cobranzasError } = await supabase
        .from('cobranzas')
        .select('*')
        .eq('cliente_id', clienteData.id_cliente)
        .order('fecha_vencimiento', { ascending: true });

      if (cobranzasError) {
        console.log('📝 Error cargando cobranzas:', cobranzasError);
        setCobranzas([]);
      } else {
        setCobranzas(cobranzasData || []);
      }
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular métricas del cliente
  const calcularMetricasCliente = () => {
    if (!cliente) return {};

    const totalVentas = ventas.reduce(
      (sum, v) => sum + parseFloat(v.monto_total || 0),
      0
    );
    const totalCobranzas = cobranzas.reduce(
      (sum, c) => sum + parseFloat(c.monto || 0),
      0
    );
    const cobranzasPendientes = cobranzas.filter(c => c.estado === 'Pendiente');
    const documentosPendientes = documentos.filter(
      d => d.estado === 'pendiente'
    );
    const declaracionesPendientes = declaraciones.filter(
      d => d.estado === 'pendiente'
    );

    return {
      totalVentas,
      totalCobranzas,
      cobranzasPendientes: cobranzasPendientes.length,
      montoPendiente: cobranzasPendientes.reduce(
        (sum, c) => sum + parseFloat(c.monto || 0),
        0
      ),
      documentosPendientes: documentosPendientes.length,
      declaracionesPendientes: declaracionesPendientes.length,
    };
  };

  // Ver detalles de documento
  const handleVerDocumento = documento => {
    setSelectedDocumento(documento);
    setShowDocumentoDetails(true);
  };

  // Ver detalles de declaración
  const handleVerDeclaracion = declaracion => {
    setSelectedDeclaracion(declaracion);
    setShowDeclaracionDetails(true);
  };

  // Abrir Google Drive
  const abrirGoogleDrive = () => {
    // URL del Google Drive del cliente (configurable)
    const googleDriveUrl = `https://drive.google.com/drive/folders/${cliente?.configuracion?.google_drive_folder_id || 'default'}`;
    window.open(googleDriveUrl, '_blank');
  };

  // Descargar documento
  const descargarDocumento = documento => {
    if (documento.archivo_pdf) {
      window.open(documento.archivo_pdf, '_blank');
    } else {
      alert('Documento no disponible para descarga');
    }
  };

  // Filtrar documentos
  const documentosFiltrados = documentos.filter(documento => {
    const matchSearch =
      documento.numero_documento
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      documento.nombre_emisor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo =
      filterTipo === 'todos' || documento.tipo_documento === filterTipo;
    const matchEstado =
      filterEstado === 'todos' || documento.estado === filterEstado;

    return matchSearch && matchTipo && matchEstado;
  });

  // Cargar datos al montar
  useEffect(() => {
    if (user?.email) {
      cargarDatosCliente();
    }
  }, [user?.email]);

  // Verificar si es cliente
  if (role !== 'cliente' && role !== 'admin') {
    return (
      <div className='flex items-center justify-center min-h-96'>
        <Card className='p-8 text-center max-w-md'>
          <Shield className='mx-auto h-12 w-12 text-red-600 mb-4' />
          <h2 className='text-xl font-bold text-gray-900 mb-2'>
            Acceso Restringido
          </h2>
          <p className='text-gray-600'>
            Solo los clientes pueden acceder al portal de clientes.
          </p>
        </Card>
      </div>
    );
  }

  // Cliente no encontrado
  if (!loading && !cliente) {
    return (
      <div className='flex items-center justify-center min-h-96'>
        <Card className='p-8 text-center max-w-md'>
          <User className='mx-auto h-12 w-12 text-gray-400 mb-4' />
          <h2 className='text-xl font-bold text-gray-900 mb-2'>
            Cliente No Encontrado
          </h2>
          <p className='text-gray-600'>
            No se encontró información de cliente para tu cuenta.
          </p>
          <p className='text-sm text-gray-500 mt-2'>
            Contacta a tu administrador para configurar tu perfil.
          </p>
        </Card>
      </div>
    );
  }

  const metricas = calcularMetricasCliente();

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-3'>
            <User className='h-8 w-8 text-blue-600' />
            Portal de Cliente
          </h1>
          <p className='text-gray-600 mt-1'>
            Bienvenido, {cliente?.nombre || cliente?.razon_social || 'Cliente'}
          </p>
        </div>

        <div className='flex gap-3'>
          <Button onClick={cargarDatosCliente} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Actualizar
          </Button>
          <Button onClick={abrirGoogleDrive} variant='outline'>
            <ExternalLink className='h-4 w-4 mr-2' />
            Google Drive
          </Button>
        </div>
      </div>

      {/* Información del cliente */}
      <Card className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='flex items-center'>
            <div className='p-3 bg-blue-100 rounded-full'>
              <Building className='h-6 w-6 text-blue-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Empresa</p>
              <p className='text-lg font-bold text-gray-900'>
                {cliente?.nombre || cliente?.razon_social}
              </p>
              <p className='text-sm text-gray-500'>{cliente?.rut}</p>
            </div>
          </div>

          <div className='flex items-center'>
            <div className='p-3 bg-green-100 rounded-full'>
              <DollarSign className='h-6 w-6 text-green-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Total Facturado
              </p>
              <p className='text-lg font-bold text-gray-900'>
                {formatCurrency(metricas.totalVentas)}
              </p>
            </div>
          </div>

          <div className='flex items-center'>
            <div className='p-3 bg-yellow-100 rounded-full'>
              <Clock className='h-6 w-6 text-yellow-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Pendientes</p>
              <p className='text-lg font-bold text-gray-900'>
                {metricas.cobranzasPendientes}
              </p>
              <p className='text-sm text-gray-500'>
                {formatCurrency(metricas.montoPendiente)}
              </p>
            </div>
          </div>

          <div className='flex items-center'>
            <div className='p-3 bg-purple-100 rounded-full'>
              <FileText className='h-6 w-6 text-purple-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Documentos</p>
              <p className='text-lg font-bold text-gray-900'>
                {documentos.length}
              </p>
              <p className='text-sm text-gray-500'>
                {metricas.documentosPendientes} pendientes
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Métricas detalladas */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
            <BarChart3 className='h-5 w-5 text-blue-600' />
            Resumen Financiero
          </h3>
          <div className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Total Ventas:</span>
              <span className='font-semibold'>
                {formatCurrency(metricas.totalVentas)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Total Cobrado:</span>
              <span className='font-semibold'>
                {formatCurrency(metricas.totalCobranzas)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Pendiente:</span>
              <span className='font-semibold text-red-600'>
                {formatCurrency(metricas.montoPendiente)}
              </span>
            </div>
          </div>
        </Card>

        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
            <Calendar className='h-5 w-5 text-green-600' />
            Próximos Vencimientos
          </h3>
          <div className='space-y-3'>
            {cobranzas
              .filter(c => c.estado === 'Pendiente')
              .slice(0, 3)
              .map(cobranza => (
                <div
                  key={cobranza.id}
                  className='flex justify-between items-center'
                >
                  <div>
                    <p className='text-sm font-medium'>
                      {formatDate(cobranza.fecha_vencimiento)}
                    </p>
                    <p className='text-xs text-gray-500'>Vencimiento</p>
                  </div>
                  <span className='font-semibold'>
                    {formatCurrency(cobranza.monto)}
                  </span>
                </div>
              ))}
            {cobranzas.filter(c => c.estado === 'Pendiente').length === 0 && (
              <p className='text-sm text-gray-500'>
                No hay vencimientos próximos
              </p>
            )}
          </div>
        </Card>

        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
            <AlertCircle className='h-5 w-5 text-yellow-600' />
            Alertas
          </h3>
          <div className='space-y-3'>
            {metricas.cobranzasPendientes > 0 && (
              <div className='flex items-center gap-2 text-sm'>
                <AlertCircle className='h-4 w-4 text-yellow-600' />
                <span>{metricas.cobranzasPendientes} cobranzas pendientes</span>
              </div>
            )}
            {metricas.declaracionesPendientes > 0 && (
              <div className='flex items-center gap-2 text-sm'>
                <AlertCircle className='h-4 w-4 text-red-600' />
                <span>
                  {metricas.declaracionesPendientes} declaraciones pendientes
                </span>
              </div>
            )}
            {metricas.cobranzasPendientes === 0 &&
              metricas.declaracionesPendientes === 0 && (
                <div className='flex items-center gap-2 text-sm'>
                  <CheckCircle className='h-4 w-4 text-green-600' />
                  <span>Todo al día</span>
                </div>
              )}
          </div>
        </Card>
      </div>

      {/* Documentos */}
      <Card className='p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
          <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
            <FileText className='h-5 w-5 text-blue-600' />
            Documentos Tributarios ({documentosFiltrados.length})
          </h3>

          <div className='flex gap-2'>
            <select
              value={filterTipo}
              onChange={e => setFilterTipo(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='todos'>Todos los tipos</option>
              {TIPOS_DOCUMENTO.map(tipo => (
                <option key={tipo} value={tipo}>
                  {tipo.toUpperCase()}
                </option>
              ))}
            </select>
            <select
              value={filterEstado}
              onChange={e => setFilterEstado(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='todos'>Todos los estados</option>
              {ESTADOS_DOCUMENTO.map(estado => (
                <option key={estado} value={estado}>
                  {estado.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Búsqueda */}
        <div className='mb-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              placeholder='Buscar documentos...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        {loading ? (
          <div className='text-center py-8'>
            <RefreshCw className='h-8 w-8 mx-auto animate-spin text-blue-500' />
            <p className='mt-2 text-gray-600'>Cargando documentos...</p>
          </div>
        ) : documentosFiltrados.length === 0 ? (
          <div className='text-center py-8'>
            <FileText className='h-12 w-12 mx-auto text-gray-400' />
            <p className='mt-2 text-gray-600'>
              {searchTerm
                ? 'No se encontraron documentos que coincidan con la búsqueda'
                : 'No hay documentos disponibles'}
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {documentosFiltrados.map(documento => (
              <div
                key={documento.id}
                className='border rounded-lg p-4 hover:bg-gray-50 transition-colors'
              >
                <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h4 className='font-semibold text-gray-900'>
                        {documento.numero_documento}
                      </h4>
                      <Badge variant='outline'>
                        {documento.tipo_documento.toUpperCase()}
                      </Badge>
                      <Badge
                        variant={
                          documento.estado === 'pagado'
                            ? 'success'
                            : documento.estado === 'pendiente'
                              ? 'warning'
                              : documento.estado === 'vencido'
                                ? 'destructive'
                                : 'outline'
                        }
                      >
                        {documento.estado.toUpperCase()}
                      </Badge>
                    </div>

                    <div className='text-sm text-gray-600 space-y-1'>
                      <p>
                        <strong>Emisor:</strong> {documento.nombre_emisor}
                      </p>
                      <p>
                        <strong>Fecha:</strong>{' '}
                        {formatDate(documento.fecha_emision)}
                      </p>
                      <p>
                        <strong>Monto:</strong>{' '}
                        {formatCurrency(documento.monto_total)}
                      </p>
                      {documento.fecha_vencimiento && (
                        <p>
                          <strong>Vencimiento:</strong>{' '}
                          {formatDate(documento.fecha_vencimiento)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleVerDocumento(documento)}
                    >
                      <Eye className='h-4 w-4 mr-1' />
                      Ver
                    </Button>
                    {documento.archivo_pdf && (
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => descargarDocumento(documento)}
                      >
                        <Download className='h-4 w-4 mr-1' />
                        Descargar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Declaraciones */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
          <Calendar className='h-5 w-5 text-green-600' />
          Declaraciones Tributarias ({declaraciones.length})
        </h3>

        {loading ? (
          <div className='text-center py-8'>
            <RefreshCw className='h-8 w-8 mx-auto animate-spin text-blue-500' />
            <p className='mt-2 text-gray-600'>Cargando declaraciones...</p>
          </div>
        ) : declaraciones.length === 0 ? (
          <div className='text-center py-8'>
            <Calendar className='h-12 w-12 mx-auto text-gray-400' />
            <p className='mt-2 text-gray-600'>
              No hay declaraciones disponibles
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {declaraciones.slice(0, 5).map(declaracion => (
              <div
                key={declaracion.id}
                className='border rounded-lg p-4 hover:bg-gray-50 transition-colors'
              >
                <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h4 className='font-semibold text-gray-900'>
                        {declaracion.tipo_declaracion.toUpperCase()} -{' '}
                        {declaracion.periodo_mes}/{declaracion.periodo_ano}
                      </h4>
                      <Badge
                        variant={
                          declaracion.estado === 'pagada'
                            ? 'success'
                            : declaracion.estado === 'presentada'
                              ? 'primary'
                              : declaracion.estado === 'pendiente'
                                ? 'warning'
                                : declaracion.estado === 'vencida'
                                  ? 'destructive'
                                  : 'outline'
                        }
                      >
                        {declaracion.estado.toUpperCase()}
                      </Badge>
                    </div>

                    <div className='text-sm text-gray-600 space-y-1'>
                      <p>
                        <strong>Monto:</strong>{' '}
                        {formatCurrency(declaracion.monto_impuesto)}
                      </p>
                      <p>
                        <strong>Vencimiento:</strong>{' '}
                        {formatDate(declaracion.fecha_vencimiento)}
                      </p>
                      {declaracion.fecha_presentacion && (
                        <p>
                          <strong>Presentada:</strong>{' '}
                          {formatDate(declaracion.fecha_presentacion)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleVerDeclaracion(declaracion)}
                    >
                      <Eye className='h-4 w-4 mr-1' />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal Detalles de Documento */}
      <Dialog
        open={showDocumentoDetails}
        onOpenChange={setShowDocumentoDetails}
      >
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Detalles del Documento
            </DialogTitle>
          </DialogHeader>

          {selectedDocumento && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-gray-700'>Número</p>
                  <p className='text-lg font-semibold'>
                    {selectedDocumento.numero_documento}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-700'>Tipo</p>
                  <Badge variant='outline'>
                    {selectedDocumento.tipo_documento.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-700'>Emisor</p>
                  <p>{selectedDocumento.nombre_emisor}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-700'>Estado</p>
                  <Badge
                    variant={
                      selectedDocumento.estado === 'pagado'
                        ? 'success'
                        : selectedDocumento.estado === 'pendiente'
                          ? 'warning'
                          : selectedDocumento.estado === 'vencido'
                            ? 'destructive'
                            : 'outline'
                    }
                  >
                    {selectedDocumento.estado.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-700'>
                    Fecha Emisión
                  </p>
                  <p>{formatDate(selectedDocumento.fecha_emision)}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-700'>
                    Monto Total
                  </p>
                  <p className='text-lg font-semibold'>
                    {formatCurrency(selectedDocumento.monto_total)}
                  </p>
                </div>
              </div>

              {selectedDocumento.archivo_pdf && (
                <div className='pt-4 border-t'>
                  <Button
                    onClick={() => descargarDocumento(selectedDocumento)}
                    className='w-full'
                  >
                    <Download className='h-4 w-4 mr-2' />
                    Descargar PDF
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Detalles de Declaración */}
      <Dialog
        open={showDeclaracionDetails}
        onOpenChange={setShowDeclaracionDetails}
      >
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              Detalles de la Declaración
            </DialogTitle>
          </DialogHeader>

          {selectedDeclaracion && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-gray-700'>Tipo</p>
                  <p className='text-lg font-semibold'>
                    {selectedDeclaracion.tipo_declaracion.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-700'>Período</p>
                  <p>
                    {selectedDeclaracion.periodo_mes}/
                    {selectedDeclaracion.periodo_ano}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-700'>Estado</p>
                  <Badge
                    variant={
                      selectedDeclaracion.estado === 'pagada'
                        ? 'success'
                        : selectedDeclaracion.estado === 'presentada'
                          ? 'primary'
                          : selectedDeclaracion.estado === 'pendiente'
                            ? 'warning'
                            : selectedDeclaracion.estado === 'vencida'
                              ? 'destructive'
                              : 'outline'
                    }
                  >
                    {selectedDeclaracion.estado.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-700'>Monto</p>
                  <p className='text-lg font-semibold'>
                    {formatCurrency(selectedDeclaracion.monto_impuesto)}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-700'>
                    Vencimiento
                  </p>
                  <p>{formatDate(selectedDeclaracion.fecha_vencimiento)}</p>
                </div>
                {selectedDeclaracion.fecha_presentacion && (
                  <div>
                    <p className='text-sm font-medium text-gray-700'>
                      Presentada
                    </p>
                    <p>{formatDate(selectedDeclaracion.fecha_presentacion)}</p>
                  </div>
                )}
              </div>

              {selectedDeclaracion.observaciones && (
                <div className='pt-4 border-t'>
                  <p className='text-sm font-medium text-gray-700'>
                    Observaciones
                  </p>
                  <p className='text-sm text-gray-600'>
                    {selectedDeclaracion.observaciones}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortalClientes;
