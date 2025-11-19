import express from 'express';
import {
  obtenerEstadisticasGenerales,
  obtenerEstadisticasPorCategoria,
  obtenerResumen
} from '../controllers/estadisticasController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

/**
 * @route   GET /api/v1/estadisticas
 * @desc    Obtener estadísticas generales (adaptadas por rol de usuario)
 * @access  Privado (todos los usuarios autenticados)
 */
router.get('/', obtenerEstadisticasGenerales);

/**
 * @route   GET /api/v1/estadisticas/resumen
 * @desc    Obtener resumen rápido para dashboard
 * @access  Privado (todos los usuarios autenticados)
 */
router.get('/resumen', obtenerResumen);

/**
 * @route   GET /api/v1/estadisticas/categoria/:idCategoria
 * @desc    Obtener estadísticas de una categoría específica
 * @access  Privado (todos los usuarios autenticados)
 */
router.get('/categoria/:idCategoria', obtenerEstadisticasPorCategoria);

export default router;
