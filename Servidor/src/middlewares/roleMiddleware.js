import { TIPOS_USUARIO, ROLES, MENSAJES_ERROR } from '../utils/constants.js';

// Middleware para verificar que el usuario tenga uno de los roles permitidos
export const requireRole = (rolesPermitidos) => {
  return (req, res, next) => {
    try {
      // El usuario debe estar en req.usuario gracias al authMiddleware
      if (!req.usuario) {
        return res.status(401).json({
          success: false,
          message: MENSAJES_ERROR.TOKEN_NO_PROPORCIONADO
        });
      }

      const { id_tipo_usuario, nombre_tipo } = req.usuario;

      // Verificar si el tipo de usuario está en los roles permitidos
      const tienePermiso = rolesPermitidos.some(rol => {
        // Permitir verificación por ID o por nombre
        return id_tipo_usuario === rol || nombre_tipo === rol;
      });

      if (!tienePermiso) {
        return res.status(403).json({
          success: false,
          message: MENSAJES_ERROR.ACCESO_DENEGADO
        });
      }

      next();
    } catch (error) {
      console.error('Error en verificación de roles:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar permisos'
      });
    }
  };
};

// Middleware específico para solo ciudadanos
export const requireCiudadano = requireRole([TIPOS_USUARIO.CIUDADANO, ROLES.CIUDADANO]);

// Middleware específico para solo autoridades
export const requireAutoridad = requireRole([TIPOS_USUARIO.AUTORIDAD_MUNICIPAL, ROLES.AUTORIDAD]);

// Middleware específico para solo administradores
export const requireAdmin = requireRole([TIPOS_USUARIO.ADMINISTRADOR, ROLES.ADMIN]);

// Middleware para autoridades y administradores
export const requireAutoridadOAdmin = requireRole([
  TIPOS_USUARIO.AUTORIDAD_MUNICIPAL,
  TIPOS_USUARIO.ADMINISTRADOR,
  ROLES.AUTORIDAD,
  ROLES.ADMIN
]);

// Middleware para verificar que el usuario esté activo
export const requireUsuarioActivo = (req, res, next) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: MENSAJES_ERROR.TOKEN_NO_PROPORCIONADO
      });
    }

    // Si el token tiene información de activo, verificarlo
    if (req.usuario.activo === false) {
      return res.status(403).json({
        success: false,
        message: MENSAJES_ERROR.USUARIO_DESACTIVADO
      });
    }

    next();
  } catch (error) {
    console.error('Error en verificación de usuario activo:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar estado del usuario'
    });
  }
};

// Middleware para verificar que la autoridad esté aprobada
export const requireAutoridadAprobada = (req, res, next) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: MENSAJES_ERROR.TOKEN_NO_PROPORCIONADO
      });
    }

    // Solo verificar si es autoridad
    if (req.usuario.id_tipo_usuario === TIPOS_USUARIO.AUTORIDAD_MUNICIPAL) {
      if (req.usuario.estado_verificacion !== 'aprobado') {
        return res.status(403).json({
          success: false,
          message: 'Su cuenta de autoridad está pendiente de aprobación'
        });
      }
    }

    next();
  } catch (error) {
    console.error('Error en verificación de autoridad aprobada:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar estado de autoridad'
    });
  }
};
