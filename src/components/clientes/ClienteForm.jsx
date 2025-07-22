import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';

// Esquema de validación con Zod
const clienteSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  razon_social: z
    .string()
    .min(2, 'La razón social debe tener al menos 2 caracteres')
    .max(100, 'La razón social no puede exceder 100 caracteres'),
  rut: z
    .string()
    .min(8, 'El RUT debe tener al menos 8 caracteres')
    .max(12, 'El RUT no puede exceder 12 caracteres')
    .regex(/^[0-9]{7,8}-[0-9kK]$/, 'Formato de RUT inválido'),
  giro: z
    .string()
    .min(5, 'El giro debe tener al menos 5 caracteres')
    .max(200, 'El giro no puede exceder 200 caracteres'),
  direccion: z
    .string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  comuna: z
    .string()
    .min(2, 'La comuna debe tener al menos 2 caracteres')
    .max(50, 'La comuna no puede exceder 50 caracteres'),
  region: z
    .string()
    .min(2, 'La región debe tener al menos 2 caracteres')
    .max(50, 'La región no puede exceder 50 caracteres'),
  telefono: z
    .string()
    .min(8, 'El teléfono debe tener al menos 8 caracteres')
    .max(15, 'El teléfono no puede exceder 15 caracteres')
    .regex(/^[+]?[0-9\s-()]+$/, 'Formato de teléfono inválido'),
  email: z
    .string()
    .email('Formato de email inválido')
    .max(100, 'El email no puede exceder 100 caracteres'),
  sitio_web: z
    .string()
    .url('Formato de sitio web inválido')
    .optional()
    .or(z.literal('')),
  categoria_cliente: z.enum(['Alto', 'Medio', 'Bajo'], {
    required_error: 'Debe seleccionar una categoría',
  }),
  estado: z.enum(['Activo', 'Inactivo', 'Pendiente'], {
    required_error: 'Debe seleccionar un estado',
  }),
  total_facturado: z
    .string()
    .regex(/^[0-9,]+$/, 'Solo números permitidos')
    .transform(val => parseFloat(val.replace(/,/g, '')) || 0),
  servicios_adicionales: z
    .string()
    .max(500, 'Los servicios adicionales no pueden exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  observaciones: z
    .string()
    .max(1000, 'Las observaciones no pueden exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
});

/**
 * Componente de formulario para clientes
 * Maneja creación y edición de clientes con validación avanzada
 */
const ClienteForm = ({
  cliente = null,
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
  } = useForm({
    resolver: zodResolver(clienteSchema),
    defaultValues: cliente || {
      nombre: '',
      razon_social: '',
      rut: '',
      giro: '',
      direccion: '',
      comuna: '',
      region: '',
      telefono: '',
      email: '',
      sitio_web: '',
      categoria_cliente: 'Medio',
      estado: 'Activo',
      total_facturado: '0',
      servicios_adicionales: '',
      observaciones: '',
    },
  });

  // const watchedValues = watch();

  // Calcular validación en tiempo real
  const isFormValid = Object.keys(errors).length === 0;

  const handleFormSubmit = async data => {
    try {
      await onSubmit(data);
      if (!cliente) {
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
          <User className='h-5 w-5 text-blue-600' />
          <h3 className='text-lg font-semibold'>
            {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h3>
        </div>

        {/* Información Básica */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Input
              label='Nombre *'
              icon={<User className='h-4 w-4' />}
              placeholder='Nombre del cliente'
              {...register('nombre')}
              error={errors.nombre?.message}
            />
          </div>

          <div>
            <Input
              label='Razón Social *'
              icon={<Building className='h-4 w-4' />}
              placeholder='Razón social'
              {...register('razon_social')}
              error={errors.razon_social?.message}
            />
          </div>

          <div>
            <Input
              label='RUT *'
              icon={<User className='h-4 w-4' />}
              placeholder='12.345.678-9'
              {...register('rut')}
              error={errors.rut?.message}
            />
          </div>

          <div>
            <Input
              label='Giro Comercial *'
              icon={<Building className='h-4 w-4' />}
              placeholder='Actividad económica'
              {...register('giro')}
              error={errors.giro?.message}
            />
          </div>
        </div>

        {/* Información de Contacto */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Input
              label='Teléfono *'
              icon={<Phone className='h-4 w-4' />}
              placeholder='+56 9 1234 5678'
              {...register('telefono')}
              error={errors.telefono?.message}
            />
          </div>

          <div>
            <Input
              label='Email *'
              icon={<Mail className='h-4 w-4' />}
              placeholder='cliente@empresa.com'
              type='email'
              {...register('email')}
              error={errors.email?.message}
            />
          </div>

          <div>
            <Input
              label='Sitio Web'
              icon={<Globe className='h-4 w-4' />}
              placeholder='https://www.empresa.com'
              {...register('sitio_web')}
              error={errors.sitio_web?.message}
            />
          </div>

          <div>
            <Input
              label='Total Facturado'
              icon={<DollarSign className='h-4 w-4' />}
              placeholder='1,000,000'
              {...register('total_facturado')}
              error={errors.total_facturado?.message}
            />
          </div>
        </div>

        {/* Dirección */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          <div className='md:col-span-2'>
            <Input
              label='Dirección *'
              icon={<MapPin className='h-4 w-4' />}
              placeholder='Calle 123, Oficina 456'
              {...register('direccion')}
              error={errors.direccion?.message}
            />
          </div>

          <div>
            <Input
              label='Comuna *'
              icon={<MapPin className='h-4 w-4' />}
              placeholder='Santiago'
              {...register('comuna')}
              error={errors.comuna?.message}
            />
          </div>

          <div>
            <Input
              label='Región *'
              icon={<MapPin className='h-4 w-4' />}
              placeholder='Metropolitana'
              {...register('region')}
              error={errors.region?.message}
            />
          </div>
        </div>

        {/* Clasificación */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Select
              label='Categoría *'
              {...register('categoria_cliente')}
              error={errors.categoria_cliente?.message}
            >
              <option value=''>Seleccionar categoría</option>
              <option value='Alto'>Alto</option>
              <option value='Medio'>Medio</option>
              <option value='Bajo'>Bajo</option>
            </Select>
          </div>

          <div>
            <Select
              label='Estado *'
              {...register('estado')}
              error={errors.estado?.message}
            >
              <option value=''>Seleccionar estado</option>
              <option value='Activo'>Activo</option>
              <option value='Inactivo'>Inactivo</option>
              <option value='Pendiente'>Pendiente</option>
            </Select>
          </div>
        </div>

        {/* Información Adicional */}
        <div className='space-y-4'>
          <div>
            <Textarea
              label='Servicios Adicionales'
              placeholder='Descripción de servicios adicionales contratados'
              rows={3}
              {...register('servicios_adicionales')}
              error={errors.servicios_adicionales?.message}
            />
          </div>

          <div>
            <Textarea
              label='Observaciones'
              placeholder='Observaciones adicionales sobre el cliente'
              rows={4}
              {...register('observaciones')}
              error={errors.observaciones?.message}
            />
          </div>
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
          {cliente ? 'Actualizar Cliente' : 'Crear Cliente'}
        </Button>
      </div>
    </form>
  );
};

export default ClienteForm;
