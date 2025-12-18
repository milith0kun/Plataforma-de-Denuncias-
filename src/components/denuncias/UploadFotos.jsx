import { useState, useCallback, useRef } from 'react';
import styles from './UploadFotos.module.css';

const UploadFotos = ({ fotos, setFotos, maxFotos = 5 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validarArchivo = (file) => {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const tamañoMaximo = 5 * 1024 * 1024; // 5MB

    if (!tiposPermitidos.includes(file.type)) {
      return 'Solo se permiten imágenes (JPG, PNG, WEBP)';
    }

    if (file.size > tamañoMaximo) {
      return 'El archivo no debe superar 5MB';
    }

    return null;
  };

  const procesarArchivos = useCallback((archivos) => {
    setError('');
    const archivosArray = Array.from(archivos);

    // Validar cantidad máxima
    if (fotos.length + archivosArray.length > maxFotos) {
      setError(`Solo puedes subir un máximo de ${maxFotos} fotos`);
      return;
    }

    // Validar cada archivo
    for (const file of archivosArray) {
      const errorValidacion = validarArchivo(file);
      if (errorValidacion) {
        setError(errorValidacion);
        return;
      }
    }

    // Crear previews
    const nuevasFotos = archivosArray.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));

    setFotos([...fotos, ...nuevasFotos]);
  }, [fotos, setFotos, maxFotos]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    // Solo quitar el drag si salimos del elemento principal
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const archivos = e.dataTransfer.files;
    if (archivos && archivos.length > 0) {
      procesarArchivos(archivos);
    }
  }, [procesarArchivos]);

  const handleFileChange = (e) => {
    const archivos = e.target.files;
    if (archivos && archivos.length > 0) {
      procesarArchivos(archivos);
    }
  };

  const eliminarFoto = (id) => {
    const fotoAEliminar = fotos.find(f => f.id === id);
    if (fotoAEliminar && fotoAEliminar.preview) {
      URL.revokeObjectURL(fotoAEliminar.preview);
    }
    setFotos(fotos.filter(f => f.id !== id));
    setError('');
  };

  const handleClickZona = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${fotos.length >= maxFotos ? styles.disabled : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={fotos.length < maxFotos ? handleClickZona : undefined}
        role="button"
        tabIndex={0}
        aria-label="Zona de carga de imágenes"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/jpg,image/webp"
          onChange={handleFileChange}
          className={styles.fileInput}
          disabled={fotos.length >= maxFotos}
        />

        <div className={styles.dropZoneContent}>
          <svg
            className={styles.uploadIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width="48"
            height="48"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          {fotos.length < maxFotos ? (
            <>
              <p className={styles.mainText}>
                Arrastra las fotos aquí o haz clic para seleccionar
              </p>
              <p className={styles.subText}>
                Máximo {maxFotos} fotos · JPG, PNG, WEBP · Máx 5MB cada una
              </p>
            </>
          ) : (
            <p className={styles.mainText}>
              Límite de {maxFotos} fotos alcanzado
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className={styles.error} role="alert">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          </svg>
          {error}
        </div>
      )}

      {fotos.length > 0 && (
        <div className={styles.previewGrid}>
          {fotos.map((foto) => (
            <div key={foto.id} className={styles.previewItem}>
              <img
                src={foto.preview}
                alt="Preview"
                className={styles.previewImage}
              />
              <button
                type="button"
                onClick={() => eliminarFoto(foto.id)}
                className={styles.deleteButton}
                aria-label="Eliminar foto"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{foto.file.name}</span>
                <span className={styles.fileSize}>
                  {(foto.file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.counter}>
        {fotos.length} / {maxFotos} fotos
      </div>
    </div>
  );
};

export default UploadFotos;
