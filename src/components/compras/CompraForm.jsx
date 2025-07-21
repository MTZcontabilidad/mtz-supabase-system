import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ShoppingBag,
  Calendar,
  Building,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Tag,
  User,
  MessageSquare,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';

// Esquema de validación con Zod
const compraSchema = z.object({
  fecha_solicitud: z.string().min(1, 'La fecha de solicitud es requerida'),
  proveedor: z
    .string()
    .min(2, 'El proveedor debe tener al menos 2 caracteres')
    .max(100, 'El proveedor no puede exceder 100 caracteres'),
  descripcion: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  categoria: z.string().min(1, 'Debe seleccionar una categoría'),
  monto: z
    .string()
    .regex(/^[0-9,]+$/, 'Solo números permitidos')
    .transform(val => parseFloat(val.replace(/,/g, '')) || 0),
  estado: z.enum(
    [
      'pendiente',
      'aprobada',
      'rechazada',
      'completada',
      'cancelada',
      'en_proceso',
    ],
    {
      required_error: 'Debe seleccionar un estado',
    }
  ),
  metodo_pago: z.enum(
    ['efectivo', 'transferencia', 'cheque', 'tarjeta', 'credito', 'otro'],
    {
      required_error: 'Debe seleccionar un método de pago',
    }
  ),
  fecha_entrega_esperada: z.string().optional().or(z.literal('')),
  prioridad: z.enum(['baja', 'media', 'alta', 'urgente'], {
    required_error: 'Debe seleccionar una prioridad',
  }),
  justificacion: z
    .string()
    .min(10, 'La justificación debe tener al menos 10 caracteres')
    .max(1000, 'La justificación no puede exceder 1000 caracteres'),
  notas: z
    .string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
});

/**
 * Componente de formulario para compras
 * Maneja creación y edición de compras con validación avanzada
 */
const CompraForm = ({
  compra = null,
  onSubmit,
  onCancel,
  loading = false,
  categorias = [],
  estados = [],
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(compraSchema),
    defaultValues: compra || {
      fecha_solicitud: new Date().toISOString().split('T')[0],
      proveedor: '',
      descripcion: '',
      categoria: '',
      monto: '0',
      estado: 'pendiente',
      metodo_pago: 'transferencia',
      fecha_entrega_esperada: '',
      prioridad: 'media',
      justificacion: '',
      notas: '',
    },
  });

  const watchedValues = watch(['monto', 'estado', 'prioridad']);

  // Calcular validación en tiempo real
  const isFormValid = Object.keys(errors).length === 0;

  // Calcular si requiere aprobación especial
  const requiereAprobacionEspecial = React.useMemo(() => {
    const monto = parseFloat(watchedValues[0]?.replace(/,/g, '') || 0);
    return monto > 1000000; // Más de 1 millón requiere aprobación especial
  }, [watchedValues]);

  const handleFormSubmit = async data => {
    try {
      await onSubmit(data);
      if (!compra) {
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
          <ShoppingBag className='h-5 w-5 text-blue-600' />
          <h3 className='text-lg font-semibold'>
            {compra ? 'Editar Compra' : 'Nueva Solicitud de Compra'}
          </h3>
        </div>

        {/* Información Básica */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Input
              label='Fecha de Solicitud *'
              icon={<Calendar className='h-4 w-4' />}
              type='date'
              {...register('fecha_solicitud')}
              error={errors.fecha_solicitud?.message}
            />
          </div>

          <div>
            <Input
              label='Fecha de Entrega Esperada'
              icon={<Clock className='h-4 w-4' />}
              type='date'
              {...register('fecha_entrega_esperada')}
              error={errors.fecha_entrega_esperada?.message}
            />
          </div>

          <div className='md:col-span-2'>
            <Input
              label='Proveedor *'
              icon={<Building className='h-4 w-4' />}
              placeholder='Nombre del proveedor'
              {...register('proveedor')}
              error={errors.proveedor?.message}
            />
          </div>
        </div>

        {/* Categoría y Monto */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Select
              label='Categoría *'
              icon={<Tag className='h-4 w-4' />}
              {...register('categoria')}
              error={errors.categoria?.message}
            >
              <option value=''>Seleccionar categoría</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Input
              label='Monto *'
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
            label='Descripción de la Compra *'
            placeholder='Descripción detallada de los bienes o servicios a adquirir'
            rows={3}
            {...register('descripcion')}
            error={errors.descripcion?.message}
          />
        </div>

        {/* Justificación */}
        <div className='mb-6'>
          <Textarea
            label='Justificación *'
            placeholder='Justificación de la necesidad de esta compra'
            rows={3}
            {...register('justificacion')}
            error={errors.justificacion?.message}
          />
        </div>

        {/* Estado y Prioridad */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Select
              label='Estado *'
              {...register('estado')}
              error={errors.estado?.message}
            >
              <option value=''>Seleccionar estado</option>
              {estados.map(estado => (
                <option key={estado} value={estado}>
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Select
              label='Prioridad *'
              {...register('prioridad')}
              error={errors.prioridad?.message}
            >
              <option value=''>Seleccionar prioridad</option>
              <option value='baja'>Baja</option>
              <option value='media'>Media</option>
              <option value='alta'>Alta</option>
              <option value='urgente'>Urgente</option>
            </Select>
          </div>
        </div>

        {/* Método de Pago */}
        <div className='mb-6'>
          <Select
            label='Método de Pago *'
            {...register('metodo_pago')}
            error={errors.metodo_pago?.message}
          >
            <option value=''>Seleccionar método de pago</option>
            <option value='efectivo'>Efectivo</option>
            <option value='transferencia'>Transferencia</option>
            <option value='cheque'>Cheque</option>
            <option value='tarjeta'>Tarjeta</option>
            <option value='credito'>Crédito</option>
            <option value='otro'>Otro</option>
          </Select>
        </div>

        {/* Notas */}
        <div className='mb-6'>
          <Textarea
            label='Notas Adicionales'
            placeholder='Notas adicionales sobre la compra'
            rows={3}
            {...register('notas')}
            error={errors.notas?.message}
          />
        </div>

        {/* Indicadores */}
        <div className='space-y-3'>
          {/* Indicador de Aprobación Especial */}
          {requiereAprobacionEspecial && (
            <div className='p-3 rounded-lg border border-yellow-200 bg-yellow-50'>
              <div className='flex items-center gap-2'>
                <AlertCircle className='h-4 w-4 text-yellow-600' />
                <span className='text-sm text-yellow-800 font-medium'>
                  ⚠️ Esta compra requiere aprobación especial por su monto
                </span>
              </div>
            </div>
          )}

          {/* Indicador de Validación */}
          <div className='p-3 rounded-lg border'>
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
          {compra ? 'Actualizar Compra' : 'Crear Solicitud'}
        </Button>
      </div>
    </form>
  );
};

export default CompraForm;
