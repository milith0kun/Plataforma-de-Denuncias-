/**
 * Modelo para gestión de Evidencias Fotográficas de Denuncias
 */

import pool from '../config/database.js';

class EvidenciaFoto {
  /**
   * Crear una nueva evidencia
   * @param {Object} datosEvidencia - Datos de la evidencia
   * @returns {Promise<number>} ID de la evidencia creada
   */
  static async crear(datosEvidencia) {
    try {
      const { id_denuncia, url_archivo, nombre_archivo } = datosEvidencia;

      const [resultado] = await pool.query(
        `INSERT INTO evidencia_foto (id_denuncia, url_archivo, nombre_archivo, fecha_carga)
        VALUES (?, ?, ?, NOW())`,
        [id_denuncia, url_archivo, nombre_archivo || null]
      );

      return resultado.insertId;
    } catch (error) {
      console.error('Error al crear evidencia:', error);
      throw error;
    }
  }

  /**
   * Crear múltiples evidencias de una vez
   * @param {number} id_denuncia - ID de la denuncia
   * @param {Array<string>} urls - Array de URLs de archivos
   * @returns {Promise<Array<number>>} Array de IDs de evidencias creadas
   */
  static async crearMultiples(id_denuncia, evidencias) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const ids = [];

      for (const evidencia of evidencias) {
        const [resultado] = await connection.query(
          `INSERT INTO evidencia_foto (id_denuncia, url_archivo, nombre_archivo, fecha_carga)
          VALUES (?, ?, ?, NOW())`,
          [id_denuncia, evidencia.url_archivo, evidencia.nombre_archivo || null]
        );
        ids.push(resultado.insertId);
      }

      await connection.commit();
      return ids;
    } catch (error) {
      await connection.rollback();
      console.error('Error al crear evidencias múltiples:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Obtener todas las evidencias de una denuncia
   * @param {number} id_denuncia - ID de la denuncia
   * @returns {Promise<Array>} Lista de evidencias
   */
  static async obtenerPorDenuncia(id_denuncia) {
    try {
      const [evidencias] = await pool.query(
        `SELECT
          id_evidencia,
          id_denuncia,
          url_archivo,
          nombre_archivo,
          fecha_carga
        FROM evidencia_foto
        WHERE id_denuncia = ?
        ORDER BY fecha_carga ASC`,
        [id_denuncia]
      );

      return evidencias;
    } catch (error) {
      console.error('Error al obtener evidencias:', error);
      throw error;
    }
  }

  /**
   * Obtener una evidencia por ID
   * @param {number} id_evidencia - ID de la evidencia
   * @returns {Promise<Object|null>} Datos de la evidencia o null
   */
  static async obtenerPorId(id_evidencia) {
    try {
      const [evidencias] = await pool.query(
        `SELECT
          id_evidencia,
          id_denuncia,
          url_archivo,
          nombre_archivo,
          fecha_carga
        FROM evidencia_foto
        WHERE id_evidencia = ?`,
        [id_evidencia]
      );

      return evidencias[0] || null;
    } catch (error) {
      console.error('Error al obtener evidencia por ID:', error);
      throw error;
    }
  }

  /**
   * Eliminar una evidencia
   * @param {number} id_evidencia - ID de la evidencia
   * @returns {Promise<Object>} { success, url_archivo }
   */
  static async eliminar(id_evidencia) {
    try {
      // Primero obtener la URL para poder eliminar el archivo físico
      const evidencia = await this.obtenerPorId(id_evidencia);

      if (!evidencia) {
        throw new Error('Evidencia no encontrada');
      }

      const [resultado] = await pool.query(
        'DELETE FROM evidencia_foto WHERE id_evidencia = ?',
        [id_evidencia]
      );

      return {
        success: resultado.affectedRows > 0,
        url_archivo: evidencia.url_archivo
      };
    } catch (error) {
      console.error('Error al eliminar evidencia:', error);
      throw error;
    }
  }

  /**
   * Eliminar todas las evidencias de una denuncia
   * @param {number} id_denuncia - ID de la denuncia
   * @returns {Promise<Array>} Array de URLs de archivos eliminados
   */
  static async eliminarPorDenuncia(id_denuncia) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Obtener URLs antes de eliminar
      const evidencias = await this.obtenerPorDenuncia(id_denuncia);
      const urls = evidencias.map(e => e.url_archivo);

      // Eliminar de la base de datos
      await connection.query(
        'DELETE FROM evidencia_foto WHERE id_denuncia = ?',
        [id_denuncia]
      );

      await connection.commit();
      return urls;
    } catch (error) {
      await connection.rollback();
      console.error('Error al eliminar evidencias por denuncia:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Contar evidencias de una denuncia
   * @param {number} id_denuncia - ID de la denuncia
   * @returns {Promise<number>} Cantidad de evidencias
   */
  static async contarPorDenuncia(id_denuncia) {
    try {
      const [resultado] = await pool.query(
        'SELECT COUNT(*) as total FROM evidencia_foto WHERE id_denuncia = ?',
        [id_denuncia]
      );

      return resultado[0].total;
    } catch (error) {
      console.error('Error al contar evidencias:', error);
      throw error;
    }
  }
}

export default EvidenciaFoto;
