import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import styles from './NuevaDenunciaPage.module.css';

const NuevaDenunciaPage = () => {
  const navigate = useNavigate();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    ubicacion: '',
    fechaIncidente: '',
    prioridad: 'media',
    esAnonima: false,
    evidencias: []
  });

  // Estado para manejo de archivos
  const [archivos, setArchivos] = useState([]);
  const [cargandoArchivos, setCargandoArchivos] = useState(false);

  // Estado del formulario
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState({});

  // Categorías disponibles
  const categorias = [
    { value: 'corrupcion', label: 'Corrupción' },
    { value: 'abuso_autoridad', label: 'Abuso de Autoridad' },
    { value: 'fraude', label: 'Fraude' },
    { value: 'discriminacion', label: 'Discriminación' },
    { value: 'acoso', label: 'Acoso' },
    { value: 'negligencia', label: 'Negligencia' },
    { value: 'otros', label: 'Otros' }
  ];

  // Manejar cambios en inputs
  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejar carga de archivos
  const manejarArchivos = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    setCargandoArchivos(true);
    
    // Simular procesamiento de archivos
    setTimeout(() => {
      setArchivos(prev => [...prev, ...nuevosArchivos]);
      setCargandoArchivos(false);
    }, 1000);
  };

  // Eliminar archivo
  const eliminarArchivo = (index) => {
    setArchivos(prev => prev.filter((_, i) => i !== index));
  };

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.titulo.trim()) {
      nuevosErrores.titulo = 'El título es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.length < 50) {
      nuevosErrores.descripcion = 'La descripción debe tener al menos 50 caracteres';
    }

    if (!formData.categoria) {
      nuevosErrores.categoria = 'Selecciona una categoría';
    }

    if (!formData.ubicacion.trim()) {
      nuevosErrores.ubicacion = 'La ubicación es obligatoria';
    }

    if (!formData.fechaIncidente) {
      nuevosErrores.fechaIncidente = 'La fecha del incidente es obligatoria';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Enviar formulario
  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setEnviando(true);

    try {
      // Simular envío de denuncia
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mostrar mensaje de éxito y redirigir
      alert('Denuncia enviada exitosamente');
      navigate('/denuncias');
    } catch (error) {
      console.error('Error al enviar denuncia:', error);
      alert('Error al enviar la denuncia. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Nueva Denuncia</h1>
          <p className={styles.subtitle}>
            Reporta irregularidades de manera segura y confidencial
          </p>
        </div>

        <form onSubmit={manejarEnvio} className={styles.form}>
          {/* Información básica */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Información Básica</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="titulo" className={styles.label}>
                Título de la Denuncia *
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={manejarCambio}
                className={`${styles.input} ${errores.titulo ? styles.inputError : ''}`}
                placeholder="Describe brevemente el problema"
                maxLength={100}
              />
              {errores.titulo && <span className={styles.error}>{errores.titulo}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="categoria" className={styles.label}>
                Categoría *
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={manejarCambio}
                className={`${styles.select} ${errores.categoria ? styles.inputError : ''}`}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errores.categoria && <span className={styles.error}>{errores.categoria}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="descripcion" className={styles.label}>
                Descripción Detallada *
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={manejarCambio}
                className={`${styles.textarea} ${errores.descripcion ? styles.inputError : ''}`}
                placeholder="Describe detalladamente lo ocurrido, incluyendo fechas, lugares, personas involucradas y cualquier información relevante..."
                rows={6}
                maxLength={2000}
              />
              <div className={styles.charCount}>
                {formData.descripcion.length}/2000 caracteres
              </div>
              {errores.descripcion && <span className={styles.error}>{errores.descripcion}</span>}
            </div>
          </div>

          {/* Detalles del incidente */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Detalles del Incidente</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="fechaIncidente" className={styles.label}>
                  Fecha del Incidente *
                </label>
                <input
                  type="date"
                  id="fechaIncidente"
                  name="fechaIncidente"
                  value={formData.fechaIncidente}
                  onChange={manejarCambio}
                  className={`${styles.input} ${errores.fechaIncidente ? styles.inputError : ''}`}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errores.fechaIncidente && <span className={styles.error}>{errores.fechaIncidente}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="prioridad" className={styles.label}>
                  Prioridad
                </label>
                <select
                  id="prioridad"
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={manejarCambio}
                  className={styles.select}
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ubicacion" className={styles.label}>
                Ubicación *
              </label>
              <input
                type="text"
                id="ubicacion"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={manejarCambio}
                className={`${styles.input} ${errores.ubicacion ? styles.inputError : ''}`}
                placeholder="Dirección, institución o lugar donde ocurrió el incidente"
              />
              {errores.ubicacion && <span className={styles.error}>{errores.ubicacion}</span>}
            </div>
          </div>

          {/* Evidencias */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Evidencias (Opcional)</h2>
            <p className={styles.sectionDescription}>
              Puedes adjuntar documentos, imágenes o videos que respalden tu denuncia
            </p>
            
            <div className={styles.fileUpload}>
              <input
                type="file"
                id="evidencias"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mp3"
                onChange={manejarArchivos}
                className={styles.fileInput}
              />
              <label htmlFor="evidencias" className={styles.fileLabel}>
                <span className={styles.fileIcon}>📎</span>
                Seleccionar Archivos
              </label>
            </div>

            {cargandoArchivos && (
              <div className={styles.loading}>
                Procesando archivos...
              </div>
            )}

            {archivos.length > 0 && (
              <div className={styles.fileList}>
                {archivos.map((archivo, index) => (
                  <div key={index} className={styles.fileItem}>
                    <span className={styles.fileName}>{archivo.name}</span>
                    <span className={styles.fileSize}>
                      ({(archivo.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <button
                      type="button"
                      onClick={() => eliminarArchivo(index)}
                      className={styles.removeFile}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Opciones de privacidad */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Opciones de Privacidad</h2>
            
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="esAnonima"
                name="esAnonima"
                checked={formData.esAnonima}
                onChange={manejarCambio}
                className={styles.checkbox}
              />
              <label htmlFor="esAnonima" className={styles.checkboxLabel}>
                Enviar denuncia de forma anónima
              </label>
            </div>
            <p className={styles.privacyNote}>
              Si seleccionas esta opción, tu identidad no será revelada en el proceso de investigación.
              Sin embargo, esto puede limitar el seguimiento de tu caso.
            </p>
          </div>

          {/* Botones de acción */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => navigate('/inicio')}
              className={styles.cancelBtn}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={enviando}
            >
              {enviando ? 'Enviando...' : 'Enviar Denuncia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevaDenunciaPage;