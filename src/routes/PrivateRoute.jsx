import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading/Loading';

const PrivateRoute = ({ children, requireRole }) => {
  const { estaAutenticado, cargando, esAdmin, esAutoridad, esCiudadano } = useAuth();

  if (cargando) {
    return <Loading text="Verificando sesión..." />;
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" />;
  }

  // Verificar rol específico si se requiere
  if (requireRole) {
    switch (requireRole) {
      case 'admin':
        if (!esAdmin) {
          return <Navigate to="/dashboard" />;
        }
        break;
      case 'autoridad':
        if (!esAutoridad) {
          return <Navigate to="/dashboard" />;
        }
        break;
      case 'ciudadano':
        if (!esCiudadano) {
          return <Navigate to="/dashboard" />;
        }
        break;
      default:
        break;
    }
  }

  return children;
};

export default PrivateRoute;
