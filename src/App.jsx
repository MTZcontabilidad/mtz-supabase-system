import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

// Páginas principales
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import LandingPage from './pages/Landing/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';
import ClientsList from './pages/Clients/ClientsList';
import AdminUsersPanel from './pages/Admin/AdminUsersPanel';
import Layout from './components/layout/Layout';

function App() {
  return (
    <AuthProvider>
      <div className='min-h-screen bg-gray-50'>
        <Routes>
          {/* Ruta raíz - Landing Page */}
          <Route
            path='/'
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />

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

          {/* Rutas protegidas del sistema */}
          <Route
            path='/app/*'
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    {/* Dashboard principal */}
                    <Route path='/' element={<Navigate to='/app/dashboard' replace />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    
                    {/* Gestión de clientes */}
                    <Route path='/clients' element={<ClientsList />} />
                    
                    {/* Panel de administración */}
                    <Route path='/admin/users' element={<AdminUsersPanel />} />
                    
                    {/* Rutas placeholder para desarrollo futuro */}
                    <Route path='/reports' element={
                      <div className='p-8 text-center'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Módulo de Reportes</h2>
                        <p className='text-gray-600'>En desarrollo - Próximamente disponible</p>
                      </div>
                    } />
                    
                    <Route path='/analytics' element={
                      <div className='p-8 text-center'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Módulo de Analytics</h2>
                        <p className='text-gray-600'>En desarrollo - Próximamente disponible</p>
                      </div>
                    } />
                    
                    <Route path='/settings' element={
                      <div className='p-8 text-center'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Configuración</h2>
                        <p className='text-gray-600'>En desarrollo - Próximamente disponible</p>
                      </div>
                    } />

                    {/* Ruta 404 dentro del sistema */}
                    <Route path='*' element={<Navigate to='/app/dashboard' replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Ruta 404 global */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;