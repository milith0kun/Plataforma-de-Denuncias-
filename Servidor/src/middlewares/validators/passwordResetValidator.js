import { body, param, validationResult } from 'express-validator';

// Validaciones para solicitud de recuperación
export const validarSolicitudRecuperacion = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  
  // Middleware para manejar errores de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

// Validaciones para restablecer contraseña
export const validarRestablecerPassword = [
  body('token')
    .trim()
    .notEmpty().withMessage('El token es obligatorio')
    .isLength({ min: 64, max: 64 }).withMessage('Token inválido'),
  
  body('nueva_password')
    .notEmpty().withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 8, max: 50 }).withMessage('La contraseña debe tener entre 8 y 50 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  body('confirmar_password')
    .notEmpty().withMessage('La confirmación de contraseña es obligatoria')
    .custom((value, { req }) => value === req.body.nueva_password).withMessage('Las contraseñas no coinciden'),
  
  // Middleware para manejar errores de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

// Validación para verificar token
export const validarToken = [
  param('token')
    .trim()
    .notEmpty().withMessage('El token es obligatorio')
    .isLength({ min: 64, max: 64 }).withMessage('Token inválido'),
  
  // Middleware para manejar errores de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];
