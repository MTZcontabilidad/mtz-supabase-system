import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, Button, Input, Badge } from '../../ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../ui/Dialog';
import {
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Save,
  X,
} from 'lucide-react';

// Esquema de validación
const clienteSchema = z.object({
  nombre_empresa: z.string().min(1, 'Nombre de empresa es requerido'),
  rut: z.string().min(1, 'RUT es requerido'),
  nombre_contacto: z.string().min(1, 'Nombre de contacto es requerido'),
  email: z.string().email('Email inválido').min(1, 'Email es requerido'),
  telefono: z.string().min(1, 'Teléfono es requerido'),
  direccion: z.string().min(1, 'Dirección es requerida'),
  ciudad: z.string().min(1, 'Ciudad es requerida'),
  region: z.string().min(1, 'Región es requerida'),
  tipo_empresa: z.string().min(1, 'Tipo de empresa es requerido'),
  estado: z.string().default('activo'),
});

const ClienteForm = ({ isOpen, onClose, cliente = null, onSave }) => {
  const [loading, setLoading] = useState(false);
  const isEdit = !!cliente;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre_empresa: '',
      rut: '',
      nombre_contacto: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      region: '',
      tipo_empresa: 'empresa',
      estado: 'activo',
    },
  });

  // Cargar datos del cliente si estamos editando
  useEffect(() => {
    if (isEdit && cliente) {
      Object.keys(cliente).forEach(key => {
        setValue(key, cliente[key]);
      });
    } else {
      reset();
    }
  }, [cliente, isEdit, setValue, reset]);

  const onSubmit = async data => {
    setLoading(true);
    try {
      await onSave(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error guardando cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Building2 className='w-5 h-5' />
            {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Información de la Empresa */}
          <Card className='p-4'>
            <h3 className='text-lg font-medium mb-4 flex items-center gap-2'>
              <Building2 className='w-5 h-5' />
              Información de la Empresa
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                label='Nombre de la Empresa'
                {...register('nombre_empresa')}
                error={errors.nombre_empresa?.message}
                placeholder='Empresa S.A.'
              />
              <Input
                label='RUT'
                {...register('rut')}
                error={errors.rut?.message}
                placeholder='12.345.678-9'
              />
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Tipo de Empresa
                </label>
                <select
                  {...register('tipo_empresa')}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value='empresa'>Empresa</option>
                  <option value='startup'>Startup</option>
                  <option value='corporacion'>Corporación</option>
                  <option value='pyme'>PYME</option>
                  <option value='ong'>ONG</option>
                </select>
                {errors.tipo_empresa && (
                  <p className='text-sm text-red-600 mt-1'>
                    {errors.tipo_empresa.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Información de Contacto */}
          <Card className='p-4'>
            <h3 className='text-lg font-medium mb-4 flex items-center gap-2'>
              <User className='w-5 h-5' />
              Información de Contacto
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                label='Nombre de Contacto'
                {...register('nombre_contacto')}
                error={errors.nombre_contacto?.message}
                placeholder='Juan Pérez'
              />
              <Input
                label='Email'
                type='email'
                {...register('email')}
                error={errors.email?.message}
                placeholder='contacto@empresa.com'
              />
              <Input
                label='Teléfono'
                {...register('telefono')}
                error={errors.telefono?.message}
                placeholder='+56 9 1234 5678'
              />
            </div>
          </Card>

          {/* Dirección */}
          <Card className='p-4'>
            <h3 className='text-lg font-medium mb-4 flex items-center gap-2'>
              <MapPin className='w-5 h-5' />
              Ubicación
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='md:col-span-2'>
                <Input
                  label='Dirección'
                  {...register('direccion')}
                  error={errors.direccion?.message}
                  placeholder='Av. Providencia 123, Oficina 456'
                />
              </div>
              <Input
                label='Ciudad'
                {...register('ciudad')}
                error={errors.ciudad?.message}
                placeholder='Santiago'
              />
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Región
                </label>
                <select
                  {...register('region')}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value=''>Seleccionar región</option>
                  <option value='metropolitana'>Región Metropolitana</option>
                  <option value='valparaiso'>Región de Valparaíso</option>
                  <option value='biobio'>Región del Bío-Bío</option>
                  <option value='araucania'>Región de la Araucanía</option>
                  <option value='los_lagos'>Región de Los Lagos</option>
                  <option value='maule'>Región del Maule</option>
                  <option value='antofagasta'>Región de Antofagasta</option>
                  <option value='atacama'>Región de Atacama</option>
                  <option value='coquimbo'>Región de Coquimbo</option>
                  <option value='ohiggins'>Región de O'Higgins</option>
                  <option value='los_rios'>Región de Los Ríos</option>
                  <option value='aysen'>Región de Aysén</option>
                  <option value='magallanes'>Región de Magallanes</option>
                  <option value='arica'>Región de Arica y Parinacota</option>
                  <option value='tarapaca'>Región de Tarapacá</option>
                </select>
                {errors.region && (
                  <p className='text-sm text-red-600 mt-1'>
                    {errors.region.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Estado */}
          {isEdit && (
            <Card className='p-4'>
              <h3 className='text-lg font-medium mb-4 flex items-center gap-2'>
                <FileText className='w-5 h-5' />
                Estado
              </h3>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Estado del Cliente
                </label>
                <select
                  {...register('estado')}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value='activo'>Activo</option>
                  <option value='inactivo'>Inactivo</option>
                  <option value='prospecto'>Prospecto</option>
                  <option value='suspendido'>Suspendido</option>
                </select>
              </div>
            </Card>
          )}

          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancelar
            </Button>
            <Button type='submit' loading={loading}>
              <Save className='w-4 h-4 mr-2' />
              {isEdit ? 'Actualizar' : 'Guardar'} Cliente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClienteForm;