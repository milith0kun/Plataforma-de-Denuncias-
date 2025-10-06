import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';

class UsuarioController {
  // Obtener perfil del usuario autenticado
  static async obtenerPerfil(req, res) {
    try {
      const { id_usuario } = req.usuario; // Viene del middleware de autenticación

      const usuario = await Usuario.buscarPorId(id_usuario);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Remover información sensible
      const { password_hash, ...perfilUsuario } = usuario;

      res.json({
        success: true,
        data: perfilUsuario,
        message: 'Perfil obtenido exitosamente'
      });

    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar perfil del usuario
  static async actualizarPerfil(req, res) {
    try {
      const { id_usuario } = req.usuario;
      const { nombres, apellidos, telefono, direccion } = req.body;

      // Validar que el usuario existe
      const usuarioExiste = await Usuario.buscarPorId(id_usuario);
      if (!usuarioExiste) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Actualizar perfil
      const actualizado = await Usuario.actualizarPerfil(id_usuario, {
        nombres,
        apellidos,
        telefono,
        direccion
      });

      if (!actualizado) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo actualizar el perfil'
        });
      }

      // Obtener usuario actualizado
      const usuarioActualizado = await Usuario.buscarPorId(id_usuario);
      const { password_hash, ...perfilActualizado } = usuarioActualizado;

      res.json({
        success: true,
        data: perfilActualizado,
        message: 'Perfil actualizado exitosamente'
      });

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Cambiar contraseña
  static async cambiarPassword(req, res) {
    try {
      const { id_usuario } = req.usuario;
      const { password_actual, password_nuevo } = req.body;

      // Obtener contraseña actual del usuario
      const passwordHashActual = await Usuario.verificarPassword(id_usuario);
      
      if (!passwordHashActual) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Verificar contraseña actual
      const passwordValida = await bcrypt.compare(password_actual, passwordHashActual);
      
      if (!passwordValida) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña actual es incorrecta'
        });
      }

      // Hashear nueva contraseña
      const nuevoPasswordHash = await bcrypt.hash(password_nuevo, 10);

      // Actualizar contraseña
      const actualizado = await Usuario.cambiarPassword(id_usuario, nuevoPasswordHash);

      if (!actualizado) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo cambiar la contraseña'
        });
      }

      res.json({
        success: true,
        message: 'Contraseña cambiada exitosamente'
      });

    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener historial de actividad del usuario
  static async obtenerHistorialActividad(req, res) {
    try {
      const { id_usuario } = req.usuario;
      const limite = parseInt(req.query.limite) || 10;

      const historial = await Usuario.obtenerHistorialActividad(id_usuario, limite);

      res.json({
        success: true,
        data: historial,
        message: 'Historial obtenido exitosamente'
      });

    } catch (error) {
      console.error('Error al obtener historial:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

export default UsuarioController;