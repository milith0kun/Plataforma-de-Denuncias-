import styles from './MetricCard.module.css';

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  color = 'blue', 
  trend = null, 
  onClick = null,
  loading = false 
}) => {
  const getIcon = (iconName) => {
    const icons = {
      pending: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      ),
      assigned: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <polyline points="17,11 19,13 23,9"/>
        </svg>
      ),
      resolved: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      ),
      urgent: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      users: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      reports: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"/>
          <polyline points="9,11 12,14 15,11"/>
          <line x1="12" y1="2" x2="12" y2="14"/>
        </svg>
      ),
      growth: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
      ),
      default: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      )
    };
    
    return icons[iconName] || icons.default;
  };

  const getTrendIcon = (trendType) => {
    if (trendType === 'up') {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
          <polyline points="17,6 23,6 23,12"/>
        </svg>
      );
    }
    if (trendType === 'down') {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="23,18 13.5,8.5 8.5,13.5 1,6"/>
          <polyline points="17,18 23,18 23,12"/>
        </svg>
      );
    }
    return null;
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div 
      className={`${styles.metricCard} ${styles[color]} ${onClick ? styles.clickable : ''} ${loading ? styles.loading : ''}`}
      onClick={onClick}
    >
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}
      
      <div className={styles.metricIcon}>
        {getIcon(icon)}
      </div>
      
      <div className={styles.metricContent}>
        <div className={styles.metricValue}>
          {formatValue(value)}
        </div>
        <div className={styles.metricTitle}>
          {title}
        </div>
        
        {trend && (
          <div className={`${styles.metricTrend} ${styles[`trend${trend.type}`]}`}>
            <div className={styles.trendIcon}>
              {getTrendIcon(trend.type)}
            </div>
            <span className={styles.trendValue}>
              {trend.value}%
            </span>
            <span className={styles.trendPeriod}>
              {trend.period || 'vs mes anterior'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;