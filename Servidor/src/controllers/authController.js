import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import PasswordResetToken from '../models/PasswordResetToken.js';
import EmailService from '../services/emailService.js';
import { jwtConfig } from '../config/jwt.js';
import { TIPOS_USUARIO, MENSAJES_ERROR, MENSAJES_EXITO } from '../utils/constants.js';

class AuthController {
  // Método privado para validar unicidad de datos
  static async _validarDatosUnicos(email, documento_identidad, numero_empleado = null) {
    // Verificar email
    if (await Usuario.emailExiste(email)) {
      return { valido: false, mensaje: MENSAJES_ERROR.EMAIL_EXISTENTE };
    }

    // Verificar documento
    if (await Usuario.documentoExiste(documento_identidad)) {
      return { valido: false, mensaje: MENSAJES_ERROR.DOCUMENTO_EXISTENTE };
    }

    // Verificar número de empleado (solo para autoridades)
    if (numero_empleado && await Usuario.numeroEmpleadoExiste(numero_empleado)) {
      return { valido: false, mensaje: MENSAJES_ERROR.NUMERO_EMPLEADO_EXISTENTE };
    }

    return { valido: true };
  }

  // Método privado para generar token JWT
  static _generarToken(usuario) {
    return jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        id_tipo_usuario: usuario.id_tipo_usuario,
        nombre_tipo: usuario.nombre_tipo,
        estado_verificacion: usuario.estado_verificacion || null
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
  }

  // Método privado para formatear respuesta de usuario
  static _formatearUsuario(usuario, incluirCamposAutoridad = false) {
    const usuarioBase = {
      id_usuario: usuario.id_usuario,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      telefono: usuario.telefono,
      direccion: usuario.direccion_registro,
      tipo_usuario: usuario.nombre_tipo
    };

    if (incluirCamposAutoridad) {
      return {
        ...usuarioBase,
        cargo: usuario.cargo,
        area_responsabilidad: usuario.area_responsabilidad,
        numero_empleado: usuario.numero_empleado,
        estado_verificacion: usuario.estado_verificacion
      };
    }

    return usuarioBase;
  }

