// Importa dotenv para poder leer variables de entorno desde el archivo .env
import dotenv from 'dotenv';

// Carga las variables de entorno definidas en el archivo .env al objeto process.env
dotenv.config();

// Configuración centralizada para JWT (JSON Web Token)
export const jwtConfig = {
  // Clave secreta usada para firmar y verificar los tokens JWT
  // Se obtiene desde la variable de entorno JWT_SECRET
  // Si no existe, se usa una clave por defecto (solo recomendable en desarrollo)
  secret: process.env.JWT_SECRET || 'clave_secreta_por_defecto',

  // Tiempo de expiración del token JWT
  // Se obtiene desde la variable de entorno JWT_EXPIRES_IN
  // Ejemplos: '1h', '7d', '30m'
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
