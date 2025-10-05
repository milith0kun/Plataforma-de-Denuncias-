import { pool } from '../config/database.js';

class Usuario {
  // Crear nuevo usuario (ciudadano o autoridad)
  static async crear(datosUsuario) {
    const { 
      id_tipo_usuario, 
      nombres, 
      apellidos, 
      documento_identidad, 
      email, 
      telefono, 
      direccion_registro, 
      password_hash,
      // Campos específicos de autoridad
      cargo,
      area_responsabilidad,
      numero_empleado,
      fecha_ingreso,
      estado_verificacion
    } = datosUsuario;
    
    const query = `
      INSERT INTO usuario (
        id_tipo_usuario, nombres, apellidos, documento_identidad, email, telefono, direccion_registro, password_hash,
        cargo, area_responsabilidad, numero_empleado, fecha_ingreso, estado_verificacion
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [resultado] = await pool.execute(query, [
      id_tipo_usuario,
      nombres,
      apellidos,
      documento_identidad,
      email,
      telefono || null,
      direccion_registro || null,
      password_hash,
      cargo || null,
      area_responsabilidad || null,
      numero_empleado || null,
      fecha_ingreso || null,
      estado_verificacion || 'aprobado'
    ]);
    
    return resultado.insertId;
  }

  // Buscar usuario por email
  static async buscarPorEmail(email) {
    const query = `
      SELECT u.*, t.nombre as nombre_tipo 
      FROM usuario u
      INNER JOIN tipo_usuario t ON u.id_tipo_usuario = t.id_tipo_usuario
      WHERE u.email = ?
    `;
    
    const [rows] = await pool.execute(query, [email]);
    return rows[0] || null;
  }

  // Buscar usuario por ID
  static async buscarPorId(id_usuario) {
    const query = `
      SELECT u.id_usuario, u.id_tipo_usuario, u.nombres, u.apellidos, u.documento_identidad, 
             u.email, u.telefono, u.direccion_registro, u.activo, u.fecha_registro, t.nombre as nombre_tipo,
             u.cargo, u.area_responsabilidad, u.numero_empleado, u.fecha_ingreso, u.estado_verificacion
      FROM usuario u
      INNER JOIN tipo_usuario t ON u.id_tipo_usuario = t.id_tipo_usuario
      WHERE u.id_usuario = ?
    `;
    
    const [rows] = await pool.execute(query, [id_usuario]);
    return rows[0] || null;
  }

  // Buscar por documento de identidad
  static async buscarPorDocumento(documento_identidad) {
    const query = `SELECT * FROM usuario WHERE documento_identidad = ?`;
    const [rows] = await pool.execute(query, [documento_identidad]);
    return rows[0] || null;
  }

  // Verificar si el email ya existe
  static async emailExiste(email) {
    const query = `SELECT COUNT(*) as count FROM usuario WHERE email = ?`;
    const [rows] = await pool.execute(query, [email]);
    return rows[0].count > 0;
  }

  // Verificar si el documento ya existe
  static async documentoExiste(documento_identidad) {
    const query = `SELECT COUNT(*) as count FROM usuario WHERE documento_identidad = ?`;
    const [rows] = await pool.execute(query, [documento_identidad]);
    return rows[0].count > 0;
  }

  // Verificar si el número de empleado ya existe
  static async numeroEmpleadoExiste(numero_empleado) {
    const query = `SELECT COUNT(*) as count FROM usuario WHERE numero_empleado = ?`;
    const [rows] = await pool.execute(query, [numero_empleado]);
    return rows[0].count > 0;
  }

  // Actualizar perfil de usuario
  static async actualizarPerfil(id_usuario, datosActualizacion) {
    const { nombres, apellidos, telefono, direccion } = datosActualizacion;
    
    const query = `
      UPDATE usuario 
      SET nombres = ?, apellidos = ?, telefono = ?, direccion_registro = ?
      WHERE id_usuario = ?
    `;
    
    const [resultado] = await pool.execute(query, [
      nombres,
      apellidos,
      telefono || null,
      direccion || null,
      id_usuario
    ]);
    
    return resultado.affectedRows > 0;
  }

  // Cambiar contraseña
  static async cambiarPassword(id_usuario, nuevoPasswordHash) {
    const query = `
      UPDATE usuario 
      SET password_hash = ?
      WHERE id_usuario = ?
    `;
    
    const [resultado] = await pool.execute(query, [nuevoPasswordHash, id_usuario]);
    return resultado.affectedRows > 0;
  }

  // Verificar contraseña actual
  static async verificarPassword(id_usuario, passwordHash) {
    const query = `SELECT password_hash FROM usuario WHERE id_usuario = ?`;
    const [rows] = await pool.execute(query, [id_usuario]);
    
    if (rows.length === 0) {
      return false;
    }
    
    return rows[0].password_hash;
  }

  // Obtener historial de actividad del usuario (placeholder para futuras implementaciones)
  static async obtenerHistorialActividad(id_usuario, limite = 10) {
    // Por ahora retornamos un array vacío, se implementará cuando tengamos tabla de auditoría
    return [];
  }

  // Verificar si email existe para otro usuario (útil para actualizaciones)
  static async emailExisteParaOtroUsuario(email, id_usuario) {
    const query = `SELECT COUNT(*) as count FROM usuario WHERE email = ? AND id_usuario != ?`;
    const [rows] = await pool.execute(query, [email, id_usuario]);
    return rows[0].count > 0;
  }

  // Verificar si documento existe para otro usuario (útil para actualizaciones)
  static async documentoExisteParaOtroUsuario(documento_identidad, id_usuario) {
    const query = `SELECT COUNT(*) as count FROM usuario WHERE documento_identidad = ? AND id_usuario != ?`;
    const [rows] = await pool.execute(query, [documento_identidad, id_usuario]);
    return rows[0].count > 0;
  }
}

export default Usuario;
