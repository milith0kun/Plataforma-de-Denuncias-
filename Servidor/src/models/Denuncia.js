/**
 * Modelo para gestión de Denuncias
 */

import pool from '../config/database.js';

class Denuncia {
  /**
   * Crear una nueva denuncia
   * @param {Object} datosDenuncia - Datos de la denuncia
   * @returns {Promise<number>} ID de la denuncia creada
   */
  static async crear(datosDenuncia) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const {
        id_ciudadano,
        id_categoria,
        titulo,
        descripcion_detallada,
        latitud,
        longitud,
        direccion_geolocalizada,
        es_anonima = false
      } = datosDenuncia;

      // El estado inicial siempre es "Registrada" (id_estado = 1)
      const id_estado_inicial = 1;

      const [resultado] = await connection.query(
        `INSERT INTO denuncia (
          id_ciudadano,
          id_categoria,
          id_estado_actual,
          titulo,
          descripcion_detallada,
          latitud,
          longitud,
          direccion_geolocalizada,
          es_anonima,
          fecha_registro,
          ultima_actualizacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          id_ciudadano,
          id_categoria,
          id_estado_inicial,
          titulo,
          descripcion_detallada,
          latitud || null,
          longitud || null,
          direccion_geolocalizada || null,
          es_anonima
        ]
      );

      const id_denuncia = resultado.insertId;

      // Registrar el estado inicial en el historial
      await connection.query(
        `INSERT INTO historial_estado (
          id_denuncia,
          id_estado_anterior,
          id_estado_nuevo,
          id_usuario_cambio,
          comentario,
          fecha_cambio
        ) VALUES (?, NULL, ?, ?, ?, NOW())`,
        [id_denuncia, id_estado_inicial, id_ciudadano, 'Denuncia registrada']
      );

      await connection.commit();
      return id_denuncia;
    } catch (error) {
      await connection.rollback();
      console.error('Error al crear denuncia:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Obtener una denuncia por ID
   * @param {number} id_denuncia - ID de la denuncia
   * @returns {Promise<Object|null>} Datos de la denuncia o null
   */
  static async obtenerPorId(id_denuncia) {
    try {
      const [denuncias] = await pool.query(
        `SELECT
          d.id_denuncia,
          d.id_ciudadano,
          d.id_categoria,
          d.id_estado_actual,
          d.titulo,
          d.descripcion_detallada,
          d.latitud,
          d.longitud,
          d.direccion_geolocalizada,
          d.es_anonima,
          d.fecha_registro,
          d.ultima_actualizacion,
          c.nombre as categoria_nombre,
          e.nombre as estado_nombre,
          u.nombres as ciudadano_nombres,
          u.apellidos as ciudadano_apellidos,
          u.email as ciudadano_email
        FROM denuncia d
        LEFT JOIN categoria c ON d.id_categoria = c.id_categoria
        LEFT JOIN estado_denuncia e ON d.id_estado_actual = e.id_estado
        LEFT JOIN usuario u ON d.id_ciudadano = u.id_usuario
        WHERE d.id_denuncia = ?`,
        [id_denuncia]
      );

      if (denuncias.length === 0) {
        return null;
      }

      const denuncia = denuncias[0];

      // Si es anónima, ocultar datos del ciudadano
      if (denuncia.es_anonima) {
        denuncia.ciudadano_nombres = 'Anónimo';
        denuncia.ciudadano_apellidos = '';
        denuncia.ciudadano_email = null;
        denuncia.id_ciudadano = null;
      }

      return denuncia;
    } catch (error) {
      console.error('Error al obtener denuncia por ID:', error);
      throw error;
    }
  }

  /**
   * Obtener denuncias con filtros
   * @param {Object} filtros - Filtros de búsqueda
   * @param {Object} paginacion - Opciones de paginación
   * @returns {Promise<Object>} { denuncias, total }
   */
  static async obtenerConFiltros(filtros = {}, paginacion = {}) {
    try {
      const {
        id_ciudadano,
        id_categoria,
        id_estado,
        busqueda,
        fecha_inicio,
        fecha_fin
      } = filtros;

      const {
        pagina = 1,
        limite = 10,
        orden = 'fecha_registro',
        direccion = 'DESC'
      } = paginacion;

      let condiciones = [];
      let parametros = [];

      if (id_ciudadano) {
        condiciones.push('d.id_ciudadano = ?');
        parametros.push(id_ciudadano);
      }

      if (id_categoria) {
        condiciones.push('d.id_categoria = ?');
        parametros.push(id_categoria);
      }

      if (id_estado) {
        condiciones.push('d.id_estado_actual = ?');
        parametros.push(id_estado);
      }

      if (busqueda) {
        condiciones.push('(d.titulo LIKE ? OR d.descripcion_detallada LIKE ?)');
        parametros.push(`%${busqueda}%`, `%${busqueda}%`);
      }

      if (fecha_inicio) {
        condiciones.push('d.fecha_registro >= ?');
        parametros.push(fecha_inicio);
      }

      if (fecha_fin) {
        condiciones.push('d.fecha_registro <= ?');
        parametros.push(fecha_fin);
      }

      const whereClause = condiciones.length > 0
        ? 'WHERE ' + condiciones.join(' AND ')
        : '';

      // Contar total
      const [countResult] = await pool.query(
        `SELECT COUNT(*) as total
        FROM denuncia d
        ${whereClause}`,
        parametros
      );

      const total = countResult[0].total;

      // Calcular offset
      const offset = (pagina - 1) * limite;

      // Obtener denuncias
      const ordenValidos = ['fecha_registro', 'ultima_actualizacion', 'titulo'];
      const ordenFinal = ordenValidos.includes(orden) ? orden : 'fecha_registro';
      const direccionFinal = direccion.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      const [denuncias] = await pool.query(
        `SELECT
          d.id_denuncia,
          d.id_ciudadano,
          d.id_categoria,
          d.id_estado_actual,
          d.titulo,
          d.descripcion_detallada,
          d.latitud,
          d.longitud,
          d.direccion_geolocalizada,
          d.es_anonima,
          d.fecha_registro,
          d.ultima_actualizacion,
          c.nombre as categoria_nombre,
          e.nombre as estado_nombre,
          u.nombres as ciudadano_nombres,
          u.apellidos as ciudadano_apellidos
        FROM denuncia d
        LEFT JOIN categoria c ON d.id_categoria = c.id_categoria
        LEFT JOIN estado_denuncia e ON d.id_estado_actual = e.id_estado
        LEFT JOIN usuario u ON d.id_ciudadano = u.id_usuario
        ${whereClause}
        ORDER BY d.${ordenFinal} ${direccionFinal}
        LIMIT ? OFFSET ?`,
        [...parametros, limite, offset]
      );

      // Ocultar datos de denuncias anónimas
      denuncias.forEach(denuncia => {
        if (denuncia.es_anonima) {
          denuncia.ciudadano_nombres = 'Anónimo';
          denuncia.ciudadano_apellidos = '';
          denuncia.id_ciudadano = null;
        }
      });

      return {
        denuncias,
        total,
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        totalPaginas: Math.ceil(total / limite)
      };
    } catch (error) {
      console.error('Error al obtener denuncias con filtros:', error);
      throw error;
    }
  }

  /**
   * Actualizar el estado de una denuncia
   * @param {number} id_denuncia - ID de la denuncia
   * @param {number} id_estado_nuevo - ID del nuevo estado
   * @param {number} id_usuario - ID del usuario que hace el cambio
   * @param {string} comentario - Comentario sobre el cambio
   * @returns {Promise<boolean>} true si se actualizó
   */
  static async cambiarEstado(id_denuncia, id_estado_nuevo, id_usuario, comentario) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Obtener estado actual
      const [denuncias] = await connection.query(
        'SELECT id_estado_actual FROM denuncia WHERE id_denuncia = ?',
        [id_denuncia]
      );

      if (denuncias.length === 0) {
        throw new Error('Denuncia no encontrada');
      }

      const id_estado_anterior = denuncias[0].id_estado_actual;

      // Actualizar estado en denuncia
      await connection.query(
        `UPDATE denuncia
        SET id_estado_actual = ?,
            ultima_actualizacion = NOW()
        WHERE id_denuncia = ?`,
        [id_estado_nuevo, id_denuncia]
      );

      // Registrar en historial
      await connection.query(
        `INSERT INTO historial_estado (
          id_denuncia,
          id_estado_anterior,
          id_estado_nuevo,
          id_usuario_cambio,
          comentario,
          fecha_cambio
        ) VALUES (?, ?, ?, ?, ?, NOW())`,
        [id_denuncia, id_estado_anterior, id_estado_nuevo, id_usuario, comentario]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error('Error al cambiar estado:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Obtener historial de estados de una denuncia
   * @param {number} id_denuncia - ID de la denuncia
   * @returns {Promise<Array>} Historial de cambios de estado
   */
  static async obtenerHistorialEstados(id_denuncia) {
    try {
      const [historial] = await pool.query(
        `SELECT
          h.id_historial,
          h.id_estado_anterior,
          h.id_estado_nuevo,
          h.comentario,
          h.fecha_cambio,
          ea.nombre as estado_anterior_nombre,
          en.nombre as estado_nuevo_nombre,
          u.nombres as usuario_nombres,
          u.apellidos as usuario_apellidos
        FROM historial_estado h
        LEFT JOIN estado_denuncia ea ON h.id_estado_anterior = ea.id_estado
        LEFT JOIN estado_denuncia en ON h.id_estado_nuevo = en.id_estado
        LEFT JOIN usuario u ON h.id_usuario_cambio = u.id_usuario
        WHERE h.id_denuncia = ?
        ORDER BY h.fecha_cambio ASC`,
        [id_denuncia]
      );

      return historial;
    } catch (error) {
      console.error('Error al obtener historial de estados:', error);
      throw error;
    }
  }

  /**
   * Actualizar información de una denuncia
   * @param {number} id_denuncia - ID de la denuncia
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise<boolean>} true si se actualizó
   */
  static async actualizar(id_denuncia, datos) {
    try {
      const camposPermitidos = ['titulo', 'descripcion_detallada', 'latitud', 'longitud', 'direccion_geolocalizada'];
      const campos = [];
      const valores = [];

      for (const campo of camposPermitidos) {
        if (datos.hasOwnProperty(campo)) {
          campos.push(`${campo} = ?`);
          valores.push(datos[campo]);
        }
      }

      if (campos.length === 0) {
        return false;
      }

      campos.push('ultima_actualizacion = NOW()');
      valores.push(id_denuncia);

      const [resultado] = await pool.query(
        `UPDATE denuncia SET ${campos.join(', ')} WHERE id_denuncia = ?`,
        valores
      );

      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar denuncia:', error);
      throw error;
    }
  }

  /**
   * Eliminar una denuncia (soft delete o hard delete según configuración)
   * @param {number} id_denuncia - ID de la denuncia
   * @returns {Promise<boolean>} true si se eliminó
   */
  static async eliminar(id_denuncia) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Eliminar evidencias primero (CASCADE should handle this, but being explicit)
      await connection.query(
        'DELETE FROM evidencia_foto WHERE id_denuncia = ?',
        [id_denuncia]
      );

      // Eliminar historial
      await connection.query(
        'DELETE FROM historial_estado WHERE id_denuncia = ?',
        [id_denuncia]
      );

      // Eliminar denuncia
      const [resultado] = await connection.query(
        'DELETE FROM denuncia WHERE id_denuncia = ?',
        [id_denuncia]
      );

      await connection.commit();
      return resultado.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error('Error al eliminar denuncia:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default Denuncia;
