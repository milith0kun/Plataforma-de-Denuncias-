import express from 'express';
import authRoutes from './authRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';

const router = express.Router();

// Rutas de autenticación
router.use('/auth', authRoutes);

// Rutas de usuarios
router.use('/usuarios', usuarioRoutes);

// Ruta de bienvenida
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Plataforma de Denuncias Ciudadanas',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      usuarios: '/api/v1/usuarios'
    }
  });
});

export default router;
