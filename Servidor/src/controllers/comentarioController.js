/**
 * Controlador de Comentarios
 * Maneja la lógica de comentarios en denuncias
 */

const Comentario = require('../models/Comentario');
const Denuncia = require('../models/Denuncia');
const { TIPOS_USUARIO } = require('../utils/constants');

/**
 * Crear un nuevo comentario en una denuncia
 */
exports.crearComentario = async (req, res) => {
  try {
    const { id } = req.params; // ID de la denuncia
    const { comentario, es_interno } = req.body;
    const idUsuario = req.usuario.id_usuario;
    const tipoUsuario = req.usuario.tipo_usuario_id;

    // Validaciones
    if (!comentario || comentario.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'El comentario no puede estar vacío'
        }
      });
    }

    if (comentario.length > 1000) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'El comentario no puede exceder 1000 caracteres'
        }
      });
    }

    // Verificar que la denuncia existe
    const denuncia = await Denuncia.obtenerPorId(id);
    if (!denuncia) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Denuncia no encontrada'
        }
      });
    }

    // Solo autoridades y admins pueden hacer comentarios internos
    const esComentarioInterno = es_interno === true;
    if (esComentarioInterno && tipoUsuario === TIPOS_USUARIO.CIUDADANO) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'No tienes permisos para crear comentarios internos'
        }
      });
    }

    // Crear el comentario
    const nuevoComentario = await Comentario.crear({
      id_denuncia: id,
      id_usuario: idUsuario,
      comentario: comentario.trim(),
      es_interno: esComentarioInterno
    });

    return res.status(201).json({
      success: true,
      message: 'Comentario creado exitosamente',
      data: {
        comentario: nuevoComentario
      }
    });
  } catch (error) {
    console.error('Error al crear comentario:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Error al crear el comentario'
      }
    });
  }
};

/**
 * Obtener comentarios de una denuncia
 */
exports.obtenerComentarios = async (req, res) => {
  try {
    const { id } = req.params; // ID de la denuncia
    const tipoUsuario = req.usuario.tipo_usuario_id;

    // Verificar que la denuncia existe
    const denuncia = await Denuncia.obtenerPorId(id);
    if (!denuncia) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Denuncia no encontrada'
        }
      });
    }

    // Autoridades y admins ven comentarios internos
    const incluirInternos = tipoUsuario !== TIPOS_USUARIO.CIUDADANO;

    // Obtener comentarios
    const comentarios = await Comentario.obtenerPorDenuncia(id, incluirInternos);

    return res.json({
      success: true,
      data: {
        comentarios,
        total: comentarios.length
      }
    });
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener los comentarios'
      }
    });
  }
};

/**
 * Actualizar un comentario
 */
exports.actualizarComentario = async (req, res) => {
  try {
    const { idComentario } = req.params;
    const { comentario } = req.body;
    const idUsuario = req.usuario.id_usuario;
    const tipoUsuario = req.usuario.tipo_usuario_id;

    // Validaciones
    if (!comentario || comentario.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'El comentario no puede estar vacío'
        }
      });
    }

    // Verificar que el comentario existe
    const comentarioExistente = await Comentario.obtenerPorId(idComentario);
    if (!comentarioExistente) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Comentario no encontrado'
        }
      });
    }

    // Solo el autor puede editar su comentario (o un admin)
    const esAutor = comentarioExistente.id_usuario === idUsuario;
    const esAdmin = tipoUsuario === TIPOS_USUARIO.ADMIN;

    if (!esAutor && !esAdmin) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'No tienes permisos para editar este comentario'
        }
      });
    }

    // Actualizar el comentario
    const comentarioActualizado = await Comentario.actualizar(idComentario, comentario.trim());

    return res.json({
      success: true,
      message: 'Comentario actualizado exitosamente',
      data: {
        comentario: comentarioActualizado
      }
    });
  } catch (error) {
    console.error('Error al actualizar comentario:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Error al actualizar el comentario'
      }
    });
  }
};

/**
 * Eliminar un comentario
 */
exports.eliminarComentario = async (req, res) => {
  try {
    const { idComentario } = req.params;
    const idUsuario = req.usuario.id_usuario;
    const tipoUsuario = req.usuario.tipo_usuario_id;

    // Verificar que el comentario existe
    const comentario = await Comentario.obtenerPorId(idComentario);
    if (!comentario) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Comentario no encontrado'
        }
      });
    }

    // Solo el autor puede eliminar su comentario (o un admin)
    const esAutor = comentario.id_usuario === idUsuario;
    const esAdmin = tipoUsuario === TIPOS_USUARIO.ADMIN;

    if (!esAutor && !esAdmin) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'No tienes permisos para eliminar este comentario'
        }
      });
    }

    // Eliminar el comentario
    await Comentario.eliminar(idComentario);

    return res.json({
      success: true,
      message: 'Comentario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Error al eliminar el comentario'
      }
    });
  }
};

/**
 * Obtener estadísticas de comentarios de una denuncia
 */
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const { id } = req.params; // ID de la denuncia

    // Verificar que la denuncia existe
    const denuncia = await Denuncia.obtenerPorId(id);
    if (!denuncia) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Denuncia no encontrada'
        }
      });
    }

    // Obtener estadísticas
    const estadisticas = await Comentario.obtenerEstadisticas(id);

    return res.json({
      success: true,
      data: {
        estadisticas
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener las estadísticas'
      }
    });
  }
};
