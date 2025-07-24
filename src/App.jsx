
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import SimpleLogin from './components/auth/SimpleLogin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import ClientesPage from './pages/Clientes/ClientesPage';
import VentasPageSimple from './pages/Ventas/VentasPageSimple';
import RRHHPage from './pages/RRHH/RRHHPage';
import IVAPage from './pages/IVA/IVAPage';
import ContratosPanel from './pages/Contratos/ContratosPanel';
import CargaMasivaPageSimple from './pages/CargaMasiva/CargaMasivaPageSimple';
import CobranzaPage from './pages/Cobranza/CobranzaPage';
import ComprasPage from './pages/Compras/ComprasPage';

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <Routes>
          <Route path='/login' element={<SimpleLogin />} />
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/clientes' element={<ClientesPage />} />
            <Route path='/ventas' element={<VentasPageSimple />} />
            <Route path='/rrhh' element={<RRHHPage />} />
            <Route path='/iva' element={<IVAPage />} />
            <Route path='/contratos' element={<ContratosPanel />} />
            <Route path='/carga-masiva' element={<CargaMasivaPageSimple />} />
            <Route path='/cobranza' element={<CobranzaPage />} />
            <Route path='/compras' element={<ComprasPage />} />
            <Route
              path='/reportes'
              element={<div>Página de Reportes (En desarrollo)</div>}
            />
            <Route
              path='/configuracion'
              element={<div>Página de Configuración (En desarrollo)</div>}
            />
            <Route
              path='/admin/usuarios'
              element={<div>Página de Administración (En desarrollo)</div>}
            />
            <Route
              path='/portal-clientes'
              element={<div>Portal de Clientes (En desarrollo)</div>}
            />
          </Route>
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
