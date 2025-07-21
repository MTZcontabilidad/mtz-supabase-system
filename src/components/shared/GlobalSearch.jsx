import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building, FileText, DollarSign, User, X } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Iconos por tipo de resultado
  const getIcon = type => {
    switch (type) {
      case 'empresa':
        return <Building className='w-4 h-4 text-blue-600' />;
      case 'venta':
        return <FileText className='w-4 h-4 text-green-600' />;
      case 'cobranza':
        return <DollarSign className='w-4 h-4 text-yellow-600' />;
      case 'usuario':
        return <User className='w-4 h-4 text-purple-600' />;
      default:
        return <Search className='w-4 h-4 text-gray-400' />;
    }
  };

  // Función de búsqueda
  const search = async searchTerm => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const allResults = [];

      // Buscar empresas
      const { data: empresas } = await supabase
        .from('empresas')
        .select('id, nombre, ruc, estado')
        .ilike('nombre', `%${searchTerm}%`)
        .limit(5);

      if (empresas) {
        empresas.forEach(empresa => {
          allResults.push({
            id: empresa.id,
            title: empresa.nombre,
            subtitle: `RUC: ${empresa.ruc}`,
            type: 'empresa',
            status: empresa.estado,
            route: '/empresas',
          });
        });
      }

      // Buscar ventas
      const { data: ventas } = await supabase
        .from('ventas')
        .select('id, numero_factura, monto_total, fecha_emision, estado')
        .ilike('numero_factura', `%${searchTerm}%`)
        .limit(5);

      if (ventas) {
        ventas.forEach(venta => {
          allResults.push({
            id: venta.id,
            title: `Factura ${venta.numero_factura}`,
            subtitle: `$${venta.monto_total?.toLocaleString()} - ${new Date(venta.fecha_emision).toLocaleDateString()}`,
            type: 'venta',
            status: venta.estado,
            route: '/ventas',
          });
        });
      }

      // Buscar cobranzas
      const { data: cobranzas } = await supabase
        .from('cobranzas')
        .select('id, numero_factura, monto, fecha_vencimiento, estado')
        .ilike('numero_factura', `%${searchTerm}%`)
        .limit(5);

      if (cobranzas) {
        cobranzas.forEach(cobranza => {
          allResults.push({
            id: cobranza.id,
            title: `Cobranza ${cobranza.numero_factura}`,
            subtitle: `$${cobranza.monto?.toLocaleString()} - Vence: ${new Date(cobranza.fecha_vencimiento).toLocaleDateString()}`,
            type: 'cobranza',
            status: cobranza.estado,
            route: '/cobranza',
          });
        });
      }

      // Buscar usuarios
      const { data: usuarios } = await supabase
        .from('usuarios')
        .select('id, email, nombre, apellido, estado')
        .or(
          `email.ilike.%${searchTerm}%,nombre.ilike.%${searchTerm}%,apellido.ilike.%${searchTerm}%`
        )
        .limit(5);

      if (usuarios) {
        usuarios.forEach(usuario => {
          allResults.push({
            id: usuario.id,
            title: `${usuario.nombre} ${usuario.apellido}`,
            subtitle: usuario.email,
            type: 'usuario',
            status: usuario.estado,
            route: '/admin/users',
          });
        });
      }

      setResults(allResults.slice(0, 10)); // Máximo 10 resultados
    } catch (error) {
      console.error('Error en búsqueda global:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce para la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        search(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Manejar teclas
  const handleKeyDown = e => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleResultClick(results[selectedIndex]);
    }
  };

  // Manejar clic en resultado
  const handleResultClick = result => {
    navigate(result.route);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(-1);
  };

  // Manejar clic fuera del componente
  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative flex-1 max-w-md mx-4' ref={searchRef}>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
        <input
          type='text'
          placeholder='Buscar empresas, ventas, cobranzas... (Ctrl+K)'
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
          >
            <X className='w-4 h-4' />
          </button>
        )}
      </div>

      {/* Resultados */}
      {isOpen && (query || isLoading) && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto'>
          {isLoading ? (
            <div className='p-4 text-center text-gray-500'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto'></div>
              <p className='mt-2'>Buscando...</p>
            </div>
          ) : results.length > 0 ? (
            <div>
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className={`w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 ${
                    index === selectedIndex
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : ''
                  }`}
                >
                  {getIcon(result.type)}
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-gray-900 truncate'>
                      {result.title}
                    </p>
                    <p className='text-sm text-gray-600 truncate'>
                      {result.subtitle}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      result.status === 'activo' || result.status === 'pagada'
                        ? 'bg-green-100 text-green-800'
                        : result.status === 'pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {result.status}
                  </span>
                </button>
              ))}
            </div>
          ) : query && !isLoading ? (
            <div className='p-4 text-center text-gray-500'>
              <Search className='w-8 h-8 mx-auto mb-2 text-gray-300' />
              <p>No se encontraron resultados</p>
              <p className='text-sm'>Intenta con otros términos</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
