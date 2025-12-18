import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import Alert from '../../../components/common/Alert/Alert';
import styles from './ResetPasswordPage.module.css';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { restablecerPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Verificar que el token esté presente
  useEffect(() => {
    if (!token || !email) {
      setTokenValid(false);
      setGeneralError('Enlace de recuperación inválido o expirado');
    }
  }, [token, email]);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos: una letra minúscula, una mayúscula, un número y un carácter especial';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setGeneralError('');

    try {
      await restablecerPassword({
        token,
        email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      setSuccess(true);
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      if (error.message.includes('token') || error.message.includes('expirado')) {
        setTokenValid(false);
      }
      setGeneralError(error.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  // Redirigir al login después del éxito
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // Si el token no es válido
  if (!tokenValid) {
    return (
      <div className={styles.resetPasswordPage}>
        <div className={styles.container}>
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>⚠️</div>
            <h1 className={styles.errorTitle}>
              Enlace Inválido
            </h1>
            <p className={styles.errorMessage}>
              El enlace de recuperación es inválido o ha expirado. 
              Por favor, solicita un nuevo enlace de recuperación.
            </p>
            
            <div className={styles.errorActions}>
              <Link to="/forgot-password" className={styles.btnPrimary}>
                Solicitar Nuevo Enlace
              </Link>
              <Link to="/login" className={styles.btnSecondary}>
                Volver al Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si el restablecimiento fue exitoso
  if (success) {
    return (
      <div className={styles.resetPasswordPage}>
        <div className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✅</div>
            <h1 className={styles.successTitle}>
              ¡Contraseña Restablecida!
            </h1>
            <p className={styles.successMessage}>
              Tu contraseña ha sido restablecida exitosamente. 
              Ahora puedes iniciar sesión con tu nueva contraseña.
            </p>
            <p className={styles.redirectMessage}>
              Serás redirigido al login en unos segundos...
            </p>
            
            <div className={styles.successActions}>
              <Link to="/login" className={styles.btnPrimary}>
                Ir al Login Ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.resetPasswordPage}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.icon}>🔐</div>
            <h1 className={styles.title}>
              Restablecer Contraseña
            </h1>
            <p className={styles.subtitle}>
              Ingresa tu nueva contraseña para <strong>{email}</strong>
            </p>
          </div>

          {generalError && (
            <Alert
              tipo="error"
              mensaje={generalError}
              onClose={() => setGeneralError('')}
            />
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Nueva Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="Ingresa tu nueva contraseña"
              required
              autoComplete="new-password"
              autoFocus
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              placeholder="Confirma tu nueva contraseña"
              required
              autoComplete="new-password"
            />

            <div className={styles.passwordRequirements}>
              <h4>Requisitos de la contraseña:</h4>
              <ul>
                <li className={formData.password.length >= 8 ? styles.valid : ''}>
                  Al menos 8 caracteres
                </li>
                <li className={/[a-z]/.test(formData.password) ? styles.valid : ''}>
                  Una letra minúscula
                </li>
                <li className={/[A-Z]/.test(formData.password) ? styles.valid : ''}>
                  Una letra mayúscula
                </li>
                <li className={/\d/.test(formData.password) ? styles.valid : ''}>
                  Un número
                </li>
                <li className={/[@$!%*?&]/.test(formData.password) ? styles.valid : ''}>
                  Un carácter especial (@$!%*?&)
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              loading={loading}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </Button>
          </form>

          <div className={styles.footer}>
            <p className={styles.backToLogin}>
              ¿Recordaste tu contraseña?{' '}
              <Link to="/login" className={styles.loginLink}>
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;