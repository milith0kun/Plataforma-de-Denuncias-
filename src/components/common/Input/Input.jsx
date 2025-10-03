import styles from './Input.module.css';

const Input = ({ 
  label, 
  type = 'text', 
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  disabled = false,
  ...props 
}) => {
  return (
    <div className={styles['input-group']}>
      {label && (
        <label 
          htmlFor={name} 
          className={`${styles.label} ${required ? styles['label-required'] : ''}`}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`${styles.input} ${error ? styles['input-error'] : ''}`}
        {...props}
      />
      {error && <span className={styles['error-message']}>{error}</span>}
    </div>
  );
};

export default Input;
