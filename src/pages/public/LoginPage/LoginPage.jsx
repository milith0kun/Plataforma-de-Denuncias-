import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useGoogleAuth } from '../../../hooks/useGoogleAuth';
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
  const { loginWithGoogle, isConfigured, isGoogleLoaded } = useGoogleAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const handleGoogleLogin = async () => {
    console.log('Botón de Google clickeado');
    console.log('isConfigured:', isConfigured);
    console.log('isGoogleLoaded:', isGoogleLoaded);
    console.log('window.google:', !!window.google);
    console.log('Origen actual:', window.location.origin);
    
    if (!isConfigured) {
      const mensaje = 'Google OAuth no está configurado. Por favor, configura VITE_GOOGLE_CLIENT_ID en el archivo .env\n\nConsulta OAUTH_SETUP.md para instrucciones detalladas.';
      console.error(mensaje);
      alert(mensaje);
      return;
    }

    if (!isGoogleLoaded) {
      const mensaje = 'El SDK de Google aún no se ha cargado. Por favor, espera un momento e intenta nuevamente.';
      console.warn(mensaje);
      setGoogleError(mensaje);
      return;
    }

    setGoogleError('');
    setCargando(true);
    console.log('Iniciando login con Google...');
    console.log('Si aparece error de "unregistered_origin", asegúrate de acceder desde http://localhost:3000');
    
    loginWithGoogle(
      async (credential) => {
        console.log('✅ Credential recibido de Google');
        try {
          console.log('Enviando credential al backend...');
          const api = (await import('../../../services/api.js')).default;
          const response = await api.post('/auth/google', { credential });
          
          console.log('Respuesta del backend:', response.data);
          
          if (response.data.success) {
            console.log('✅ Login exitoso');
            // Guardar token y usuario en localStorage
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('usuario', JSON.stringify(response.data.data.usuario));
            
            // Redirigir según el tipo de usuario
            const tipoUsuario = response.data.data.usuario.tipo_usuario;
            console.log('Redirigiendo usuario tipo:', tipoUsuario);
            if (tipoUsuario === 'Autoridad' || tipoUsuario === 'Autoridad_Municipal') {
              navigate('/dashboard-autoridad');
            } else {
              navigate('/home');
            }
            // Recargar la página para actualizar el estado de autenticación
            window.location.reload();
          }
        } catch (error) {
          console.error('❌ Error al procesar login de Google:', error);
          console.error('Detalles del error:', error.response?.data);
          setGoogleError(error.response?.data?.message || 'Error al iniciar sesión con Google');
        } finally {
          setCargando(false);
        }
      },
      (error) => {
        console.error('❌ Error en Google login:', error);
        setGoogleError(error);
        setCargando(false);
      }
    );
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
        navigate('/home');
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
        {/* Lado Izquierdo - Información */}
        <div className={styles['info-section']}>
          <div className={styles['info-content']}>
            <img src="/Establish.svg" alt="Logo" className={styles['logo-large']} />
            <h2 className={styles['info-title']}>Plataforma de Denuncias Urbanas</h2>
            <p className={styles['info-description']}>
              Reporta problemas en tu comunidad y contribuye a mejorar tu ciudad
            </p>
            
            <div className={styles['features']}>
              <div className={styles['feature-item']}>
                <div className={styles['feature-icon']}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <h3 className={styles['feature-title']}>Reportes Rápidos</h3>
                  <p className={styles['feature-text']}>Crea denuncias en minutos con fotos y ubicación</p>
                </div>
              </div>

              <div className={styles['feature-item']}>
                <div className={styles['feature-icon']}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h3 className={styles['feature-title']}>Seguimiento en Tiempo Real</h3>
                  <p className={styles['feature-text']}>Monitorea el progreso de tus denuncias</p>
                </div>
              </div>

              <div className={styles['feature-item']}>
                <div className={styles['feature-icon']}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <h3 className={styles['feature-title']}>Comunidad Activa</h3>
                  <p className={styles['feature-text']}>Colabora con otros ciudadanos y autoridades</p>
                </div>
              </div>
            </div>

            <div className={styles['stats']}>
              <div className={styles['stat-item']}>
                <span className={styles['stat-number']}>1,234+</span>
                <span className={styles['stat-label']}>Denuncias Resueltas</span>
              </div>
              <div className={styles['stat-item']}>
                <span className={styles['stat-number']}>850+</span>
                <span className={styles['stat-label']}>Ciudadanos Activos</span>
              </div>
              <div className={styles['stat-item']}>
                <span className={styles['stat-number']}>98%</span>
                <span className={styles['stat-label']}>Satisfacción</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho - Formulario */}
        <div className={styles['form-section']}>
          <div className={styles['form-content']}>
            <div className={styles['login-header']}>
              <h1 className={styles['login-title']}>Iniciar Sesión</h1>
              <p className={styles['login-subtitle']}>
                Ingresa a tu cuenta para continuar
              </p>
            </div>

            {error && <Alert type="error" message={error} />}
            {googleError && <Alert type="error" message={googleError} />}

            {/* Botón de Google */}
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              disabled={cargando || !isGoogleLoaded}
              className={styles['google-button']}
              title={!isGoogleLoaded ? 'Cargando Google SDK...' : 'Iniciar sesión con Google'}
            >
              <GoogleIcon />
              <span>
                {cargando ? 'Cargando...' : !isGoogleLoaded ? 'Cargando Google...' : 'Continuar con Google'}
              </span>
            </button>
            
            {!isConfigured && (
              <div style={{ fontSize: '0.875rem', color: '#ef4444', marginTop: '0.5rem', textAlign: 'center' }}>
                ⚠️ Google OAuth no configurado. Verifica el archivo .env
              </div>
            )}

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
      </div>
    </div>
  );
};

export default LoginPage;
