import api from './api.js';

/**
 * Servicio para gestión de perfil de usuario
 * Maneja todas las operaciones relacionadas con el perfil del usuario autenticado
 */
class UsuarioService {
  
  /**
   * Obtiene el perfil del usuario autenticado
   * @returns {Promise<Object>} Datos del perfil del usuario
   */
  static async obtenerPerfil() {
    try {
      const response = await api.get('/usuarios/profile');
      return response.data;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw this.manejarError(error);
    }
  }

  /**
   * Actualiza el perfil del usuario autenticado
   * @param {Object} datosActualizacion - Datos a actualizar
   * @param {string} datosActualizacion.nombres - Nombres del usuario
   * @param {string} datosActualizacion.apellidos - Apellidos del usuario
   * @param {string} [datosActualizacion.telefono] - Teléfono del usuario
   * @param {string} [datosActualizacion.direccion] - Dirección del usuario
   * @param {string} [datosActualizacion.email] - Email del usuario
   * @param {string} [datosActualizacion.numero_documento] - Número de documento
   * @returns {Promise<Object>} Respuesta de la actualización
   */
  static async actualizarPerfil(datosActualizacion) {
    try {
      // Validar datos antes de enviar
      this.validarDatosActualizacion(datosActualizacion);
      
      const response = await api.put('/usuarios/profile', datosActualizacion);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw this.manejarError(error);
    }
  }

  /**
   * Cambia la contraseña del usuario autenticado
   * @param {Object} datosCambioPassword - Datos para cambio de contraseña
   * @param {string} datosCambioPassword.password_actual - Contraseña actual
   * @param {string} datosCambioPassword.password_nuevo - Nueva contraseña
   * @param {string} datosCambioPassword.confirmar_password - Confirmación de nueva contraseña
   * @returns {Promise<Object>} Respuesta del cambio de contraseña
   */
  static async cambiarPassword(datosCambioPassword) {
    try {
      // Validar datos antes de enviar
      this.validarDatosCambioPassword(datosCambioPassword);
      
      const response = await api.put('/usuarios/cambiar-password', datosCambioPassword);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw this.manejarError(error);
    }
  }

  /**
   * Obtiene el historial de actividad del usuario
   * @param {Object} [opciones] - Opciones de consulta
   * @param {number} [opciones.limite=10] - Límite de registros
   * @param {number} [opciones.pagina=1] - Página a consultar
   * @returns {Promise<Object>} Historial de actividad
   */
  static async obtenerHistorialActividad(opciones = {}) {
    try {
      const { limite = 10, pagina = 1 } = opciones;
      const params = new URLSearchParams({
        limite: limite.toString(),
        pagina: pagina.toString()
      });
      
      const response = await api.get(`/usuarios/historial-actividad?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial de actividad:', error);
      throw this.manejarError(error);
    }
  }

  /**
   * Valida los datos de actualización de perfil
   * @param {Object} datos - Datos a validar
   * @throws {Error} Si los datos no son válidos
   */
  static validarDatosActualizacion(datos) {
    const errores = [];

    // Validar nombres
    if (!datos.nombres || datos.nombres.trim().length < 2) {
      errores.push('Los nombres son obligatorios y deben tener al menos 2 caracteres');
    }

    // Validar apellidos
    if (!datos.apellidos || datos.apellidos.trim().length < 2) {
      errores.push('Los apellidos son obligatorios y deben tener al menos 2 caracteres');
    }

    // Validar teléfono si se proporciona
    if (datos.telefono && !/^\d{10}$/.test(datos.telefono)) {
      errores.push('El teléfono debe tener exactamente 10 dígitos');
    }

    // Validar email si se proporciona
    if (datos.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
      errores.push('El email debe tener un formato válido');
    }

    // Validar número de documento si se proporciona
    if (datos.numero_documento && (datos.numero_documento.length < 6 || datos.numero_documento.length > 15)) {
      errores.push('El número de documento debe tener entre 6 y 15 caracteres');
    }

    if (errores.length > 0) {
      throw new Error(errores.join(', '));
    }
  }

  /**
   * Valida los datos de cambio de contraseña
   * @param {Object} datos - Datos a validar
   * @throws {Error} Si los datos no son válidos
   */
  static validarDatosCambioPassword(datos) {
    const errores = [];

    // Validar contraseña actual
    if (!datos.password_actual) {
      errores.push('La contraseña actual es obligatoria');
    }

    // Validar nueva contraseña
    if (!datos.password_nuevo) {
      errores.push('La nueva contraseña es obligatoria');
    } else if (datos.password_nuevo.length < 8) {
      errores.push('La nueva contraseña debe tener al menos 8 caracteres');
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(datos.password_nuevo)) {
      errores.push('La nueva contraseña debe contener al menos: una letra minúscula, una mayúscula, un número y un carácter especial');
    }

    // Validar confirmación de contraseña
    if (!datos.confirmar_password) {
      errores.push('La confirmación de contraseña es obligatoria');
    } else if (datos.password_nuevo !== datos.confirmar_password) {
      errores.push('La confirmación de contraseña no coincide');
    }

    // Validar que la nueva contraseña sea diferente a la actual
    if (datos.password_actual === datos.password_nuevo) {
      errores.push('La nueva contraseña debe ser diferente a la actual');
    }

    if (errores.length > 0) {
      throw new Error(errores.join(', '));
    }
  }

  /**
   * Maneja los errores de las peticiones HTTP
   * @param {Error} error - Error de la petición
   * @returns {Error} Error procesado
   */
  static manejarError(error) {
    if (error.response) {
      // Error de respuesta del servidor
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          // Errores de validación
          if (data.errores && Array.isArray(data.errores)) {
            const mensajes = data.errores.map(err => err.mensaje).join(', ');
            return new Error(mensajes);
          }
          return new Error(data.message || 'Datos inválidos');
        
        case 401:
          return new Error('No autorizado. Por favor, inicia sesión nuevamente');
        
        case 403:
          return new Error('No tienes permisos para realizar esta acción');
        
        case 404:
          return new Error('Recurso no encontrado');
        
        case 409:
          return new Error(data.message || 'Conflicto con los datos existentes');
        
        case 500:
          return new Error('Error interno del servidor. Intenta nuevamente más tarde');
        
        default:
          return new Error(data.message || 'Error desconocido');
      }
    } else if (error.request) {
      // Error de red
      return new Error('Error de conexión. Verifica tu conexión a internet');
    } else {
      // Error de configuración u otro
      return new Error(error.message || 'Error inesperado');
    }
  }

  /**
   * Formatea los datos del usuario para mostrar
   * @param {Object} usuario - Datos del usuario
   * @returns {Object} Datos formateados
   */
  static formatearDatosUsuario(usuario) {
    return {
      ...usuario,
      nombre_completo: `${usuario.nombres} ${usuario.apellidos}`,
      telefono_formateado: usuario.telefono ? this.formatearTelefono(usuario.telefono) : null,
      fecha_registro_formateada: usuario.fecha_registro ? 
        new Date(usuario.fecha_registro).toLocaleDateString('es-CO') : null
    };
  }

  /**
   * Formatea un número de teléfono
   * @param {string} telefono - Número de teléfono
   * @returns {string} Teléfono formateado
   */
  static formatearTelefono(telefono) {
    if (!telefono || telefono.length !== 10) return telefono;
    return `${telefono.slice(0, 3)} ${telefono.slice(3, 6)} ${telefono.slice(6)}`;
  }
}

export default UsuarioService;