import dotenv from 'dotenv';
import app from './src/app.js';
import { verificarConexion } from './src/config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Iniciar servidor
const iniciarServidor = async () => {
  try {
    // Verificar conexión a la base de datos
    const conexionExitosa = await verificarConexion();
    
    if (!conexionExitosa) {
      console.error('No se pudo conectar a la base de datos. Verifica tu configuración.');
      process.exit(1);
    }

    // Iniciar servidor Express
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📡 API disponible en http://localhost:${PORT}/api/v1`);
      console.log(`🔐 Endpoints de autenticación:`);
      console.log(`   POST /api/v1/auth/register/ciudadano`);
      console.log(`   POST /api/v1/auth/login`);
      console.log(`   GET  /api/v1/auth/verify-token\n`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();
