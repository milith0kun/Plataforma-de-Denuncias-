import { useState, useEffect } from 'react';
import styles from './Lightbox.module.css';

const Lightbox = ({ images = [], initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [currentIndex, images.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const currentImage = images[currentIndex];

  return (
    <div className={styles.lightbox} onClick={onClose}>
      <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.counter}>
            {currentIndex + 1} / {images.length}
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image */}
        <div className={styles.imageContainer}>
          <img
            src={currentImage.url || currentImage}
            alt={currentImage.descripcion || `Imagen ${currentIndex + 1}`}
            className={`${styles.image} ${isZoomed ? styles.zoomed : ''}`}
            onClick={toggleZoom}
          />
        </div>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.navButtonPrev}`}
              onClick={handlePrevious}
              aria-label="Imagen anterior"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className={`${styles.navButton} ${styles.navButtonNext}`}
              onClick={handleNext}
              aria-label="Imagen siguiente"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Footer with thumbnails */}
        {images.length > 1 && (
          <div className={styles.thumbnails}>
            {images.map((img, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${index === currentIndex ? styles.thumbnailActive : ''}`}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsZoomed(false);
                }}
              >
                <img
                  src={img.url || img}
                  alt={`Miniatura ${index + 1}`}
                />
              </button>
            ))}
          </div>
        )}

        {/* Description */}
        {currentImage.descripcion && (
          <div className={styles.description}>
            <p>{currentImage.descripcion}</p>
          </div>
        )}

        {/* Controls hint */}
        <div className={styles.hint}>
          <span>← → para navegar</span>
          <span>•</span>
          <span>Click para zoom</span>
          <span>•</span>
          <span>ESC para cerrar</span>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
