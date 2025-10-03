import dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'clave_secreta_por_defecto',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
