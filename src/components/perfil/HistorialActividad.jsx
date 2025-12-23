import React, { useState, useEffect } from 'react';
import UsuarioService from '../../services/usuarioService';
import styles from './HistorialActividad.module.css';

/**
 * Componente para mostrar el historial de actividad del usuario
 * Incluye paginación y filtros básicos
 */
const HistorialActividad = () => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paginacion, setPaginacion] = useState({
    pagina: 1,
    limite: 10,
    total: 0,
    totalPaginas: 0
  });

  /**
   * Carga el historial de actividad
   * @param {number} pagina - Página a cargar
   * @param {number} limite - Límite de elementos por página
   */
  const cargarHistorial = async (pagina = 1, limite = 10) => {
    try {
      setLoading(true);
      setError('');

      const response = await UsuarioService.obtenerHistorialActividad({ pagina, limite });

      // El backend devuelve { success: true, data: [...actividades...] }
      const actividadesData = response.data || response.actividades || [];

      setActividades(actividadesData);
      setPaginacion({
        pagina: response.pagina || pagina,
        limite: response.limite || limite,
        total: actividadesData.length,
        totalPaginas: Math.ceil(actividadesData.length / limite) || 1
      });
    } catch (err) {
      console.error('Error al cargar historial:', err);
      setError('Error al cargar el historial de actividad');
      setActividades([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar historial al montar el componente
  useEffect(() => {
    cargarHistorial();
  }, []);

  /**
   * Maneja el cambio de página
   * @param {number} nuevaPagina - Nueva página a cargar
   */
  const handleCambioPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= paginacion.totalPaginas) {
      cargarHistorial(nuevaPagina, paginacion.limite);
    }
  };

  /**
   * Maneja el cambio de límite de elementos por página
   * @param {Event} e - Evento del select
   */
  const handleCambioLimite = (e) => {
    const nuevoLimite = parseInt(e.target.value);
    cargarHistorial(1, nuevoLimite);
  };

  /**
   * Formatea la fecha de actividad
   * @param {string} fecha - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  const formatearFecha = (fecha) => {
    try {
      const date = new Date(fecha);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  /**
   * Obtiene el icono para el tipo de actividad
   * @param {string} tipo - Tipo de actividad
   * @returns {string} Emoji del icono
   */
  const obtenerIconoActividad = (tipo) => {
    const iconos = {
      'login': '🔐',
      'logout': '🚪',
      'perfil_actualizado': '👤',
      'password_cambiado': '🔑',
      'denuncia_creada': '📝',
      'denuncia_actualizada': '✏️',
      'documento_subido': '📎',
      'configuracion_cambiada': '⚙️',
      'default': '📋'
    };

    return iconos[tipo] || iconos.default;
  };

  /**
   * Obtiene la clase CSS para el tipo de actividad
   * @param {string} tipo - Tipo de actividad
   * @returns {string} Clase CSS
   */
  const obtenerClaseActividad = (tipo) => {
    const clases = {
      'login': styles.actividadLogin,
      'logout': styles.actividadLogout,
      'perfil_actualizado': styles.actividadPerfil,
      'password_cambiado': styles.actividadSeguridad,
      'denuncia_creada': styles.actividadDenuncia,
      'denuncia_actualizada': styles.actividadDenuncia,
      'documento_subido': styles.actividadDocumento,
      'configuracion_cambiada': styles.actividadConfiguracion
    };

    return clases[tipo] || styles.actividadDefault;
  };

  /**
   * Reintenta cargar el historial
   */
  const reintentar = () => {
    cargarHistorial(paginacion.pagina, paginacion.limite);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando historial de actividad...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          <p>{error}</p>
          <button onClick={reintentar} className={styles.btnReintentar}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Historial de Actividad</h3>
        <p className={styles.subtitle}>
          Registro de tus últimas actividades en la plataforma
        </p>
      </div>

      {/* Controles de paginación superior */}
      {paginacion.total > 0 && (
        <div className={styles.controles}>
          <div className={styles.info}>
            Mostrando {((paginacion.pagina - 1) * paginacion.limite) + 1} - {Math.min(paginacion.pagina * paginacion.limite, paginacion.total)} de {paginacion.total} actividades
          </div>

          <div className={styles.limitePorPagina}>
            <label htmlFor="limite">Mostrar:</label>
            <select
              id="limite"
              value={paginacion.limite}
              onChange={handleCambioLimite}
              className={styles.selectLimite}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>por página</span>
          </div>
        </div>
      )}

      {/* Lista de actividades */}
      {actividades.length === 0 ? (
        <div className={styles.sinActividades}>
          <div className={styles.iconoVacio}>📋</div>
          <h4>No hay actividades registradas</h4>
          <p>Cuando realices acciones en la plataforma, aparecerán aquí.</p>
        </div>
      ) : (
        <div className={styles.listaActividades}>
          {actividades.map((actividad, index) => (
            <div key={index} className={`${styles.itemActividad} ${obtenerClaseActividad(actividad.tipo)}`}>
              <div className={styles.iconoActividad}>
                {actividad.icono || obtenerIconoActividad(actividad.tipo)}
              </div>

              <div className={styles.contenidoActividad}>
                <div className={styles.descripcionActividad}>
                  {actividad.descripcion || 'Actividad sin descripción'}
                </div>

                {actividad.detalles && (
                  <div className={styles.detallesActividad}>
                    {actividad.detalles}
                  </div>
                )}

                <div className={styles.metadatosActividad}>
                  <span className={styles.fechaActividad}>
                    {formatearFecha(actividad.fecha || actividad.fecha_actividad)}
                  </span>

                  {actividad.ip_address && (
                    <span className={styles.ipActividad}>
                      IP: {actividad.ip_address}
                    </span>
                  )}

                  {actividad.user_agent && (
                    <span className={styles.dispositivoActividad} title={actividad.user_agent}>
                      {actividad.user_agent.includes('Mobile') ? '📱' : '💻'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
      }

      {/* Controles de paginación inferior */}
      {
        paginacion.totalPaginas > 1 && (
          <div className={styles.paginacion}>
            <button
              onClick={() => handleCambioPagina(paginacion.pagina - 1)}
              disabled={paginacion.pagina <= 1}
              className={styles.btnPaginacion}
              aria-label="Página anterior"
            >
              ← Anterior
            </button>

            <div className={styles.numerosPagina}>
              {/* Mostrar páginas cercanas a la actual */}
              {Array.from({ length: Math.min(5, paginacion.totalPaginas) }, (_, i) => {
                let numeroPagina;

                if (paginacion.totalPaginas <= 5) {
                  numeroPagina = i + 1;
                } else if (paginacion.pagina <= 3) {
                  numeroPagina = i + 1;
                } else if (paginacion.pagina >= paginacion.totalPaginas - 2) {
                  numeroPagina = paginacion.totalPaginas - 4 + i;
                } else {
                  numeroPagina = paginacion.pagina - 2 + i;
                }

                return (
                  <button
                    key={numeroPagina}
                    onClick={() => handleCambioPagina(numeroPagina)}
                    className={`${styles.btnPaginacion} ${numeroPagina === paginacion.pagina ? styles.paginaActiva : ''
                      }`}
                  >
                    {numeroPagina}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handleCambioPagina(paginacion.pagina + 1)}
              disabled={paginacion.pagina >= paginacion.totalPaginas}
              className={styles.btnPaginacion}
              aria-label="Página siguiente"
            >
              Siguiente →
            </button>
          </div>
        )
      }
    </div>
  );
};

export default HistorialActividad;