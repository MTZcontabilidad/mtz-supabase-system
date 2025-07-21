import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ShoppingCart,
  Calendar,
  User,
  FileText,
  DollarSign,
  Percent,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';

// Esquema de validación con Zod
const ventaSchema = z.object({
  fecha_emision: z.string().min(1, 'La fecha de emisión es requerida'),
  cliente: z
    .string()
    .min(2, 'El cliente debe tener al menos 2 caracteres')
    .max(100, 'El cliente no puede exceder 100 caracteres'),
  numero_factura: z
    .string()
    .min(1, 'El número de factura es requerido')
    .max(20, 'El número de factura no puede exceder 20 caracteres'),
  descripcion: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  subtotal: z
    .string()
    .regex(/^[0-9,]+$/, 'Solo números permitidos')
    .transform(val => parseFloat(val.replace(/,/g, '')) || 0),
  tasaIva: z
    .string()
    .regex(/^[0-9.]+$/, 'Solo números permitidos')
    .transform(val => parseFloat(val) || 0.19),
  iva: z
    .string()
    .regex(/^[0-9,]+$/, 'Solo números permitidos')
    .transform(val => parseFloat(val.replace(/,/g, '')) || 0),
  monto_total: z
    .string()
    .regex(/^[0-9,]+$/, 'Solo números permitidos')
    .transform(val => parseFloat(val.replace(/,/g, '')) || 0),
  estado: z.enum(['pendiente', 'pagado', 'vencido', 'cancelado'], {
    required_error: 'Debe seleccionar un estado',
  }),
  forma_pago: z.enum(['efectivo', 'transferencia', 'cheque', 'tarjeta'], {
    required_error: 'Debe seleccionar una forma de pago',
  }),
  fecha_vencimiento: z.string().optional().or(z.literal('')),
  observaciones: z
    .string()
    .max(1000, 'Las observaciones no pueden exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
});

/**
 * Componente de formulario para ventas
 * Maneja creación y edición de ventas con validación avanzada
 */
const VentaForm = ({
  venta = null,
  onSubmit,
  onCancel,
  loading = false,
  calcularTotales,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(ventaSchema),
    defaultValues: venta || {
      fecha_emision: new Date().toISOString().split('T')[0],
      cliente: '',
      numero_factura: '',
      descripcion: '',
      subtotal: '0',
      tasaIva: '0.19',
      iva: '0',
      monto_total: '0',
      estado: 'pendiente',
      forma_pago: 'transferencia',
      fecha_vencimiento: '',
      observaciones: '',
    },
  });

  const watchedValues = watch(['subtotal', 'tasaIva']);

  // Calcular IVA y total automáticamente
  React.useEffect(() => {
    const subtotal = parseFloat(watchedValues[0]?.replace(/,/g, '') || 0);
    const tasaIva = parseFloat(watchedValues[1] || 0.19);

    if (subtotal > 0) {
      const { iva, total } = calcularTotales(subtotal, tasaIva);
      setValue('iva', iva);
      setValue('monto_total', total);
    }
  }, [watchedValues, setValue, calcularTotales]);

  // Calcular validación en tiempo real
  const isFormValid = Object.keys(errors).length === 0;

  const handleFormSubmit = async data => {
    try {
      await onSubmit(data);
      if (!venta) {
        reset(); // Solo resetear si es creación
      }
    } catch (error) {
      console.error('Error en formulario:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
      <Card className='p-6'>
        <div className='flex items-center gap-2 mb-6'>
          <ShoppingCart className='h-5 w-5 text-blue-600' />
          <h3 className='text-lg font-semibold'>
            {venta ? 'Editar Venta' : 'Nueva Venta'}
          </h3>
        </div>

        {/* Información Básica */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Input
              label='Fecha de Emisión *'
              icon={<Calendar className='h-4 w-4' />}
              type='date'
              {...register('fecha_emision')}
              error={errors.fecha_emision?.message}
            />
          </div>

          <div>
            <Input
              label='Número de Factura *'
              icon={<FileText className='h-4 w-4' />}
              placeholder='001-2024'
              {...register('numero_factura')}
              error={errors.numero_factura?.message}
            />
          </div>

          <div className='md:col-span-2'>
            <Input
              label='Cliente *'
              icon={<User className='h-4 w-4' />}
              placeholder='Nombre del cliente'
              {...register('cliente')}
              error={errors.cliente?.message}
            />
          </div>
        </div>

        {/* Descripción */}
        <div className='mb-6'>
          <Textarea
            label='Descripción de la Venta *'
            placeholder='Descripción detallada de los productos o servicios'
            rows={3}
            {...register('descripcion')}
            error={errors.descripcion?.message}
          />
        </div>

        {/* Montos */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          <div>
            <Input
              label='Subtotal *'
              icon={<DollarSign className='h-4 w-4' />}
              placeholder='1,000,000'
              {...register('subtotal')}
              error={errors.subtotal?.message}
            />
          </div>

          <div>
            <Input
              label='Tasa IVA (%)'
              icon={<Percent className='h-4 w-4' />}
              placeholder='19'
              {...register('tasaIva')}
              error={errors.tasaIva?.message}
            />
          </div>

          <div>
            <Input
              label='IVA'
              icon={<DollarSign className='h-4 w-4' />}
              readOnly
              {...register('iva')}
              error={errors.iva?.message}
            />
          </div>

          <div className='md:col-span-3'>
            <Input
              label='Total *'
              icon={<DollarSign className='h-4 w-4' />}
              readOnly
              {...register('monto_total')}
              error={errors.monto_total?.message}
            />
          </div>
        </div>

        {/* Estado y Forma de Pago */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Select
              label='Estado *'
              {...register('estado')}
              error={errors.estado?.message}
            >
              <option value=''>Seleccionar estado</option>
              <option value='pendiente'>Pendiente</option>
              <option value='pagado'>Pagado</option>
              <option value='vencido'>Vencido</option>
              <option value='cancelado'>Cancelado</option>
            </Select>
          </div>

          <div>
            <Select
              label='Forma de Pago *'
              {...register('forma_pago')}
              error={errors.forma_pago?.message}
            >
              <option value=''>Seleccionar forma de pago</option>
              <option value='efectivo'>Efectivo</option>
              <option value='transferencia'>Transferencia</option>
              <option value='cheque'>Cheque</option>
              <option value='tarjeta'>Tarjeta</option>
            </Select>
          </div>
        </div>

        {/* Fecha de Vencimiento */}
        <div className='mb-6'>
          <Input
            label='Fecha de Vencimiento'
            icon={<Calendar className='h-4 w-4' />}
            type='date'
            {...register('fecha_vencimiento')}
            error={errors.fecha_vencimiento?.message}
          />
        </div>

        {/* Observaciones */}
        <div className='mb-6'>
          <Textarea
            label='Observaciones'
            placeholder='Observaciones adicionales sobre la venta'
            rows={3}
            {...register('observaciones')}
            error={errors.observaciones?.message}
          />
        </div>

        {/* Indicador de Validación */}
        <div className='mt-4 p-3 rounded-lg border'>
          <div className='flex items-center gap-2'>
            {isFormValid ? (
              <>
                <CheckCircle className='h-4 w-4 text-green-600' />
                <span className='text-sm text-green-600 font-medium'>
                  Formulario válido
                </span>
              </>
            ) : (
              <>
                <AlertCircle className='h-4 w-4 text-red-600' />
                <span className='text-sm text-red-600 font-medium'>
                  Hay errores en el formulario
                </span>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Botones de Acción */}
      <div className='flex justify-end gap-4'>
        <Button
          type='button'
          variant='outline'
          onClick={handleCancel}
          disabled={loading || isSubmitting}
        >
          Cancelar
        </Button>

        <Button
          type='submit'
          loading={loading || isSubmitting}
          disabled={!isFormValid}
        >
          {venta ? 'Actualizar Venta' : 'Crear Venta'}
        </Button>
      </div>
    </form>
  );
};

export default VentaForm;
