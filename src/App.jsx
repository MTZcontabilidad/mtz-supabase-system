import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ClientesPage from './pages/Clientes/ClientesPage';

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/clientes' element={<ClientesPage />} />
          <Route path='/' element={<Navigate to='/login' replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