  // Registro de ciudadano
  static async registroCiudadano(req, res) {
    try {
      const { nombres, apellidos, documento_identidad, email, telefono, direccion, password } = req.body;

      // Validar datos únicos
      const validacion = await AuthController._validarDatosUnicos(email, documento_identidad);
      if (!validacion.valido) {
        return res.status(400).json({
          success: false,
          message: validacion.mensaje
        });
      }

      // Hashear contraseña
      const password_hash = await bcrypt.hash(password, 10);

      // Crear usuario ciudadano
      const id_usuario = await Usuario.crear({
        id_tipo_usuario: TIPOS_USUARIO.CIUDADANO,
        nombres,
        apellidos,
        documento_identidad,
        email,
        telefono,
        direccion_registro: direccion,
        password_hash
      });

      // Obtener usuario creado
      const usuarioCreado = await Usuario.buscarPorId(id_usuario);

      // Generar token
      const token = AuthController._generarToken(usuarioCreado);

      res.status(201).json({
        success: true,
        message: MENSAJES_EXITO.REGISTRO_EXITOSO,
        data: {
          token,
          usuario: AuthController._formatearUsuario(usuarioCreado)
        }
      });
    } catch (error) {
      console.error('Error en registro de ciudadano:', error);
      console.error('Stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Error al registrar usuario',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
      const token = AuthController._generarToken(usuario);

      // Determinar si es autoridad para incluir campos adicionales
      const esAutoridad = usuario.id_tipo_usuario === TIPOS_USUARIO.AUTORIDAD_MUNICIPAL;

      res.json({
        success: true,
        message: MENSAJES_EXITO.LOGIN_EXITOSO,
        data: {
          token,
          usuario: AuthController._formatearUsuario(usuario, esAutoridad)
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
          message: MENSAJES_ERROR.USUARIO_NO_ENCONTRADO
        });
      }

      // Determinar si es autoridad para incluir campos adicionales
      const esAutoridad = usuario.id_tipo_usuario === TIPOS_USUARIO.AUTORIDAD_MUNICIPAL;

      res.json({
        success: true,
        message: 'Token válido',
        data: {
          usuario: AuthController._formatearUsuario(usuario, esAutoridad)
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

  // Registro de autoridad
  static async registroAutoridad(req, res) {
    try {
      const {
        nombres,
        apellidos,
        documento_identidad,
        email,
        telefono,
        direccion_registro,
        password,
        cargo,
        area_responsabilidad,
        numero_empleado,
        fecha_ingreso
      } = req.body;

      // Validar datos únicos (incluyendo número de empleado)
      const validacion = await AuthController._validarDatosUnicos(email, documento_identidad, numero_empleado);
      if (!validacion.valido) {
        return res.status(400).json({
          success: false,
          message: validacion.mensaje
        });
      }

      // Hashear contraseña
      const password_hash = await bcrypt.hash(password, 10);

      // Crear usuario autoridad (requiere aprobación de admin)
      const id_usuario = await Usuario.crear({
        id_tipo_usuario: TIPOS_USUARIO.AUTORIDAD_MUNICIPAL,
        nombres,
        apellidos,
        documento_identidad,
        email,
        telefono,
        direccion_registro,
        password_hash,
        cargo,
        area_responsabilidad,
        numero_empleado,
        fecha_ingreso,
        estado_verificacion: 'aprobado' // TODO: En producción cambiar a 'pendiente' para requerir aprobación de admin
      });

      // Obtener usuario creado
      const usuarioCreado = await Usuario.buscarPorId(id_usuario);

      // Generar token
      const token = AuthController._generarToken(usuarioCreado);

      res.status(201).json({
        success: true,
        message: MENSAJES_EXITO.REGISTRO_AUTORIDAD_PENDIENTE,
        data: {
          token,
          usuario: AuthController._formatearUsuario(usuarioCreado, true)
        }
      });
    } catch (error) {
      console.error('Error en registro de autoridad:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar autoridad',
        error: error.message
      });
    }
  }

  // Solicitar recuperación de contraseña
  static async solicitarRecuperacion(req, res) {
    try {
      const { email } = req.body;

      // Buscar usuario por email
      const usuario = await Usuario.buscarPorEmail(email);

      // Por seguridad, siempre devolver el mismo mensaje (no revelar si el email existe)
      const mensajeGenerico = 'Si el email existe en nuestro sistema, recibirás un enlace de recuperación';

      if (!usuario) {
        return res.json({
          success: true,
          message: mensajeGenerico
        });
      }

      // Verificar si ya existe un token reciente (prevenir spam)
      const tieneTokenReciente = await PasswordResetToken.existeTokenReciente(usuario.id_usuario, 5);
      if (tieneTokenReciente) {
        return res.status(429).json({
          success: false,
          message: 'Ya se envió un enlace de recuperación recientemente. Por favor espera 5 minutos.'
        });
      }

      // Invalidar tokens anteriores del usuario
      await PasswordResetToken.invalidarTokensUsuario(usuario.id_usuario);

      // Crear nuevo token
      const ip_solicitud = req.ip || req.connection.remoteAddress;
      const token = await PasswordResetToken.crear(usuario.id_usuario, ip_solicitud);

      // Enviar email con el token
      await EmailService.enviarEmailRecuperacion(
        usuario.email,
        token,
        usuario.nombres
      );

      res.json({
        success: true,
        message: mensajeGenerico,
        // Solo en desarrollo, mostrar el token
        ...(process.env.NODE_ENV === 'development' && { token })
      });
    } catch (error) {
      console.error('Error en solicitud de recuperación:', error);
      res.status(500).json({
        success: false,
        message: 'Error al procesar solicitud de recuperación',
        error: error.message
      });
    }
  }

  // Restablecer contraseña con token
  static async restablecerPassword(req, res) {
    try {
      const { token, nueva_password } = req.body;

      // Buscar token válido
      const tokenData = await PasswordResetToken.buscarTokenValido(token);

      if (!tokenData) {
        return res.status(400).json({
          success: false,
          message: 'Token inválido o expirado'
        });
      }

      // Hashear nueva contraseña
      const password_hash = await bcrypt.hash(nueva_password, 10);

      // Actualizar contraseña
      const actualizado = await Usuario.cambiarPassword(tokenData.id_usuario, password_hash);

      if (!actualizado) {
        return res.status(500).json({
          success: false,
          message: 'Error al actualizar contraseña'
        });
      }

      // Marcar token como usado
      await PasswordResetToken.marcarComoUsado(token);

      // Enviar email de confirmación
      await EmailService.enviarEmailConfirmacionCambio(
        tokenData.email,
        tokenData.nombres
      );

      res.json({
        success: true,
        message: 'Contraseña restablecida exitosamente'
      });
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      res.status(500).json({
        success: false,
        message: 'Error al restablecer contraseña',
        error: error.message
      });
    }
  }

  // Verificar si un token es válido (sin usarlo)
  static async verificarTokenRecuperacion(req, res) {
    try {
      const { token } = req.params;

      const tokenData = await PasswordResetToken.buscarTokenValido(token);

      if (!tokenData) {
        return res.status(400).json({
          success: false,
          message: 'Token inválido o expirado'
        });
      }

      res.json({
        success: true,
        message: 'Token válido',
        data: {
          email: tokenData.email,
          nombres: tokenData.nombres
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
