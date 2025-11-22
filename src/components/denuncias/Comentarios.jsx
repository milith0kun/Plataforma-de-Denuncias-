import { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './Comentarios.module.css';

const Comentarios = ({ idDenuncia, esAutoridad = false }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [esInterno, setEsInterno] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarComentarios();
  }, [idDenuncia]);

  const cargarComentarios = async () => {
    try {
      setCargando(true);
      const response = await api.get(`/denuncias/${idDenuncia}/comentarios`);
      if (response.data.success) {
        setComentarios(response.data.data.comentarios);
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      setError('Error al cargar los comentarios');
    } finally {
      setCargando(false);
    }
  };

  const enviarComentario = async (e) => {
    e.preventDefault();

    if (!nuevoComentario.trim()) {
      setError('El comentario no puede estar vacío');
      return;
    }

    if (nuevoComentario.length > 1000) {
      setError('El comentario no puede exceder 1000 caracteres');
      return;
    }

    try {
      setEnviando(true);
      setError('');

      const response = await api.post(`/denuncias/${idDenuncia}/comentarios`, {
        comentario: nuevoComentario.trim(),
        es_interno: esInterno
      });

      if (response.data.success) {
        setNuevoComentario('');
        setEsInterno(false);
        await cargarComentarios();
      }
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      setError(error.response?.data?.error?.message || 'Error al enviar el comentario');
    } finally {
      setEnviando(false);
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const obtenerIniciales = (nombres, apellidos) => {
    const inicialNombre = nombres?.charAt(0) || '';
    const inicialApellido = apellidos?.charAt(0) || '';
    return `${inicialNombre}${inicialApellido}`.toUpperCase();
  };

  const obtenerColorPorRol = (tipoUsuario) => {
    switch (tipoUsuario) {
      case 'Ciudadano':
        return 'var(--color-role-ciudadano)';
      case 'Autoridad':
        return 'var(--color-role-autoridad)';
      case 'Admin':
        return 'var(--color-role-admin)';
      default:
        return 'var(--color-gray-500)';
    }
  };

  if (cargando) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando comentarios...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Comentarios ({comentarios.length})
        </h3>
      </div>

      {/* Formulario de nuevo comentario */}
      <form onSubmit={enviarComentario} className={styles.form}>
        <textarea
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          className={styles.textarea}
          placeholder="Escribe un comentario..."
          rows={3}
          maxLength={1000}
          disabled={enviando}
        />

        <div className={styles.formActions}>
          <div className={styles.charCount}>
            {nuevoComentario.length}/1000
          </div>

          {esAutoridad && (
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={esInterno}
                onChange={(e) => setEsInterno(e.target.checked)}
                disabled={enviando}
              />
              <span>Comentario interno (solo autoridades)</span>
            </label>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={enviando || !nuevoComentario.trim()}
          >
            {enviando ? 'Enviando...' : 'Comentar'}
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </form>

      {/* Lista de comentarios */}
      <div className={styles.comentariosList}>
        {comentarios.length === 0 ? (
          <div className={styles.empty}>
            <p>No hay comentarios aún</p>
            <p className={styles.emptySub}>Sé el primero en comentar</p>
          </div>
        ) : (
          comentarios.map((comentario) => (
            <div
              key={comentario.id_comentario}
              className={`${styles.comentario} ${comentario.es_interno ? styles.interno : ''}`}
            >
              <div className={styles.comentarioHeader}>
                <div
                  className={styles.avatar}
                  style={{ backgroundColor: obtenerColorPorRol(comentario.tipo_usuario) }}
                >
                  {obtenerIniciales(comentario.nombres, comentario.apellidos)}
                </div>

                <div className={styles.comentarioMeta}>
                  <div className={styles.comentarioAutor}>
                    {comentario.nombres} {comentario.apellidos}
                    <span className={styles.rol}>{comentario.tipo_usuario}</span>
                    {comentario.es_interno && (
                      <span className={styles.badgeInterno}>Interno</span>
                    )}
                  </div>
                  <div className={styles.comentarioFecha}>
                    {formatearFecha(comentario.fecha_comentario)}
                  </div>
                </div>
              </div>

              <div className={styles.comentarioContenido}>
                {comentario.comentario}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comentarios;
