import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Settings, Save, RotateCcw, AlertCircle, CheckCircle, Eye, EyeOff, Calendar, Hash, ToggleLeft, FileText, Globe, Lock, Palette, Bell, Database, Mail, Shield, Code, Link,  } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';

// Esquema de validación con Zod
const configuracionSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  categoria: z.string().min(1, 'Debe seleccionar una categoría'),
  tipo: z.string().min(1, 'Debe seleccionar un tipo'),
  valor: z.string().min(1, 'El valor es requerido'),
  descripcion: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  estado: z.string().min(1, 'Debe seleccionar un estado'),
  editable: z.boolean(),
  requerido: z.boolean(),
  opciones: z.string().optional().or(z.literal('')),
});

/**
 * Componente de formulario para configuraciones del sistema
 * Maneja creación y edición de configuraciones con validación avanzada
 */
const ConfiguracionForm = ({
  configuracion = null,
  onSubmit,
  onCancel,
  onRestore,
  loading = false,
  categorias = [],
  tipos = [],
  estados = [],
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showJsonEditor, setShowJsonEditor] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(configuracionSchema),
    defaultValues: configuracion || {
      nombre: '',
      categoria: '',
      tipo: 'Texto',
      valor: '',
      descripcion: '',
      estado: 'Activo',
      editable: true,
      requerido: false,
      opciones: '',
    },
  });

  const watchedValues = watch(['tipo', 'valor', 'categoria']);

  // Calcular validación en tiempo real
  const isFormValid = Object.keys(errors).length === 0;

  // Determinar si mostrar campos especiales según el tipo
  const showOptionsField = watchedValues[0] === 'Select';
  const showPasswordField = watchedValues[0] === 'Password';
  const showJsonField = watchedValues[0] === 'JSON';
  const showNumberField = watchedValues[0] === 'Número';
  const showDateField = watchedValues[0] === 'Fecha';
  const showUrlField = watchedValues[0] === 'URL';

  const handleFormSubmit = async data => {
    try {
      await onSubmit(data);
      if (!configuracion) {
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

  const handleRestore = () => {
    if (onRestore && configuracion) {
      onRestore(configuracion.id);
    }
  };

  // Obtener icono según categoría
  const getCategoryIcon = categoria => {
    const icons = {
      Sistema: <Settings className='h-4 w-4' />,
      Seguridad: <Shield className='h-4 w-4' />,
      Notificaciones: <Bell className='h-4 w-4' />,
      Apariencia: <Palette className='h-4 w-4' />,
      Integración: <Code className='h-4 w-4' />,
      Backup: <Database className='h-4 w-4' />,
      Email: <Mail className='h-4 w-4' />,
      API: <Globe className='h-4 w-4' />,
    };
    return icons[categoria] || <Settings className='h-4 w-4' />;
  };

  // Obtener icono según tipo
  const getTypeIcon = tipo => {
    const icons = {
      Texto: <FileText className='h-4 w-4' />,
      Número: <Hash className='h-4 w-4' />,
      Booleano: <ToggleLeft className='h-4 w-4' />,
      JSON: <Code className='h-4 w-4' />,
      Fecha: <Calendar className='h-4 w-4' />,
      Select: <FileText className='h-4 w-4' />,
      Password: <Lock className='h-4 w-4' />,
      URL: <Link className='h-4 w-4' />,
    };
    return icons[tipo] || <FileText className='h-4 w-4' />;
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
      <Card className='p-6'>
        <div className='flex items-center gap-2 mb-6'>
          <Settings className='h-5 w-5 text-blue-600' />
          <h3 className='text-lg font-semibold'>
            {configuracion ? 'Editar Configuración' : 'Nueva Configuración'}
          </h3>
        </div>

        {/* Información Básica */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Input
              label='Nombre de la Configuración *'
              placeholder='Ej: Nombre de la Empresa'
              {...register('nombre')}
              error={errors.nombre?.message}
            />
          </div>

          <div>
            <Select
              label='Categoría *'
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
        </div>

        {/* Tipo y Estado */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Select
              label='Tipo de Dato *'
              {...register('tipo')}
              error={errors.tipo?.message}
            >
              <option value=''>Seleccionar tipo</option>
              {tipos.map(tipo => (
                <option key={tipo} value={tipo}>
                  {tipo}
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
                  {estado}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Valor */}
        <div className='mb-6'>
          {showPasswordField ? (
            <div className='relative'>
              <Input
                label='Valor *'
                type={showPassword ? 'text' : 'password'}
                placeholder='Ingrese el valor'
                {...register('valor')}
                error={errors.valor?.message}
              />
              <button
                type='button'
                className='absolute right-3 top-8 text-gray-500 hover:text-gray-700'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>
          ) : showNumberField ? (
            <Input
              label='Valor *'
              type='number'
              placeholder='Ingrese un número'
              {...register('valor')}
              error={errors.valor?.message}
            />
          ) : showDateField ? (
            <Input
              label='Valor *'
              type='date'
              {...register('valor')}
              error={errors.valor?.message}
            />
          ) : showUrlField ? (
            <Input
              label='Valor *'
              type='url'
              placeholder='https://ejemplo.com'
              {...register('valor')}
              error={errors.valor?.message}
            />
          ) : showJsonField ? (
            <div>
              <div className='flex items-center justify-between mb-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Valor JSON *
                </label>
                <button
                  type='button'
                  className='text-sm text-blue-600 hover:text-blue-800'
                  onClick={() => setShowJsonEditor(!showJsonEditor)}
                >
                  {showJsonEditor ? 'Vista Simple' : 'Editor JSON'}
                </button>
              </div>
              {showJsonEditor ? (
                <Textarea
                  placeholder='{"key": "value"}'
                  rows={6}
                  {...register('valor')}
                  error={errors.valor?.message}
                />
              ) : (
                <Input
                  placeholder='{"key": "value"}'
                  {...register('valor')}
                  error={errors.valor?.message}
                />
              )}
            </div>
          ) : (
            <Input
              label='Valor *'
              placeholder='Ingrese el valor'
              {...register('valor')}
              error={errors.valor?.message}
            />
          )}
        </div>

        {/* Opciones para Select */}
        {showOptionsField && (
          <div className='mb-6'>
            <Textarea
              label='Opciones (una por línea) *'
              placeholder='opcion1&#10;opcion2&#10;opcion3'
              rows={4}
              {...register('opciones')}
              error={errors.opciones?.message}
            />
          </div>
        )}

        {/* Descripción */}
        <div className='mb-6'>
          <Textarea
            label='Descripción *'
            placeholder='Descripción detallada de la configuración'
            rows={3}
            {...register('descripcion')}
            error={errors.descripcion?.message}
          />
        </div>

        {/* Opciones de Control */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div className='flex items-center space-x-3'>
            <input
              type='checkbox'
              id='editable'
              {...register('editable')}
              className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
            />
            <label
              htmlFor='editable'
              className='text-sm font-medium text-gray-700'
            >
              Configuración editable
            </label>
          </div>

          <div className='flex items-center space-x-3'>
            <input
              type='checkbox'
              id='requerido'
              {...register('requerido')}
              className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
            />
            <label
              htmlFor='requerido'
              className='text-sm font-medium text-gray-700'
            >
              Configuración requerida
            </label>
          </div>
        </div>

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

          {/* Información del tipo */}
          {watchedValues[0] && (
            <div className='p-3 rounded-lg border border-blue-200 bg-blue-50'>
              <div className='flex items-center gap-2'>
                {getTypeIcon(watchedValues[0])}
                <span className='text-sm text-blue-800 font-medium'>
                  Tipo: {watchedValues[0]}
                </span>
              </div>
              <p className='text-xs text-blue-600 mt-1'>
                {watchedValues[0] === 'JSON' && 'Ingrese un objeto JSON válido'}
                {watchedValues[0] === 'Password' &&
                  'El valor se mostrará oculto'}
                {watchedValues[0] === 'Select' &&
                  'Defina las opciones disponibles'}
                {watchedValues[0] === 'URL' && 'Ingrese una URL válida'}
                {watchedValues[0] === 'Fecha' && 'Seleccione una fecha'}
                {watchedValues[0] === 'Número' && 'Ingrese un valor numérico'}
                {watchedValues[0] === 'Booleano' && 'Use true/false o 1/0'}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Botones de Acción */}
      <div className='flex justify-end gap-4'>
        {configuracion && onRestore && (
          <Button
            type='button'
            variant='outline'
            onClick={handleRestore}
            disabled={loading || isSubmitting}
          >
            <RotateCcw className='h-4 w-4 mr-2' />
            Restaurar
          </Button>
        )}

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
          {configuracion ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

export default ConfiguracionForm;
