import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, Button, Input, Badge } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog';
import {
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Save,
  X,
  AlertCircle,
} from 'lucide-react';
import { cn, validateRUT, formatRUT } from '@/utils/helpers';
import {
  ESTADOS_CLIENTE,
  TIPOS_EMPRESA,
  REGIONES_CHILE,
} from '@/utils/constants';

// Schema de validación con Zod
const clienteSchema = z.object({
  id_cliente: z.string().min(1, 'Código de cliente es requerido'),
  razon_social: z
    .string()
    .min(2, 'Razón social debe tener al menos 2 caracteres'),
  rut: z.string().refine(validateRUT, 'RUT inválido'),
  tipo_empresa: z.string().min(1, 'Tipo de empresa es requerido'),
  rubro: z.string().optional(),
  estado: z.string().min(1, 'Estado es requerido'),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  direccion_completa: z.string().optional(),
  categoria_cliente: z.string().optional(),

  // Datos SII y legales
  clave_sii: z.string().optional(),
  rut_representante_legal: z.string().optional(),
  clave_sii_representante: z.string().optional(),
  clave_unica: z.string().optional(),
  certificado_digital: z.string().optional(),

  // Datos financieros
  total_facturado: z
    .number()
    .min(0, 'Total facturado no puede ser negativo')
    .optional(),
  numero_facturas: z
    .number()
    .min(0, 'Número de facturas no puede ser negativo')
    .optional(),
  promedio_factura: z
    .number()
    .min(0, 'Promedio de factura no puede ser negativo')
    .optional(),
});

/**
 * ClienteForm Component
 * Formulario profesional para crear y editar clientes.
 * Incluye validaciones completas y campos organizados por secciones.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.cliente - Cliente a editar (opcional)
 * @param {Function} props.onSubmit - Callback al enviar formulario
 * @param {Function} props.onCancel - Callback al cancelar
 * @param {boolean} props.loading - Estado de carga
 * @param {boolean} props.open - Si el modal está abierto
 * @param {Function} props.onOpenChange - Callback para cambio de estado del modal
 */
