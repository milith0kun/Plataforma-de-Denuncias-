import { useState } from 'react';
import styles from './ModalAsignarArea.module.css';

const AREAS_DISPONIBLES = [
  'Obras Públicas',
  'Limpieza',
  'Seguridad',
  'Salud',
  'Medio Ambiente',
  'Transporte',
  'Servicios Sociales'
];

const ModalAsignarArea = ({ denuncia, onClose, onAsignar, procesando }) => {
  const [areaSeleccionada, setAreaSeleccionada] = useState(denuncia?.area_asignada || '');
  const [comentario, setComentario] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAsignar(denuncia.id_denuncia, areaSeleccionada, comentario);
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Asignar Área Responsable</h2>
          <button
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Cerrar modal"
            disabled={procesando}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Denuncia:</span>
              <span className={styles.infoValue}>{denuncia?.titulo}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Categoría:</span>
              <span className={styles.infoValue}>{denuncia?.categoria_nombre}</span>
            </div>
            {denuncia?.area_asignada && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Área actual:</span>
                <span className={styles.areaBadge}>{denuncia.area_asignada}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Área Responsable <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.formSelect}
                value={areaSeleccionada}
                onChange={(e) => setAreaSeleccionada(e.target.value)}
                required
              >
                <option value="">Seleccionar área</option>
                {AREAS_DISPONIBLES.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <p className={styles.helpText}>
                Esta área será responsable de gestionar la denuncia
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Comentario (Opcional)
              </label>
              <textarea
                className={styles.formTextarea}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Agrega notas adicionales sobre la asignación..."
                rows={3}
              ></textarea>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnCancelar}
                onClick={onClose}
                disabled={procesando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.btnGuardar}
                disabled={procesando || !areaSeleccionada}
              >
                {procesando ? (
                  <>
                    <span className={styles.spinner}></span>
                    Asignando...
                  </>
                ) : (
                  'Asignar Área'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalAsignarArea;
