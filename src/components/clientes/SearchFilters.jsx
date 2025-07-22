import React, { useState, useCallback, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import { cn  } from '../../utils/helpers.js';
import {
  ESTADOS_CLIENTE,
  TIPOS_EMPRESA,
  REGIONES_CHILE,
} from '@/utils/constants.js';

/**
 * SearchFilters Component
 * Filtros avanzados para búsqueda de clientes.
 * Soporta múltiples criterios y filtros combinados.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.clientes - Lista completa de clientes
 * @param {Function} props.onFilter - Callback con clientes filtrados
 * @param {boolean} props.showFilters - Si mostrar filtros expandidos
 * @param {Function} props.onToggleFilters - Callback para toggle de filtros
 */
const SearchFilters = ({
  clientes = [],
  onFilter,
  showFilters = false,
  onToggleFilters,
  className = '',
}) => {
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    tipoEmpresa: '',
    region: '',
    categoria: '',
    minFacturacion: '',
    maxFacturacion: '',
    fechaDesde: '',
    fechaHasta: '',
  });

  // Aplicar filtros
  const applyFilters = newFilters => {
    const filtered = clientes.filter(cliente => {
      // Búsqueda general
      if (newFilters.search) {
        const searchLower = newFilters.search.toLowerCase();
        const matchesSearch =
          cliente.razon_social?.toLowerCase().includes(searchLower) ||
          cliente.rut?.includes(searchLower) ||
          cliente.email?.toLowerCase().includes(searchLower) ||
          cliente.id_cliente?.includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Filtro por estado
      if (newFilters.estado && cliente.estado !== newFilters.estado) {
        return false;
      }

      // Filtro por tipo de empresa
      if (
        newFilters.tipoEmpresa &&
        cliente.tipo_empresa !== newFilters.tipoEmpresa
      ) {
        return false;
      }

      // Filtro por región (aproximado)
      if (
        newFilters.region &&
        !cliente.direccion_completa?.includes(newFilters.region)
      ) {
        return false;
      }

      // Filtro por categoría
      if (
        newFilters.categoria &&
        cliente.categoria_cliente !== newFilters.categoria
      ) {
        return false;
      }

      // Filtro por facturación mínima
      if (newFilters.minFacturacion) {
        const minFact = parseFloat(newFilters.minFacturacion);
        if (parseFloat(cliente.total_facturado || 0) < minFact) {
          return false;
        }
      }

      // Filtro por facturación máxima
      if (newFilters.maxFacturacion) {
        const maxFact = parseFloat(newFilters.maxFacturacion);
        if (parseFloat(cliente.total_facturado || 0) > maxFact) {
          return false;
        }
      }

      // Filtro por fecha de registro
      if (newFilters.fechaDesde) {
        const fechaDesde = new Date(newFilters.fechaDesde);
        const fechaCliente = new Date(cliente.fecha_registro);
        if (fechaCliente < fechaDesde) {
          return false;
        }
      }

      if (newFilters.fechaHasta) {
        const fechaHasta = new Date(newFilters.fechaHasta);
        const fechaCliente = new Date(cliente.fecha_registro);
        if (fechaCliente > fechaHasta) {
          return false;
        }
      }

      return true;
    });

    onFilter(filtered);
  };

  // Manejar cambio de filtro
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      estado: '',
      tipoEmpresa: '',
      region: '',
      categoria: '',
      minFacturacion: '',
      maxFacturacion: '',
      fechaDesde: '',
      fechaHasta: '',
    };
    setFilters(emptyFilters);
    onFilter(clientes);
  };

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(
    value => value !== ''
  ).length;

  return (
    <Card className={cn('p-4', className)}>
      {/* Header de filtros */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <Filter className='h-5 w-5 text-gray-600' />
          <h3 className='text-lg font-medium text-gray-900'>Filtros</h3>
          {activeFiltersCount > 0 && (
            <Badge variant='primary' size='sm'>
              {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <div className='flex items-center gap-2'>
          {activeFiltersCount > 0 && (
            <Button variant='ghost' size='sm' onClick={clearFilters}>
              <X className='h-4 w-4 mr-1' />
              Limpiar
            </Button>
          )}

          <Button variant='outline' size='sm' onClick={onToggleFilters}>
            {showFilters ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </Button>
        </div>
      </div>

      {/* Búsqueda principal */}
      <div className='mb-4'>
        <Input
          type='text'
          placeholder='Buscar por nombre, RUT, email o código...'
          value={filters.search}
          onChange={e => handleFilterChange('search', e.target.value)}
          className='w-full'
        />
      </div>

      {/* Filtros expandibles */}
      {showFilters && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200'>
          {/* Estado */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Estado
            </label>
            <select
              value={filters.estado}
              onChange={e => handleFilterChange('estado', e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Todos los estados</option>
              {ESTADOS_CLIENTE.map(estado => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Empresa */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Tipo de Empresa
            </label>
            <select
              value={filters.tipoEmpresa}
              onChange={e => handleFilterChange('tipoEmpresa', e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Todos los tipos</option>
              {TIPOS_EMPRESA.map(tipo => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          {/* Región */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Región
            </label>
            <select
              value={filters.region}
              onChange={e => handleFilterChange('region', e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Todas las regiones</option>
              {REGIONES_CHILE.map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Categoría */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Categoría
            </label>
            <select
              value={filters.categoria}
              onChange={e => handleFilterChange('categoria', e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Todas las categorías</option>
              <option value='VIP'>VIP</option>
              <option value='Premium'>Premium</option>
              <option value='Top'>Top</option>
              <option value='Regular'>Regular</option>
              <option value='Medio'>Medio</option>
              <option value='Bajo'>Bajo</option>
            </select>
          </div>

          {/* Facturación Mínima */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Facturación Mínima
            </label>
            <Input
              type='number'
              placeholder='0'
              value={filters.minFacturacion}
              onChange={e =>
                handleFilterChange('minFacturacion', e.target.value)
              }
            />
          </div>

          {/* Facturación Máxima */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Facturación Máxima
            </label>
            <Input
              type='number'
              placeholder='Sin límite'
              value={filters.maxFacturacion}
              onChange={e =>
                handleFilterChange('maxFacturacion', e.target.value)
              }
            />
          </div>

          {/* Fecha Desde */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Fecha Desde
            </label>
            <Input
              type='date'
              value={filters.fechaDesde}
              onChange={e => handleFilterChange('fechaDesde', e.target.value)}
            />
          </div>

          {/* Fecha Hasta */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Fecha Hasta
            </label>
            <Input
              type='date'
              value={filters.fechaHasta}
              onChange={e => handleFilterChange('fechaHasta', e.target.value)}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default SearchFilters;
