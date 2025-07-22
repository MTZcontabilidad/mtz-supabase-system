import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import SimpleLogin from './components/auth/SimpleLogin';
import Navigation from './components/layout/Navigation';
import Dashboard from './pages/Dashboard/Dashboard';
import ClientesPage from './pages/Clientes/ClientesPage';
import VentasPage from './pages/Ventas/VentasPage';
import RRHHPage from './pages/RRHH/RRHHPage';
import IVAPage from './pages/IVA/IVAPage';

// Componente para páginas con navegación
const PageWithNavigation = ({ children }) => (
  <div>
    <Navigation />
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>{children}</div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <Routes>
          <Route path='/login' element={<SimpleLogin />} />
          <Route
            path='/dashboard'
            element={
              <PageWithNavigation>
                <Dashboard />
              </PageWithNavigation>
            }
          />
          <Route
            path='/clientes'
            element={
              <PageWithNavigation>
                <ClientesPage />
              </PageWithNavigation>
            }
          />
          <Route
            path='/ventas'
            element={
              <PageWithNavigation>
                <VentasPage />
              </PageWithNavigation>
            }
          />
          <Route
            path='/rrhh'
            element={
              <PageWithNavigation>
                <RRHHPage />
              </PageWithNavigation>
            }
          />
          <Route
            path='/iva'
            element={
              <PageWithNavigation>
                <IVAPage />
              </PageWithNavigation>
            }
          />
          <Route path='/' element={<Navigate to='/login' replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
