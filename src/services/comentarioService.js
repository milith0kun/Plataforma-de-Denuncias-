/**
 * Servicio para gestión de Comentarios
 */

import api from './api';

const comentarioService = {
  /**
   * Obtener comentarios de una denuncia
   * @param {number} idDenuncia - ID de la denuncia
   * @returns {Promise} Lista de comentarios
   */
  async obtenerComentarios(idDenuncia) {
    try {
      const response = await api.get(`/denuncias/${idDenuncia}/comentarios`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Crear un nuevo comentario
   * @param {number} idDenuncia - ID de la denuncia
   * @param {Object} datos - {comentario, es_interno}
   * @returns {Promise} Comentario creado
   */
  async crearComentario(idDenuncia, datos) {
    try {
      const response = await api.post(`/denuncias/${idDenuncia}/comentarios`, datos);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Actualizar un comentario
   * @param {number} idComentario - ID del comentario
   * @param {string} nuevoComentario - Nuevo texto del comentario
   * @returns {Promise} Comentario actualizado
   */
  async actualizarComentario(idComentario, nuevoComentario) {
    try {
      const response = await api.put(`/comentarios/${idComentario}`, {
        comentario: nuevoComentario
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Eliminar un comentario
   * @param {number} idComentario - ID del comentario
   * @returns {Promise} Respuesta de la API
   */
  async eliminarComentario(idComentario) {
    try {
      const response = await api.delete(`/comentarios/${idComentario}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener estadísticas de comentarios de una denuncia
   * @param {number} idDenuncia - ID de la denuncia
   * @returns {Promise} Estadísticas de comentarios
   */
  async obtenerEstadisticas(idDenuncia) {
    try {
      const response = await api.get(`/denuncias/${idDenuncia}/comentarios/estadisticas`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default comentarioService;
