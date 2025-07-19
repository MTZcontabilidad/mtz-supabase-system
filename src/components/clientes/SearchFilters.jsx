import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button, Input, Card, Badge } from '../../ui';
import { cn } from '../../../utils/helpers';
import {
  ESTADOS_CLIENTE,
  TIPOS_EMPRESA,
  REGIONES_CHILE,
} from '../../../utils/constants';

/**
 * SearchFilters Component
 * Filtros avanzados para búsqueda de clientes.
 * Soporta múltiples criterios y filtros combinados.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.filters - Filtros actuales
 * @param {Function} props.onFiltersChange - Función para cambiar filtros
 * @param {Function} props.onClearFilters - Función para limpiar filtros
 */
const SearchFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleMultiSelectChange = (key, value) => {
    const currentValues = filters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFiltersChange({
      ...filters,
      [key]: newValues,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.estado?.length) count++;
    if (filters.tipo_empresa?.length) count++;
    if (filters.region?.length) count++;
    if (filters.fecha_desde) count++;
    if (filters.fecha_hasta) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className='p-4 border-l-4 border-l-blue-500'>
      {/* Header de filtros */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <Filter className='w-5 h-5 text-blue-600' />
          <h3 className='font-medium text-gray-900'>Filtros de Búsqueda</h3>
          {activeFiltersCount > 0 && (
            <Badge variant='primary' size='sm'>
              {activeFiltersCount} activos
            </Badge>
          )}
        </div>
        <div className='flex items-center gap-2'>
          {activeFiltersCount > 0 && (
            <Button
              variant='ghost'
              size='sm'
              onClick={onClearFilters}
              className='text-red-600 hover:text-red-700'
            >
              <X className='w-4 h-4 mr-1' />
              Limpiar
            </Button>
          )}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className='w-4 h-4' />
            ) : (
              <ChevronDown className='w-4 h-4' />
            )}
            {isExpanded ? 'Contraer' : 'Expandir'}
          </Button>
        </div>
      </div>

      {/* Búsqueda de texto - siempre visible */}
      <div className='mb-4'>
        <Input
          placeholder='Buscar por nombre, RUT, email o teléfono...'
          value={filters.search || ''}
          onChange={e => handleFilterChange('search', e.target.value)}
          className='w-full'
        />
      </div>

      {/* Filtros expandibles */}
      <div
        className={cn(
          'space-y-4 transition-all duration-300',
          isExpanded ? 'block' : 'hidden'
        )}
      >
        {/* Estados */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Estados
          </label>
          <div className='flex flex-wrap gap-2'>
            {ESTADOS_CLIENTE.map(estado => (
              <Badge
                key={estado.value}
                variant={
                  filters.estado?.includes(estado.value)
                    ? 'primary'
                    : 'outline'
                }
                className='cursor-pointer hover:bg-blue-50 transition-colors'
                onClick={() =>
                  handleMultiSelectChange('estado', estado.value)
                }
              >
                {estado.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tipos de empresa */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Tipos de Empresa
          </label>
          <div className='flex flex-wrap gap-2'>
            {TIPOS_EMPRESA.map(tipo => (
              <Badge
                key={tipo.value}
                variant={
                  filters.tipo_empresa?.includes(tipo.value)
                    ? 'primary'
                    : 'outline'
                }
                className='cursor-pointer hover:bg-blue-50 transition-colors'
                onClick={() =>
                  handleMultiSelectChange('tipo_empresa', tipo.value)
                }
              >
                {tipo.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Regiones */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Regiones
          </label>
          <div className='max-h-32 overflow-y-auto'>
            <div className='flex flex-wrap gap-2'>
              {REGIONES_CHILE.map(region => (
                <Badge
                  key={region.value}
                  variant={
                    filters.region?.includes(region.value)
                      ? 'primary'
                      : 'outline'
                  }
                  size='sm'
                  className='cursor-pointer hover:bg-blue-50 transition-colors'
                  onClick={() =>
                    handleMultiSelectChange('region', region.value)
                  }
                >
                  {region.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Rango de fechas */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Fecha Desde
            </label>
            <input
              type='date'
              value={filters.fecha_desde || ''}
              onChange={e => handleFilterChange('fecha_desde', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Fecha Hasta
            </label>
            <input
              type='date'
              value={filters.fecha_hasta || ''}
              onChange={e => handleFilterChange('fecha_hasta', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
        </div>
      </div>

      {/* Resumen de filtros activos */}
      {activeFiltersCount > 0 && (
        <div className='mt-4 pt-4 border-t border-gray-200'>
          <p className='text-sm text-gray-600'>
            <strong>{activeFiltersCount}</strong> filtro
            {activeFiltersCount !== 1 ? 's' : ''} aplicado
            {activeFiltersCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </Card>
  );
};

export default SearchFilters;