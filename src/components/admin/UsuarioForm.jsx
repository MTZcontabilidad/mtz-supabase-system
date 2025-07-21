import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Shield,
  Save,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Hash,
  UserCheck,
  UserX,
  Clock,
  Star,
  Award,
  Zap,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  FileText,
  Users,
  Server,
  Calculator,
  Megaphone,
  Settings,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';

// Esquema de validación con Zod
const usuarioSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .min(5, 'El email debe tener al menos 5 caracteres')
    .max(100, 'El email no puede exceder 100 caracteres'),
  nombre_completo: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  rol_id: z.string().min(1, 'Debe seleccionar un rol'),
  cargo: z
    .string()
    .min(2, 'El cargo debe tener al menos 2 caracteres')
    .max(100, 'El cargo no puede exceder 100 caracteres'),
  telefono: z
    .string()
    .min(8, 'El teléfono debe tener al menos 8 caracteres')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .optional()
    .or(z.literal('')),
  departamento: z.string().min(1, 'Debe seleccionar un departamento'),
  estado: z.enum(
    ['activo', 'inactivo', 'suspendido', 'pendiente_activacion', 'bloqueado'],
    {
      required_error: 'Debe seleccionar un estado',
    }
  ),
  fecha_ingreso: z.string().optional().or(z.literal('')),
  salario: z
    .string()
    .regex(/^[0-9,]+$/, 'Solo números permitidos')
    .transform(val => parseFloat(val.replace(/,/g, '')) || 0)
    .optional()
    .or(z.literal('')),
  direccion: z
    .string()
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .optional()
    .or(z.literal('')),
  notas: z
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
});

/**
 * Componente de formulario para usuarios
 * Maneja creación y edición de usuarios con validación avanzada
 */
const UsuarioForm = ({
  usuario = null,
  onSubmit,
  onCancel,
  loading = false,
  roles = [],
  departamentos = [],
  estados = [],
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(usuarioSchema),
    defaultValues: usuario || {
      email: '',
      nombre_completo: '',
      rol_id: '',
      cargo: '',
      telefono: '',
      departamento: '',
      estado: 'pendiente_activacion',
      fecha_ingreso: '',
      salario: '',
      direccion: '',
      notas: '',
    },
  });

  const watchedValues = watch(['estado', 'rol_id', 'departamento']);

  // Calcular validación en tiempo real
  const isFormValid = Object.keys(errors).length === 0;

  // Determinar si mostrar campos avanzados
  const showAdvancedFields = showAdvanced || usuario;

  const handleFormSubmit = async data => {
    try {
      await onSubmit(data);
      if (!usuario) {
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

  // Obtener icono según departamento
  const getDepartmentIcon = departamento => {
    const icons = {
      Administración: <Building className='h-4 w-4' />,
      Ventas: <TrendingUp className='h-4 w-4' />,
      Cobranzas: <CreditCard className='h-4 w-4' />,
      Compras: <ShoppingBag className='h-4 w-4' />,
      Contratos: <FileText className='h-4 w-4' />,
      RRHH: <Users className='h-4 w-4' />,
      Sistemas: <Server className='h-4 w-4' />,
      Contabilidad: <Calculator className='h-4 w-4' />,
      Marketing: <Megaphone className='h-4 w-4' />,
      Operaciones: <Settings className='h-4 w-4' />,
    };
    return icons[departamento] || <Building className='h-4 w-4' />;
  };

  // Obtener icono según estado
  const getStatusIcon = estado => {
    const icons = {
      activo: <UserCheck className='h-4 w-4' />,
      inactivo: <UserX className='h-4 w-4' />,
      suspendido: <Clock className='h-4 w-4' />,
      pendiente_activacion: <User className='h-4 w-4' />,
      bloqueado: <Shield className='h-4 w-4' />,
    };
    return icons[estado] || <User className='h-4 w-4' />;
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
      <Card className='p-6'>
        <div className='flex items-center gap-2 mb-6'>
          <User className='h-5 w-5 text-blue-600' />
          <h3 className='text-lg font-semibold'>
            {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
        </div>

        {/* Información Básica */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Input
              label='Email *'
              icon={<Mail className='h-4 w-4' />}
              type='email'
              placeholder='usuario@empresa.com'
              {...register('email')}
              error={errors.email?.message}
            />
          </div>

          <div>
            <Input
              label='Nombre Completo *'
              icon={<User className='h-4 w-4' />}
              placeholder='Nombre y Apellido'
              {...register('nombre_completo')}
              error={errors.nombre_completo?.message}
            />
          </div>
        </div>

        {/* Rol y Cargo */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Select
              label='Rol *'
              icon={<Shield className='h-4 w-4' />}
              {...register('rol_id')}
              error={errors.rol_id?.message}
            >
              <option value=''>Seleccionar rol</option>
              {roles.map(rol => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Input
              label='Cargo *'
              icon={<Briefcase className='h-4 w-4' />}
              placeholder='Ej: Gerente de Ventas'
              {...register('cargo')}
              error={errors.cargo?.message}
            />
          </div>
        </div>

        {/* Departamento y Estado */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Select
              label='Departamento *'
              {...register('departamento')}
              error={errors.departamento?.message}
            >
              <option value=''>Seleccionar departamento</option>
              {departamentos.map(depto => (
                <option key={depto} value={depto}>
                  {depto}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Select
              label='Estado *'
              {...register('estado')}
              error={errors.estado?.message}
            >
              <option value=''>Seleccionar estado</option>
              {estados.map(estado => (
                <option key={estado} value={estado}>
                  {estado.charAt(0).toUpperCase() +
                    estado.slice(1).replace('_', ' ')}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Teléfono y Fecha de Ingreso */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Input
              label='Teléfono'
              icon={<Phone className='h-4 w-4' />}
              placeholder='+56 9 1234 5678'
              {...register('telefono')}
              error={errors.telefono?.message}
            />
          </div>

          <div>
            <Input
              label='Fecha de Ingreso'
              icon={<Calendar className='h-4 w-4' />}
              type='date'
              {...register('fecha_ingreso')}
              error={errors.fecha_ingreso?.message}
            />
          </div>
        </div>

        {/* Campos Avanzados */}
        {showAdvancedFields && (
          <>
            {/* Salario y Dirección */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
              <div>
                <Input
                  label='Salario'
                  icon={<Hash className='h-4 w-4' />}
                  placeholder='1,000,000'
                  {...register('salario')}
                  error={errors.salario?.message}
                />
              </div>

              <div>
                <Input
                  label='Dirección'
                  icon={<MapPin className='h-4 w-4' />}
                  placeholder='Dirección completa'
                  {...register('direccion')}
                  error={errors.direccion?.message}
                />
              </div>
            </div>

            {/* Notas */}
            <div className='mb-6'>
              <Textarea
                label='Notas'
                placeholder='Notas adicionales sobre el usuario'
                rows={3}
                {...register('notas')}
                error={errors.notas?.message}
              />
            </div>
          </>
        )}

        {/* Botón para mostrar/ocultar campos avanzados */}
        {!usuario && (
          <div className='mb-6'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? (
                <>
                  <ChevronUp className='h-4 w-4 mr-2' />
                  Ocultar Campos Avanzados
                </>
              ) : (
                <>
                  <ChevronDown className='h-4 w-4 mr-2' />
                  Mostrar Campos Avanzados
                </>
              )}
            </Button>
          </div>
        )}

        {/* Indicadores */}
        <div className='space-y-3'>
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

          {/* Información del Rol */}
          {watchedValues[1] && (
            <div className='p-3 rounded-lg border border-blue-200 bg-blue-50'>
              <div className='flex items-center gap-2'>
                <Shield className='h-4 w-4 text-blue-600' />
                <span className='text-sm text-blue-800 font-medium'>
                  Rol:{' '}
                  {roles.find(r => r.id === watchedValues[1])?.nombre || 'N/A'}
                </span>
              </div>
            </div>
          )}

          {/* Información del Estado */}
          {watchedValues[0] && (
            <div className='p-3 rounded-lg border border-purple-200 bg-purple-50'>
              <div className='flex items-center gap-2'>
                {getStatusIcon(watchedValues[0])}
                <span className='text-sm text-purple-800 font-medium'>
                  Estado:{' '}
                  {watchedValues[0].charAt(0).toUpperCase() +
                    watchedValues[0].slice(1).replace('_', ' ')}
                </span>
              </div>
            </div>
          )}

          {/* Información del Departamento */}
          {watchedValues[2] && (
            <div className='p-3 rounded-lg border border-green-200 bg-green-50'>
              <div className='flex items-center gap-2'>
                {getDepartmentIcon(watchedValues[2])}
                <span className='text-sm text-green-800 font-medium'>
                  Departamento: {watchedValues[2]}
                </span>
              </div>
            </div>
          )}
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
          <Save className='h-4 w-4 mr-2' />
          {usuario ? 'Actualizar Usuario' : 'Crear Usuario'}
        </Button>
      </div>
    </form>
  );
};

export default UsuarioForm;
