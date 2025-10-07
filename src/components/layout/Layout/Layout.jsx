import { useAuth } from '../../../hooks/useAuth';
import Navigation from '../../common/Navigation/Navigation';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const { estaAutenticado } = useAuth();

  // Si no está autenticado, renderizar solo el contenido sin navegación
  if (!estaAutenticado) {
    return (
      <div className={styles.publicLayout}>
        {children}
      </div>
    );
  }

  // Layout para usuarios autenticados
  return (
    <div className={styles.layout}>
      <Navigation />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default Layout;