import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import Alert from '../../../components/common/Alert/Alert';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registrarCiudadano, error } = useAuth();
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    documento_identidad: '',
    email: '',
    telefono: '',
    direccion: '',
    password: '',
    confirmarPassword: ''
  });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombres.trim()) {
      nuevosErrores.nombres = 'Los nombres son obligatorios';
    }

    if (!formData.apellidos.trim()) {
      nuevosErrores.apellidos = 'Los apellidos son obligatorios';
    }

    if (!formData.documento_identidad.trim()) {
      nuevosErrores.documento_identidad = 'El documento es obligatorio';
    } else if (formData.documento_identidad.length < 8) {
      nuevosErrores.documento_identidad = 'El documento debe tener al menos 8 caracteres';
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nuevosErrores.email = 'Email inválido';
    }

    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';
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
      // Enviar solo los campos necesarios (sin confirmarPassword)
      const { confirmarPassword, ...datosRegistro } = formData;
      await registrarCiudadano(datosRegistro);
      navigate('/home'); // Redirigir a la página de inicio del usuario autenticado
    } catch (error) {
      console.error('Error en registro:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles['register-container']}>
      <div className={styles['register-card']}>
        <div className={styles['register-header']}>
          <h1 className={styles['register-title']}>Registro de Ciudadano</h1>
          <p className={styles['register-subtitle']}>
            Crea tu cuenta para reportar problemas urbanos
          </p>
        </div>

        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleSubmit} className={styles['register-form']}>
          <div className={styles['form-row']}>
            <Input
              label="Nombres"
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              error={errores.nombres}
              placeholder="Juan Carlos"
              required
            />

            <Input
              label="Apellidos"
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              error={errores.apellidos}
              placeholder="Pérez López"
              required
            />
          </div>

          <div className={styles['form-row']}>
            <Input
              label="Documento de Identidad"
              type="text"
              name="documento_identidad"
              value={formData.documento_identidad}
              onChange={handleChange}
              error={errores.documento_identidad}
              placeholder="12345678"
              required
            />

            <Input
              label="Teléfono"
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              error={errores.telefono}
              placeholder="987654321"
            />
          </div>

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
            label="Dirección"
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            error={errores.direccion}
            placeholder="Av. Principal 123"
          />

          <div className={styles['form-row']}>
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

            <Input
              label="Confirmar Contraseña"
              type="password"
              name="confirmarPassword"
              value={formData.confirmarPassword}
              onChange={handleChange}
              error={errores.confirmarPassword}
              placeholder="••••••••"
              required
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={cargando}
          >
            {cargando ? 'Registrando...' : 'Registrarse'}
          </Button>
        </form>

        <div className={styles['login-link']}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión aquí</Link>
        </div>
        
        <div className={styles['authority-link']}>
          ¿Eres una autoridad?{' '}
          <Link to="/register-authority">Regístrate como autoridad</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
