import { useAuth } from '../../../hooks/useAuth';
import Button from '../../../components/common/Button/Button';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className={styles['home-container']}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          Plataforma de Denuncias
        </div>
        <div className={styles['user-section']}>
          <div className={styles['user-info']}>
            <span className={styles['user-name']}>
              {usuario?.nombres} {usuario?.apellidos}
            </span>
          </div>
          <Button variant="danger" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </nav>

      <div className={styles.content}>
        <div className={styles['welcome-card']}>
          <h1 className={styles['welcome-title']}>
            ¡Bienvenido a la Plataforma de Denuncias!
          </h1>
          <p className={styles['welcome-text']}>
            Hola {usuario?.nombres}, tu sesión ha iniciado correctamente.
          </p>
          <p className={styles['welcome-text']}>
            Desde aquí podrás reportar problemas urbanos y hacer seguimiento a tus denuncias.
          </p>
          <span className={styles['user-type']}>
            {usuario?.tipo_usuario}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
