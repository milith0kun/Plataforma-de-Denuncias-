import styles from './Loading.module.css';

const Loading = ({ text = 'Cargando...' }) => {
  return (
    <div className={styles['loading-container']}>
      <div>
        <div className={styles.spinner}></div>
        {text && <p className={styles['loading-text']}>{text}</p>}
      </div>
    </div>
  );
};

export default Loading;
