import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import styles from './Header.module.css';

// Iconos SVG minimalistas
const Icons = {
  // Navegación general
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  ),
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  manage: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  reports: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  track: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  google: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
};

/**
 * Header Unificado - Componente de navegación principal
 * Se adapta automáticamente según el contexto (público o autenticado)
 * y el rol del usuario (ciudadano, autoridad, admin)
 */
const Header = ({ variant }) => {
  const { usuario, logout, estaAutenticado, esAutoridad, esCiudadano, esAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [perfilMenuAbierto, setPerfilMenuAbierto] = useState(false);
  const dropdownRef = useRef(null);

  // Rutas públicas donde NO se debe mostrar el header autenticado
  const rutasPublicas = ['/', '/login', '/register', '/register-authority', '/forgot-password', '/reset-password'];
  const esRutaPublica = rutasPublicas.includes(location.pathname) || location.pathname.startsWith('/reset-password');
  
  // Determinar si mostrar header público o autenticado
  const esPublico = variant === 'public' || !estaAutenticado || esRutaPublica;

  // Obtener iniciales del usuario
  const obtenerIniciales = (nombres, apellidos) => {
    const inicial1 = nombres ? nombres.charAt(0).toUpperCase() : '';
    const inicial2 = apellidos ? apellidos.charAt(0).toUpperCase() : '';
    return inicial1 + inicial2 || 'U';
  };

  // Obtener items de navegación según rol
  const getNavItems = () => {
    if (esAutoridad) {
      return [
        { path: '/gestionar-denuncias', label: 'Gestionar Denuncias', icon: 'manage', primary: true }
      ];
    }

    if (esCiudadano) {
      return [
        { path: '/nueva-denuncia', label: 'Nueva Denuncia', icon: 'plus', primary: true }
      ];
    }

    if (esAdmin) {
      return [
        { path: '/admin-dashboard', label: 'Panel', icon: 'dashboard' },
        { path: '/usuarios', label: 'Usuarios', icon: 'user' },
        { path: '/estadisticas', label: 'Estadísticas', icon: 'reports' }
      ];
    }

    return [];
  };

  // Obtener etiqueta de rol
  const getRolLabel = () => {
    if (esAutoridad) return 'Autoridad';
    if (esCiudadano) return 'Ciudadano';
    if (esAdmin) return 'Admin';
    return 'Usuario';
  };

  // Verificar ruta activa
  const esRutaActiva = (ruta) => location.pathname === ruta;

  // Handlers
  const alternarMenu = () => setMenuAbierto(!menuAbierto);
  const alternarPerfilMenu = () => setPerfilMenuAbierto(!perfilMenuAbierto);

  const manejarLogout = () => {
    logout();
    setPerfilMenuAbierto(false);
    navigate('/');
  };

  const cerrarMenus = () => {
    setMenuAbierto(false);
    setPerfilMenuAbierto(false);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const manejarClickFuera = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPerfilMenuAbierto(false);
      }
    };
    document.addEventListener('mousedown', manejarClickFuera);
    return () => document.removeEventListener('mousedown', manejarClickFuera);
  }, []);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    cerrarMenus();
  }, [location.pathname]);

  const navItems = getNavItems();

  // ============ HEADER PÚBLICO ============
  if (esPublico) {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            <img src="/Establish.svg" alt="Logo" className={styles.logoImg} />
            <div className={styles.logoTextContainer}>
              <span className={styles.logoTextTop}>Denuncias</span>
              <span className={styles.logoTextBottom}>Ciudadanas</span>
            </div>
          </Link>

          <nav className={styles.publicNav}>
            <Link to="/login" className={styles.navLinkPublic}>
              Iniciar Sesión
            </Link>
            <Link to="/register" className={styles.navButtonPrimary}>
              Registrarse
            </Link>
          </nav>

          <button className={styles.mobileMenuBtn} onClick={alternarMenu}>
            {menuAbierto ? Icons.close : Icons.menu}
          </button>
        </div>

        {menuAbierto && (
          <>
            <div className={styles.mobileMenu}>
              <Link to="/login" className={styles.mobileNavLink} onClick={cerrarMenus}>
                Iniciar Sesión
              </Link>
              <Link to="/register" className={styles.mobileNavButton} onClick={cerrarMenus}>
                Registrarse
              </Link>
            </div>
            <div className={styles.overlay} onClick={cerrarMenus} />
          </>
        )}
      </header>
    );
  }

  // ============ HEADER AUTENTICADO ============
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to={esAutoridad ? '/dashboard-autoridad' : '/inicio'} className={styles.logo}>
          <img src="/Establish.svg" alt="Logo" className={styles.logoImg} />
          <div className={styles.logoTextContainer}>
            <span className={styles.logoTextTop}>Denuncias</span>
            <span className={styles.logoTextBottom}>Ciudadanas</span>
          </div>
        </Link>

        {/* Sub Nav Bar para robustez */}
        <div className={styles.subNavBar}>
          <div className={styles.pageTitle}>
            {navItems.find(item => esRutaActiva(item.path))?.label || (
              location.pathname.includes('/denuncias/') ? 'Detalle de Denuncia' : 
              location.pathname === '/perfil' ? 'Mi Perfil' : 'Dashboard'
            )}
          </div>
        </div>

        {/* Navegación principal */}
        <nav className={`${styles.navMenu} ${menuAbierto ? styles.navMenuOpen : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={item.primary ? styles.navLinkPrimary : `${styles.navLink} ${esRutaActiva(item.path) ? styles.navLinkActive : ''}`}
              onClick={cerrarMenus}
            >
              <span className={styles.navIcon}>{Icons[item.icon]}</span>
              <span className={styles.navText}>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sección de usuario */}
        <div className={styles.userSection}>
          {/* Notificaciones */}
          <button className={styles.notificationBtn} title="Notificaciones">
            {Icons.bell}
            <span className={styles.notificationBadge}>0</span>
          </button>

          {/* Perfil */}
          <div className={styles.profileMenu} ref={dropdownRef}>
            <button className={styles.profileBtn} onClick={alternarPerfilMenu}>
              <div className={styles.avatar}>
                {obtenerIniciales(usuario?.nombres, usuario?.apellidos)}
              </div>
              <div className={styles.profileInfo}>
                <span className={styles.userName}>{usuario?.nombres}</span>
                <span className={styles.userRole}>{getRolLabel()}</span>
              </div>
              <span className={`${styles.dropdownIcon} ${perfilMenuAbierto ? styles.dropdownIconOpen : ''}`}>
                {Icons.chevronDown}
              </span>
            </button>

            {perfilMenuAbierto && (
              <div className={styles.profileDropdown}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownAvatar}>
                    {obtenerIniciales(usuario?.nombres, usuario?.apellidos)}
                  </div>
                  <div className={styles.dropdownInfo}>
                    <span className={styles.dropdownName}>
                      {usuario?.nombres} {usuario?.apellidos}
                    </span>
                    <span className={styles.dropdownEmail}>{usuario?.email}</span>
                    <span className={styles.dropdownRole}>{getRolLabel()}</span>
                  </div>
                </div>

                <div className={styles.dropdownDivider} />

                <Link to="/perfil" className={styles.dropdownItem} onClick={cerrarMenus}>
                  <span className={styles.dropdownItemIcon}>{Icons.user}</span>
                  Mi Perfil
                </Link>

                <button className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`} onClick={manejarLogout}>
                  <span className={styles.dropdownItemIcon}>{Icons.logout}</span>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>

          {/* Botón móvil */}
          <button className={styles.mobileMenuBtn} onClick={alternarMenu}>
            {menuAbierto ? Icons.close : Icons.menu}
          </button>
        </div>
      </div>

      {(menuAbierto || perfilMenuAbierto) && (
        <div className={styles.overlay} onClick={cerrarMenus} />
      )}
    </header>
  );
};

export default Header;