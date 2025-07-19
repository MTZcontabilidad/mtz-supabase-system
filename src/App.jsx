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
import Layout from './components/layout/Layout.jsx';

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

          {/* Rutas protegidas con Layout */}
          <Route
            path='/app'
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to='/app/dashboard' replace />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='clients' element={<ClientsList />} />
            <Route path='admin' element={<AdminUsersPanel />} />
          </Route>

          {/* Landing page */}
          <Route path='/landing' element={<LandingPage />} />

          {/* Catch-all route */}
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;