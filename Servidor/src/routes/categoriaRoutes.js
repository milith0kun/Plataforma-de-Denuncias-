/**
 * Rutas para gestión de Categorías
 */

import { Router } from 'express';
import CategoriaController from '../controllers/categoriaController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/roleMiddleware.js';

const router = Router();

/**
 * @route   GET /api/v1/categorias
 * @desc    Obtener todas las categorías
 * @access  Público (aunque podría requerir autenticación)
 */
router.get('/', CategoriaController.obtenerCategorias);

/**
 * @route   GET /api/v1/categorias/:id
 * @desc    Obtener una categoría por ID
 * @access  Público
 */
router.get('/:id', CategoriaController.obtenerCategoriaPorId);

/**
 * @route   POST /api/v1/categorias
 * @desc    Crear una nueva categoría
 * @access  Privado (Solo administradores)
 */
router.post('/', verificarToken, requireAdmin, CategoriaController.crearCategoria);

/**
 * @route   PUT /api/v1/categorias/:id
 * @desc    Actualizar una categoría
 * @access  Privado (Solo administradores)
 */
router.put('/:id', verificarToken, requireAdmin, CategoriaController.actualizarCategoria);

export default router;
