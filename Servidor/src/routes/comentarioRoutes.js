/**
 * Rutas de Comentarios
 */

import express from 'express';
import * as comentarioController from '../controllers/comentarioController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Rutas de comentarios por denuncia
router.post('/denuncias/:id/comentarios', comentarioController.crearComentario);
router.get('/denuncias/:id/comentarios', comentarioController.obtenerComentarios);
router.get('/denuncias/:id/comentarios/estadisticas', comentarioController.obtenerEstadisticas);

// Rutas de gestión de comentarios individuales
router.put('/comentarios/:idComentario', comentarioController.actualizarComentario);
router.delete('/comentarios/:idComentario', comentarioController.eliminarComentario);

export default router;
