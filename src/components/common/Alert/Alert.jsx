import styles from './Alert.module.css';

const Alert = ({ type = 'info', message, children }) => {
  if (!message && !children) return null;

  return (
    <div className={`${styles.alert} ${styles[`alert-${type}`]}`}>
      {message || children}
    </div>
  );
};

export default Alert;
