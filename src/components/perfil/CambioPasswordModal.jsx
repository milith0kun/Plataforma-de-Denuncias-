import React, { useState, useEffect } from 'react';
import styles from './CambioPasswordModal.module.css';
import Button from '../common/Button/Button';

/**
 * Modal para cambio de contraseña
 * Permite al usuario cambiar su contraseña actual por una nueva
 */
const CambioPasswordModal = ({ onCambiar, onCerrar }) => {
  const [formData, setFormData] = useState({
    password_actual: '',
    password_nuevo: '',
    confirmar_password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nuevo: false,
    confirmar: false
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCerrar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCerrar]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  /**
   * Evalúa la fortaleza de la contraseña
   * @param {string} password - Contraseña a evaluar
   * @returns {Object} Puntuación y retroalimentación
   */
  const evaluatePasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Debe tener al menos 8 caracteres');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Debe incluir letras minúsculas');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Debe incluir letras mayúsculas');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Debe incluir números');
    }

    if (/[@$!%*?&]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Debe incluir caracteres especiales (@$!%*?&)');
    }

    if (password.length >= 12) {
      score += 1;
    }

    return { score, feedback };
  };

  /**
   * Maneja los cambios en los campos del formulario
   * @param {Event} e - Evento del input
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Evaluar fortaleza de la nueva contraseña
    if (name === 'password_nuevo') {
      setPasswordStrength(evaluatePasswordStrength(value));
    }
  };

  /**
   * Alterna la visibilidad de una contraseña
   * @param {string} field - Campo de contraseña a alternar
   */
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  /**
   * Valida los datos del formulario
   * @returns {boolean} True si es válido, false si hay errores
   */
  const validateForm = () => {
    const newErrors = {};

    // Validar contraseña actual
    if (!formData.password_actual) {
      newErrors.password_actual = 'La contraseña actual es obligatoria';
    }

    // Validar nueva contraseña
    if (!formData.password_nuevo) {
      newErrors.password_nuevo = 'La nueva contraseña es obligatoria';
    } else {
      const strength = evaluatePasswordStrength(formData.password_nuevo);
      if (strength.score < 4) {
        newErrors.password_nuevo = 'La contraseña no cumple con los requisitos mínimos';
      }
    }

    // Validar confirmación de contraseña
    if (!formData.confirmar_password) {
      newErrors.confirmar_password = 'La confirmación de contraseña es obligatoria';
    } else if (formData.password_nuevo !== formData.confirmar_password) {
      newErrors.confirmar_password = 'Las contraseñas no coinciden';
    }

    // Validar que la nueva contraseña sea diferente a la actual
    if (formData.password_actual && formData.password_nuevo && 
        formData.password_actual === formData.password_nuevo) {
      newErrors.password_nuevo = 'La nueva contraseña debe ser diferente a la actual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onCambiar(formData);
      // Si llegamos aquí, el cambio fue exitoso
      onCerrar();
    } catch (error) {
      // Manejar errores específicos
      if (error.message.includes('contraseña actual')) {
        setErrors({ password_actual: 'La contraseña actual es incorrecta' });
      } else {
        setErrors({ general: error.message || 'Error al cambiar la contraseña' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Obtiene la clase CSS para el indicador de fortaleza
   * @returns {string} Clase CSS
   */
  const getStrengthClass = () => {
    if (passwordStrength.score <= 2) return styles.strengthWeak;
    if (passwordStrength.score <= 4) return styles.strengthMedium;
    return styles.strengthStrong;
  };

  /**
   * Obtiene el texto del indicador de fortaleza
   * @returns {string} Texto descriptivo
   */
  const getStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Débil';
    if (passwordStrength.score <= 4) return 'Media';
    return 'Fuerte';
  };

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Cambiar Contraseña</h2>
          <button
            className={styles.closeButton}
            onClick={onCerrar}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Error general */}
          {errors.general && (
            <div className={styles.errorGeneral}>
              <span className={styles.errorIcon}>⚠️</span>
              {errors.general}
            </div>
          )}

          {/* Contraseña actual */}
          <div className={styles.formGroup}>
            <label htmlFor="password_actual" className={styles.label}>
              Contraseña Actual *
            </label>
            <div className={styles.passwordField}>
              <input
                type={showPasswords.actual ? 'text' : 'password'}
                id="password_actual"
                name="password_actual"
                value={formData.password_actual}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.password_actual ? styles.inputError : ''}`}
                placeholder="Ingresa tu contraseña actual"
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => togglePasswordVisibility('actual')}
                aria-label={showPasswords.actual ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPasswords.actual ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password_actual && (
              <span className={styles.errorMessage}>{errors.password_actual}</span>
            )}
          </div>

          {/* Nueva contraseña */}
          <div className={styles.formGroup}>
            <label htmlFor="password_nuevo" className={styles.label}>
              Nueva Contraseña *
            </label>
            <div className={styles.passwordField}>
              <input
                type={showPasswords.nuevo ? 'text' : 'password'}
                id="password_nuevo"
                name="password_nuevo"
                value={formData.password_nuevo}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.password_nuevo ? styles.inputError : ''}`}
                placeholder="Ingresa tu nueva contraseña"
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => togglePasswordVisibility('nuevo')}
                aria-label={showPasswords.nuevo ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPasswords.nuevo ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            
            {/* Indicador de fortaleza */}
            {formData.password_nuevo && (
              <div className={styles.strengthIndicator}>
                <div className={styles.strengthBar}>
                  <div 
                    className={`${styles.strengthFill} ${getStrengthClass()}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
                <span className={`${styles.strengthText} ${getStrengthClass()}`}>
                  {getStrengthText()}
                </span>
              </div>
            )}
            
            {errors.password_nuevo && (
              <span className={styles.errorMessage}>{errors.password_nuevo}</span>
            )}
            
            {/* Requisitos de contraseña */}
            {formData.password_nuevo && passwordStrength.feedback.length > 0 && (
              <div className={styles.requirements}>
                <p className={styles.requirementsTitle}>Requisitos faltantes:</p>
                <ul className={styles.requirementsList}>
                  {passwordStrength.feedback.map((req, index) => (
                    <li key={index} className={styles.requirement}>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmar_password" className={styles.label}>
              Confirmar Nueva Contraseña *
            </label>
            <div className={styles.passwordField}>
              <input
                type={showPasswords.confirmar ? 'text' : 'password'}
                id="confirmar_password"
                name="confirmar_password"
                value={formData.confirmar_password}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.confirmar_password ? styles.inputError : ''}`}
                placeholder="Confirma tu nueva contraseña"
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => togglePasswordVisibility('confirmar')}
                aria-label={showPasswords.confirmar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPasswords.confirmar ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmar_password && (
              <span className={styles.errorMessage}>{errors.confirmar_password}</span>
            )}
          </div>

          {/* Botones de acción */}
          <div className={styles.formActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={onCerrar}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || passwordStrength.score < 4}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Cambiando...
                </>
              ) : (
                'Cambiar Contraseña'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CambioPasswordModal;