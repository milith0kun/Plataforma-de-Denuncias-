/**
 * Rutas para gestión de Denuncias
 */

import { Router } from 'express';
import DenunciaController from '../controllers/denunciaController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { requireUsuarioActivo } from '../middlewares/roleMiddleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(verificarToken, requireUsuarioActivo);

/**
 * @route   POST /api/v1/denuncias
 * @desc    Crear una nueva denuncia
 * @access  Privado (Ciudadanos)
 */
router.post('/', DenunciaController.crearDenuncia);

/**
 * @route   GET /api/v1/denuncias
 * @desc    Obtener denuncias con filtros
 * @access  Privado (Todos los usuarios autenticados)
 */
router.get('/', DenunciaController.obtenerDenuncias);

/**
 * @route   GET /api/v1/denuncias/:id
 * @desc    Obtener una denuncia específica
 * @access  Privado
 */
router.get('/:id', DenunciaController.obtenerDenunciaPorId);

/**
 * @route   PUT /api/v1/denuncias/:id
 * @desc    Actualizar una denuncia
 * @access  Privado (Ciudadano propietario)
 */
router.put('/:id', DenunciaController.actualizarDenuncia);

/**
 * @route   PUT /api/v1/denuncias/:id/estado
 * @desc    Cambiar el estado de una denuncia
 * @access  Privado (Autoridades y Administradores)
 */
router.put('/:id/estado', DenunciaController.cambiarEstado);

/**
 * @route   DELETE /api/v1/denuncias/:id
 * @desc    Eliminar una denuncia
 * @access  Privado (Ciudadano propietario, solo en estado Registrada)
 */
router.delete('/:id', DenunciaController.eliminarDenuncia);

export default router;
