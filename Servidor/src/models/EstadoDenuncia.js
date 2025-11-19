/**
 * Modelo para gestión de Estados de Denuncias
 */

import pool from '../config/database.js';

class EstadoDenuncia {
  /**
   * Obtener todos los estados
   * @returns {Promise<Array>} Lista de estados ordenados por flujo
   */
  static async obtenerTodos() {
    try {
      const [estados] = await pool.query(
        `SELECT
          id_estado,
          nombre,
          descripcion,
          orden_flujo
        FROM estado_denuncia
        ORDER BY orden_flujo ASC`
      );
      return estados;
    } catch (error) {
      console.error('Error al obtener estados:', error);
      throw error;
    }
  }

  /**
   * Obtener un estado por ID
   * @param {number} id_estado - ID del estado
   * @returns {Promise<Object|null>} Datos del estado o null
   */
  static async obtenerPorId(id_estado) {
    try {
      const [estados] = await pool.query(
        `SELECT
          id_estado,
          nombre,
          descripcion,
          orden_flujo
        FROM estado_denuncia
        WHERE id_estado = ?`,
        [id_estado]
      );
      return estados[0] || null;
    } catch (error) {
      console.error('Error al obtener estado por ID:', error);
      throw error;
    }
  }

  /**
   * Obtener un estado por nombre
   * @param {string} nombre - Nombre del estado
   * @returns {Promise<Object|null>} Datos del estado o null
   */
  static async obtenerPorNombre(nombre) {
    try {
      const [estados] = await pool.query(
        `SELECT
          id_estado,
          nombre,
          descripcion,
          orden_flujo
        FROM estado_denuncia
        WHERE nombre = ?`,
        [nombre]
      );
      return estados[0] || null;
    } catch (error) {
      console.error('Error al obtener estado por nombre:', error);
      throw error;
    }
  }

  /**
   * Validar si una transición de estado es válida
   * @param {number} id_estado_actual - ID del estado actual
   * @param {number} id_estado_nuevo - ID del nuevo estado
   * @returns {Promise<boolean>} true si la transición es válida
   */
  static async esTransicionValida(id_estado_actual, id_estado_nuevo) {
    try {
      // Obtener los estados
      const estadoActual = await this.obtenerPorId(id_estado_actual);
      const estadoNuevo = await this.obtenerPorId(id_estado_nuevo);

      if (!estadoActual || !estadoNuevo) {
        return false;
      }

      // Permitir transición si:
      // 1. El nuevo estado está en el siguiente paso del flujo
      // 2. O se está retrocediendo (orden_flujo menor)
      // 3. O es el mismo estado (actualización)
      return estadoNuevo.orden_flujo >= estadoActual.orden_flujo - 10 &&
             estadoNuevo.orden_flujo <= estadoActual.orden_flujo + 20;
    } catch (error) {
      console.error('Error al validar transición:', error);
      return false;
    }
  }
}

export default EstadoDenuncia;
