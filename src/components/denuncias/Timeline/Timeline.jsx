import styles from './Timeline.module.css';

const Timeline = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No hay historial de cambios de estado disponible.</p>
      </div>
    );
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    const ahora = new Date();
    const diff = ahora - date;

    // Menos de 1 minuto
    if (diff < 60000) {
      return 'Hace un momento';
    }

    // Menos de 1 hora
    if (diff < 3600000) {
      const minutos = Math.floor(diff / 60000);
      return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    }

    // Menos de 1 día
    if (diff < 86400000) {
      const horas = Math.floor(diff / 3600000);
      return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    }

    // Menos de 7 días
    if (diff < 604800000) {
      const dias = Math.floor(diff / 86400000);
      return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    }

    // Formato completo
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerIconoEstado = (estado) => {
    const iconos = {
      'registrada': '📝',
      'pendiente': '⏳',
      'en revisión': '🔍',
      'en proceso': '🔄',
      'asignada': '👤',
      'resuelta': '✅',
      'cerrada': '🔒'
    };

    const estadoLower = estado?.toLowerCase() || '';
    return iconos[estadoLower] || '📌';
  };

  const obtenerColorEstado = (estado) => {
    const estadoLower = estado?.toLowerCase().replace(/\s+/g, '') || '';
    const colores = {
      'registrada': styles.colorInfo,
      'pendiente': styles.colorWarning,
      'enrevisión': styles.colorWarning,
      'enproceso': styles.colorPurple,
      'asignada': styles.colorTeal,
      'resuelta': styles.colorSuccess,
      'cerrada': styles.colorGray
    };

    return colores[estadoLower] || styles.colorInfo;
  };

  return (
    <div className={styles.timeline}>
      {items.map((item, index) => (
        <div key={item.id || index} className={styles.timelineItem}>
          <div className={`${styles.timelineMarker} ${obtenerColorEstado(item.estado)}`}>
            <span className={styles.icon}>{obtenerIconoEstado(item.estado)}</span>
          </div>

          <div className={styles.timelineContent}>
            <div className={styles.timelineHeader}>
              <h4 className={styles.timelineTitle}>{item.estado}</h4>
              <span className={styles.timelineDate}>{formatearFecha(item.fecha)}</span>
            </div>

            {item.comentario && (
              <p className={styles.timelineComment}>{item.comentario}</p>
            )}

            {item.usuario && (
              <div className={styles.timelineUser}>
                <svg className={styles.userIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{item.usuario}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
