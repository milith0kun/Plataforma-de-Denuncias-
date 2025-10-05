import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import Alert from '../../../components/common/Alert/Alert';
import styles from './ForgotPasswordPage.module.css';

const ForgotPasswordPage = () => {
  const { solicitarRecuperacion } = useAuth();
  const [formData, setFormData] = useState({
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState('');

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

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
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
      await solicitarRecuperacion(formData.email);
      setSuccess(true);
    } catch (error) {
      console.error('Error al solicitar recuperación:', error);
      setGeneralError(error.message || 'Error al enviar solicitud de recuperación');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.forgotPasswordPage}>
        <div className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>📧</div>
            <h1 className={styles.successTitle}>
              Solicitud Enviada
            </h1>
            <p className={styles.successMessage}>
              Hemos enviado un enlace de recuperación a <strong>{formData.email}</strong>
            </p>
            <p className={styles.successInstructions}>
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña. 
              Si no recibes el email en unos minutos, revisa tu carpeta de spam.
            </p>
            
            <div className={styles.successActions}>
              <Link to="/login" className={styles.btnPrimary}>
                Volver al Login
              </Link>
              <button 
                onClick={() => setSuccess(false)}
                className={styles.btnSecondary}
              >
                Enviar Nuevamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.forgotPasswordPage}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.icon}>🔑</div>
            <h1 className={styles.title}>
              ¿Olvidaste tu contraseña?
            </h1>
            <p className={styles.subtitle}>
              No te preocupes, te ayudamos a recuperarla. Ingresa tu email y te enviaremos 
              un enlace para restablecer tu contraseña.
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
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="tu@email.com"
              required
              autoComplete="email"
              autoFocus
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              loading={loading}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
            </Button>
          </form>

          <div className={styles.footer}>
            <p className={styles.backToLogin}>
              ¿Recordaste tu contraseña?{' '}
              <Link to="/login" className={styles.loginLink}>
                Iniciar Sesión
              </Link>
            </p>
            
            <div className={styles.help}>
              <p className={styles.helpText}>
                ¿Necesitas ayuda? Contacta a nuestro{' '}
                <a href="mailto:soporte@denuncias.gov.co" className={styles.supportLink}>
                  equipo de soporte
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;