import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

/**
 * Layout Component
 * Layout principal responsive para el sistema MTZ.
 * Integra Header, Sidebar colapsable y área de contenido principal.
 * Optimizado para dispositivos móviles y desktop.
 */
const Layout = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <div className='flex'>
        <Sidebar />
        <main className='flex-1 p-4 lg:p-8 transition-all duration-300'>
          <div className='max-w-7xl mx-auto'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
