/**
 * Rutas para gestión de Estados de Denuncias
 */

import { Router } from 'express';
import EstadoController from '../controllers/estadoController.js';

const router = Router();

/**
 * @route   GET /api/v1/estados
 * @desc    Obtener todos los estados
 * @access  Público (aunque podría requerir autenticación)
 */
router.get('/', EstadoController.obtenerEstados);

/**
 * @route   GET /api/v1/estados/:id
 * @desc    Obtener un estado por ID
 * @access  Público
 */
router.get('/:id', EstadoController.obtenerEstadoPorId);

export default router;
