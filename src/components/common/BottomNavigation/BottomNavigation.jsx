import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  MapPin, 
  User,
  Settings,
  BarChart3
} from 'lucide-react';
import styles from './BottomNavigation.module.css';

/**
 * BottomNavigation - Barra de navegación inferior para móviles
 * Se adapta según el rol del usuario (ciudadano o autoridad)
 */
const BottomNavigation = ({ userType = 'ciudadano' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Configuración de navegación para ciudadanos
  const ciudadanoNavItems = [
    {
      path: '/home',
      icon: LayoutDashboard,
      label: 'Inicio',
      color: '#3b82f6'
    },
    {
      path: '/denuncias',
      icon: FileText,
      label: 'Denuncias',
      color: '#8b5cf6'
    },
    {
      path: '/nueva-denuncia',
      icon: Plus,
      label: 'Nueva',
      color: '#10b981',
      isMain: true // Botón principal destacado
    },
    {
      path: '/seguimiento',
      icon: MapPin,
      label: 'Seguimiento',
      color: '#f59e0b'
    },
    {
      path: '/perfil',
      icon: User,
      label: 'Perfil',
      color: '#64748b'
    }
  ];

  // Configuración de navegación para autoridades
  const autoridadNavItems = [
    {
      path: '/dashboard-autoridad',
      icon: LayoutDashboard,
      label: 'Dashboard',
      color: '#3b82f6'
    },
    {
      path: '/gestionar-denuncias',
      icon: Settings,
      label: 'Gestionar',
      color: '#8b5cf6',
      isMain: true
    },
    {
      path: '/denuncias',
      icon: FileText,
      label: 'Denuncias',
      color: '#10b981'
    },
    {
      path: '/estadisticas',
      icon: BarChart3,
      label: 'Reportes',
      color: '#f59e0b'
    },
    {
      path: '/perfil',
      icon: User,
      label: 'Perfil',
      color: '#64748b'
    }
  ];

  const navItems = userType === 'autoridad' ? autoridadNavItems : ciudadanoNavItems;

  const isActive = (path) => {
    if (path === '/home' && location.pathname === '/home') return true;
    if (path !== '/home' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navContainer}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`${styles.navItem} ${active ? styles.active : ''} ${item.isMain ? styles.mainButton : ''}`}
              style={{
                '--nav-color': item.color
              }}
            >
              <div className={styles.navIconWrapper}>
                <Icon 
                  size={item.isMain ? 28 : 24} 
                  strokeWidth={active ? 2.5 : 2}
                />
              </div>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
