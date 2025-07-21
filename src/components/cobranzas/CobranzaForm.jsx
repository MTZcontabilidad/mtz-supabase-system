import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CreditCard,
  Calendar,
  User,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  CheckSquare,
  Square,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';

// Esquema de validación con Zod
const cobranzaSchema = z.object({
  fecha_creacion: z.string().min(1, 'La fecha de creación es requerida'),
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
  monto: z
    .string()
    .regex(/^[0-9,]+$/, 'Solo números permitidos')
    .transform(val => parseFloat(val.replace(/,/g, '')) || 0),
  fecha_vencimiento: z.string().min(1, 'La fecha de vencimiento es requerida'),
  estado: z.enum(['pendiente', 'pagado', 'vencido', 'cancelado', 'parcial'], {
    required_error: 'Debe seleccionar un estado',
  }),
  metodo_pago: z.enum(
    ['efectivo', 'transferencia', 'cheque', 'tarjeta', 'otro'],
    {
      required_error: 'Debe seleccionar un método de pago',
    }
  ),
  monto_pagado: z
    .string()
    .regex(/^[0-9,]*$/, 'Solo números permitidos')
    .transform(val => parseFloat(val.replace(/,/g, '')) || 0)
    .optional()
    .or(z.literal('')),
  fecha_pago: z.string().optional().or(z.literal('')),
  recordatorio_enviado: z.boolean().default(false),
  notas: z
    .string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
});

/**
 * Componente de formulario para cobranzas
 * Maneja creación y edición de cobranzas con validación avanzada
 */
const CobranzaForm = ({
  cobranza = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(cobranzaSchema),
    defaultValues: cobranza || {
      fecha_creacion: new Date().toISOString().split('T')[0],
      cliente: '',
      numero_factura: '',
      descripcion: '',
      monto: '0',
      fecha_vencimiento: '',
      estado: 'pendiente',
      metodo_pago: 'transferencia',
      monto_pagado: '',
      fecha_pago: '',
      recordatorio_enviado: false,
      notas: '',
    },
  });

  const watchedValues = watch(['monto', 'monto_pagado', 'estado']);

  // Calcular validación en tiempo real
  const isFormValid = Object.keys(errors).length === 0;

  // Calcular monto pendiente
  const montoPendiente = React.useMemo(() => {
    const monto = parseFloat(watchedValues[0]?.replace(/,/g, '') || 0);
    const pagado = parseFloat(watchedValues[1]?.replace(/,/g, '') || 0);
    return Math.max(0, monto - pagado);
  }, [watchedValues]);

  // Actualizar estado automáticamente
  React.useEffect(() => {
    const monto = parseFloat(watchedValues[0]?.replace(/,/g, '') || 0);
    const pagado = parseFloat(watchedValues[1]?.replace(/,/g, '') || 0);

    if (pagado >= monto && monto > 0) {
      setValue('estado', 'pagado');
    } else if (pagado > 0 && pagado < monto) {
      setValue('estado', 'parcial');
    } else if (watchedValues[2] === 'pagado' && pagado === 0) {
      setValue('estado', 'pendiente');
    }
  }, [watchedValues, setValue]);

  const handleFormSubmit = async data => {
    try {
      await onSubmit(data);
      if (!cobranza) {
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
          <CreditCard className='h-5 w-5 text-blue-600' />
          <h3 className='text-lg font-semibold'>
            {cobranza ? 'Editar Cobranza' : 'Nueva Cobranza'}
          </h3>
        </div>

        {/* Información Básica */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Input
              label='Fecha de Creación *'
              icon={<Calendar className='h-4 w-4' />}
              type='date'
              {...register('fecha_creacion')}
              error={errors.fecha_creacion?.message}
            />
          </div>

          <div>
            <Input
              label='Fecha de Vencimiento *'
              icon={<Clock className='h-4 w-4' />}
              type='date'
              {...register('fecha_vencimiento')}
              error={errors.fecha_vencimiento?.message}
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

          <div>
            <Input
              label='Número de Factura *'
              icon={<FileText className='h-4 w-4' />}
              placeholder='001-2024'
              {...register('numero_factura')}
              error={errors.numero_factura?.message}
            />
          </div>

          <div>
            <Input
              label='Monto Total *'
              icon={<DollarSign className='h-4 w-4' />}
              placeholder='1,000,000'
              {...register('monto')}
              error={errors.monto?.message}
            />
          </div>
        </div>

        {/* Descripción */}
        <div className='mb-6'>
          <Textarea
            label='Descripción de la Cobranza *'
            placeholder='Descripción detallada de la cobranza'
            rows={3}
            {...register('descripcion')}
            error={errors.descripcion?.message}
          />
        </div>

        {/* Información de Pago */}
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
              <option value='parcial'>Pago Parcial</option>
              <option value='vencido'>Vencido</option>
              <option value='cancelado'>Cancelado</option>
            </Select>
          </div>

          <div>
            <Select
              label='Método de Pago *'
              {...register('metodo_pago')}
              error={errors.metodo_pago?.message}
            >
              <option value=''>Seleccionar método</option>
              <option value='efectivo'>Efectivo</option>
              <option value='transferencia'>Transferencia</option>
              <option value='cheque'>Cheque</option>
              <option value='tarjeta'>Tarjeta</option>
              <option value='otro'>Otro</option>
            </Select>
          </div>
        </div>

        {/* Montos */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          <div>
            <Input
              label='Monto Pagado'
              icon={<DollarSign className='h-4 w-4' />}
              placeholder='0'
              {...register('monto_pagado')}
              error={errors.monto_pagado?.message}
            />
          </div>

          <div>
            <Input
              label='Monto Pendiente'
              icon={<DollarSign className='h-4 w-4' />}
              value={montoPendiente.toLocaleString()}
              readOnly
              className='bg-gray-50'
            />
          </div>

          <div>
            <Input
              label='Fecha de Pago'
              icon={<Calendar className='h-4 w-4' />}
              type='date'
              {...register('fecha_pago')}
              error={errors.fecha_pago?.message}
            />
          </div>
        </div>

        {/* Recordatorio */}
        <div className='mb-6'>
          <div className='flex items-center gap-3'>
            <input
              type='checkbox'
              id='recordatorio'
              {...register('recordatorio_enviado')}
              className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
            />
            <label
              htmlFor='recordatorio'
              className='text-sm font-medium text-gray-700'
            >
              Recordatorio enviado al cliente
            </label>
          </div>
        </div>

        {/* Observaciones */}
        <div className='mb-6'>
          <Textarea
            label='Notas'
            placeholder='Notas adicionales sobre la cobranza'
            rows={3}
            {...register('notas')}
            error={errors.notas?.message}
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
          {cobranza ? 'Actualizar Cobranza' : 'Crear Cobranza'}
        </Button>
      </div>
    </form>
  );
};

export default CobranzaForm;
