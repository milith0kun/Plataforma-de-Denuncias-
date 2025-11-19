/**
 * Controlador para gestión de Denuncias
 */

import Denuncia from '../models/Denuncia.js';
import Categoria from '../models/Categoria.js';
import EstadoDenuncia from '../models/EstadoDenuncia.js';
import EvidenciaFoto from '../models/EvidenciaFoto.js';
import { MENSAJES_ERROR, MENSAJES_EXITO } from '../utils/constants.js';

class DenunciaController {
  /**
   * Crear una nueva denuncia
   * POST /api/v1/denuncias
   */
  static async crearDenuncia(req, res) {
    try {
      const { id_usuario, id_tipo_usuario } = req.usuario;

      // Solo ciudadanos pueden crear denuncias
      if (id_tipo_usuario !== 1) { // 1 = Ciudadano
        return res.status(403).json({
          success: false,
          message: 'Solo los ciudadanos pueden registrar denuncias'
        });
      }

      const {
        id_categoria,
        titulo,
        descripcion_detallada,
        latitud,
        longitud,
        direccion_geolocalizada,
        es_anonima
      } = req.body;

      // Validar que la categoría existe
      const categoria = await Categoria.obtenerPorId(id_categoria);
      if (!categoria) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
      }

      // Crear la denuncia
      const id_denuncia = await Denuncia.crear({
        id_ciudadano: id_usuario,
        id_categoria,
        titulo,
        descripcion_detallada,
        latitud,
        longitud,
        direccion_geolocalizada,
        es_anonima: es_anonima || false
      });

      // Si hay archivos de evidencia (se manejarán después con Multer)
      if (req.evidencias && req.evidencias.length > 0) {
        await EvidenciaFoto.crearMultiples(id_denuncia, req.evidencias);
      }

      // Obtener la denuncia creada
      const denunciaCreada = await Denuncia.obtenerPorId(id_denuncia);

      res.status(201).json({
        success: true,
        message: MENSAJES_EXITO.DENUNCIA_CREADA || 'Denuncia registrada exitosamente',
        data: {
          denuncia: denunciaCreada
        }
      });
    } catch (error) {
      console.error('Error en crearDenuncia:', error);
      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al crear la denuncia'
      });
    }
  }

  /**
   * Obtener denuncias con filtros
   * GET /api/v1/denuncias
   */
  static async obtenerDenuncias(req, res) {
    try {
      const { id_usuario, id_tipo_usuario } = req.usuario;

      const {
        id_categoria,
        id_estado,
        busqueda,
        fecha_inicio,
        fecha_fin,
        pagina,
        limite,
        orden,
        direccion
      } = req.query;

      const filtros = {
        id_categoria,
        id_estado,
        busqueda,
        fecha_inicio,
        fecha_fin
      };

      // Si es ciudadano, solo puede ver sus propias denuncias
      if (id_tipo_usuario === 1) {
        filtros.id_ciudadano = id_usuario;
      }

      const paginacion = {
        pagina: parseInt(pagina) || 1,
        limite: parseInt(limite) || 10,
        orden: orden || 'fecha_registro',
        direccion: direccion || 'DESC'
      };

      const resultado = await Denuncia.obtenerConFiltros(filtros, paginacion);

      res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error en obtenerDenuncias:', error);
      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al obtener denuncias'
      });
    }
  }

  /**
   * Obtener una denuncia específica
   * GET /api/v1/denuncias/:id
   */
  static async obtenerDenunciaPorId(req, res) {
    try {
      const { id_usuario, id_tipo_usuario } = req.usuario;
      const { id } = req.params;

      const denuncia = await Denuncia.obtenerPorId(id);

      if (!denuncia) {
        return res.status(404).json({
          success: false,
          message: 'Denuncia no encontrada'
        });
      }

      // Verificar permisos: ciudadano solo puede ver sus propias denuncias
      if (id_tipo_usuario === 1 && denuncia.id_ciudadano !== id_usuario) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para ver esta denuncia'
        });
      }

      // Obtener evidencias
      const evidencias = await EvidenciaFoto.obtenerPorDenuncia(id);

      // Obtener historial de estados
      const historial = await Denuncia.obtenerHistorialEstados(id);

      res.status(200).json({
        success: true,
        data: {
          denuncia,
          evidencias,
          historial
        }
      });
    } catch (error) {
      console.error('Error en obtenerDenunciaPorId:', error);
      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al obtener la denuncia'
      });
    }
  }

  /**
   * Actualizar una denuncia
   * PUT /api/v1/denuncias/:id
   */
  static async actualizarDenuncia(req, res) {
    try {
      const { id_usuario, id_tipo_usuario } = req.usuario;
      const { id } = req.params;

      const denuncia = await Denuncia.obtenerPorId(id);

      if (!denuncia) {
        return res.status(404).json({
          success: false,
          message: 'Denuncia no encontrada'
        });
      }

      // Solo el ciudadano que creó la denuncia puede actualizarla
      // y solo si está en estado "Registrada" o "Pendiente"
      if (id_tipo_usuario === 1 && denuncia.id_ciudadano !== id_usuario) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para actualizar esta denuncia'
        });
      }

      const estadosEditables = [1, 2]; // Registrada, Pendiente
      if (!estadosEditables.includes(denuncia.id_estado_actual)) {
        return res.status(400).json({
          success: false,
          message: 'Esta denuncia ya no puede ser editada'
        });
      }

      const {
        titulo,
        descripcion_detallada,
        latitud,
        longitud,
        direccion_geolocalizada
      } = req.body;

      const datosActualizacion = {};
      if (titulo !== undefined) datosActualizacion.titulo = titulo;
      if (descripcion_detallada !== undefined) datosActualizacion.descripcion_detallada = descripcion_detallada;
      if (latitud !== undefined) datosActualizacion.latitud = latitud;
      if (longitud !== undefined) datosActualizacion.longitud = longitud;
      if (direccion_geolocalizada !== undefined) datosActualizacion.direccion_geolocalizada = direccion_geolocalizada;

      const actualizado = await Denuncia.actualizar(id, datosActualizacion);

      if (!actualizado) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo actualizar la denuncia'
        });
      }

      const denunciaActualizada = await Denuncia.obtenerPorId(id);

      res.status(200).json({
        success: true,
        message: 'Denuncia actualizada exitosamente',
        data: {
          denuncia: denunciaActualizada
        }
      });
    } catch (error) {
      console.error('Error en actualizarDenuncia:', error);
      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al actualizar la denuncia'
      });
    }
  }

  /**
   * Cambiar el estado de una denuncia
   * PUT /api/v1/denuncias/:id/estado
   */
  static async cambiarEstado(req, res) {
    try {
      const { id_usuario, id_tipo_usuario } = req.usuario;
      const { id } = req.params;
      const { id_estado_nuevo, comentario } = req.body;

      // Solo autoridades y admins pueden cambiar estados
      if (id_tipo_usuario === 1) { // 1 = Ciudadano
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para cambiar el estado de denuncias'
        });
      }

      const denuncia = await Denuncia.obtenerPorId(id);

      if (!denuncia) {
        return res.status(404).json({
          success: false,
          message: 'Denuncia no encontrada'
        });
      }

      // Validar que el nuevo estado existe
      const nuevoEstado = await EstadoDenuncia.obtenerPorId(id_estado_nuevo);
      if (!nuevoEstado) {
        return res.status(404).json({
          success: false,
          message: 'Estado no válido'
        });
      }

      // Validar transición de estado
      const transicionValida = await EstadoDenuncia.esTransicionValida(
        denuncia.id_estado_actual,
        id_estado_nuevo
      );

      if (!transicionValida) {
        return res.status(400).json({
          success: false,
          message: 'Transición de estado no permitida'
        });
      }

      await Denuncia.cambiarEstado(
        id,
        id_estado_nuevo,
        id_usuario,
        comentario || 'Estado actualizado'
      );

      const denunciaActualizada = await Denuncia.obtenerPorId(id);

      res.status(200).json({
        success: true,
        message: 'Estado actualizado exitosamente',
        data: {
          denuncia: denunciaActualizada
        }
      });
    } catch (error) {
      console.error('Error en cambiarEstado:', error);
      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al cambiar el estado'
      });
    }
  }

  /**
   * Eliminar una denuncia
   * DELETE /api/v1/denuncias/:id
   */
  static async eliminarDenuncia(req, res) {
    try {
      const { id_usuario, id_tipo_usuario } = req.usuario;
      const { id } = req.params;

      const denuncia = await Denuncia.obtenerPorId(id);

      if (!denuncia) {
        return res.status(404).json({
          success: false,
          message: 'Denuncia no encontrada'
        });
      }

      // Solo el ciudadano que creó la denuncia puede eliminarla
      // y solo si está en estado "Registrada"
      if (id_tipo_usuario === 1 && denuncia.id_ciudadano !== id_usuario) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para eliminar esta denuncia'
        });
      }

      if (denuncia.id_estado_actual !== 1) { // 1 = Registrada
        return res.status(400).json({
          success: false,
          message: 'Solo se pueden eliminar denuncias en estado Registrada'
        });
      }

      const eliminado = await Denuncia.eliminar(id);

      if (!eliminado) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo eliminar la denuncia'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Denuncia eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error en eliminarDenuncia:', error);
      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al eliminar la denuncia'
      });
    }
  }
}

export default DenunciaController;
