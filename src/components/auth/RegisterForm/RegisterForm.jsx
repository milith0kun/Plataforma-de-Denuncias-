import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';
import Alert from '../../common/Alert/Alert';
import Loading from '../../common/Loading/Loading';
import styles from './RegisterForm.module.css';

const RegisterForm = ({ tipo = 'ciudadano', onSuccess }) => {
  const { registrarCiudadano, registrarAutoridad, cargando, error, limpiarError } = useAuth();
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    documento_identidad: '',
    email: '',
    password: '',
    confirmarPassword: '',
    telefono: '',
    direccion: '',
    // Campos específicos para autoridades
    area_responsabilidad: '',
    cargo: ''
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

    // Validaciones comunes
    if (!formData.nombres.trim()) {
      nuevosErrores.nombres = 'Los nombres son obligatorios';
    }

    if (!formData.apellidos.trim()) {
      nuevosErrores.apellidos = 'Los apellidos son obligatorios';
    }

    if (!formData.documento_identidad.trim()) {
      nuevosErrores.documento_identidad = 'El documento de identidad es obligatorio';
    } else if (!/^\d{8,12}$/.test(formData.documento_identidad)) {
      nuevosErrores.documento_identidad = 'El documento debe tener entre 8 y 12 dígitos';
    }

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

    if (!formData.confirmarPassword.trim()) {
      nuevosErrores.confirmarPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
    } else if (!/^\d{9,15}$/.test(formData.telefono.replace(/\s/g, ''))) {
      nuevosErrores.telefono = 'El teléfono debe tener entre 9 y 15 dígitos';
    }

    // Validaciones específicas para autoridades
    if (tipo === 'autoridad') {
      if (!formData.area_responsabilidad.trim()) {
        nuevosErrores.area_responsabilidad = 'El área de responsabilidad es obligatoria';
      }

      if (!formData.cargo.trim()) {
        nuevosErrores.cargo = 'El cargo es obligatorio';
      }
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
      // Preparar datos para envío
      const datosEnvio = {
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        documento_identidad: formData.documento_identidad.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        telefono: formData.telefono.trim(),
        direccion: formData.direccion.trim()
      };

      // Agregar campos específicos para autoridades
      if (tipo === 'autoridad') {
        datosEnvio.area_responsabilidad = formData.area_responsabilidad.trim();
        datosEnvio.cargo = formData.cargo.trim();
      }

      // Llamar al servicio correspondiente
      if (tipo === 'autoridad') {
        await registrarAutoridad(datosEnvio);
      } else {
        await registrarCiudadano(datosEnvio);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // El error ya se maneja en el contexto
      console.error('Error en registro:', error);
    }
  };

  const tituloFormulario = tipo === 'autoridad' ? 'Registro de Autoridad' : 'Registro de Ciudadano';
  const subtituloFormulario = tipo === 'autoridad' 
    ? 'Crea tu cuenta como autoridad municipal'
    : 'Crea tu cuenta para reportar problemas urbanos';

  return (
    <div className={styles.registerForm}>
      <div className={styles.header}>
        <h2 className={styles.titulo}>{tituloFormulario}</h2>
        <p className={styles.subtitulo}>{subtituloFormulario}</p>
      </div>

      {error && (
        <Alert 
          tipo="error" 
          mensaje={error} 
          onClose={limpiarError}
        />
      )}

      <form onSubmit={handleSubmit} className={styles.formulario}>
        <div className={styles.fila}>
          <Input
            label="Nombres"
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            error={errores.nombres}
            placeholder="Tus nombres"
            required
          />

          <Input
            label="Apellidos"
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            error={errores.apellidos}
            placeholder="Tus apellidos"
            required
          />
        </div>

        <div className={styles.fila}>
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
            required
          />
        </div>

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
          label="Dirección"
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          error={errores.direccion}
          placeholder="Tu dirección (opcional)"
        />

        {tipo === 'autoridad' && (
          <>
            <Input
              label="Área de Responsabilidad"
              type="text"
              name="area_responsabilidad"
              value={formData.area_responsabilidad}
              onChange={handleChange}
              error={errores.area_responsabilidad}
              placeholder="Ej: Obras Públicas, Servicios Urbanos"
              required
            />

            <Input
              label="Cargo"
              type="text"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              error={errores.cargo}
              placeholder="Tu cargo en la institución"
              required
            />
          </>
        )}

        <div className={styles.fila}>
          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errores.password}
            placeholder="Mínimo 6 caracteres"
            required
          />

          <Input
            label="Confirmar Contraseña"
            type="password"
            name="confirmarPassword"
            value={formData.confirmarPassword}
            onChange={handleChange}
            error={errores.confirmarPassword}
            placeholder="Repite tu contraseña"
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          disabled={cargando}
        >
          {cargando ? <Loading size="small" /> : 'Crear Cuenta'}
        </Button>
      </form>

      <div className={styles.footer}>
        <p className={styles.textoLogin}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.enlaceLogin}>
            Inicia sesión aquí
          </Link>
        </p>
        
        {/* Temporalmente comentado hasta implementar registro de autoridades
        {tipo === 'ciudadano' && (
          <p className={styles.textoAutoridad}>
            ¿Eres autoridad municipal?{' '}
            <Link to="/register/autoridad" className={styles.enlaceAutoridad}>
              Regístrate como autoridad
            </Link>
          </p>
        )}
        */}
      </div>
    </div>
  );
};

export default RegisterForm;