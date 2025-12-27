/**
 * Servicio para gestión de Denuncias
 */

import api from './api';

const denunciaService = {
  /**
   * Crear una nueva denuncia
   * @param {Object} datosDenuncia - Datos de la denuncia
   * @returns {Promise} Respuesta de la API
   */
  async crearDenuncia(datosDenuncia) {
    try {
      const response = await api.post('/denuncias', datosDenuncia);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener todas las denuncias del usuario autenticado (o todas si es autoridad/admin)
   * @param {Object} filtros - Filtros opcionales
   * @returns {Promise} Lista de denuncias
   */
  async obtenerDenuncias(filtros = {}) {
    try {
      const params = new URLSearchParams();

      if (filtros.id_categoria) params.append('id_categoria', filtros.id_categoria);
      if (filtros.id_estado) params.append('id_estado', filtros.id_estado);
      if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
      if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
      if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
      if (filtros.pagina) params.append('pagina', filtros.pagina);
      if (filtros.limite) params.append('limite', filtros.limite);
      if (filtros.orden) params.append('orden', filtros.orden);
      if (filtros.direccion) params.append('direccion', filtros.direccion);

      const queryString = params.toString();
      const url = queryString ? `/denuncias?${queryString}` : '/denuncias';

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener una denuncia específica por ID
   * @param {number} id - ID de la denuncia
   * @returns {Promise} Datos de la denuncia
   */
  async obtenerDenunciaPorId(id) {
    try {
      const response = await api.get(`/denuncias/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Actualizar una denuncia
   * @param {number} id - ID de la denuncia
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise} Respuesta de la API
   */
  async actualizarDenuncia(id, datos) {
    try {
      const response = await api.put(`/denuncias/${id}`, datos);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cambiar el estado de una denuncia (solo autoridades)
   * @param {number} id - ID de la denuncia
   * @param {number} id_estado_nuevo - ID del nuevo estado
   * @param {string} comentario - Comentario sobre el cambio
   * @returns {Promise} Respuesta de la API
   */
  async cambiarEstado(id, id_estado_nuevo, comentario) {
    try {
      const response = await api.put(`/denuncias/${id}/estado`, {
        id_estado_nuevo,
        comentario
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Eliminar una denuncia
   * @param {number} id - ID de la denuncia
   * @returns {Promise} Respuesta de la API
   */
  async eliminarDenuncia(id) {
    try {
      const response = await api.delete(`/denuncias/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener categorías disponibles
   * @returns {Promise} Lista de categorías
   */
  async obtenerCategorias() {
    try {
      const response = await api.get('/categorias');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener estados disponibles
   * @returns {Promise} Lista de estados
   */
  async obtenerEstados() {
    try {
      const response = await api.get('/estados');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener estadísticas de denuncias del usuario
   * @returns {Promise} Estadísticas
   */
  async obtenerEstadisticasUsuario() {
    try {
      // Obtener todas las denuncias del usuario
      const response = await this.obtenerDenuncias({ limite: 1000 });

      if (!response.success) {
        throw new Error('Error al obtener denuncias');
      }

      const denuncias = response.data.denuncias;

      // Calcular estadísticas
      const estadisticas = {
        total: denuncias.length,
        pendientes: denuncias.filter(d => d.id_estado_actual === 1 || d.id_estado_actual === 2).length,
        enProceso: denuncias.filter(d => d.id_estado_actual === 3 || d.id_estado_actual === 4).length,
        resueltas: denuncias.filter(d => d.id_estado_actual === 5).length,
        cerradas: denuncias.filter(d => d.id_estado_actual === 6).length
      };

      return estadisticas;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Subir evidencias fotográficas a una denuncia
   * @param {number} idDenuncia - ID de la denuncia
   * @param {Array<File>} archivos - Archivos de imágenes
   * @returns {Promise} Respuesta de la API
   */
  async subirEvidencias(idDenuncia, archivos) {
    try {
      const formData = new FormData();

      archivos.forEach((archivo) => {
        formData.append('evidencias', archivo);
      });

      const response = await api.post(`/denuncias/${idDenuncia}/evidencias`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Eliminar una evidencia fotográfica
   * @param {number} idEvidencia - ID de la evidencia
   * @returns {Promise} Respuesta de la API
   */
  async eliminarEvidencia(idEvidencia) {
    try {
      const response = await api.delete(`/denuncias/evidencias/${idEvidencia}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener historial de estados de una denuncia
   * @param {number} id - ID de la denuncia
   * @returns {Promise} Historial de estados
   */
  async obtenerHistorialEstados(id) {
    try {
      const response = await api.get(`/denuncias/${id}/historial`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Asignar área responsable a una denuncia
   * @param {number} id - ID de la denuncia
   * @param {string} area_asignada - Área a asignar
   * @param {string} comentario - Comentario opcional
   * @returns {Promise} Respuesta de la API
   */
  async asignarArea(id, area_asignada, comentario) {
    try {
      const response = await api.put(`/denuncias/${id}/asignar`, {
        area_asignada,
        comentario
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default denunciaService;
