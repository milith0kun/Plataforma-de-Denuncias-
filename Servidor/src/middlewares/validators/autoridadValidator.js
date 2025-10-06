import { body, validationResult } from 'express-validator';
import { CARGOS_AUTORIDAD, AREAS_RESPONSABILIDAD } from '../../utils/constants.js';

// Validaciones para registro de autoridad
export const validarRegistroAutoridad = [
  body('nombres')
    .trim()
    .notEmpty().withMessage('Los nombres son obligatorios')
    .isLength({ min: 2, max: 100 }).withMessage('Los nombres deben tener entre 2 y 100 caracteres'),
  
  body('apellidos')
    .trim()
    .notEmpty().withMessage('Los apellidos son obligatorios')
    .isLength({ min: 2, max: 100 }).withMessage('Los apellidos deben tener entre 2 y 100 caracteres'),
  
  body('documento_identidad')
    .trim()
    .notEmpty().withMessage('El documento de identidad es obligatorio')
    .isLength({ min: 7, max: 20 }).withMessage('El documento debe tener entre 7 y 20 caracteres')
    .matches(/^[0-9A-Za-z-]+$/).withMessage('El documento solo puede contener letras, números y guiones'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  
  body('telefono')
    .optional()
    .trim()
    .isMobilePhone('any').withMessage('Debe proporcionar un número de teléfono válido'),
  
  body('direccion_registro')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('La dirección no puede exceder 255 caracteres'),
  
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8, max: 50 }).withMessage('La contraseña debe tener entre 8 y 50 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  body('confirm_password')
    .notEmpty().withMessage('La confirmación de contraseña es obligatoria')
    .custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden'),
  
  // Campos específicos de autoridad
  body('cargo')
    .trim()
    .notEmpty().withMessage('El cargo es obligatorio')
    .isIn(CARGOS_AUTORIDAD).withMessage('El cargo seleccionado no es válido'),
  
  body('area_responsabilidad')
    .trim()
    .notEmpty().withMessage('El área de responsabilidad es obligatoria')
    .isIn(AREAS_RESPONSABILIDAD).withMessage('El área seleccionada no es válida'),
  
  body('numero_empleado')
    .trim()
    .notEmpty().withMessage('El número de empleado es obligatorio')
    .isLength({ min: 3, max: 50 }).withMessage('El número de empleado debe tener entre 3 y 50 caracteres')
    .matches(/^[0-9A-Za-z-]+$/).withMessage('El número de empleado solo puede contener letras, números y guiones'),
  
  body('fecha_ingreso')
    .notEmpty().withMessage('La fecha de ingreso es obligatoria')
    .isDate().withMessage('Debe proporcionar una fecha válida')
    .custom((value) => {
      const fechaIngreso = new Date(value);
      const hoy = new Date();
      if (fechaIngreso > hoy) {
        throw new Error('La fecha de ingreso no puede ser futura');
      }
      return true;
    }),
  
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
