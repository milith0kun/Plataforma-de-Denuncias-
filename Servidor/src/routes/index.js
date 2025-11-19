import express from 'express';
import authRoutes from './authRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import denunciaRoutes from './denunciaRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';
import estadoRoutes from './estadoRoutes.js';
import comentarioRoutes from './comentarioRoutes.js';
import estadisticasRoutes from './estadisticasRoutes.js';

const router = express.Router();

// Rutas de autenticación
router.use('/auth', authRoutes);

// Rutas de usuarios
router.use('/usuarios', usuarioRoutes);

// Rutas de denuncias
router.use('/denuncias', denunciaRoutes);

// Rutas de categorías
router.use('/categorias', categoriaRoutes);

// Rutas de estados
router.use('/estados', estadoRoutes);

// Rutas de comentarios (incluye /denuncias/:id/comentarios y /comentarios/:id)
router.use('/', comentarioRoutes);

// Rutas de estadísticas
router.use('/estadisticas', estadisticasRoutes);

// Ruta de bienvenida
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Plataforma de Denuncias Ciudadanas',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      usuarios: '/api/v1/usuarios',
      denuncias: '/api/v1/denuncias',
      categorias: '/api/v1/categorias',
      estados: '/api/v1/estados'
    }
  });
});

export default router;
