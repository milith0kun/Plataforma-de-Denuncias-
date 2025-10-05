import { validationResult } from 'express-validator';

export const manejarErroresValidacion = (req, res, next) => {
  const errores = validationResult(req);
  
  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errores: errores.array().map(error => ({
        campo: error.path,
        mensaje: error.msg
      }))
    });
  }
  
  next();
};

// Alias para compatibilidad
export const validationMiddleware = manejarErroresValidacion;
