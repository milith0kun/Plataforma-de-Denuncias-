import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const ProtectedRoute = ({ children, requireRole = null }) => {
  const { estaAutenticado, esAutoridad, esCiudadano, esAdmin, cargando } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (cargando) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  // Verificar roles específicos si se requiere
  if (requireRole) {
    switch (requireRole) {
      case 'ciudadano':
        if (!esCiudadano) {
          // Si es autoridad, redirigir a su dashboard
          if (esAutoridad) {
            return <Navigate to="/dashboard-autoridad" replace />;
          }
          // Si es admin, redirigir a panel de admin (cuando esté implementado)
          if (esAdmin) {
            return <Navigate to="/admin" replace />;
          }
          // Si no tiene rol válido, redirigir al login
          return <Navigate to="/login" replace />;
        }
        break;
      
      case 'autoridad':
        if (!esAutoridad) {
          // Si es ciudadano, redirigir a su página de inicio
          if (esCiudadano) {
            return <Navigate to="/inicio" replace />;
          }
          // Si es admin, redirigir a panel de admin (cuando esté implementado)
          if (esAdmin) {
            return <Navigate to="/admin" replace />;
          }
          // Si no tiene rol válido, redirigir al login
          return <Navigate to="/login" replace />;
        }
        break;
      
      case 'admin':
        if (!esAdmin) {
          // Redirigir según el rol del usuario
          if (esAutoridad) {
            return <Navigate to="/dashboard-autoridad" replace />;
          }
          if (esCiudadano) {
            return <Navigate to="/inicio" replace />;
          }
          // Si no tiene rol válido, redirigir al login
          return <Navigate to="/login" replace />;
        }
        break;
      
      default:
        // Rol no reconocido, permitir acceso si está autenticado
        break;
    }
  }

  // Si pasa todas las verificaciones, renderizar el componente hijo
  return children;
};

export default ProtectedRoute;