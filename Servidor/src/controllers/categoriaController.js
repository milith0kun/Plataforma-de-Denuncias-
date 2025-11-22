/**
 * Controlador para gestión de Categorías
 */

import Categoria from '../models/Categoria.js';
import { MENSAJES_ERROR } from '../utils/constants.js';

class CategoriaController {
  /**
   * Obtener todas las categorías
   * GET /api/v1/categorias
   */
  static async obtenerCategorias(req, res) {
    try {
      const categorias = await Categoria.obtenerTodas();

      res.status(200).json({
        success: true,
        data: {
          categorias
        }
      });
    } catch (error) {
      console.error('Error en obtenerCategorias:', error);
      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al obtener categorías'
      });
    }
  }

  /**
   * Obtener una categoría por ID
   * GET /api/v1/categorias/:id
   */
  static async obtenerCategoriaPorId(req, res) {
    try {
      const { id } = req.params;

      const categoria = await Categoria.obtenerPorId(id);

      if (!categoria) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          categoria
        }
      });
    } catch (error) {
      console.error('Error en obtenerCategoriaPorId:', error);
      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al obtener la categoría'
      });
    }
  }

  /**
   * Crear una nueva categoría (solo administradores)
   * POST /api/v1/categorias
   */
  static async crearCategoria(req, res) {
    try {
      const { nombre, descripcion, area_responsable_sugerida } = req.body;

      const id_categoria = await Categoria.crear({
        nombre,
        descripcion,
        area_responsable_sugerida
      });

      const categoriaCreada = await Categoria.obtenerPorId(id_categoria);

      res.status(201).json({
        success: true,
        message: 'Categoría creada exitosamente',
        data: {
          categoria: categoriaCreada
        }
      });
    } catch (error) {
      console.error('Error en crearCategoria:', error);

      // Si es error de duplicado
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Ya existe una categoría con ese nombre'
        });
      }

      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al crear la categoría'
      });
    }
  }

  /**
   * Actualizar una categoría (solo administradores)
   * PUT /api/v1/categorias/:id
   */
  static async actualizarCategoria(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, area_responsable_sugerida } = req.body;

      const categoriaExiste = await Categoria.obtenerPorId(id);

      if (!categoriaExiste) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
      }

      const actualizado = await Categoria.actualizar(id, {
        nombre,
        descripcion,
        area_responsable_sugerida
      });

      if (!actualizado) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo actualizar la categoría'
        });
      }

      const categoriaActualizada = await Categoria.obtenerPorId(id);

      res.status(200).json({
        success: true,
        message: 'Categoría actualizada exitosamente',
        data: {
          categoria: categoriaActualizada
        }
      });
    } catch (error) {
      console.error('Error en actualizarCategoria:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Ya existe una categoría con ese nombre'
        });
      }

      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al actualizar la categoría'
        });
    }
  }
}

export default CategoriaController;
