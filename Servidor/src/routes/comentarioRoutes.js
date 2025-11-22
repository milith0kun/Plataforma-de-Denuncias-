/**
 * Rutas de Comentarios
 */

import express from 'express';
import * as comentarioController from '../controllers/comentarioController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de comentarios por denuncia
router.post('/denuncias/:id/comentarios', comentarioController.crearComentario);
router.get('/denuncias/:id/comentarios', comentarioController.obtenerComentarios);
router.get('/denuncias/:id/comentarios/estadisticas', comentarioController.obtenerEstadisticas);

// Rutas de gestión de comentarios individuales
router.put('/comentarios/:idComentario', comentarioController.actualizarComentario);
router.delete('/comentarios/:idComentario', comentarioController.eliminarComentario);

export default router;
