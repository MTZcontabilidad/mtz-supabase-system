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
          {/* Ruta raíz - redirigir al login */}
          <Route path='/' element={<Navigate to='/login' replace />} />

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