import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import Alert from '../../../components/common/Alert/Alert';
import styles from './LoginPage.module.css';

// Icono de Google
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const handleGoogleLogin = () => {
    // TODO: Implementar autenticación con Google OAuth
    console.log('Google login clicked');
    alert('La autenticación con Google se implementará próximamente');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo al modificarlo
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nuevosErrores.email = 'Email inválido';
    }

    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es obligatoria';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setCargando(true);
    try {
      const respuesta = await login(formData);
      // Redirigir según el tipo de usuario
      const tipoUsuario = respuesta?.data?.usuario?.tipo_usuario;
      if (tipoUsuario === 'Autoridad' || tipoUsuario === 'Autoridad_Municipal') {
        navigate('/dashboard-autoridad');
      } else {
        navigate('/inicio');
      }
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-card']}>
        <div className={styles['login-header']}>
          <img src="/Establish.svg" alt="Logo" className={styles['logo']} />
          <h1 className={styles['login-title']}>Bienvenido</h1>
          <p className={styles['login-subtitle']}>
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Botón de Google */}
        <button 
          type="button" 
          onClick={handleGoogleLogin}
          className={styles['google-button']}
        >
          <GoogleIcon />
          <span>Continuar con Google</span>
        </button>

        <div className={styles['divider']}>
          <span>o</span>
        </div>

        <form onSubmit={handleSubmit} className={styles['login-form']}>
          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errores.email}
            placeholder="tu@email.com"
            required
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errores.password}
            placeholder="••••••••"
            required
          />

          <div className={styles['forgot-password']}>
            <Link to="/forgot-password" className={styles['forgot-link']}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={cargando}
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className={styles['footer-links']}>
          <p className={styles['register-text']}>
            ¿No tienes cuenta?{' '}
            <Link to="/register" className={styles['link']}>Regístrate aquí</Link>
          </p>
          <p className={styles['authority-text']}>
            ¿Eres una autoridad?{' '}
            <Link to="/register-authority" className={styles['link']}>Regístrate como autoridad</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
