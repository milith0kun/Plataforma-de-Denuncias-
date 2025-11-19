import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header/Header';
import denunciaService from '../../services/denunciaService';
import { getEstadoColor } from '../../constants/colors';
import styles from './DetalleDenunciaPage.module.css';

const DetalleDenunciaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [denuncia, setDenuncia] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [evidencias, setEvidencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDenuncia();
  }, [id]);

  const cargarDenuncia = async () => {
    try {
      setCargando(true);
      setError(null);

      const response = await denunciaService.obtenerDenunciaPorId(id);

      if (response.success) {
        setDenuncia(response.data.denuncia);
        setHistorial(response.data.historial || []);
        setEvidencias(response.data.evidencias || []);
      } else {
        setError(response.message || 'Error al cargar la denuncia');
      }
    } catch (err) {
      console.error('Error al cargar denuncia:', err);
      setError(err.message || 'Error al cargar la denuncia');
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearFechaRelativa = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    const ahora = new Date();
    const diff = ahora - date;
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Ayer';
    if (dias < 7) return `Hace ${dias} días`;
    if (dias < 30) return `Hace ${Math.floor(dias / 7)} semanas`;
    if (dias < 365) return `Hace ${Math.floor(dias / 30)} meses`;
    return `Hace ${Math.floor(dias / 365)} años`;
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

  if (cargando) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando denuncia...</p>
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
            <button onClick={cargarDenuncia} className={styles.retryButton}>
              Reintentar
            </button>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!denuncia) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>Denuncia no encontrada</p>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
              Volver
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
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <button onClick={() => navigate(-1)} className={styles.breadcrumbLink}>
            ← Volver
          </button>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Detalle de Denuncia</span>
        </div>

        {/* Header de la denuncia */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>{denuncia.titulo}</h1>
            <p className={styles.subtitle}>
              ID: #{denuncia.id_denuncia} • Registrada {formatearFechaRelativa(denuncia.fecha_registro)}
            </p>
          </div>
          <div className={styles.headerBadge}>
            <span className={`${styles.estadoBadge} ${obtenerColorEstado(denuncia.estado_nombre)}`}>
              {denuncia.estado_nombre}
            </span>
          </div>
        </div>

        {/* Grid de contenido */}
        <div className={styles.contentGrid}>
          {/* Columna principal */}
          <div className={styles.mainColumn}>
            {/* Descripción */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Descripción</h2>
              <p className={styles.descripcion}>{denuncia.descripcion_detallada}</p>
            </div>

            {/* Ubicación */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Ubicación</h2>
              <div className={styles.ubicacionInfo}>
                <div className={styles.ubicacionItem}>
                  <span className={styles.ubicacionIcon}>📍</span>
                  <div>
                    <p className={styles.ubicacionLabel}>Dirección</p>
                    <p className={styles.ubicacionValue}>
                      {denuncia.direccion_geolocalizada || 'No especificada'}
                    </p>
                  </div>
                </div>
                {denuncia.latitud && denuncia.longitud && (
                  <div className={styles.ubicacionItem}>
                    <span className={styles.ubicacionIcon}>🌍</span>
                    <div>
                      <p className={styles.ubicacionLabel}>Coordenadas</p>
                      <p className={styles.ubicacionValue}>
                        {denuncia.latitud}, {denuncia.longitud}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Evidencias */}
            {evidencias.length > 0 && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Evidencias Fotográficas</h2>
                <div className={styles.galeriaEvidencias}>
                  {evidencias.map((evidencia) => (
                    <div key={evidencia.id_evidencia} className={styles.evidenciaItem}>
                      <img
                        src={`${import.meta.env.VITE_API_URL}${evidencia.ruta_archivo}`}
                        alt={`Evidencia ${evidencia.id_evidencia}`}
                        className={styles.evidenciaImagen}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historial de Estados */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Historial de Estados</h2>
              <div className={styles.timeline}>
                {historial.length > 0 ? (
                  historial.map((item, index) => (
                    <div key={item.id_historial} className={styles.timelineItem}>
                      <div className={styles.timelineMarker}>
                        <div className={`${styles.timelineDot} ${index === historial.length - 1 ? styles.timelineDotActive : ''}`}></div>
                        {index < historial.length - 1 && <div className={styles.timelineLine}></div>}
                      </div>
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineHeader}>
                          <span className={`${styles.timelineEstado} ${obtenerColorEstado(item.estado_nuevo_nombre)}`}>
                            {item.estado_nuevo_nombre}
                          </span>
                          <span className={styles.timelineFecha}>
                            {formatearFecha(item.fecha_cambio)}
                          </span>
                        </div>
                        {item.comentario && (
                          <p className={styles.timelineComentario}>{item.comentario}</p>
                        )}
                        {item.usuario_nombres && (
                          <p className={styles.timelineUsuario}>
                            Por: {item.usuario_nombres} {item.usuario_apellidos}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyMessage}>No hay historial disponible</p>
                )}
              </div>
            </div>
          </div>

          {/* Columna lateral */}
          <div className={styles.sideColumn}>
            {/* Información general */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Información General</h2>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Categoría</span>
                  <span className={styles.infoValue}>{denuncia.categoria_nombre}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Fecha de Registro</span>
                  <span className={styles.infoValue}>
                    {formatearFecha(denuncia.fecha_registro)}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Última Actualización</span>
                  <span className={styles.infoValue}>
                    {formatearFecha(denuncia.ultima_actualizacion)}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Estado Actual</span>
                  <span className={`${styles.infoValue} ${obtenerColorEstado(denuncia.estado_nombre)}`}>
                    {denuncia.estado_nombre}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Tipo</span>
                  <span className={styles.infoValue}>
                    {denuncia.es_anonima ? 'Anónima' : 'Pública'}
                  </span>
                </div>
              </div>
            </div>

            {/* Información del denunciante */}
            {!denuncia.es_anonima && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Denunciante</h2>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Nombre</span>
                    <span className={styles.infoValue}>
                      {denuncia.ciudadano_nombres} {denuncia.ciudadano_apellidos}
                    </span>
                  </div>
                  {denuncia.ciudadano_email && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Email</span>
                      <span className={styles.infoValue}>{denuncia.ciudadano_email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Acciones</h2>
              <div className={styles.actionButtons}>
                <button
                  className={styles.actionButton}
                  onClick={() => window.print()}
                >
                  🖨️ Imprimir
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => navigate(`/denuncias/${id}/seguimiento`)}
                >
                  📊 Ver Seguimiento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleDenunciaPage;
