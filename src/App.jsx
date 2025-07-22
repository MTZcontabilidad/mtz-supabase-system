import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import SimpleLogin from './components/auth/SimpleLogin';
import Dashboard from './pages/Dashboard/Dashboard';
import ClientesPage from './pages/Clientes/ClientesPage';

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <Routes>
          <Route path='/login' element={<SimpleLogin />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/clientes' element={<ClientesPage />} />
          <Route path='/' element={<Navigate to='/login' replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
