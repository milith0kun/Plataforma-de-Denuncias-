import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import styles from './Navigation.module.css';

const Navigation = () => {
  const { usuario, esAutoridad, esCiudadano, esAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const togglePerfil = () => {
    setPerfilAbierto(!perfilAbierto);
  };

  // Configuración de navegación según el rol
  const getNavItems = () => {
    if (esAutoridad) {
      return [
        { path: '/dashboard-autoridad', label: 'Dashboard', icon: 'dashboard' },
        { path: '/gestionar-denuncias', label: 'Gestionar Denuncias', icon: 'manage' },
        { path: '/reportes', label: 'Reportes', icon: 'reports' },
        { path: '/mapa-denuncias', label: 'Mapa', icon: 'map' }
      ];
    }
    
    if (esCiudadano) {
      return [
        { path: '/inicio', label: 'Inicio', icon: 'home' },
        { path: '/denuncias', label: 'Mis Denuncias', icon: 'complaints' },
        { path: '/nueva-denuncia', label: 'Nueva Denuncia', icon: 'add' },
        { path: '/seguimiento', label: 'Seguimiento', icon: 'track' }
      ];
    }
    
    if (esAdmin) {
      return [
        { path: '/admin-dashboard', label: 'Panel Admin', icon: 'admin' },
        { path: '/usuarios', label: 'Usuarios', icon: 'users' },
        { path: '/configuracion', label: 'Configuración', icon: 'settings' },
        { path: '/estadisticas', label: 'Estadísticas', icon: 'stats' }
      ];
    }
    
    return [];
  };

  const navItems = getNavItems();

  const getIcon = (iconName) => {
    const icons = {
      dashboard: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
      home: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      complaints: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
      add: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      ),
      manage: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      reports: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"/>
          <polyline points="9,11 12,14 15,11"/>
          <line x1="12" y1="2" x2="12" y2="14"/>
        </svg>
      ),
      map: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
          <line x1="8" y1="2" x2="8" y2="18"/>
          <line x1="16" y1="6" x2="16" y2="22"/>
        </svg>
      ),
      track: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      ),
      admin: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      users: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      settings: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
      stats: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      )
    };
    
    return icons[iconName] || icons.home;
  };

  const getRoleBadge = () => {
    if (esAutoridad) return { text: 'Autoridad', color: '#3b82f6' };
    if (esCiudadano) return { text: 'Ciudadano', color: '#10b981' };
    if (esAdmin) return { text: 'Administrador', color: '#8b5cf6' };
    return { text: 'Usuario', color: '#6b7280' };
  };

  const roleBadge = getRoleBadge();

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        {/* Logo y título */}
        <div className={styles.navBrand}>
          <Link to="/" className={styles.brandLink}>
            <div className={styles.logo}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span className={styles.brandText}>DenunciasCiudadanas</span>
          </Link>
        </div>

        {/* Menú de navegación */}
        <div className={`${styles.navMenu} ${menuAbierto ? styles.navMenuOpen : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${location.pathname === item.path ? styles.navLinkActive : ''}`}
              onClick={() => setMenuAbierto(false)}
            >
              <div className={styles.navIcon}>
                {getIcon(item.icon)}
              </div>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Perfil de usuario */}
        <div className={styles.navProfile}>
          <button 
            className={styles.profileButton}
            onClick={togglePerfil}
          >
            <div className={styles.profileAvatar}>
              {usuario?.nombres?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>
                {usuario?.nombres} {usuario?.apellidos}
              </span>
              <span 
                className={styles.profileRole}
                style={{ color: roleBadge.color }}
              >
                {roleBadge.text}
              </span>
            </div>
            <div className={styles.profileArrow}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="6,9 12,15 18,9"/>
              </svg>
            </div>
          </button>

          {/* Menú desplegable del perfil */}
          {perfilAbierto && (
            <div className={styles.profileDropdown}>
              <Link 
                to="/perfil" 
                className={styles.dropdownItem}
                onClick={() => setPerfilAbierto(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Mi Perfil
              </Link>
              <button 
                className={styles.dropdownItem}
                onClick={handleLogout}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>

        {/* Botón de menú móvil */}
        <button 
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;