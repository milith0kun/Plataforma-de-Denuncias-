import { pool } from '../config/database.js';

class Usuario {
  // Crear nuevo usuario
  static async crear(datosUsuario) {
    const { id_tipo, nombres, apellidos, documento_identidad, email, telefono, direccion, password_hash } = datosUsuario;
    
    const query = `
      INSERT INTO usuarios (id_tipo, nombres, apellidos, documento_identidad, email, telefono, direccion, password_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [resultado] = await pool.execute(query, [
      id_tipo,
      nombres,
      apellidos,
      documento_identidad,
      email,
      telefono || null,
      direccion || null,
      password_hash
    ]);
    
    return resultado.insertId;
  }

  // Buscar usuario por email
  static async buscarPorEmail(email) {
    const query = `
      SELECT u.*, t.nombre_tipo 
      FROM usuarios u
      INNER JOIN tipos_usuario t ON u.id_tipo = t.id_tipo
      WHERE u.email = ?
    `;
    
    const [rows] = await pool.execute(query, [email]);
    return rows[0] || null;
  }

  // Buscar usuario por ID
  static async buscarPorId(id_usuario) {
    const query = `
      SELECT u.id_usuario, u.id_tipo, u.nombres, u.apellidos, u.documento_identidad, 
             u.email, u.telefono, u.direccion, u.activo, u.fecha_registro, t.nombre_tipo
      FROM usuarios u
      INNER JOIN tipos_usuario t ON u.id_tipo = t.id_tipo
      WHERE u.id_usuario = ?
    `;
    
    const [rows] = await pool.execute(query, [id_usuario]);
    return rows[0] || null;
  }

  // Buscar por documento de identidad
  static async buscarPorDocumento(documento_identidad) {
    const query = `SELECT * FROM usuarios WHERE documento_identidad = ?`;
    const [rows] = await pool.execute(query, [documento_identidad]);
    return rows[0] || null;
  }

  // Verificar si el email ya existe
  static async emailExiste(email) {
    const query = `SELECT COUNT(*) as count FROM usuarios WHERE email = ?`;
    const [rows] = await pool.execute(query, [email]);
    return rows[0].count > 0;
  }

  // Verificar si el documento ya existe
  static async documentoExiste(documento_identidad) {
    const query = `SELECT COUNT(*) as count FROM usuarios WHERE documento_identidad = ?`;
    const [rows] = await pool.execute(query, [documento_identidad]);
    return rows[0].count > 0;
  }
}

export default Usuario;
