import { useAuth } from '../../../hooks/useAuth';
import Header from '../../common/Header/Header';
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
      <Header />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
