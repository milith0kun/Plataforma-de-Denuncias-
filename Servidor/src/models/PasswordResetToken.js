import { pool } from '../config/database.js';
import crypto from 'crypto';

class PasswordResetToken {
  // Generar token único
  static generarToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Crear token de recuperación
  static async crear(id_usuario, ip_solicitud = null) {
    const token = this.generarToken();
    const fecha_expiracion = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    const query = `
      INSERT INTO password_reset_token (id_usuario, token, fecha_expiracion, ip_solicitud)
      VALUES (?, ?, ?, ?)
    `;

    await pool.execute(query, [
      id_usuario,
      token,
      fecha_expiracion,
      ip_solicitud
    ]);

    return token;
  }

  // Buscar token válido
  static async buscarTokenValido(token) {
    const query = `
      SELECT prt.*, u.email, u.nombres, u.apellidos
      FROM password_reset_token prt
      INNER JOIN usuario u ON prt.id_usuario = u.id_usuario
      WHERE prt.token = ?
        AND prt.usado = FALSE
        AND prt.fecha_expiracion > NOW()
    `;

    const [rows] = await pool.execute(query, [token]);
    return rows[0] || null;
  }

  // Marcar token como usado
  static async marcarComoUsado(token) {
    const query = `
      UPDATE password_reset_token
      SET usado = TRUE
      WHERE token = ?
    `;

    const [resultado] = await pool.execute(query, [token]);
    return resultado.affectedRows > 0;
  }

  // Invalidar todos los tokens de un usuario
  static async invalidarTokensUsuario(id_usuario) {
    const query = `
      UPDATE password_reset_token
      SET usado = TRUE
      WHERE id_usuario = ? AND usado = FALSE
    `;

    await pool.execute(query, [id_usuario]);
  }

  // Limpiar tokens expirados (mantenimiento)
  static async limpiarTokensExpirados() {
    const query = `
      DELETE FROM password_reset_token
      WHERE fecha_expiracion < NOW() OR usado = TRUE
    `;

    const [resultado] = await pool.execute(query);
    return resultado.affectedRows;
  }

  // Verificar si existe un token reciente para el usuario (prevenir spam)
  static async existeTokenReciente(id_usuario, minutos = 5) {
    const query = `
      SELECT COUNT(*) as count
      FROM password_reset_token
      WHERE id_usuario = ?
        AND fecha_creacion > DATE_SUB(NOW(), INTERVAL ? MINUTE)
        AND usado = FALSE
    `;

    const [rows] = await pool.execute(query, [id_usuario, minutos]);
    return rows[0].count > 0;
  }
}

export default PasswordResetToken;
