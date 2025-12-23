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

      // Asegurar que id_categoria sea string (ObjectId válido)
      const categoriaId = typeof id_categoria === 'number' ? id_categoria.toString() : id_categoria;

      // Validar que la categoría existe
      const categoria = await Categoria.obtenerPorId(categoriaId);
      if (!categoria) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
      }

      // Crear la denuncia
      const id_denuncia = await Denuncia.crear({
        id_ciudadano: id_usuario,
        id_categoria: categoriaId,
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
          id_denuncia: id_denuncia,
          denuncia: denunciaCreada
        }
      });
    } catch (error) {
      console.error('Error en crearDenuncia:', error);
      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al crear la denuncia',
        error_detail: error.message // Temporal para depuración
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
      const ciudadanoId = denuncia.id_ciudadano_original || denuncia.id_ciudadano?._id || denuncia.id_ciudadano;
      if (id_tipo_usuario === 1 && ciudadanoId && ciudadanoId.toString() !== id_usuario.toString()) {
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
      if (id_tipo_usuario === 1 && denuncia.id_ciudadano && denuncia.id_ciudadano.toString() !== id_usuario.toString()) {
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
      if (id_tipo_usuario === 1 && denuncia.id_ciudadano && denuncia.id_ciudadano.toString() !== id_usuario.toString()) {
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

  /**
   * Subir evidencias fotográficas a una denuncia
   * POST /api/v1/denuncias/:id/evidencias
   */
  static async subirEvidencias(req, res) {
    try {
      const { id_usuario, id_tipo_usuario } = req.usuario;
      const { id } = req.params;

      // Verificar que la denuncia existe
      const denuncia = await Denuncia.obtenerPorId(id);

      if (!denuncia) {
        return res.status(404).json({
          success: false,
          message: 'Denuncia no encontrada'
        });
      }

      // Verificar permisos: solo el ciudadano que creó la denuncia puede subir evidencias
      // Usamos id_ciudadano_original ya que id_ciudadano está populado
      const idPropietario = denuncia.id_ciudadano_original || (denuncia.id_ciudadano?._id || denuncia.id_ciudadano);

      if (id_tipo_usuario === 1 && idPropietario && idPropietario.toString() !== id_usuario.toString()) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para subir evidencias a esta denuncia'
        });
      }

      // Verificar que se subieron archivos
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No se subieron archivos'
        });
      }

      console.log('Archivos subidos:', req.files.map(f => ({ path: f.path, mimetype: f.mimetype })));

      // Preparar datos de evidencias para guardar en BD
      const evidencias = req.files.map(file => {
        // Obtener la parte de la ruta después de 'uploads' de forma robusta
        const pathParts = file.path.split(/[\\/]uploads[\\/]/);
        const relativePath = pathParts.length > 1 ? pathParts[1] : file.filename;

        return {
          url_archivo: `/uploads/${relativePath.replace(/\\/g, '/')}`,
          nombre_archivo: file.originalname,
          tipo_archivo: file.mimetype,
          tamano_bytes: file.size
        };
      });

      // Guardar evidencias en la base de datos
      const evidenciasCreadas = await EvidenciaFoto.crearMultiples(id, evidencias);

      res.status(201).json({
        success: true,
        message: `${evidencias.length} evidencia(s) subida(s) exitosamente`,
        data: {
          evidencias: evidenciasCreadas
        }
      });
    } catch (error) {
      console.error('Error en subirEvidencias:', error);
      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al subir evidencias'
      });
    }
  }

  /**
   * Obtener evidencias de una denuncia
   * GET /api/v1/denuncias/:id/evidencias
   */
  static async obtenerEvidencias(req, res) {
    try {
      const { id } = req.params;

      // Verificar que la denuncia existe
      const denuncia = await Denuncia.obtenerPorId(id);

      if (!denuncia) {
        return res.status(404).json({
          success: false,
          message: 'Denuncia no encontrada'
        });
      }

      const evidencias = await EvidenciaFoto.obtenerPorDenuncia(id);

      res.status(200).json({
        success: true,
        data: {
          evidencias
        }
      });
    } catch (error) {
      console.error('Error en obtenerEvidencias:', error);
      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al obtener evidencias'
      });
    }
  }

  /**
   * Obtener historial de estados de una denuncia
   * GET /api/v1/denuncias/:id/historial
   */
  static async obtenerHistorial(req, res) {
    try {
      const { id } = req.params;

      // Verificar que la denuncia existe
      const denuncia = await Denuncia.obtenerPorId(id);
      if (!denuncia) {
        return res.status(404).json({
          success: false,
          message: 'Denuncia no encontrada'
        });
      }

      // Obtener historial desde el modelo HistorialEstado
      const HistorialEstado = (await import('../models/HistorialEstado.js')).default;
      const historial = await HistorialEstado.obtenerPorDenuncia(id);

      res.status(200).json({
        success: true,
        data: {
          historial
        }
      });
    } catch (error) {
      console.error('Error en obtenerHistorial:', error);
      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al obtener historial'
      });
    }
  }
}

export default DenunciaController;