const ClienteForm = ({
  cliente = null,
  onSubmit,
  onCancel,
  loading = false,
  open = false,
  onOpenChange,
}) => {
  const isEditing = !!cliente;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(clienteSchema),
    mode: 'onChange',
    defaultValues: {
      id_cliente: '',
      razon_social: '',
      rut: '',
      tipo_empresa: '',
      rubro: '',
      estado: 'Activo',
      telefono: '',
      email: '',
      direccion_completa: '',
      categoria_cliente: '',
      clave_sii: '',
      rut_representante_legal: '',
      clave_sii_representante: '',
      clave_unica: '',
      certificado_digital: '',
      total_facturado: 0,
      numero_facturas: 0,
      promedio_factura: 0,
    },
  });

  // Cargar datos del cliente si se está editando
  useEffect(() => {
    if (cliente) {
      reset({
        ...cliente,
        total_facturado: cliente.total_facturado || 0,
        numero_facturas: cliente.numero_facturas || 0,
        promedio_factura: cliente.promedio_factura || 0,
      });
    } else {
      reset();
    }
  }, [cliente, reset]);

  // Formatear RUT automáticamente
  const handleRutChange = e => {
    const formattedRut = formatRUT(e.target.value);
    setValue('rut', formattedRut);
  };

  // Manejar envío del formulario
  const handleFormSubmit = data => {
    onSubmit(data);
  };

  // Manejar cancelación
  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Building2 className='h-5 w-5' />
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
          {/* Información Básica */}
          <Card className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <Building2 className='h-5 w-5' />
              Información Básica
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Código Cliente *
                </label>
                <Input
                  {...register('id_cliente')}
                  placeholder='Ej: 0217'
                  className={cn(errors.id_cliente && 'border-red-500')}
                />
                {errors.id_cliente && (
                  <p className='text-sm text-red-600 mt-1'>
                    {errors.id_cliente.message}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  RUT *
                </label>
                <Input
                  {...register('rut')}
                  onChange={handleRutChange}
                  placeholder='12.345.678-9'
                  className={cn(errors.rut && 'border-red-500')}
                />
                {errors.rut && (
                  <p className='text-sm text-red-600 mt-1'>
                    {errors.rut.message}
                  </p>
                )}
              </div>

              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Razón Social *
                </label>
                <Input
                  {...register('razon_social')}
                  placeholder='Nombre de la empresa'
                  className={cn(errors.razon_social && 'border-red-500')}
                />
                {errors.razon_social && (
                  <p className='text-sm text-red-600 mt-1'>
                    {errors.razon_social.message}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Tipo de Empresa *
                </label>
                <select
                  {...register('tipo_empresa')}
                  className={cn(
                    'w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
                    errors.tipo_empresa && 'border-red-500'
                  )}
                >
                  <option value=''>Seleccionar tipo</option>
                  {TIPOS_EMPRESA.map(tipo => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
                {errors.tipo_empresa && (
                  <p className='text-sm text-red-600 mt-1'>
                    {errors.tipo_empresa.message}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Rubro
                </label>
                <Input
                  {...register('rubro')}
                  placeholder='Ej: Tecnología, Construcción'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Estado *
                </label>
                <select
                  {...register('estado')}
                  className={cn(
                    'w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
                    errors.estado && 'border-red-500'
                  )}
                >
                  {ESTADOS_CLIENTE.map(estado => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
                {errors.estado && (
                  <p className='text-sm text-red-600 mt-1'>
                    {errors.estado.message}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Categoría
                </label>
                <select
                  {...register('categoria_cliente')}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Sin categoría</option>
                  <option value='VIP'>VIP</option>
                  <option value='Premium'>Premium</option>
                  <option value='Top'>Top</option>
                  <option value='Regular'>Regular</option>
                  <option value='Medio'>Medio</option>
                  <option value='Bajo'>Bajo</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Información de Contacto */}
          <Card className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <User className='h-5 w-5' />
              Información de Contacto
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Teléfono
                </label>
                <Input
                  {...register('telefono')}
                  placeholder='+56 9 1234 5678'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email
                </label>
                <Input
                  {...register('email')}
                  type='email'
                  placeholder='contacto@empresa.cl'
                  className={cn(errors.email && 'border-red-500')}
                />
                {errors.email && (
                  <p className='text-sm text-red-600 mt-1'>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Dirección Completa
                </label>
                <Input
                  {...register('direccion_completa')}
                  placeholder='Av. Providencia 1234, Santiago'
                />
              </div>
            </div>
          </Card>

          {/* Datos SII y Legales */}
          <Card className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Datos SII y Legales
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Clave SII
                </label>
                <Input
                  {...register('clave_sii')}
                  placeholder='Clave SII de la empresa'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  RUT Representante Legal
                </label>
                <Input
                  {...register('rut_representante_legal')}
                  placeholder='12.345.678-9'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Clave SII Representante
                </label>
                <Input
                  {...register('clave_sii_representante')}
                  placeholder='Clave SII del representante'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Clave Única
                </label>
                <Input {...register('clave_unica')} placeholder='Clave única' />
              </div>

              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Certificado Digital
                </label>
                <Input
                  {...register('certificado_digital')}
                  placeholder='Número de certificado digital'
                />
              </div>
            </div>
          </Card>

          {/* Datos Financieros */}
          <Card className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Datos Financieros
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Total Facturado
                </label>
                <Input
                  {...register('total_facturado', { valueAsNumber: true })}
                  type='number'
                  placeholder='0'
                  className={cn(errors.total_facturado && 'border-red-500')}
                />
                {errors.total_facturado && (
                  <p className='text-sm text-red-600 mt-1'>
                    {errors.total_facturado.message}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Número de Facturas
                </label>
                <Input
                  {...register('numero_facturas', { valueAsNumber: true })}
                  type='number'
                  placeholder='0'
                  className={cn(errors.numero_facturas && 'border-red-500')}
                />
                {errors.numero_facturas && (
                  <p className='text-sm text-red-600 mt-1'>
                    {errors.numero_facturas.message}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Promedio Factura
                </label>
                <Input
                  {...register('promedio_factura', { valueAsNumber: true })}
                  type='number'
                  placeholder='0'
                  className={cn(errors.promedio_factura && 'border-red-500')}
                />
                {errors.promedio_factura && (
                  <p className='text-sm text-red-600 mt-1'>
                    {errors.promedio_factura.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleCancel}>
              <X className='h-4 w-4 mr-2' />
              Cancelar
            </Button>
            <Button type='submit' disabled={!isValid || loading}>
              <Save className='h-4 w-4 mr-2' />
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClienteForm;
