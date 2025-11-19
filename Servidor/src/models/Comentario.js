/**
 * Modelo de Comentario
 * Gestiona comentarios y seguimiento de denuncias
 */

const db = require('../config/database');

const Comentario = {
  /**
   * Crear un nuevo comentario
   * @param {Object} datosComentario - Datos del comentario
   * @returns {Promise<Object>} Comentario creado
   */
  async crear(datosComentario) {
    try {
      const query = `
        INSERT INTO comentarios
        (id_denuncia, id_usuario, comentario, es_interno)
        VALUES (?, ?, ?, ?)
      `;

      const [resultado] = await db.execute(query, [
        datosComentario.id_denuncia,
        datosComentario.id_usuario,
        datosComentario.comentario,
        datosComentario.es_interno || false
      ]);

      // Obtener el comentario recién creado
      const comentarioCreado = await this.obtenerPorId(resultado.insertId);

      return comentarioCreado;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener un comentario por ID
   * @param {number} id - ID del comentario
   * @returns {Promise<Object>} Comentario
   */
  async obtenerPorId(id) {
    try {
      const query = `
        SELECT
          c.*,
          u.nombres,
          u.apellidos,
          u.tipo_usuario_id,
          tu.nombre AS tipo_usuario
        FROM comentarios c
        INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
        LEFT JOIN tipos_usuario tu ON u.tipo_usuario_id = tu.id
        WHERE c.id_comentario = ?
      `;

      const [comentarios] = await db.execute(query, [id]);

      return comentarios[0] || null;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener comentarios de una denuncia
   * @param {number} idDenuncia - ID de la denuncia
   * @param {boolean} incluirInternos - Si incluir comentarios internos (solo para autoridades)
   * @returns {Promise<Array>} Lista de comentarios
   */
  async obtenerPorDenuncia(idDenuncia, incluirInternos = false) {
    try {
      let query = `
        SELECT
          c.*,
          u.nombres,
          u.apellidos,
          u.tipo_usuario_id,
          tu.nombre AS tipo_usuario
        FROM comentarios c
        INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
        LEFT JOIN tipos_usuario tu ON u.tipo_usuario_id = tu.id
        WHERE c.id_denuncia = ?
      `;

      // Si no se incluyen internos, filtrar
      if (!incluirInternos) {
        query += ' AND c.es_interno = FALSE';
      }

      query += ' ORDER BY c.fecha_comentario DESC';

      const [comentarios] = await db.execute(query, [idDenuncia]);

      return comentarios;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar un comentario
   * @param {number} id - ID del comentario
   * @param {string} nuevoComentario - Nuevo texto del comentario
   * @returns {Promise<Object>} Comentario actualizado
   */
  async actualizar(id, nuevoComentario) {
    try {
      const query = `
        UPDATE comentarios
        SET comentario = ?
        WHERE id_comentario = ?
      `;

      await db.execute(query, [nuevoComentario, id]);

      return await this.obtenerPorId(id);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Eliminar un comentario
   * @param {number} id - ID del comentario
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  async eliminar(id) {
    try {
      const query = 'DELETE FROM comentarios WHERE id_comentario = ?';
      const [resultado] = await db.execute(query, [id]);

      return resultado.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verificar si un comentario pertenece a un usuario
   * @param {number} idComentario - ID del comentario
   * @param {number} idUsuario - ID del usuario
   * @returns {Promise<boolean>} True si el comentario pertenece al usuario
   */
  async perteneceAUsuario(idComentario, idUsuario) {
    try {
      const query = `
        SELECT id_comentario
        FROM comentarios
        WHERE id_comentario = ? AND id_usuario = ?
      `;

      const [resultados] = await db.execute(query, [idComentario, idUsuario]);

      return resultados.length > 0;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener estadísticas de comentarios de una denuncia
   * @param {number} idDenuncia - ID de la denuncia
   * @returns {Promise<Object>} Estadísticas
   */
  async obtenerEstadisticas(idDenuncia) {
    try {
      const query = `
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN es_interno = FALSE THEN 1 ELSE 0 END) as publicos,
          SUM(CASE WHEN es_interno = TRUE THEN 1 ELSE 0 END) as internos,
          MIN(fecha_comentario) as primer_comentario,
          MAX(fecha_comentario) as ultimo_comentario
        FROM comentarios
        WHERE id_denuncia = ?
      `;

      const [estadisticas] = await db.execute(query, [idDenuncia]);

      return estadisticas[0] || {
        total: 0,
        publicos: 0,
        internos: 0,
        primer_comentario: null,
        ultimo_comentario: null
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Comentario;
