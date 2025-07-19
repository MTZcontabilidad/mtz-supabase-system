import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Globe,
  Key,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Trash2,
  Download,
  Upload,
} from 'lucide-react';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import Badge from '@/components/ui/Badge.jsx';
import Input from '@/components/ui/Input.jsx';
import useAuth from '@/hooks/useAuth.js';

/**
 * SettingsPage - Sistema de Configuración MTZ
 * Configuraciones del sistema, perfil de usuario y ajustes avanzados
 */
const SettingsPage = () => {
  const { user, role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Estados para formularios
  const [profileData, setProfileData] = useState({
    nombre: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    telefono: user?.user_metadata?.phone || '',
    empresa: user?.user_metadata?.company || '',
    cargo: user?.user_metadata?.position || '',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: 30,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
    securityAlerts: true,
    systemUpdates: false,
  });

  const [appSettings, setAppSettings] = useState({
    theme: 'light',
    language: 'es',
    timezone: 'America/Santiago',
    dateFormat: 'DD/MM/YYYY',
    currency: 'CLP',
    autoSave: true,
    compactMode: false,
  });

  // Tabs disponibles
  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'security', name: 'Seguridad', icon: Shield },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'appearance', name: 'Apariencia', icon: Palette },
    { id: 'system', name: 'Sistema', icon: Settings },
  ];

  // Guardar configuración
  const guardarConfiguracion = async tipo => {
    try {
      setLoading(true);

      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log(`Configuración ${tipo} guardada:`, {
        profileData,
        securityData,
        notificationSettings,
        appSettings,
      });

      // Aquí iría la lógica real de guardado
      alert(`Configuración ${tipo} guardada exitosamente`);
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  // Exportar configuración
  const exportarConfiguracion = () => {
    const config = {
      profile: profileData,
      security: securityData,
      notifications: notificationSettings,
      app: appSettings,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mtz-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importar configuración
  const importarConfiguracion = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const config = JSON.parse(e.target.result);
          if (config.profile) setProfileData(config.profile);
          if (config.notifications)
            setNotificationSettings(config.notifications);
          if (config.app) setAppSettings(config.app);
          alert('Configuración importada exitosamente');
        } catch (error) {
          alert('Error al importar la configuración');
        }
      };
      reader.readAsText(file);
    }
  };

  // Renderizar contenido según tab activo
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Información Personal
              </h3>
              <Badge variant='outline' size='sm'>
                {role || 'Usuario'}
              </Badge>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Nombre Completo
                </label>
                <Input
                  value={profileData.nombre}
                  onChange={e =>
                    setProfileData({ ...profileData, nombre: e.target.value })
                  }
                  placeholder='Tu nombre completo'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Email
                </label>
                <Input
                  value={profileData.email}
                  onChange={e =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  placeholder='tu@email.com'
                  type='email'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Teléfono
                </label>
                <Input
                  value={profileData.telefono}
                  onChange={e =>
                    setProfileData({ ...profileData, telefono: e.target.value })
                  }
                  placeholder='+56 9 1234 5678'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Empresa
                </label>
                <Input
                  value={profileData.empresa}
                  onChange={e =>
                    setProfileData({ ...profileData, empresa: e.target.value })
                  }
                  placeholder='Nombre de la empresa'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Cargo
                </label>
                <Input
                  value={profileData.cargo}
                  onChange={e =>
                    setProfileData({ ...profileData, cargo: e.target.value })
                  }
                  placeholder='Tu cargo o posición'
                />
              </div>
            </div>

            <div className='flex gap-2'>
              <Button
                onClick={() => guardarConfiguracion('perfil')}
                disabled={loading}
              >
                <Save className='h-4 w-4 mr-2' />
                Guardar Cambios
              </Button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Configuración de Seguridad
            </h3>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Contraseña Actual
                </label>
                <div className='relative'>
                  <Input
                    value={securityData.currentPassword}
                    onChange={e =>
                      setSecurityData({
                        ...securityData,
                        currentPassword: e.target.value,
                      })
                    }
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Tu contraseña actual'
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4 text-gray-400' />
                    ) : (
                      <Eye className='h-4 w-4 text-gray-400' />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Nueva Contraseña
                </label>
                <div className='relative'>
                  <Input
                    value={securityData.newPassword}
                    onChange={e =>
                      setSecurityData({
                        ...securityData,
                        newPassword: e.target.value,
                      })
                    }
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder='Nueva contraseña'
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className='h-4 w-4 text-gray-400' />
                    ) : (
                      <Eye className='h-4 w-4 text-gray-400' />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Confirmar Nueva Contraseña
                </label>
                <Input
                  value={securityData.confirmPassword}
                  onChange={e =>
                    setSecurityData({
                      ...securityData,
                      confirmPassword: e.target.value,
                    })
                  }
                  type='password'
                  placeholder='Confirmar nueva contraseña'
                />
              </div>

              <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                <div>
                  <h4 className='font-medium text-gray-900'>
                    Autenticación de Dos Factores
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Añade una capa extra de seguridad a tu cuenta
                  </p>
                </div>
                <Button
                  variant={
                    securityData.twoFactorEnabled ? 'default' : 'outline'
                  }
                  size='sm'
                  onClick={() =>
                    setSecurityData({
                      ...securityData,
                      twoFactorEnabled: !securityData.twoFactorEnabled,
                    })
                  }
                >
                  {securityData.twoFactorEnabled ? 'Activado' : 'Desactivado'}
                </Button>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Tiempo de Sesión (minutos)
                </label>
                <Input
                  value={securityData.sessionTimeout}
                  onChange={e =>
                    setSecurityData({
                      ...securityData,
                      sessionTimeout: parseInt(e.target.value),
                    })
                  }
                  type='number'
                  min='5'
                  max='480'
                />
              </div>
            </div>

            <div className='flex gap-2'>
              <Button
                onClick={() => guardarConfiguracion('seguridad')}
                disabled={loading}
              >
                <Save className='h-4 w-4 mr-2' />
                Actualizar Seguridad
              </Button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Configuración de Notificaciones
            </h3>

            <div className='space-y-4'>
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div
                  key={key}
                  className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
                >
                  <div>
                    <h4 className='font-medium text-gray-900'>
                      {key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())}
                    </h4>
                    <p className='text-sm text-gray-600'>
                      {key.includes('email')
                        ? 'Recibir notificaciones por email'
                        : key.includes('push')
                          ? 'Recibir notificaciones push'
                          : key.includes('Reports')
                            ? 'Recibir reportes automáticos'
                            : key.includes('Alerts')
                              ? 'Alertas de seguridad importantes'
                              : 'Notificaciones del sistema'}
                    </p>
                  </div>
                  <Button
                    variant={value ? 'default' : 'outline'}
                    size='sm'
                    onClick={() =>
                      setNotificationSettings({
                        ...notificationSettings,
                        [key]: !value,
                      })
                    }
                  >
                    {value ? 'Activado' : 'Desactivado'}
                  </Button>
                </div>
              ))}
            </div>

            <div className='flex gap-2'>
              <Button
                onClick={() => guardarConfiguracion('notificaciones')}
                disabled={loading}
              >
                <Save className='h-4 w-4 mr-2' />
                Guardar Notificaciones
              </Button>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Apariencia y Tema
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Tema
                </label>
                <div className='grid grid-cols-2 gap-2'>
                  {['light', 'dark', 'auto'].map(theme => (
                    <Button
                      key={theme}
                      variant={
                        appSettings.theme === theme ? 'default' : 'outline'
                      }
                      size='sm'
                      onClick={() => setAppSettings({ ...appSettings, theme })}
                    >
                      {theme === 'light'
                        ? 'Claro'
                        : theme === 'dark'
                          ? 'Oscuro'
                          : 'Automático'}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Idioma
                </label>
                <select
                  value={appSettings.language}
                  onChange={e =>
                    setAppSettings({ ...appSettings, language: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='es'>Español</option>
                  <option value='en'>English</option>
                  <option value='pt'>Português</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Zona Horaria
                </label>
                <select
                  value={appSettings.timezone}
                  onChange={e =>
                    setAppSettings({ ...appSettings, timezone: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='America/Santiago'>Chile (GMT-3)</option>
                  <option value='America/New_York'>Nueva York (GMT-5)</option>
                  <option value='Europe/Madrid'>Madrid (GMT+1)</option>
                  <option value='UTC'>UTC</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Moneda
                </label>
                <select
                  value={appSettings.currency}
                  onChange={e =>
                    setAppSettings({ ...appSettings, currency: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='CLP'>Peso Chileno (CLP)</option>
                  <option value='USD'>Dólar Estadounidense (USD)</option>
                  <option value='EUR'>Euro (EUR)</option>
                </select>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                <div>
                  <h4 className='font-medium text-gray-900'>
                    Guardado Automático
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Guardar cambios automáticamente mientras trabajas
                  </p>
                </div>
                <Button
                  variant={appSettings.autoSave ? 'default' : 'outline'}
                  size='sm'
                  onClick={() =>
                    setAppSettings({
                      ...appSettings,
                      autoSave: !appSettings.autoSave,
                    })
                  }
                >
                  {appSettings.autoSave ? 'Activado' : 'Desactivado'}
                </Button>
              </div>

              <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                <div>
                  <h4 className='font-medium text-gray-900'>Modo Compacto</h4>
                  <p className='text-sm text-gray-600'>
                    Mostrar más información en menos espacio
                  </p>
                </div>
                <Button
                  variant={appSettings.compactMode ? 'default' : 'outline'}
                  size='sm'
                  onClick={() =>
                    setAppSettings({
                      ...appSettings,
                      compactMode: !appSettings.compactMode,
                    })
                  }
                >
                  {appSettings.compactMode ? 'Activado' : 'Desactivado'}
                </Button>
              </div>
            </div>

            <div className='flex gap-2'>
              <Button
                onClick={() => guardarConfiguracion('apariencia')}
                disabled={loading}
              >
                <Save className='h-4 w-4 mr-2' />
                Aplicar Cambios
              </Button>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Configuración del Sistema
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Card className='p-6'>
                <h4 className='font-semibold text-gray-900 mb-4 flex items-center'>
                  <Database className='h-5 w-5 text-blue-600 mr-2' />
                  Información del Sistema
                </h4>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Versión:</span>
                    <span className='text-gray-900'>1.0.0</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Última actualización:</span>
                    <span className='text-gray-900'>Hace 2 días</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Estado:</span>
                    <Badge variant='default' size='sm'>
                      Operativo
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className='p-6'>
                <h4 className='font-semibold text-gray-900 mb-4 flex items-center'>
                  <Globe className='h-5 w-5 text-green-600 mr-2' />
                  Conectividad
                </h4>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>API Status:</span>
                    <Badge variant='default' size='sm'>
                      Conectado
                    </Badge>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Base de datos:</span>
                    <Badge variant='default' size='sm'>
                      Activa
                    </Badge>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Sincronización:</span>
                    <Badge variant='outline' size='sm'>
                      En tiempo real
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between p-4 bg-blue-50 rounded-lg'>
                <div>
                  <h4 className='font-medium text-blue-900'>
                    Exportar Configuración
                  </h4>
                  <p className='text-sm text-blue-700'>
                    Descargar toda la configuración actual como archivo JSON
                  </p>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={exportarConfiguracion}
                >
                  <Download className='h-4 w-4 mr-2' />
                  Exportar
                </Button>
              </div>

              <div className='flex items-center justify-between p-4 bg-green-50 rounded-lg'>
                <div>
                  <h4 className='font-medium text-green-900'>
                    Importar Configuración
                  </h4>
                  <p className='text-sm text-green-700'>
                    Restaurar configuración desde un archivo JSON
                  </p>
                </div>
                <div className='relative'>
                  <input
                    type='file'
                    accept='.json'
                    onChange={importarConfiguracion}
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                  />
                  <Button variant='outline' size='sm'>
                    <Upload className='h-4 w-4 mr-2' />
                    Importar
                  </Button>
                </div>
              </div>

              <div className='flex items-center justify-between p-4 bg-red-50 rounded-lg'>
                <div>
                  <h4 className='font-medium text-red-900'>
                    Restablecer Configuración
                  </h4>
                  <p className='text-sm text-red-700'>
                    Volver a la configuración por defecto (se perderán todos los
                    cambios)
                  </p>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className='text-red-600 border-red-300 hover:bg-red-50'
                >
                  <RefreshCw className='h-4 w-4 mr-2' />
                  Restablecer
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
            <Settings className='h-8 w-8 text-blue-600' />
            Configuración
          </h1>
          <p className='text-gray-600'>
            Gestiona tu perfil, seguridad y preferencias del sistema
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8'>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className='h-4 w-4' />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <Card className='p-6'>{renderTabContent()}</Card>
    </div>
  );
};

export default SettingsPage;
