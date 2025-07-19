import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { verifyEnvironment } from './utils/verifyEnv.js';

// Verificar variables de entorno al iniciar
verifyEnvironment();

// Configurar el router con future flags para eliminar warnings
const router = (
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <App />
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{router}</React.StrictMode>
);
