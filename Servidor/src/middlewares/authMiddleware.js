import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

export const verificarToken = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    // Extraer token (formato: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido'
      });
    }

    // Verificar y decodificar token
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    // Agregar datos del usuario a la petición
    req.usuario = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};
