import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import styles from './DenunciasPage.module.css';

const DenunciasPage = () => {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  
  // Datos de ejemplo para las denuncias
  const denuncias = [
    {
      id: 1,
      titulo: "Ruido excesivo en zona residencial",
      descripcion: "Música alta durante la madrugada en el sector residencial",
      fecha: "2024-01-15",
      estado: "En proceso",
      categoria: "Ruido",
      ubicacion: "Calle 123 #45-67",
      prioridad: "Media"
    },
    {
      id: 2,
      titulo: "Basura acumulada en vía pública",
      descripcion: "Acumulación de basura en la esquina que no ha sido recolectada",
      fecha: "2024-01-10",
      estado: "Resuelta",
      categoria: "Limpieza",
      ubicacion: "Carrera 45 #12-34",
      prioridad: "Alta"
    },
    {
      id: 3,
      titulo: "Semáforo dañado en intersección",
      descripcion: "El semáforo no funciona correctamente, causando problemas de tráfico",
      fecha: "2024-01-08",
      estado: "Pendiente",
      categoria: "Infraestructura",
      ubicacion: "Intersección Calle 50 con Carrera 30",
      prioridad: "Alta"
    },
    {
      id: 4,
      titulo: "Hueco en la vía principal",
      descripcion: "Hueco grande que puede causar daños a los vehículos",
      fecha: "2024-01-05",
      estado: "En proceso",
      categoria: "Vías",
      ubicacion: "Avenida Principal Km 5",
      prioridad: "Media"
    }
  ];

  // Filtrar denuncias según el estado seleccionado
  const denunciasFiltradas = filtroEstado === 'todas' 
    ? denuncias 
    : denuncias.filter(denuncia => denuncia.estado.toLowerCase().replace(' ', '') === filtroEstado);

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
                {denuncias.filter(d => d.estado === 'Pendiente').length}
              </span>
              <span className={styles.estadisticaLabel}>Pendientes</span>
            </div>
            <div className={styles.estadistica}>
              <span className={styles.estadisticaNumero}>
                {denuncias.filter(d => d.estado === 'En proceso').length}
              </span>
              <span className={styles.estadisticaLabel}>En Proceso</span>
            </div>
            <div className={styles.estadistica}>
              <span className={styles.estadisticaNumero}>
                {denuncias.filter(d => d.estado === 'Resuelta').length}
              </span>
              <span className={styles.estadisticaLabel}>Resueltas</span>
            </div>
          </div>
        </div>

        {/* Lista de denuncias */}
        <div className={styles.denunciasList}>
          {denunciasFiltradas.length > 0 ? (
            denunciasFiltradas.map((denuncia) => (
              <div key={denuncia.id} className={styles.denunciaCard}>
                <div className={styles.denunciaHeader}>
                  <div className={styles.denunciaInfo}>
                    <h3 className={styles.denunciaTitle}>{denuncia.titulo}</h3>
                    <p className={styles.denunciaDescripcion}>{denuncia.descripcion}</p>
                  </div>
                  <div className={styles.denunciaEstados}>
                    <span className={`${styles.estado} ${obtenerColorEstado(denuncia.estado)}`}>
                      {denuncia.estado}
                    </span>
                    <span className={`${styles.prioridad} ${obtenerColorPrioridad(denuncia.prioridad)}`}>
                      {denuncia.prioridad}
                    </span>
                  </div>
                </div>
                
                <div className={styles.denunciaDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>📅</span>
                    <span className={styles.detailText}>{denuncia.fecha}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>📍</span>
                    <span className={styles.detailText}>{denuncia.ubicacion}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>🏷️</span>
                    <span className={styles.detailText}>{denuncia.categoria}</span>
                  </div>
                </div>
                
                <div className={styles.denunciaActions}>
                  <button className={styles.actionBtn}>
                    Ver Detalles
                  </button>
                  <button className={styles.actionBtn}>
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