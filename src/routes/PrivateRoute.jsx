import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading/Loading';

const PrivateRoute = ({ children }) => {
  const { estaAutenticado, cargando } = useAuth();

  if (cargando) {
    return <Loading text="Verificando sesión..." />;
  }

  return estaAutenticado ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
