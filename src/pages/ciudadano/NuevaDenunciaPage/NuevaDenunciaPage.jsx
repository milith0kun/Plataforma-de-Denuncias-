import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import denunciaService from '../../../services/denunciaService';
import styles from './NuevaDenunciaPage.module.css';

const NuevaDenunciaPage = () => {
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion_detallada: '',
    id_categoria: '',
    direccion_geolocalizada: '',
    latitud: null,
    longitud: null,
    es_anonima: false
  });

  // Estado para manejo de archivos
  const [archivos, setArchivos] = useState([]);
  const [cargandoArchivos, setCargandoArchivos] = useState(false);

  // Estado del formulario
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState({});

  // Categorías disponibles (de la API)
  const [categorias, setCategorias] = useState([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);

  // Cargar categorías al montar el componente
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setCargandoCategorias(true);
      const response = await denunciaService.obtenerCategorias();
      if (response.success) {
        setCategorias(response.data.categorias);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setCargandoCategorias(false);
    }
  };

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

    if (!formData.descripcion_detallada.trim()) {
      nuevosErrores.descripcion_detallada = 'La descripción es obligatoria';
    } else if (formData.descripcion_detallada.length < 20) {
      nuevosErrores.descripcion_detallada = 'La descripción debe tener al menos 20 caracteres';
    }

    if (!formData.id_categoria) {
      nuevosErrores.id_categoria = 'Selecciona una categoría';
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
      // Preparar datos para enviar
      const datosDenuncia = {
        titulo: formData.titulo.trim(),
        descripcion_detallada: formData.descripcion_detallada.trim(),
        id_categoria: parseInt(formData.id_categoria),
        direccion_geolocalizada: formData.direccion_geolocalizada?.trim() || null,
        latitud: formData.latitud || null,
        longitud: formData.longitud || null,
        es_anonima: formData.es_anonima
      };

      // Crear la denuncia
      const response = await denunciaService.crearDenuncia(datosDenuncia);

      if (response.success) {
        // TODO: Subir evidencias si hay archivos
        // if (archivos.length > 0) {
        //   await subirEvidencias(response.data.denuncia.id_denuncia, archivos);
        // }

        alert('✅ Denuncia creada exitosamente');
        navigate('/denuncias');
      }
    } catch (error) {
      console.error('Error al enviar denuncia:', error);
      const mensajeError = error.message || 'Error al enviar la denuncia. Inténtalo de nuevo.';
      alert('❌ ' + mensajeError);
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
              <label htmlFor="id_categoria" className={styles.label}>
                Categoría *
              </label>
              {cargandoCategorias ? (
                <p>Cargando categorías...</p>
              ) : (
                <>
                  <select
                    id="id_categoria"
                    name="id_categoria"
                    value={formData.id_categoria}
                    onChange={manejarCambio}
                    className={`${styles.select} ${errores.id_categoria ? styles.inputError : ''}`}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                  {errores.id_categoria && <span className={styles.error}>{errores.id_categoria}</span>}
                </>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="descripcion_detallada" className={styles.label}>
                Descripción Detallada *
              </label>
              <textarea
                id="descripcion_detallada"
                name="descripcion_detallada"
                value={formData.descripcion_detallada}
                onChange={manejarCambio}
                className={`${styles.textarea} ${errores.descripcion_detallada ? styles.inputError : ''}`}
                placeholder="Describe detalladamente lo ocurrido, incluyendo fechas, lugares, personas involucradas y cualquier información relevante..."
                rows={6}
                maxLength={2000}
              />
              <div className={styles.charCount}>
                {formData.descripcion_detallada.length}/2000 caracteres
              </div>
              {errores.descripcion_detallada && <span className={styles.error}>{errores.descripcion_detallada}</span>}
            </div>
          </div>

          {/* Ubicación */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Ubicación</h2>

            <div className={styles.formGroup}>
              <label htmlFor="direccion_geolocalizada" className={styles.label}>
                Dirección o Ubicación (Opcional)
              </label>
              <input
                type="text"
                id="direccion_geolocalizada"
                name="direccion_geolocalizada"
                value={formData.direccion_geolocalizada}
                onChange={manejarCambio}
                className={styles.input}
                placeholder="Ej: Calle 123 #45-67, Barrio Centro"
              />
              <p className={styles.fieldNote}>
                Puedes especificar la dirección aproximada donde ocurrió el incidente
              </p>
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
                id="es_anonima"
                name="es_anonima"
                checked={formData.es_anonima}
                onChange={manejarCambio}
                className={styles.checkbox}
              />
              <label htmlFor="es_anonima" className={styles.checkboxLabel}>
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