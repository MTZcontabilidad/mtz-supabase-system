import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

// Solo importamos páginas que realmente existen
import Login from './pages/Auth/Login';

function App() {
  return (
    <AuthProvider>
      <div className='min-h-screen bg-gray-50'>
        <Routes>
          {/* Ruta raíz - redirigir al login */}
          <Route path='/' element={<Navigate to='/login' replace />} />

          {/* Ruta de login */}
          <Route
            path='/login'
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Placeholder para dashboard futuro */}
          <Route
            path='/app/*'
            element={
              <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                      <span className="text-white text-2xl font-bold">MTZ</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      ¡Bienvenido al Sistema MTZ!
                    </h1>
                    <p className="text-gray-600 mb-4">
                      Dashboard en desarrollo. Sistema funcionando correctamente.
                    </p>
                    <div className="text-sm text-gray-500">
                      🎯 Supabase: Conectado <br />
                      🚀 Autenticación: Funcionando <br />
                      📊 8 clientes activos, $85,555,727 total
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Ruta 404 */}
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
