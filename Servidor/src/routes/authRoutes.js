import express from 'express';
import { body } from 'express-validator';
import AuthController from '../controllers/authController.js';
import { manejarErroresValidacion } from '../middlewares/validationMiddleware.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { validarRegistroAutoridad } from '../middlewares/validators/autoridadValidator.js';
import { 
  validarSolicitudRecuperacion, 
  validarRestablecerPassword,
  validarToken 
} from '../middlewares/validators/passwordResetValidator.js';

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

// Ruta para login con Google OAuth
router.post(
  '/google',
  body('credential').notEmpty().withMessage('Credential de Google es requerido'),
  manejarErroresValidacion,
  AuthController.loginConGoogle
);

router.get(
  '/verify-token',
  verificarToken,
  AuthController.verificarToken
);

// Ruta para registro de autoridad
router.post(
  '/register/autoridad',
  validarRegistroAutoridad,
  AuthController.registroAutoridad
);

// Rutas de recuperación de contraseña
router.post(
  '/forgot-password',
  validarSolicitudRecuperacion,
  AuthController.solicitarRecuperacion
);

router.post(
  '/reset-password',
  validarRestablecerPassword,
  AuthController.restablecerPassword
);

router.get(
  '/verify-reset-token/:token',
  validarToken,
  AuthController.verificarTokenRecuperacion
);

export default router;
