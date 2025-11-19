// Constantes del sistema

// Tipos de Usuario (deben coincidir con la BD)
export const TIPOS_USUARIO = {
  CIUDADANO: 1,
  AUTORIDAD_MUNICIPAL: 2,
  ADMINISTRADOR: 3
};

// Nombres de roles para validación
export const ROLES = {
  CIUDADANO: 'Ciudadano',
  AUTORIDAD: 'Autoridad_Municipal',
  ADMIN: 'Administrador'
};

// Cargos válidos para autoridades
export const CARGOS_AUTORIDAD = [
  'Alcalde',
  'Regidor',
  'Gerente Municipal',
  'Subgerente',
  'Jefe de Área',
  'Supervisor',
  'Inspector',
  'Coordinador',
  'Técnico Municipal',
  'Otro'
];

// Áreas de responsabilidad
export const AREAS_RESPONSABILIDAD = [
  'Obras Públicas',
  'Servicios Urbanos',
  'Limpieza y Saneamiento',
  'Seguridad Ciudadana',
  'Desarrollo Urbano',
  'Gestión Ambiental',
  'Transporte y Vialidad',
  'Servicios Públicos',
  'Administración General',
  'Otra'
];

// Estados de verificación de autoridad
export const ESTADOS_VERIFICACION = {
  PENDIENTE: 'pendiente',
  APROBADO: 'aprobado',
  RECHAZADO: 'rechazado'
};

// Estados de denuncia
export const ESTADOS_DENUNCIA = {
  REGISTRADA: 1,
  EN_REVISION: 2,
  ASIGNADA: 3,
  EN_PROCESO: 4,
  RESUELTA: 5,
  CERRADA: 6
};

// Límites del sistema
export const LIMITES = {
  MAX_IMAGENES_POR_DENUNCIA: 5,
  MAX_TAMANO_IMAGEN_MB: 5,
  MIN_LONGITUD_PASSWORD: 8,
  MAX_LONGITUD_PASSWORD: 50
};

// Mensajes de error comunes
export const MENSAJES_ERROR = {
  EMAIL_EXISTENTE: 'El email ya está registrado',
  DOCUMENTO_EXISTENTE: 'El documento de identidad ya está registrado',
  NUMERO_EMPLEADO_EXISTENTE: 'El número de empleado ya está registrado',
  CREDENCIALES_INCORRECTAS: 'Credenciales incorrectas',
  USUARIO_DESACTIVADO: 'Usuario desactivado. Contacte al administrador',
  TOKEN_NO_PROPORCIONADO: 'Token no proporcionado',
  TOKEN_INVALIDO: 'Token inválido',
  TOKEN_EXPIRADO: 'Token expirado',
  ACCESO_DENEGADO: 'No tiene permisos para realizar esta acción',
  USUARIO_NO_ENCONTRADO: 'Usuario no encontrado',
  DATOS_INVALIDOS: 'Datos inválidos'
};

// Mensajes de éxito
export const MENSAJES_EXITO = {
  REGISTRO_EXITOSO: 'Usuario registrado exitosamente',
  REGISTRO_AUTORIDAD_PENDIENTE: 'Registro exitoso. Su cuenta está pendiente de aprobación por un administrador',
  LOGIN_EXITOSO: 'Login exitoso',
  ACTUALIZACION_EXITOSA: 'Actualización exitosa',
  OPERACION_EXITOSA: 'Operación realizada exitosamente',
  DENUNCIA_CREADA: 'Denuncia registrada exitosamente'
};
