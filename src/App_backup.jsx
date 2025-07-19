import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

// Páginas principales
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';

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

          {/* Rutas protegidas */}
          <Route
            path='/app/dashboard'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Ruta por defecto para /app */}
          <Route
            path='/app'
            element={<Navigate to='/app/dashboard' replace />}
          />

          {/* Ruta 404 */}
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
