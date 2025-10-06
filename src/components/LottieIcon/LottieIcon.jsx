import React from 'react';
import Lottie from 'react-lottie-player';
import './LottieIcon.css';

/**
 * Componente reutilizable para mostrar animaciones Lottie
 * @param {object} src - Objeto JSON de la animación Lottie
 * @param {string} alt - Texto alternativo para accesibilidad
 * @param {string} className - Clases CSS adicionales
 * @param {number} width - Ancho del icono (por defecto 60px)
 * @param {number} height - Alto del icono (por defecto 60px)
 * @param {boolean} loop - Si la animación debe repetirse (por defecto true)
 * @param {boolean} autoplay - Si la animación debe iniciarse automáticamente (por defecto true)
 * @param {string} speed - Velocidad de la animación (por defecto 1)
 */
const LottieIcon = ({ 
  src, 
  alt, 
  className = '', 
  width = 60, 
  height = 60, 
  loop = true, 
  autoplay = true,
  speed = 1
}) => {
  // Verificar que src sea un objeto válido de animación Lottie
  if (!src || typeof src !== 'object') {
    return (
      <div className={`lottie-icon ${className}`} title={alt}>
        <div 
          className="lottie-error" 
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          Error: Datos de animación inválidos
        </div>
      </div>
    );
  }

  return (
    <div className={`lottie-icon ${className}`} title={alt}>
      <Lottie
        animationData={src}
        className="lottie-player"
        loop={loop}
        play={autoplay}
        speed={speed}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </div>
  );
};

export default LottieIcon;