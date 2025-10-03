import styles from './Button.module.css';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  fullWidth = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  const classNames = [
    styles.button,
    styles[`button-${variant}`],
    fullWidth && styles['button-full']
  ].filter(Boolean).join(' ');

  return (
    <button 
      type={type}
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
