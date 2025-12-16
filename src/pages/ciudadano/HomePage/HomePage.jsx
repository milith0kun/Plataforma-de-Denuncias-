import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import LottieIcon from '../../../components/LottieIcon/LottieIcon';
import denunciaService from '../../../services/denunciaService';
import styles from './HomePage.module.css';

// Importar iconos JSON
import SpeedIcon from '../../../assets/icons/speed.json';
import TransparencyIcon from '../../../assets/icons/transparency.json';
import SecurityIcon from '../../../assets/icons/security.json';
import ServicesIcon from '../../../assets/icons/services.json';
import BuildingsIcon from '../../../assets/icons/buildings.json';
import MobileIcon from '../../../assets/icons/mobile.json';
import InfrastructureIcon from '../../../assets/icons/infrastructure.json';

const HomePage = () => {
  const navigate = useNavigate();
  const { usuario, estaAutenticado, esCiudadano, esAutoridad, esAdmin } = useAuth();

  // Estados para datos de la API
  const [estadisticas, setEstadisticas] = useState({
    denunciasRealizadas: 0,
    denunciasPendientes: 0,
    denunciasEnProceso: 0,
    denunciasResueltas: 0
  });
  const [denunciasRecientes, setDenunciasRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos de la API
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);

      // Obtener estadísticas
      const stats = await denunciaService.obtenerEstadisticasUsuario();
      setEstadisticas({
        denunciasRealizadas: stats.total,
        denunciasPendientes: stats.pendientes,
        denunciasEnProceso: stats.enProceso,
        denunciasResueltas: stats.resueltas
      });

      // Obtener denuncias recientes (últimas 3)
      const response = await denunciaService.obtenerDenuncias({
        limite: 3,
        orden: 'fecha_registro',
        direccion: 'DESC'
      });

      if (response.success) {
        setDenunciasRecientes(response.data.denuncias);
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  // Función para navegar a diferentes secciones
  const navegarA = (ruta) => {
    navigate(ruta);
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
      <>
        <Header />
        <section className={styles.dashboardSection}>
          <div className={styles.dashboardContainer}>
            <div className={styles.loadingState}>
              <p>Cargando datos...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <>
        <Header />
        <section className={styles.dashboardSection}>
          <div className={styles.dashboardContainer}>
            <div className={styles.errorState}>
              <p>⚠️ {error}</p>
              <button onClick={cargarDatos} className={styles.btn + ' ' + styles.btnPrimary}>
                Reintentar
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Header />

      <section className={styles.dashboardSection}>
        <div className={styles.dashboardContainer}>
          {/* Hero Section */}
          <div className={styles.heroSection}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Hola, {usuario?.nombres} 👋
              </h1>
              <p className={styles.heroSubtitle}>
                Gestiona tus denuncias y contribuye a mejorar tu comunidad
              </p>
              <div className={styles.heroActions}>
                <button 
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => navigate('/nueva-denuncia')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  Nueva Denuncia
                </button>
                <button 
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => navigate('/denuncias')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                  </svg>
                  Ver Mis Denuncias
                </button>
              </div>
            </div>
            <div className={styles.heroIllustration}>
              <LottieIcon 
                src={BuildingsIcon} 
                alt="Ilustración" 
                width={300} 
                height={300}
              />
            </div>
          </div>

          {/* Estadísticas en cards mejoradas */}
          <div className={styles.statsSection}>
            <h2 className={styles.sectionTitle}>Resumen de tus Denuncias</h2>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard} data-type="total">
                <div className={styles.metricIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                  </svg>
                </div>
                <div className={styles.metricContent}>
                  <div className={styles.metricValue}>{estadisticas.denunciasRealizadas}</div>
                  <div className={styles.metricLabel}>Total de Denuncias</div>
                </div>
              </div>
              
              <div className={styles.metricCard} data-type="pending">
                <div className={styles.metricIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                </div>
                <div className={styles.metricContent}>
                  <div className={styles.metricValue}>{estadisticas.denunciasPendientes}</div>
                  <div className={styles.metricLabel}>Pendientes</div>
                </div>
              </div>
              
              <div className={styles.metricCard} data-type="progress">
                <div className={styles.metricIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22,4 12,14.01 9,11.01" />
                  </svg>
                </div>
                <div className={styles.metricContent}>
                  <div className={styles.metricValue}>{estadisticas.denunciasEnProceso}</div>
                  <div className={styles.metricLabel}>En Proceso</div>
                </div>
              </div>
              
              <div className={styles.metricCard} data-type="resolved">
                <div className={styles.metricIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22,4 12,14.01 9,11.01" />
                  </svg>
                </div>
                <div className={styles.metricContent}>
                  <div className={styles.metricValue}>{estadisticas.denunciasResueltas}</div>
                  <div className={styles.metricLabel}>Resueltas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Accesos R\u00e1pidos Mejorados */}
          <div className={`${styles.section} ${styles.quickActionsSection}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Accesos R\u00e1pidos</h2>
              <p className={styles.sectionSubtitle}>Realiza acciones comunes de forma r\u00e1pida</p>
            </div>
            <div className={styles.quickActionsGrid}>
              <div className={`${styles.actionCard} ${styles.primary}`} onClick={() => navigate('/nueva-denuncia')}>
                <div className={styles.actionCardIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
                <h3 className={styles.actionCardTitle}>Nueva Denuncia</h3>
                <p className={styles.actionCardDesc}>Reporta un problema en tu comunidad</p>
                <div className={styles.actionCardArrow}>\u2192</div>
              </div>

              <div className={`${styles.actionCard} ${styles.secondary}`} onClick={() => navigate('/denuncias')}>
                <div className={styles.actionCardIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                  </svg>
                </div>
                <h3 className={styles.actionCardTitle}>Mis Denuncias</h3>
                <p className={styles.actionCardDesc}>Revisa el estado de tus reportes</p>
                <div className={styles.actionCardArrow}>\u2192</div>
              </div>

              <div className={`${styles.actionCard} ${styles.tertiary}`} onClick={() => navigate('/seguimiento')}>
                <div className={styles.actionCardIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 12l-4-4-4 4M12 16V8" />
                  </svg>
                </div>
                <h3 className={styles.actionCardTitle}>Seguimiento</h3>
                <p className={styles.actionCardDesc}>Rastrea tus denuncias</p>
                <div className={styles.actionCardArrow}>\u2192</div>
              </div>

              <div className={`${styles.actionCard} ${styles.quaternary}`} onClick={() => navigate('/perfil')}>
                <div className={styles.actionCardIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h3 className={styles.actionCardTitle}>Mi Perfil</h3>
                <p className={styles.actionCardDesc}>Actualiza tu informaci\u00f3n</p>
                <div className={styles.actionCardArrow}>\u2192</div>
              </div>
            </div>
          </div>

          {/* Denuncias Recientes Mejoradas */}
          <div className={`${styles.section} ${styles.recentDenunciasSection}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Denuncias Recientes</h2>
              <button className={styles.viewAllBtn} onClick={() => navigate('/denuncias')}>
                Ver todas
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            {denunciasRecientes.length === 0 ? (
              <div className={styles.emptyStateModern}>
                <div className={styles.emptyIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                  </svg>
                </div>
                <h3 className={styles.emptyTitle}>Sin denuncias a\u00fan</h3>
                <p className={styles.emptyDescription}>Empieza reportando un problema en tu comunidad</p>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => navigate('/nueva-denuncia')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  Crear primera denuncia
                </button>
              </div>
            ) : (
              <div className={styles.denunciasList}>
                {denunciasRecientes.map((denuncia) => (
                  <div
                    key={denuncia.id_denuncia}
                    className={styles.denunciaItem}
                    onClick={() => navigate(`/denuncias/${denuncia.id_denuncia}`)}
                  >
                    <div className={styles.denunciaStatusIndicator} data-status={denuncia.estado_nombre?.toLowerCase().replace(/\s+/g, '')}></div>
                    <div className={styles.denunciaContent}>
                      <div className={styles.denunciaMain}>
                        <h3 className={styles.denunciaTitulo}>{denuncia.titulo}</h3>
                        <span className={`${styles.badge} ${styles['badge' + denuncia.estado_nombre?.replace(/\s+/g, '')]}`}>
                          {denuncia.estado_nombre}
                        </span>
                      </div>
                      <div className={styles.denunciaMeta}>
                        <span className={styles.metaItem}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                            <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                          </svg>
                          {denuncia.categoria_nombre}
                        </span>
                        <span className={styles.metaItem}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {formatearFecha(denuncia.fecha_registro)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.denunciaArrow}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sección de Consejos Útiles */}
          <div className={`${styles.section} ${styles.tipsSection}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Consejos para una Denuncia Efectiva</h2>
            </div>
            <div className={styles.tipsGrid}>
              <div className={styles.tipCard}>
                <div className={styles.tipIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                <h4 className={styles.tipTitle}>Sé específico</h4>
                <p className={styles.tipDescription}>Proporciona detalles claros sobre la ubicación y el problema</p>
              </div>

              <div className={styles.tipCard}>
                <div className={styles.tipIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="16.5" y1="7.5" x2="16.51" y2="7.5" />
                  </svg>
                </div>
                <h4 className={styles.tipTitle}>Incluye fotos</h4>
                <p className={styles.tipDescription}>Las evidencias visuales aceleran la resolución del problema</p>
              </div>

              <div className={styles.tipCard}>
                <div className={styles.tipIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h4 className={styles.tipTitle}>Mantente informado</h4>
                <p className={styles.tipDescription}>Revisa regularmente el estado de tus denuncias</p>
              </div>

              <div className={styles.tipCard}>
                <div className={styles.tipIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h4 className={styles.tipTitle}>Sé respetuoso</h4>
                <p className={styles.tipDescription}>Mantén un tono profesional en todas tus comunicaciones</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
