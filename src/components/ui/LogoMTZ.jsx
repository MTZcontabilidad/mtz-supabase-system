// =====================================================================
// 🐼 COMPONENTE LOGO MTZ - Reutilizable
// Logo corporativo de MTZ Consultores Tributarios
// =====================================================================

const LogoMTZ = ({
  size = 'md',
  showText = true,
  variant = 'full',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const LogoIcon = () => (
    <img
      src='/images/mtz-logo.png'
      alt='MTZ Consultores Tributarios'
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
      onError={e => {
        // Fallback si no se encuentra el logo
        e.target.style.display = 'none';
        const fallback = e.target.nextElementSibling;
        if (fallback) fallback.style.display = 'flex';
      }}
    />
  );

  const FallbackIcon = () => (
    <div
      className={`bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl flex items-center justify-center ${sizeClasses[size]}`}
      style={{ display: 'none' }}
    >
      <span className='text-white font-bold text-sm'>MTZ</span>
    </div>
  );

  const LogoText = () => (
    <div>
      <h1 className={`${textSizeClasses[size]} font-bold text-gray-900`}>
        MTZ Ouroborus AI
      </h1>
      <p className={`text-sm text-gray-600 ${size === 'sm' ? 'text-xs' : ''}`}>
        Consultores Tributarios
      </p>
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className='flex items-center'>
        <LogoIcon />
        <FallbackIcon />
      </div>
    );
  }

  if (variant === 'text') {
    return <LogoText />;
  }

  return (
    <div className='flex items-center gap-3'>
      <div className='flex items-center'>
        <LogoIcon />
        <FallbackIcon />
      </div>
      {showText && <LogoText />}
    </div>
  );
};

export default LogoMTZ;

// =====================================================================
// 📝 INSTRUCCIONES DE USO
// =====================================================================

/*
🐼 COMPONENTE LOGO MTZ LISTO PARA USAR:

USOS COMUNES:
1. <LogoMTZ /> - Logo completo con texto
2. <LogoMTZ variant="icon" size="sm" /> - Solo ícono pequeño
3. <LogoMTZ size="xl" /> - Logo grande para landing
4. <LogoMTZ showText={false} /> - Solo ícono con tamaño por defecto

CARACTERÍSTICAS:
- ✅ Fallback automático si no se encuentra la imagen
- ✅ Responsive con diferentes tamaños
- ✅ Variantes: completo, solo ícono, solo texto
- ✅ Accesible con alt text apropiado
- ✅ Branding corporativo consistente

REEMPLAZA EN COMPONENTES:
- Header.jsx
- LandingPage.jsx  
- Login.jsx
- Footer components
*/
