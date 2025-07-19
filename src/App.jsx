import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import PublicRoute from './components/auth/PublicRoute.jsx';

// Páginas principales
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import LandingPage from './pages/Landing/LandingPage.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import ClientsList from './pages/Clients/ClientsList.jsx';
import ReportsPage from './pages/Reports/ReportsPage.jsx';
import AnalyticsPage from './pages/Analytics/AnalyticsPage.jsx';
import ProyeccionesPage from './pages/Proyecciones/ProyeccionesPage.jsx';
import SettingsPage from './pages/Settings/SettingsPage.jsx';
import AdminUsersPanel from './pages/Admin/AdminUsersPanel.jsx';
import Layout from './components/layout/Layout.jsx';

function App() {
  return (
    <AuthProvider>
      <div className='min-h-screen bg-gray-50'>
        <Routes>
          {/* Ruta raíz - LandingPage */}
          <Route path='/' element={<LandingPage />} />

          {/* Rutas públicas */}
          <Route
            path='/login'
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path='/register'
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path='/landing' element={<LandingPage />} />

          {/* Rutas protegidas con Layout */}
          <Route
            path='/app'
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Ruta por defecto para /app */}
            <Route index element={<Navigate to='/app/dashboard' replace />} />

            {/* Dashboard */}
            <Route path='dashboard' element={<Dashboard />} />

            {/* Clientes */}
            <Route path='clients' element={<ClientsList />} />

            {/* Reportes */}
            <Route path='reports' element={<ReportsPage />} />

            {/* Analytics */}
            <Route path='analytics' element={<AnalyticsPage />} />

            {/* Proyecciones */}
            <Route path='proyecciones' element={<ProyeccionesPage />} />

            {/* Configuración */}
            <Route path='settings' element={<SettingsPage />} />

            {/* Administración */}
            <Route path='admin' element={<AdminUsersPanel />} />
          </Route>

          {/* Ruta 404 */}
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
