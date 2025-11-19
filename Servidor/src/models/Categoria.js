/**
 * Modelo para gestión de Categorías de Denuncias
 */

import pool from '../config/database.js';

class Categoria {
  /**
   * Obtener todas las categorías
   * @returns {Promise<Array>} Lista de categorías
   */
  static async obtenerTodas() {
    try {
      const [categorias] = await pool.query(
        `SELECT
          id_categoria,
          nombre,
          descripcion,
          area_responsable_sugerida
        FROM categoria
        ORDER BY nombre ASC`
      );
      return categorias;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }

  /**
   * Obtener una categoría por ID
   * @param {number} id_categoria - ID de la categoría
   * @returns {Promise<Object|null>} Datos de la categoría o null
   */
  static async obtenerPorId(id_categoria) {
    try {
      const [categorias] = await pool.query(
        `SELECT
          id_categoria,
          nombre,
          descripcion,
          area_responsable_sugerida
        FROM categoria
        WHERE id_categoria = ?`,
        [id_categoria]
      );
      return categorias[0] || null;
    } catch (error) {
      console.error('Error al obtener categoría por ID:', error);
      throw error;
    }
  }

  /**
   * Crear una nueva categoría
   * @param {Object} datos - Datos de la categoría
   * @returns {Promise<number>} ID de la categoría creada
   */
  static async crear(datos) {
    try {
      const { nombre, descripcion, area_responsable_sugerida } = datos;

      const [resultado] = await pool.query(
        `INSERT INTO categoria (nombre, descripcion, area_responsable_sugerida)
        VALUES (?, ?, ?)`,
        [nombre, descripcion, area_responsable_sugerida]
      );

      return resultado.insertId;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  }

  /**
   * Actualizar una categoría
   * @param {number} id_categoria - ID de la categoría
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise<boolean>} true si se actualizó
   */
  static async actualizar(id_categoria, datos) {
    try {
      const { nombre, descripcion, area_responsable_sugerida } = datos;

      const [resultado] = await pool.query(
        `UPDATE categoria
        SET nombre = ?,
            descripcion = ?,
            area_responsable_sugerida = ?
        WHERE id_categoria = ?`,
        [nombre, descripcion, area_responsable_sugerida, id_categoria]
      );

      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw error;
    }
  }
}

export default Categoria;
