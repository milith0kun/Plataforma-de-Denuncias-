/**
 * ============================================================================
 * COMPONENTE: FORMULARIO DE INICIO DE SESIÓN
 * ============================================================================
 * 
 * @file LoginForm.jsx
 * @description Formulario de autenticación que permite a los usuarios iniciar
 *              sesión en la plataforma con validación de credenciales.
 * 
 * @author Dennis Moises Ccapatinta Qqueccaño - 140984
 * @date 2024-12-18
 * @version 2.0.0
 * 
 * @component LoginForm
 * @category Autenticación
 * 
 * @requires React
 * @requires react-router-dom
 * @requires ../../../hooks/useAuth
 * @requires ../../common/Input/Input
 * @requires ../../common/Button/Button
 * @requires ../../common/Alert/Alert
 * @requires ../../common/Loading/Loading
 * 
 * @functionality
 * - Validación de formato de email
 * - Validación de longitud de contraseña
 * - Manejo de errores de autenticación
 * - Redirección tras login exitoso
 * - Enlace a recuperación de contraseña
 * 
 * @props {Function} onSuccess - Callback ejecutado tras login exitoso
 * 
 * ============================================================================
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';
import Alert from '../../common/Alert/Alert';
import Loading from '../../common/Loading/Loading';
import styles from './LoginForm.module.css';

const LoginForm = ({ onSuccess }) => {
  const { login, cargando, error, limpiarError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errores, setErrores] = useState({});

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error específico del campo
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Limpiar error general
    if (error) {
      limpiarError();
    }
  };

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'El email no es válido';
    }

    if (!formData.password.trim()) {
      nuevosErrores.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      await login(formData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // El error ya se maneja en el contexto
      console.error('Error en login:', error);
    }
  };

  return (
    <div className={styles.loginForm}>
      <div className={styles.header}>
        <h2 className={styles.titulo}>Iniciar Sesión</h2>
        <p className={styles.subtitulo}>
          Accede a tu cuenta para gestionar tus denuncias
        </p>
      </div>

      {error && (
        <Alert
          tipo="error"
          mensaje={error}
          onClose={limpiarError}
        />
      )}

      <form onSubmit={handleSubmit} className={styles.formulario}>
        <Input
          label="Email"
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
          placeholder="Tu contraseña"
          required
        />

        <div className={styles.opciones}>
          <Link to="/forgot-password" className={styles.enlaceRecuperacion}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          disabled={cargando}
        >
          {cargando ? <Loading size="small" /> : 'Iniciar Sesión'}
        </Button>
      </form>

      <div className={styles.footer}>
        <p className={styles.textoRegistro}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className={styles.enlaceRegistro}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;