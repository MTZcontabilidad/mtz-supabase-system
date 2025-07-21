import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { ToastProvider } from '@/components/ui/Toast.jsx';
import Layout from '@/components/layout/Layout.jsx';
import ProtectedRoute from '@/components/auth/ProtectedRoute.jsx';
import PublicRoute from '@/components/auth/PublicRoute.jsx';
import LoadingSpinner from '@/components/ui/LoadingSpinner.jsx';

// Lazy loading de páginas para mejor performance
const Login = lazy(() => import('@/pages/Auth/Login.jsx'));
const Register = lazy(() => import('@/pages/Auth/Register.jsx'));
const ResetPassword = lazy(() => import('@/pages/Auth/ResetPassword.jsx'));

// Páginas principales con lazy loading
const Dashboard = lazy(() => import('@/pages/Dashboard/Dashboard.jsx'));
const ClientesPage = lazy(() => import('@/pages/Clientes/ClientesPage.jsx'));
const VentasPage = lazy(() => import('@/pages/Ventas/VentasPage.jsx'));
const CobranzaPage = lazy(() => import('@/pages/Cobranza/CobranzaPage.jsx'));
const ComprasPage = lazy(() => import('@/pages/Compras/ComprasPage.jsx'));
const ContratosPanel = lazy(
  () => import('@/pages/Contratos/ContratosPanel.jsx')
);
const CargaMasivaPage = lazy(
  () => import('@/pages/CargaMasiva/CargaMasivaPage.jsx')
);
const ReportsPage = lazy(() => import('@/pages/Reports/ReportsPage.jsx'));
const SettingsPage = lazy(() => import('@/pages/Settings/SettingsPage.jsx'));
const UserManagementPage = lazy(
  () => import('@/pages/Admin/UserManagementPage.jsx')
);
const PortalClientes = lazy(
  () => import('@/pages/Clientes/PortalClientes.jsx')
);

// Páginas adicionales con lazy loading
const IVAPage = lazy(() => import('@/pages/IVA/IVAPage.jsx'));
const RRHHPage = lazy(() => import('@/pages/RRHH/RRHHPage.jsx'));
const EjemploPage = lazy(() => import('@/pages/Ejemplo/EjemploPage.jsx'));

// Landing page
const LandingPage = lazy(() => import('@/pages/Landing/LandingPage.jsx'));

import '@/index.css';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className='App'>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Ruta pública - Landing Page */}
              <Route
                path='/'
                element={
                  <PublicRoute>
                    <LandingPage />
                  </PublicRoute>
                }
              />

              {/* Rutas de autenticación */}
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
              <Route
                path='/reset-password'
                element={
                  <PublicRoute>
                    <ResetPassword />
                  </PublicRoute>
                }
              />

              {/* Rutas protegidas con Layout */}
              <Route
                path='/dashboard'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path='/clientes'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ClientesPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path='/ventas'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <VentasPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path='/cobranza'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CobranzaPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path='/compras'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ComprasPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path='/contratos'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ContratosPanel />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path='/carga-masiva'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CargaMasivaPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path='/reportes'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ReportsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path='/configuracion'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SettingsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path='/admin/usuarios'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <UserManagementPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path='/portal-clientes'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PortalClientes />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path='/ejemplo'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <EjemploPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Páginas adicionales */}
              <Route
                path='/iva'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <IVAPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path='/rrhh'
                element={
                  <ProtectedRoute>
                    <Layout>
                      <RRHHPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Redirección por defecto */}
              <Route path='*' element={<Navigate to='/dashboard' replace />} />
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
