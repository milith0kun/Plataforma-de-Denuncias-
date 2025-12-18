import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';
import { 
  validarActualizacionPerfil, 
  validarCambioPassword, 
  validarHistorialActividad,
  sanitizarDatosPerfil 
} from '../middlewares/perfilValidations.js';

const router = express.Router();

// Rutas del módulo de usuarios

// GET /api/v1/usuarios/profile - Obtener perfil del usuario autenticado
router.get('/profile', verificarToken, UsuarioController.obtenerPerfil);

// PUT /api/v1/usuarios/profile - Actualizar perfil del usuario
router.put('/profile', 
  verificarToken,
  sanitizarDatosPerfil,
  validarActualizacionPerfil,
  validationMiddleware,
  UsuarioController.actualizarPerfil
);

// PUT /api/v1/usuarios/cambiar-password - Cambiar contraseña
router.put('/cambiar-password',
  verificarToken,
  validarCambioPassword,
  validationMiddleware,
  UsuarioController.cambiarPassword
);

// GET /api/v1/usuarios/historial-actividad - Obtener historial de actividad
router.get('/historial-actividad',
  verificarToken,
  validarHistorialActividad,
  validationMiddleware,
  UsuarioController.obtenerHistorialActividad
);

export default router;