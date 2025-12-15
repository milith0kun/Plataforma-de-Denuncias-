import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../../components/common/Button/Button';
import Loading from '../../../components/common/Loading/Loading';
import styles from './RegisterAuthorityPage.module.css';

// Iconos SVG para mostrar/ocultar contraseña
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/**
 * Página de registro para autoridades
 * Permite a las autoridades registrarse en el sistema
 */
const RegisterAuthorityPage = () => {
  const { registrarAutoridad, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    numero_documento: '',
    cargo: '',
    institucion: '',
    codigo_autoridad: '',
    direccion: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Maneja los cambios en los campos del formulario
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
  };

  /**
   * Valida los datos del formulario
   */
  const validateForm = () => {
    const newErrors = {};

    // Validar nombres
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son obligatorios';
    } else if (formData.nombres.trim().length < 2) {
      newErrors.nombres = 'Los nombres deben tener al menos 2 caracteres';
    }

    // Validar apellidos
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
    } else if (formData.apellidos.trim().length < 2) {
      newErrors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email debe tener un formato válido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debe confirmar la contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar número de documento
    if (!formData.numero_documento.trim()) {
      newErrors.numero_documento = 'El número de documento es obligatorio';
    } else if (formData.numero_documento.trim().length < 8) {
      newErrors.numero_documento = 'El número de documento debe tener al menos 8 caracteres';
    }

    // Validar cargo
    if (!formData.cargo.trim()) {
      newErrors.cargo = 'El cargo es obligatorio';
    }

    // Validar institución
    if (!formData.institucion.trim()) {
      newErrors.institucion = 'La institución es obligatoria';
    }

    // Validar código de autoridad
    if (!formData.codigo_autoridad.trim()) {
      newErrors.codigo_autoridad = 'El código de autoridad es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const datosRegistro = {
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirm_password: formData.confirmPassword,
        telefono: formData.telefono.trim() || '',
        documento_identidad: formData.numero_documento.trim(),
        cargo: formData.cargo.trim(),
        area_responsabilidad: formData.institucion.trim(),
        numero_empleado: formData.codigo_autoridad.trim(),
        direccion_registro: formData.direccion.trim() || 'No especificada',
        fecha_ingreso: new Date().toISOString().split('T')[0] // Fecha actual en formato YYYY-MM-DD
      };

      console.log('📤 Datos a enviar:', JSON.stringify(datosRegistro, null, 2));

      await registrarAutoridad(datosRegistro);

      // Redirigir a página de confirmación o login
      navigate('/login', {
        state: {
          message: 'Registro de autoridad enviado. Espere la verificación de su cuenta.'
        }
      });
    } catch (error) {
      console.error('❌ Error en registro de autoridad:', error);

      // Extraer mensaje específico del error
      let errorMessage = 'Error desconocido en el registro';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map(err => err.message).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error('📋 Mensaje de error específico:', errorMessage);
      console.error('📊 Datos de respuesta completos:', error.response?.data);

      // Mostrar el error al usuario (puedes implementar un toast o modal aquí)
      alert(`Error en el registro: ${errorMessage}`);
    }
  };

  return (
    <div className={styles.registerAuthorityPage}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.registerCard}>
            <div className={styles.header}>
              <h1 className={styles.title}>Registro de Autoridad</h1>
              <p className={styles.subtitle}>
                Complete el formulario para registrarse como autoridad
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Información Personal */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Información Personal</h3>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="nombres" className={styles.label}>
                      Nombres *
                    </label>
                    <input
                      type="text"
                      id="nombres"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.nombres ? styles.inputError : ''}`}
                      placeholder="Ingrese sus nombres"
                    />
                    {errors.nombres && (
                      <span className={styles.errorMessage}>{errors.nombres}</span>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="apellidos" className={styles.label}>
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.apellidos ? styles.inputError : ''}`}
                      placeholder="Ingrese sus apellidos"
                    />
                    {errors.apellidos && (
                      <span className={styles.errorMessage}>{errors.apellidos}</span>
                    )}
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="numero_documento" className={styles.label}>
                      Número de Documento *
                    </label>
                    <input
                      type="text"
                      id="numero_documento"
                      name="numero_documento"
                      value={formData.numero_documento}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.numero_documento ? styles.inputError : ''}`}
                      placeholder="Ingrese su número de documento"
                    />
                    {errors.numero_documento && (
                      <span className={styles.errorMessage}>{errors.numero_documento}</span>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="telefono" className={styles.label}>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Ingrese su teléfono"
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    placeholder="Ingrese su correo electrónico"
                  />
                  {errors.email && (
                    <span className={styles.errorMessage}>{errors.email}</span>
                  )}
                </div>
              </div>

              {/* Información Institucional */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Información Institucional</h3>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="cargo" className={styles.label}>
                      Cargo *
                    </label>
                    <select
                      id="cargo"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.cargo ? styles.inputError : ''}`}
                    >
                      <option value="">Seleccione un cargo</option>
                      <option value="Alcalde">Alcalde</option>
                      <option value="Regidor">Regidor</option>
                      <option value="Gerente Municipal">Gerente Municipal</option>
                      <option value="Subgerente">Subgerente</option>
                      <option value="Jefe de Área">Jefe de Área</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Inspector">Inspector</option>
                      <option value="Coordinador">Coordinador</option>
                      <option value="Técnico Municipal">Técnico Municipal</option>
                      <option value="Otro">Otro</option>
                    </select>
                    {errors.cargo && (
                      <span className={styles.errorMessage}>{errors.cargo}</span>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="institucion" className={styles.label}>
                      Área de Responsabilidad *
                    </label>
                    <select
                      id="institucion"
                      name="institucion"
                      value={formData.institucion}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.institucion ? styles.inputError : ''}`}
                    >
                      <option value="">Seleccione un área</option>
                      <option value="Obras Públicas">Obras Públicas</option>
                      <option value="Servicios Urbanos">Servicios Urbanos</option>
                      <option value="Limpieza y Saneamiento">Limpieza y Saneamiento</option>
                      <option value="Seguridad Ciudadana">Seguridad Ciudadana</option>
                      <option value="Desarrollo Urbano">Desarrollo Urbano</option>
                      <option value="Gestión Ambiental">Gestión Ambiental</option>
                      <option value="Transporte y Vialidad">Transporte y Vialidad</option>
                      <option value="Servicios Públicos">Servicios Públicos</option>
                      <option value="Administración General">Administración General</option>
                      <option value="Otra">Otra</option>
                    </select>
                    {errors.institucion && (
                      <span className={styles.errorMessage}>{errors.institucion}</span>
                    )}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="codigo_autoridad" className={styles.label}>
                    Código de Autoridad *
                  </label>
                  <input
                    type="text"
                    id="codigo_autoridad"
                    name="codigo_autoridad"
                    value={formData.codigo_autoridad}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.codigo_autoridad ? styles.inputError : ''}`}
                    placeholder="Código institucional de identificación"
                  />
                  {errors.codigo_autoridad && (
                    <span className={styles.errorMessage}>{errors.codigo_autoridad}</span>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="direccion" className={styles.label}>
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.direccion ? styles.inputError : ''}`}
                    placeholder="Dirección de la institución (opcional)"
                  />
                  {errors.direccion && (
                    <span className={styles.errorMessage}>{errors.direccion}</span>
                  )}
                </div>
              </div>

              {/* Contraseña */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Contraseña</h3>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>
                      Contraseña *
                    </label>
                    <div className={styles.passwordContainer}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                        placeholder="Ingrese su contraseña"
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                      </button>
                    </div>
                    {errors.password && (
                      <span className={styles.errorMessage}>{errors.password}</span>
                    )}
                    <div className={styles.passwordRequirements}>
                      <small className={styles.helpText}>
                        La contraseña debe contener:
                        <ul>
                          <li>Mínimo 8 caracteres</li>
                          <li>Al menos una letra mayúscula</li>
                          <li>Al menos una letra minúscula</li>
                          <li>Al menos un número</li>
                        </ul>
                      </small>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword" className={styles.label}>
                      Confirmar Contraseña *
                    </label>
                    <div className={styles.passwordContainer}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                        placeholder="Confirme su contraseña"
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <span className={styles.errorMessage}>{errors.confirmPassword}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.actions}>
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  disabled={loading}
                  className={styles.submitButton}
                >
                  {loading ? <Loading /> : 'Registrar Autoridad'}
                </Button>
              </div>
            </form>

            <div className={styles.footer}>
              <p>
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className={styles.link}>
                  Inicia sesión aquí
                </Link>
              </p>
              <p>
                ¿Eres ciudadano?{' '}
                <Link to="/register" className={styles.link}>
                  Regístrate como ciudadano
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterAuthorityPage;