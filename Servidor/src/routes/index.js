import express from 'express';
import authRoutes from './authRoutes.js';

const router = express.Router();

// Rutas de autenticación
router.use('/auth', authRoutes);

// Ruta de bienvenida
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Plataforma de Denuncias Ciudadanas',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth'
    }
  });
});

export default router;
