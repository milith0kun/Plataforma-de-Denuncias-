/**
 * Rutas para gestión de Denuncias
 */

import { Router } from 'express';
import DenunciaController from '../controllers/denunciaController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { requireUsuarioActivo } from '../middlewares/roleMiddleware.js';
import upload, { handleMulterError } from '../config/multer.js';

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
 * @route   PUT /api/v1/denuncias/:id/asignar
 * @desc    Asignar área responsable a una denuncia
 * @access  Privado (Autoridades y Administradores)
 */
router.put('/:id/asignar', DenunciaController.asignarArea);

/**
 * @route   DELETE /api/v1/denuncias/:id
 * @desc    Eliminar una denuncia
 * @access  Privado (Ciudadano propietario, solo en estado Registrada)
 */
router.delete('/:id', DenunciaController.eliminarDenuncia);

/**
 * @route   POST /api/v1/denuncias/:id/evidencias
 * @desc    Subir evidencias fotográficas a una denuncia
 * @access  Privado (Ciudadano propietario)
 */
router.post('/:id/evidencias', upload.array('evidencias', 5), handleMulterError, DenunciaController.subirEvidencias);

/**
 * @route   GET /api/v1/denuncias/:id/evidencias
 * @desc    Obtener evidencias de una denuncia
 * @access  Privado
 */
router.get('/:id/evidencias', DenunciaController.obtenerEvidencias);

/**
 * @route   GET /api/v1/denuncias/:id/historial
 * @desc    Obtener historial de estados de una denuncia
 * @access  Privado
 */
router.get('/:id/historial', DenunciaController.obtenerHistorial);

export default router;
