import styles from './LoadingSkeleton.module.css';

const LoadingSkeleton = ({ variant = 'text', width, height, count = 1, className = '' }) => {
  const variants = {
    text: styles.text,
    title: styles.title,
    circle: styles.circle,
    card: styles.card,
    table: styles.table,
    chart: styles.chart
  };

  const skeletonClass = variants[variant] || styles.text;

  const style = {
    width: width || undefined,
    height: height || undefined
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${styles.skeleton} ${skeletonClass} ${className}`}
          style={style}
        />
      ))}
    </>
  );
};

// Componentes especializados
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i}>
                <LoadingSkeleton variant="text" height="20px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex}>
                  <LoadingSkeleton variant="text" height="16px" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.cardSkeleton}>
          <LoadingSkeleton variant="title" height="24px" width="60%" />
          <LoadingSkeleton variant="text" height="16px" width="40%" />
          <LoadingSkeleton variant="text" height="48px" width="80%" />
        </div>
      ))}
    </>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className={styles.chartSkeleton}>
      <LoadingSkeleton variant="title" height="24px" width="200px" />
      <div className={styles.chartBars}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={styles.bar}
            style={{ height: `${Math.random() * 60 + 40}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
