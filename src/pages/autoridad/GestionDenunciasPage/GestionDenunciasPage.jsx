import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import denunciaService from '../../../services/denunciaService';
import styles from './GestionDenunciasPage.module.css';

const GestionDenunciasPage = () => {
  const navigate = useNavigate();

  const [denuncias, setDenuncias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modalCambiarEstado, setModalCambiarEstado] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  const [comentario, setComentario] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);

      // Cargar denuncias
      const responseDenuncias = await denunciaService.obtenerDenuncias({
        limite: 100,
        orden: 'fecha_registro',
        direccion: 'DESC'
      });

      // Cargar estados
      const responseEstados = await denunciaService.obtenerEstados();

      if (responseDenuncias.success) {
        setDenuncias(responseDenuncias.data.denuncias);
      }

      if (responseEstados.success) {
        setEstados(responseEstados.data.estados);
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const obtenerColorEstado = (estadoNombre) => {
    if (!estadoNombre) return styles.estadoPendiente;
    const estado = estadoNombre.toLowerCase().replace(/\s+/g, '');

    const mapeo = {
      'registrada': styles.estadoRegistrada,
      'pendiente': styles.estadoPendiente,
      'enrevision': styles.estadoPendiente,
      'enproceso': styles.estadoProceso,
      'asignada': styles.estadoAsignada,
      'resuelta': styles.estadoResuelta,
      'cerrada': styles.estadoCerrada
    };

    return mapeo[estado] || styles.estadoPendiente;
  };

  const denunciasFiltradas = filtroEstado === 'todas'
    ? denuncias
    : denuncias.filter(d => d.id_estado_actual === parseInt(filtroEstado));

  const abrirModalCambiarEstado = (denuncia) => {
    setModalCambiarEstado(denuncia);
    setEstadoSeleccionado(denuncia.id_estado_actual.toString());
    setComentario('');
  };

  const cerrarModal = () => {
    setModalCambiarEstado(null);
    setEstadoSeleccionado('');
    setComentario('');
  };

  const handleCambiarEstado = async (e) => {
    e.preventDefault();

    if (!estadoSeleccionado || estadoSeleccionado === modalCambiarEstado.id_estado_actual.toString()) {
      alert('Debes seleccionar un estado diferente');
      return;
    }

    if (!comentario.trim() || comentario.trim().length < 10) {
      alert('El comentario debe tener al menos 10 caracteres');
      return;
    }

    try {
      setProcesando(true);

      await denunciaService.cambiarEstado(
        modalCambiarEstado.id_denuncia,
        parseInt(estadoSeleccionado),
        comentario.trim()
      );

      alert('Estado actualizado exitosamente');
      cerrarModal();
      cargarDatos(); // Recargar denuncias
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert(err.message || 'Error al cambiar el estado');
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando denuncias...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>⚠️ {error}</p>
            <button onClick={cargarDatos} className={styles.retryButton}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Gestión de Denuncias</h1>
          <p className={styles.subtitle}>
            Administra y actualiza el estado de todas las denuncias del sistema
          </p>
        </div>

        {/* Filtros */}
        <div className={styles.filtros}>
          <div className={styles.filtroGroup}>
            <label className={styles.filtroLabel}>Filtrar por estado:</label>
            <select
              className={styles.filtroSelect}
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todas">Todas</option>
              {estados.map((estado) => (
                <option key={estado.id_estado} value={estado.id_estado}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.estadisticas}>
            <div className={styles.estadistica}>
              <span className={styles.estadisticaNumero}>{denuncias.length}</span>
              <span className={styles.estadisticaLabel}>Total</span>
            </div>
            <div className={styles.estadistica}>
              <span className={styles.estadisticaNumero}>
                {denuncias.filter(d => d.id_estado_actual === 1 || d.id_estado_actual === 2).length}
              </span>
              <span className={styles.estadisticaLabel}>Pendientes</span>
            </div>
            <div className={styles.estadistica}>
              <span className={styles.estadisticaNumero}>
                {denuncias.filter(d => d.id_estado_actual === 3 || d.id_estado_actual === 4).length}
              </span>
              <span className={styles.estadisticaLabel}>En Proceso</span>
            </div>
            <div className={styles.estadistica}>
              <span className={styles.estadisticaNumero}>
                {denuncias.filter(d => d.id_estado_actual === 5).length}
              </span>
              <span className={styles.estadisticaLabel}>Resueltas</span>
            </div>
          </div>
        </div>

        {/* Tabla de denuncias */}
        <div className={styles.tableContainer}>
          {denunciasFiltradas.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Ubicación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {denunciasFiltradas.map((denuncia) => (
                  <tr key={denuncia.id_denuncia}>
                    <td>#{denuncia.id_denuncia}</td>
                    <td className={styles.tituloCell}>{denuncia.titulo}</td>
                    <td>{denuncia.categoria_nombre}</td>
                    <td>
                      <span className={`${styles.estadoBadge} ${obtenerColorEstado(denuncia.estado_nombre)}`}>
                        {denuncia.estado_nombre}
                      </span>
                    </td>
                    <td>{formatearFecha(denuncia.fecha_registro)}</td>
                    <td className={styles.ubicacionCell}>
                      {denuncia.direccion_geolocalizada || 'No especificada'}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.btnVer}
                          onClick={() => navigate(`/denuncias/${denuncia.id_denuncia}`)}
                        >
                          Ver
                        </button>
                        <button
                          className={styles.btnEstado}
                          onClick={() => abrirModalCambiarEstado(denuncia)}
                        >
                          Cambiar Estado
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyMessage}>No hay denuncias con este filtro</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Cambiar Estado */}
      {modalCambiarEstado && (
        <div className={styles.modal} onClick={cerrarModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Cambiar Estado de Denuncia</h2>
              <button className={styles.modalClose} onClick={cerrarModal}>
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalInfo}>
                <p><strong>Denuncia:</strong> {modalCambiarEstado.titulo}</p>
                <p><strong>Estado actual:</strong> {modalCambiarEstado.estado_nombre}</p>
              </div>

              <form onSubmit={handleCambiarEstado}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nuevo Estado *</label>
                  <select
                    className={styles.formSelect}
                    value={estadoSeleccionado}
                    onChange={(e) => setEstadoSeleccionado(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar estado</option>
                    {estados.map((estado) => (
                      <option key={estado.id_estado} value={estado.id_estado}>
                        {estado.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Comentario * (mínimo 10 caracteres)</label>
                  <textarea
                    className={styles.formTextarea}
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Describe el motivo del cambio de estado..."
                    rows={4}
                    required
                    minLength={10}
                  ></textarea>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnCancelar}
                    onClick={cerrarModal}
                    disabled={procesando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.btnGuardar}
                    disabled={procesando}
                  >
                    {procesando ? 'Guardando...' : 'Guardar Cambio'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionDenunciasPage;
