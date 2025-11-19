/**
 * Servicio para obtener estadísticas y reportes
 */

import api from './api';

const estadisticasService = {
  /**
   * Obtener estadísticas generales
   * @returns {Promise} Estadísticas completas (adaptadas por rol)
   */
  async obtenerEstadisticasGenerales() {
    try {
      const response = await api.get('/estadisticas');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener resumen rápido para dashboard
   * @returns {Promise} Resumen de estadísticas
   */
  async obtenerResumen() {
    try {
      const response = await api.get('/estadisticas/resumen');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener estadísticas de una categoría específica
   * @param {number} idCategoria - ID de la categoría
   * @returns {Promise} Estadísticas de la categoría
   */
  async obtenerEstadisticasPorCategoria(idCategoria) {
    try {
      const response = await api.get(`/estadisticas/categoria/${idCategoria}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default estadisticasService;
