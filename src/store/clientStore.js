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

  // Acciones
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  setSelectedClient: client => set({ selectedClient: client }),

  setFilters: filters =>
    set(state => ({
      filters: { ...state.filters, ...filters },
    })),

  // CRUD Operations
  addClient: client =>
    set(state => ({
      clients: [...state.clients, { ...client, id: Date.now().toString() }],
    })),

  updateClient: (id, updates) =>
    set(state => ({
      clients: state.clients.map(client =>
        client.id === id ? { ...client, ...updates } : client
      ),
    })),

  deleteClient: id =>
    set(state => ({
      clients: state.clients.filter(client => client.id !== id),
    })),

  // Getters
  getFilteredClients: () => {
    const { clients, filters } = get();

    return clients.filter(client => {
      // Búsqueda por nombre, RUT o email
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          client.nombre.toLowerCase().includes(searchLower) ||
          client.rut.includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Filtro por estado
      if (filters.status && client.estado !== filters.status) {
        return false;
      }

      // Filtro por región
      if (filters.region && client.region !== filters.region) {
        return false;
      }

      // Filtro por facturación mínima
      if (
        filters.minFacturacion &&
        client.facturacion < parseInt(filters.minFacturacion)
      ) {
        return false;
      }

      // Filtro por facturación máxima
      if (
        filters.maxFacturacion &&
        client.facturacion > parseInt(filters.maxFacturacion)
      ) {
        return false;
      }

      return true;
    });
  },

  getClientById: id => {
    const { clients } = get();
    return clients.find(client => client.id === id);
  },

  // Estadísticas
  getStats: () => {
    const { clients } = get();
    const total = clients.length;
    const activos = clients.filter(c => c.estado === 'Activo').length;
    const premium = clients.filter(c => c.estado === 'Premium').length;
    const vip = clients.filter(c => c.estado === 'VIP').length;
    const totalFacturacion = clients.reduce((sum, c) => sum + c.facturacion, 0);
    const promedioFacturacion = total > 0 ? totalFacturacion / total : 0;

    return {
      total,
      activos,
      premium,
      vip,
      totalFacturacion,
      promedioFacturacion,
    };
  },
}));
