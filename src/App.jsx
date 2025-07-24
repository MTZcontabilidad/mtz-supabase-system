
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import SimpleLogin from './components/auth/SimpleLogin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import LandingPage from './pages/Landing/LandingPage';
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
          {/* Landing Page - Pública */}
          <Route path='/' element={<LandingPage />} />

          {/* Login - Público */}
          <Route path='/login' element={<SimpleLogin />} />

          {/* Rutas Protegidas */}
          <Route
            path='/app'
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path='/app/dashboard' element={<Dashboard />} />
            <Route path='/app/clientes' element={<ClientesPage />} />
            <Route path='/app/ventas' element={<VentasPageSimple />} />
            <Route path='/app/rrhh' element={<RRHHPage />} />
            <Route path='/app/iva' element={<IVAPage />} />
            <Route path='/app/contratos' element={<ContratosPanel />} />
            <Route path='/app/carga-masiva' element={<CargaMasivaPageSimple />} />
            <Route path='/app/cobranza' element={<CobranzaPage />} />
            <Route path='/app/compras' element={<ComprasPage />} />
            <Route
              path='/app/reportes'
              element={<div>Página de Reportes (En desarrollo)</div>}
            />
            <Route
              path='/app/configuracion'
              element={<div>Página de Configuración (En desarrollo)</div>}
            />
            <Route
              path='/app/admin/usuarios'
              element={<div>Página de Administración (En desarrollo)</div>}
            />
            <Route
              path='/app/portal-clientes'
              element={<div>Portal de Clientes (En desarrollo)</div>}
            />
          </Route>

          {/* Redirección por defecto */}
          <Route path='/dashboard' element={<Navigate to='/app/dashboard' replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
