import { create } from 'zustand';
import { CLIENTES_MTZ } from '../utils/constants';

export const useClientStore = create((set, get) => ({
  // Estado
  clients: CLIENTES_MTZ,
  loading: false,
  error: null,
  selectedClient: null,
  filters: {
    search: '',
    status: '',
    region: '',
    minFacturacion: '',
    maxFacturacion: '',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: CLIENTES_MTZ.length,
  },

  // Acciones
  setClients: (clients) => set({ clients }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedClient: (client) => set({ selectedClient: client }),
  
  setFilters: (filters) => {
    set({ filters });
    // Refilter clients when filters change
    get().filterClients();
  },
  
  setPagination: (pagination) => set((state) => ({
    pagination: { ...state.pagination, ...pagination }
  })),

  // Filtrar clientes
  filterClients: () => {
    const { filters } = get();
    let filtered = [...CLIENTES_MTZ];

    // Filtro de búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(client => 
        client.nombre_empresa.toLowerCase().includes(searchTerm) ||
        client.rut.toLowerCase().includes(searchTerm) ||
        client.nombre_contacto.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro de estado
    if (filters.status) {
      filtered = filtered.filter(client => client.estado === filters.status);
    }

    // Filtro de región
    if (filters.region) {
      filtered = filtered.filter(client => client.region === filters.region);
    }

    // Filtro de facturación
    if (filters.minFacturacion) {
      filtered = filtered.filter(client => 
        client.facturacion_anual >= parseFloat(filters.minFacturacion)
      );
    }
    if (filters.maxFacturacion) {
      filtered = filtered.filter(client => 
        client.facturacion_anual <= parseFloat(filters.maxFacturacion)
      );
    }

    set({ 
      clients: filtered,
      pagination: { ...get().pagination, total: filtered.length, page: 1 }
    });
  },

  // Obtener clientes paginados
  getPaginatedClients: () => {
    const { clients, pagination } = get();
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return clients.slice(start, end);
  },

  // Agregar cliente
  addClient: (client) => {
    const newClient = {
      ...client,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set((state) => ({
      clients: [...state.clients, newClient]
    }));
  },

  // Actualizar cliente
  updateClient: (id, updates) => {
    set((state) => ({
      clients: state.clients.map(client => 
        client.id === id 
          ? { ...client, ...updates, updated_at: new Date().toISOString() }
          : client
      )
    }));
  },

  // Eliminar cliente
  deleteClient: (id) => {
    set((state) => ({
      clients: state.clients.filter(client => client.id !== id)
    }));
  },

  // Obtener cliente por ID
  getClientById: (id) => {
    const { clients } = get();
    return clients.find(client => client.id === id);
  },

  // Limpiar filtros
  clearFilters: () => {
    set({
      filters: {
        search: '',
        status: '',
        region: '',
        minFacturacion: '',
        maxFacturacion: '',
      },
      clients: CLIENTES_MTZ,
      pagination: { ...get().pagination, total: CLIENTES_MTZ.length, page: 1 }
    });
  },

  // Resetear store
  reset: () => {
    set({
      clients: CLIENTES_MTZ,
      loading: false,
      error: null,
      selectedClient: null,
      filters: {
        search: '',
        status: '',
        region: '',
        minFacturacion: '',
        maxFacturacion: '',
      },
      pagination: {
        page: 1,
        pageSize: 10,
        total: CLIENTES_MTZ.length,
      },
    });
  },
}));

export default useClientStore;