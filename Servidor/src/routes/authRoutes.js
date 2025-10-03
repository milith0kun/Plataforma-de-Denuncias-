import express from 'express';
import { body } from 'express-validator';
import AuthController from '../controllers/authController.js';
import { manejarErroresValidacion } from '../middlewares/validationMiddleware.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Validaciones para registro
const validacionesRegistro = [
  body('nombres').trim().notEmpty().withMessage('Los nombres son obligatorios'),
  body('apellidos').trim().notEmpty().withMessage('Los apellidos son obligatorios'),
  body('documento_identidad')
    .trim()
    .notEmpty().withMessage('El documento de identidad es obligatorio')
    .isLength({ min: 8, max: 20 }).withMessage('El documento debe tener entre 8 y 20 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('telefono').optional().trim(),
  body('direccion').optional().trim()
];

// Validaciones para login
const validacionesLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
];

// Rutas
router.post(
  '/register/ciudadano',
  validacionesRegistro,
  manejarErroresValidacion,
  AuthController.registroCiudadano
);

router.post(
  '/login',
  validacionesLogin,
  manejarErroresValidacion,
  AuthController.login
);

router.get(
  '/verify-token',
  verificarToken,
  AuthController.verificarToken
);

export default router;
