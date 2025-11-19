import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import denunciaService from '../../../services/denunciaService';
import styles from './DenunciasPage.module.css';

const DenunciasPage = () => {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [denuncias, setDenuncias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar denuncias de la API
  useEffect(() => {
    cargarDenuncias();
  }, []);

  const cargarDenuncias = async () => {
    try {
      setCargando(true);
      setError(null);

      const response = await denunciaService.obtenerDenuncias({
        limite: 100,
        orden: 'fecha_registro',
        direccion: 'DESC'
      });

      if (response.success) {
        setDenuncias(response.data.denuncias);
      }
    } catch (err) {
      console.error('Error al cargar denuncias:', err);
      setError(err.message || 'Error al cargar las denuncias');
    } finally {
      setCargando(false);
    }
  };

  // Mapear estados de la BD a los filtros
  const mapearEstadoAFiltro = (estadoNombre) => {
    if (!estadoNombre) return 'pendiente';
    const estado = estadoNombre.toLowerCase().replace(/\s+/g, '');
    if (estado === 'registrada' || estado === 'enrevision') return 'pendiente';
    if (estado === 'asignada' || estado === 'enproceso') return 'enproceso';
    if (estado === 'resuelta' || estado === 'cerrada') return 'resuelta';
    return 'pendiente';
  };

  // Filtrar denuncias según el estado seleccionado
  const denunciasFiltradas = filtroEstado === 'todas'
    ? denuncias
    : denuncias.filter(denuncia => mapearEstadoAFiltro(denuncia.estado_nombre) === filtroEstado);

  // Función para obtener el color del estado
  const obtenerColorEstado = (estado) => {
    switch (estado.toLowerCase().replace(' ', '')) {
      case 'pendiente':
        return styles.estadoPendiente;
      case 'enproceso':
        return styles.estadoProceso;
      case 'resuelta':
        return styles.estadoResuelta;
      default:
        return '';
    }
  };

  // Función para obtener el color de la prioridad
  const obtenerColorPrioridad = (prioridad) => {
    switch (prioridad.toLowerCase()) {
      case 'alta':
        return styles.prioridadAlta;
      case 'media':
        return styles.prioridadMedia;
      case 'baja':
        return styles.prioridadBaja;
      default:
        return '';
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Mostrar estado de carga
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

  // Mostrar error
  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>⚠️ {error}</p>
            <button onClick={cargarDenuncias} className={styles.retryButton}>
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
          <h1 className={styles.title}>Mis Denuncias</h1>
          <p className={styles.subtitle}>
            Gestiona y da seguimiento a todas tus denuncias realizadas
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
              <option value="pendiente">Pendientes</option>
              <option value="enproceso">En Proceso</option>
              <option value="resuelta">Resueltas</option>
            </select>
          </div>
          
          <div className={styles.estadisticas}>
            <div className={styles.estadistica}>
              <span className={styles.estadisticaNumero}>{denuncias.length}</span>
              <span className={styles.estadisticaLabel}>Total</span>
            </div>
            <div className={styles.estadistica}>
              <span className={styles.estadisticaNumero}>
                {denuncias.filter(d => mapearEstadoAFiltro(d.estado_nombre) === 'pendiente').length}
              </span>
              <span className={styles.estadisticaLabel}>Pendientes</span>
            </div>
            <div className={styles.estadistica}>
              <span className={styles.estadisticaNumero}>
                {denuncias.filter(d => mapearEstadoAFiltro(d.estado_nombre) === 'enproceso').length}
              </span>
              <span className={styles.estadisticaLabel}>En Proceso</span>
            </div>
            <div className={styles.estadistica}>
              <span className={styles.estadisticaNumero}>
                {denuncias.filter(d => mapearEstadoAFiltro(d.estado_nombre) === 'resuelta').length}
              </span>
              <span className={styles.estadisticaLabel}>Resueltas</span>
            </div>
          </div>
        </div>

        {/* Lista de denuncias */}
        <div className={styles.denunciasList}>
          {denunciasFiltradas.length > 0 ? (
            denunciasFiltradas.map((denuncia) => (
              <div key={denuncia.id_denuncia} className={styles.denunciaCard}>
                <div className={styles.denunciaHeader}>
                  <div className={styles.denunciaInfo}>
                    <h3 className={styles.denunciaTitle}>{denuncia.titulo}</h3>
                    <p className={styles.denunciaDescripcion}>
                      {denuncia.descripcion_detallada?.substring(0, 150)}
                      {denuncia.descripcion_detallada?.length > 150 ? '...' : ''}
                    </p>
                  </div>
                  <div className={styles.denunciaEstados}>
                    <span className={`${styles.estado} ${obtenerColorEstado(denuncia.estado_nombre)}`}>
                      {denuncia.estado_nombre}
                    </span>
                  </div>
                </div>

                <div className={styles.denunciaDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>📅</span>
                    <span className={styles.detailText}>{formatearFecha(denuncia.fecha_registro)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>📍</span>
                    <span className={styles.detailText}>
                      {denuncia.direccion_geolocalizada || 'Ubicación no especificada'}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>🏷️</span>
                    <span className={styles.detailText}>{denuncia.categoria_nombre}</span>
                  </div>
                </div>

                <div className={styles.denunciaActions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => navigate(`/denuncias/${denuncia.id_denuncia}`)}
                  >
                    Ver Detalles
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => navigate(`/denuncias/${denuncia.id_denuncia}/seguimiento`)}
                  >
                    Seguimiento
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <h3 className={styles.emptyTitle}>No hay denuncias</h3>
              <p className={styles.emptyText}>
                {filtroEstado === 'todas' 
                  ? 'Aún no has realizado ninguna denuncia.'
                  : `No tienes denuncias con estado "${filtroEstado}".`
                }
              </p>
              <button 
                className={styles.emptyAction}
                onClick={() => navigate('/nueva-denuncia')}
              >
                Crear Primera Denuncia
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DenunciasPage;