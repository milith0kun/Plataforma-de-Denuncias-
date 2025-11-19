import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import Comentarios from '../../../components/denuncias/Comentarios';
import denunciaService from '../../../services/denunciaService';
import styles from './DetalleDenunciaPage.module.css';

const DetalleDenunciaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [denuncia, setDenuncia] = useState(null);
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
      }
    } catch (err) {
      console.error('Error al cargar denuncia:', err);
      setError(err.message || 'Error al cargar la denuncia');
    } finally {
      setCargando(false);
    }
  };

  // Formatear fecha
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

  // Obtener clase de estado
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

  if (cargando) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando detalles de la denuncia...</p>
          </div>
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
            <p className={styles.errorMessage}>⚠️ {error || 'Denuncia no encontrada'}</p>
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
          <span className={styles.breadcrumbCurrent}>Detalle</span>
        </div>

        {/* Header de la denuncia */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{denuncia.titulo}</h1>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${obtenerClaseEstado(denuncia.estado_nombre)}`}>
                {denuncia.estado_nombre}
              </span>
              {denuncia.es_anonima && (
                <span className={styles.badgeAnonima}>Anónima</span>
              )}
            </div>
          </div>
          <div className={styles.metadata}>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>📅</span>
              <span className={styles.metaText}>{formatearFecha(denuncia.fecha_registro)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>🏷️</span>
              <span className={styles.metaText}>{denuncia.categoria_nombre}</span>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className={styles.content}>
          {/* Descripción */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Descripción</h2>
            <p className={styles.descripcion}>{denuncia.descripcion_detallada}</p>
          </section>

          {/* Ubicación */}
          {(denuncia.direccion_geolocalizada || (denuncia.latitud && denuncia.longitud)) && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Ubicación</h2>
              {denuncia.direccion_geolocalizada && (
                <div className={styles.ubicacionInfo}>
                  <span className={styles.ubicacionIcon}>📍</span>
                  <span className={styles.ubicacionTexto}>{denuncia.direccion_geolocalizada}</span>
                </div>
              )}
              {denuncia.latitud && denuncia.longitud && (
                <div className={styles.coordenadas}>
                  <span className={styles.coordLabel}>Coordenadas:</span>
                  <span className={styles.coordValue}>
                    Lat: {parseFloat(denuncia.latitud).toFixed(6)},
                    Lng: {parseFloat(denuncia.longitud).toFixed(6)}
                  </span>
                </div>
              )}
            </section>
          )}

          {/* Evidencias */}
          {denuncia.evidencias && denuncia.evidencias.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Evidencias Fotográficas</h2>
              <div className={styles.evidenciasGrid}>
                {denuncia.evidencias.map((evidencia, index) => (
                  <div key={index} className={styles.evidenciaItem}>
                    <img
                      src={evidencia.url || evidencia.ruta}
                      alt={`Evidencia ${index + 1}`}
                      className={styles.evidenciaImg}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Información adicional */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Información Adicional</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>ID de la denuncia:</span>
                <span className={styles.infoValue}>#{denuncia.id_denuncia}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Estado actual:</span>
                <span className={styles.infoValue}>{denuncia.estado_nombre}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Categoría:</span>
                <span className={styles.infoValue}>{denuncia.categoria_nombre}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Fecha de registro:</span>
                <span className={styles.infoValue}>{formatearFecha(denuncia.fecha_registro)}</span>
              </div>
              {denuncia.fecha_actualizacion && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Última actualización:</span>
                  <span className={styles.infoValue}>{formatearFecha(denuncia.fecha_actualizacion)}</span>
                </div>
              )}
            </div>
          </section>

          {/* Comentarios */}
          <section className={styles.section}>
            <Comentarios idDenuncia={id} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default DetalleDenunciaPage;
