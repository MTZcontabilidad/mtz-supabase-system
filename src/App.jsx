import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ClientesPage from './pages/Clientes/ClientesPage';

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/clientes' element={<ClientesPage />} />
          <Route path='/' element={<Navigate to='/login' replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
