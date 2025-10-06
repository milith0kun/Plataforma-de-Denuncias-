import { body, param } from 'express-validator';
import Usuario from '../models/Usuario.js';

// Validaciones específicas para actualización de perfil
export const validarActualizacionPerfil = [
  body('nombres')
    .notEmpty()
    .withMessage('Los nombres son obligatorios')
    .isLength({ min: 2, max: 50 })
    .withMessage('Los nombres deben tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('Los nombres solo pueden contener letras y espacios')
    .trim(),
  
  body('apellidos')
    .notEmpty()
    .withMessage('Los apellidos son obligatorios')
    .isLength({ min: 2, max: 50 })
    .withMessage('Los apellidos deben tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('Los apellidos solo pueden contener letras y espacios')
    .trim(),
  
  body('telefono')
    .optional({ nullable: true, checkFalsy: true })
    .isMobilePhone('es-CO')
    .withMessage('El teléfono debe tener un formato válido colombiano')
    .isLength({ min: 10, max: 10 })
    .withMessage('El teléfono debe tener exactamente 10 dígitos'),
  
  body('direccion')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 200 })
    .withMessage('La dirección no puede exceder 200 caracteres')
    .trim(),

  // Validación personalizada para verificar que el email no esté en uso por otro usuario
  body('email')
    .optional()
    .isEmail()
    .withMessage('El email debe tener un formato válido')
    .normalizeEmail()
    .custom(async (email, { req }) => {
      if (email) {
        const emailExiste = await Usuario.emailExisteParaOtroUsuario(email, req.user.id);
        if (emailExiste) {
          throw new Error('Este email ya está en uso por otro usuario');
        }
      }
      return true;
    }),

  // Validación personalizada para verificar que el documento no esté en uso por otro usuario
  body('numero_documento')
    .optional()
    .isLength({ min: 6, max: 15 })
    .withMessage('El número de documento debe tener entre 6 y 15 caracteres')
    .isAlphanumeric()
    .withMessage('El número de documento solo puede contener letras y números')
    .custom(async (documento, { req }) => {
      if (documento) {
        const documentoExiste = await Usuario.documentoExisteParaOtroUsuario(documento, req.user.id);
        if (documentoExiste) {
          throw new Error('Este número de documento ya está en uso por otro usuario');
        }
      }
      return true;
    })
];

// Validaciones para cambio de contraseña
export const validarCambioPassword = [
  body('password_actual')
    .notEmpty()
    .withMessage('La contraseña actual es obligatoria'),
  
  body('password_nuevo')
    .isLength({ min: 8, max: 128 })
    .withMessage('La nueva contraseña debe tener entre 8 y 128 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('La nueva contraseña debe contener al menos: una letra minúscula, una mayúscula, un número y un carácter especial (@$!%*?&)'),
  
  body('confirmar_password')
    .notEmpty()
    .withMessage('La confirmación de contraseña es obligatoria')
    .custom((value, { req }) => {
      if (value !== req.body.password_nuevo) {
        throw new Error('La confirmación de contraseña no coincide con la nueva contraseña');
      }
      return true;
    }),

  // Validación personalizada para verificar que la nueva contraseña sea diferente a la actual
  body('password_nuevo')
    .custom((value, { req }) => {
      if (value === req.body.password_actual) {
        throw new Error('La nueva contraseña debe ser diferente a la contraseña actual');
      }
      return true;
    })
];

// Validaciones para parámetros de consulta del historial
export const validarHistorialActividad = [
  param('limite')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100')
    .toInt(),
  
  param('pagina')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número mayor a 0')
    .toInt()
];

// Middleware para sanitizar datos de entrada
export const sanitizarDatosPerfil = (req, res, next) => {
  if (req.body.nombres) {
    req.body.nombres = req.body.nombres.trim().replace(/\s+/g, ' ');
  }
  if (req.body.apellidos) {
    req.body.apellidos = req.body.apellidos.trim().replace(/\s+/g, ' ');
  }
  if (req.body.direccion) {
    req.body.direccion = req.body.direccion.trim().replace(/\s+/g, ' ');
  }
  if (req.body.telefono) {
    req.body.telefono = req.body.telefono.replace(/\D/g, ''); // Solo números
  }
  
  next();
};