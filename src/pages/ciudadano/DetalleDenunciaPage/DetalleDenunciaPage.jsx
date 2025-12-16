import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import Comentarios from '../../../components/denuncias/Comentarios';
import Timeline from '../../../components/denuncias/Timeline/Timeline';
import Lightbox from '../../../components/common/Lightbox/Lightbox';
import { CardSkeleton } from '../../../components/common/LoadingSkeleton/LoadingSkeleton';
import { useToast } from '../../../components/common/ToastContainer/ToastContainer';
import denunciaService from '../../../services/denunciaService';
import styles from './DetalleDenunciaPage.module.css';

const DetalleDenunciaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [denuncia, setDenuncia] = useState(null);
  const [historialEstados, setHistorialEstados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    cargarDenuncia();
  }, [id]);

  const cargarDenuncia = async () => {
    try {
      setCargando(true);
      setError(null);

      const [denunciaResponse, historialResponse] = await Promise.all([
        denunciaService.obtenerDenunciaPorId(id),
        denunciaService.obtenerHistorialEstados(id).catch(() => ({ success: false, data: { historial: [] } }))
      ]);

      if (denunciaResponse.success) {
        setDenuncia(denunciaResponse.data.denuncia);
      }

      if (historialResponse.success && historialResponse.data.historial) {
        setHistorialEstados(historialResponse.data.historial);
      }
    } catch (err) {
      console.error('Error al cargar denuncia:', err);
      setError(err.message || 'Error al cargar la denuncia');
      toast.error('Error al cargar la denuncia');
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

  const obtenerClaseEstado = (estado) => {
    if (!estado) return '';
    const estadoLower = estado.toLowerCase().replace(/\s+/g, '');
    if (estadoLower === 'registrada' || estadoLower === 'enrevision' || estadoLower === 'pendiente') {
      return styles.estadoPendiente;
    }
    if (estadoLower === 'asignada' || estadoLower === 'enproceso') {
      return styles.estadoProceso;
    }
    if (estadoLower === 'resuelta' || estadoLower === 'cerrada') {
      return styles.estadoResuelta;
    }
    return '';
  };

  const abrirLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (cargando) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <button onClick={() => navigate('/denuncias')} className={styles.breadcrumbLink}>
              ← Mis Denuncias
            </button>
          </div>
          <CardSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (error || !denuncia) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>Error al cargar</h2>
            <p className={styles.errorMessage}>{error || 'Denuncia no encontrada'}</p>
            <button onClick={() => navigate('/denuncias')} className={styles.backBtn}>
              Volver a Mis Denuncias
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
          <button onClick={() => navigate('/denuncias')} className={styles.breadcrumbLink}>
            ← Mis Denuncias
          </button>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Detalle de Denuncia</span>
        </div>

        {/* Header de la denuncia */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>{denuncia.titulo}</h1>
              <div className={styles.badges}>
                <span className={`${styles.badge} ${obtenerClaseEstado(denuncia.estado_nombre)}`}>
                  {denuncia.estado_nombre}
                </span>
                {denuncia.es_anonima && (
                  <span className={styles.badgeAnonima}>🔒 Anónima</span>
                )}
              </div>
            </div>
            <div className={styles.idBadge}>
              <span className={styles.idLabel}>ID</span>
              <span className={styles.idNumber}>#{denuncia.id_denuncia}</span>
            </div>
          </div>

          <div className={styles.metadata}>
            <div className={styles.metaItem}>
              <svg className={styles.metaIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={styles.metaText}>{formatearFecha(denuncia.fecha_registro)}</span>
            </div>
            <div className={styles.metaItem}>
              <svg className={styles.metaIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className={styles.metaText}>{denuncia.categoria_nombre}</span>
            </div>
          </div>
        </div>

        {/* Contenido principal en grid */}
        <div className={styles.mainGrid}>
          {/* Columna izquierda */}
          <div className={styles.leftColumn}>
            {/* Descripción */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Descripción</h2>
              </div>
              <p className={styles.descripcion}>{denuncia.descripcion_detallada}</p>
            </section>

            {/* Evidencias */}
            {denuncia.evidencias && denuncia.evidencias.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Evidencias Fotográficas</h2>
                  <span className={styles.sectionCount}>{denuncia.evidencias.length} foto{denuncia.evidencias.length > 1 ? 's' : ''}</span>
                </div>
                <div className={styles.evidenciasGrid}>
                  {denuncia.evidencias.map((evidencia, index) => (
                    <div
                      key={index}
                      className={styles.evidenciaItem}
                      onClick={() => abrirLightbox(index)}
                    >
                      <img
                        src={evidencia.url || evidencia.ruta}
                        alt={`Evidencia ${index + 1}`}
                        className={styles.evidenciaImg}
                      />
                      <div className={styles.evidenciaOverlay}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Ubicación */}
            {(denuncia.direccion_geolocalizada || (denuncia.latitud && denuncia.longitud)) && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Ubicación</h2>
                </div>
                {denuncia.direccion_geolocalizada && (
                  <div className={styles.ubicacionInfo}>
                    <svg className={styles.ubicacionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className={styles.ubicacionTexto}>{denuncia.direccion_geolocalizada}</span>
                  </div>
                )}
                {denuncia.latitud && denuncia.longitud && (
                  <div className={styles.coordenadas}>
                    <span className={styles.coordLabel}>Coordenadas:</span>
                    <span className={styles.coordValue}>
                      {parseFloat(denuncia.latitud).toFixed(6)}, {parseFloat(denuncia.longitud).toFixed(6)}
                    </span>
                  </div>
                )}
              </section>
            )}

            {/* Comentarios */}
            <section className={styles.section}>
              <Comentarios idDenuncia={id} />
            </section>
          </div>

          {/* Columna derecha */}
          <div className={styles.rightColumn}>
            {/* Timeline de estados */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Historial de Estados</h2>
              </div>
              {historialEstados.length > 0 ? (
                <Timeline items={historialEstados} />
              ) : (
                <div className={styles.noHistorial}>
                  <p>No hay cambios de estado registrados</p>
                </div>
              )}
            </section>

            {/* Información adicional */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Información</h2>
              </div>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Estado actual</span>
                  <span className={`${styles.badge} ${styles.badgeSmall} ${obtenerClaseEstado(denuncia.estado_nombre)}`}>
                    {denuncia.estado_nombre}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Categoría</span>
                  <span className={styles.infoValue}>{denuncia.categoria_nombre}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Fecha de registro</span>
                  <span className={styles.infoValue}>{formatearFecha(denuncia.fecha_registro)}</span>
                </div>
                {denuncia.fecha_actualizacion && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Última actualización</span>
                    <span className={styles.infoValue}>{formatearFecha(denuncia.fecha_actualizacion)}</span>
                  </div>
                )}
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Tipo de denuncia</span>
                  <span className={styles.infoValue}>{denuncia.es_anonima ? 'Anónima' : 'Identificada'}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Lightbox para evidencias */}
      {lightboxOpen && denuncia.evidencias && denuncia.evidencias.length > 0 && (
        <Lightbox
          images={denuncia.evidencias.map(e => ({ url: e.url || e.ruta }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};

export default DetalleDenunciaPage;
