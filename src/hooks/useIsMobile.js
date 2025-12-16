import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar si estamos en un dispositivo móvil
 * @param {number} breakpoint - Ancho máximo en píxeles para considerar móvil (por defecto 1024)
 * @returns {boolean} - true si es móvil, false si es desktop
 */
export const useIsMobile = (breakpoint = 1024) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};
