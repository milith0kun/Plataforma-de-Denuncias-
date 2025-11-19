/**
 * Controlador para gestión de Estados de Denuncias
 */

import EstadoDenuncia from '../models/EstadoDenuncia.js';
import { MENSAJES_ERROR } from '../utils/constants.js';

class EstadoController {
  /**
   * Obtener todos los estados
   * GET /api/v1/estados
   */
  static async obtenerEstados(req, res) {
    try {
      const estados = await EstadoDenuncia.obtenerTodos();

      res.status(200).json({
        success: true,
        data: {
          estados
        }
      });
    } catch (error) {
      console.error('Error en obtenerEstados:', error);
      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al obtener estados'
      });
    }
  }

  /**
   * Obtener un estado por ID
   * GET /api/v1/estados/:id
   */
  static async obtenerEstadoPorId(req, res) {
    try {
      const { id } = req.params;

      const estado = await EstadoDenuncia.obtenerPorId(id);

      if (!estado) {
        return res.status(404).json({
          success: false,
          message: 'Estado no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          estado
        }
      });
    } catch (error) {
      console.error('Error en obtenerEstadoPorId:', error);
      res.status(500).json({
        success: false,
        message: MENSAJES_ERROR.ERROR_SERVIDOR || 'Error al obtener el estado'
      });
    }
  }
}

export default EstadoController;
