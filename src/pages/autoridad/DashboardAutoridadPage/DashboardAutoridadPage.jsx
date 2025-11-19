import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Layout from '../../../components/layout/Layout/Layout';
import { getEstadoColor, getPrioridadColor } from '../../../constants/colors';
import styles from './DashboardAutoridadPage.module.css';

const DashboardAutoridadPage = () => {
  const { usuario } = useAuth();
  const [metricas, setMetricas] = useState({
    denunciasPendientes: 0,
    denunciasAsignadas: 0,
    denunciasResueltas: 0,
    denunciasUrgentes: 0
  });
  const [denunciasRecientes, setDenunciasRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      // TODO: Implementar llamadas a la API para obtener datos reales
      // Datos simulados por ahora
      setTimeout(() => {
        setMetricas({
          denunciasPendientes: 24,
          denunciasAsignadas: 8,
          denunciasResueltas: 156,
          denunciasUrgentes: 3
        });
        
        setDenunciasRecientes([
          {
            id: 1,
            titulo: 'Bache en Av. Principal',
            categoria: 'Infraestructura',
            estado: 'Pendiente',
            fecha: '2024-01-15',
            prioridad: 'Alta'
          },
          {
            id: 2,
            titulo: 'Falta de alumbrado público',
            categoria: 'Servicios Públicos',
            estado: 'En Proceso',
            fecha: '2024-01-14',
            prioridad: 'Media'
          },
          {
            id: 3,
            titulo: 'Acumulación de basura',
            categoria: 'Limpieza',
            estado: 'Asignada',
            fecha: '2024-01-13',
            prioridad: 'Alta'
          }
        ]);
        setCargando(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setCargando(false);
    }
  };


  if (cargando) {
    return (
      <div className={styles.dashboardPage}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className={`${styles.dashboardPage} animate-fade-in`}>
      {/* Header */}
      <div className={`${styles.header} animate-fade-in-down`}>
        <div className={styles.headerContent}>
          <div className={styles.welcomeSection}>
            <h1 className={`${styles.title} animate-fade-in-left`}>Dashboard de Autoridad</h1>
            <p className={`${styles.subtitle} animate-fade-in-left animate-delay-100`}>
              Bienvenido, {usuario?.nombres} {usuario?.apellidos}
            </p>
            <div className={`${styles.userInfo} animate-fade-in-left animate-delay-200`}>
              <span className={styles.cargo}>{usuario?.cargo}</span>
              <span className={styles.area}>{usuario?.area_responsabilidad}</span>
            </div>
          </div>
          <div className={`${styles.dateSection} animate-fade-in-right`}>
            <p className={styles.currentDate}>
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className={`${styles.metricsSection} animate-fade-in-up animate-delay-200`}>
        <div className={styles.metricsGrid}>
          <div className={`${styles.metricCard} ${styles.pendientes}`}>
            <div className={styles.metricIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            </div>
            <div className={styles.metricContent}>
              <h3 className={styles.metricNumber}>{metricas.denunciasPendientes}</h3>
              <p className={styles.metricLabel}>Denuncias Pendientes</p>
            </div>
          </div>

          <div className={`${styles.metricCard} ${styles.asignadas}`}>
            <div className={styles.metricIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <polyline points="17,11 19,13 23,9"/>
              </svg>
            </div>
            <div className={styles.metricContent}>
              <h3 className={styles.metricNumber}>{metricas.denunciasAsignadas}</h3>
              <p className={styles.metricLabel}>Asignadas a Mí</p>
            </div>
          </div>

          <div className={`${styles.metricCard} ${styles.resueltas}`}>
            <div className={styles.metricIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
            </div>
            <div className={styles.metricContent}>
              <h3 className={styles.metricNumber}>{metricas.denunciasResueltas}</h3>
              <p className={styles.metricLabel}>Resueltas</p>
            </div>
          </div>

          <div className={`${styles.metricCard} ${styles.urgentes}`}>
            <div className={styles.metricIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div className={styles.metricContent}>
              <h3 className={styles.metricNumber}>{metricas.denunciasUrgentes}</h3>
              <p className={styles.metricLabel}>Urgentes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={styles.mainContent}>
        {/* Denuncias recientes */}
        <div className={`${styles.recentSection} animate-fade-in-up animate-delay-400`}>
          <div className={`${styles.sectionHeader} animate-fade-in-left animate-delay-500`}>
            <h2 className={styles.sectionTitle}>Denuncias Recientes</h2>
            <button className={`${styles.viewAllButton} transition-smooth hover-scale`}>
              Ver todas
            </button>
          </div>
          
          <div className={styles.denunciasGrid}>
            {denunciasRecientes.map((denuncia) => (
              <div key={denuncia.id} className={styles.denunciaCard}>
                <div className={styles.denunciaHeader}>
                  <h3 className={styles.denunciaTitulo}>{denuncia.titulo}</h3>
                  <div className={styles.denunciaBadges}>
                    <span
                      className={styles.estadoBadge}
                      style={{ backgroundColor: getEstadoColor(denuncia.estado) }}
                    >
                      {denuncia.estado}
                    </span>
                    <span
                      className={styles.prioridadBadge}
                      style={{ backgroundColor: getPrioridadColor(denuncia.prioridad) }}
                    >
                      {denuncia.prioridad}
                    </span>
                  </div>
                </div>
                
                <div className={styles.denunciaInfo}>
                  <p className={styles.categoria}>{denuncia.categoria}</p>
                  <p className={styles.fecha}>{denuncia.fecha}</p>
                </div>
                
                <div className={styles.denunciaActions}>
                  <button className={styles.actionButton}>
                    Ver detalles
                  </button>
                  <button className={styles.actionButton}>
                    Asignar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className={`${styles.quickActions} animate-fade-in-up animate-delay-300`}>
          <h2 className={styles.sectionTitle}>Acciones Rápidas</h2>
          <div className={styles.actionsGrid}>
            <button className={styles.quickActionCard}>
              <div className={styles.actionIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <span>Gestionar Denuncias</span>
            </button>

            <button className={styles.quickActionCard}>
              <div className={styles.actionIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"/>
                  <polyline points="9,11 12,14 15,11"/>
                  <line x1="12" y1="2" x2="12" y2="14"/>
                </svg>
              </div>
              <span>Generar Reportes</span>
            </button>

            <button className={styles.quickActionCard}>
              <div className={styles.actionIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <span>Mapa de Denuncias</span>
            </button>

            <button className={styles.quickActionCard}>
              <div className={styles.actionIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span>Mi Perfil</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default DashboardAutoridadPage;