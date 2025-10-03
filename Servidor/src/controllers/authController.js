import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import { jwtConfig } from '../config/jwt.js';

class AuthController {
  // Registro de ciudadano
  static async registroCiudadano(req, res) {
    try {
      const { nombres, apellidos, documento_identidad, email, telefono, direccion, password } = req.body;

      // Verificar si el email ya existe
      const emailExiste = await Usuario.emailExiste(email);
      if (emailExiste) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }

      // Verificar si el documento ya existe
      const documentoExiste = await Usuario.documentoExiste(documento_identidad);
      if (documentoExiste) {
        return res.status(400).json({
          success: false,
          message: 'El documento de identidad ya está registrado'
        });
      }

      // Hashear contraseña
      const password_hash = await bcrypt.hash(password, 10);

      // Crear usuario (id_tipo = 1 para Ciudadano)
      const id_usuario = await Usuario.crear({
        id_tipo: 1,
        nombres,
        apellidos,
        documento_identidad,
        email,
        telefono,
        direccion,
        password_hash
      });

      // Obtener usuario creado
      const usuarioCreado = await Usuario.buscarPorId(id_usuario);

      // Generar token
      const token = jwt.sign(
        {
          id_usuario: usuarioCreado.id_usuario,
          email: usuarioCreado.email,
          id_tipo: usuarioCreado.id_tipo,
          nombre_tipo: usuarioCreado.nombre_tipo
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          token,
          usuario: {
            id_usuario: usuarioCreado.id_usuario,
            nombres: usuarioCreado.nombres,
            apellidos: usuarioCreado.apellidos,
            email: usuarioCreado.email,
            telefono: usuarioCreado.telefono,
            direccion: usuarioCreado.direccion,
            tipo_usuario: usuarioCreado.nombre_tipo
          }
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar usuario',
        error: error.message
      });
    }
  }

  // Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuario por email
      const usuario = await Usuario.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }

      // Verificar si el usuario está activo
      if (!usuario.activo) {
        return res.status(403).json({
          success: false,
          message: 'Usuario desactivado. Contacte al administrador'
        });
      }

      // Verificar contraseña
      const passwordValido = await bcrypt.compare(password, usuario.password_hash);

      if (!passwordValido) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }

      // Generar token
      const token = jwt.sign(
        {
          id_usuario: usuario.id_usuario,
          email: usuario.email,
          id_tipo: usuario.id_tipo,
          nombre_tipo: usuario.nombre_tipo
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          token,
          usuario: {
            id_usuario: usuario.id_usuario,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            email: usuario.email,
            telefono: usuario.telefono,
            direccion: usuario.direccion,
            tipo_usuario: usuario.nombre_tipo
          }
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error al iniciar sesión',
        error: error.message
      });
    }
  }

  // Verificar token
  static async verificarToken(req, res) {
    try {
      // El usuario ya está en req.usuario gracias al middleware
      const usuario = await Usuario.buscarPorId(req.usuario.id_usuario);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Token válido',
        data: {
          usuario: {
            id_usuario: usuario.id_usuario,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            email: usuario.email,
            telefono: usuario.telefono,
            direccion: usuario.direccion,
            tipo_usuario: usuario.nombre_tipo
          }
        }
      });
    } catch (error) {
      console.error('Error al verificar token:', error);
      res.status(500).json({
        success: false,
        message: 'Error al verificar token',
        error: error.message
      });
    }
  }
}

export default AuthController;
