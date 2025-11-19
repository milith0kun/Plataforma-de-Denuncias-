/**
 * Paleta de colores unificada del sistema
 * Estos colores deben coincidir con las variables CSS definidas en src/index.css
 *
 * USO:
 * import { COLORS } from '@/constants/colors';
 * const color = COLORS.primary;
 */

export const COLORS = {
  // Colores Principales
  primary: '#153595',       // Azul principal oscuro
  primaryLight: '#A5C1EB',  // Azul claro
  primaryDark: '#03193B',   // Azul muy oscuro/navy

  // Colores de Estado
  success: '#10b981',       // Verde - Éxito/Completado
  warning: '#f59e0b',       // Ámbar - Advertencia/Pendiente
  danger: '#ef4444',        // Rojo - Error/Urgente
  info: '#3b82f6',          // Azul - Información

  // Colores Neutrales
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Colores de Roles de Usuario
  roles: {
    ciudadano: '#10b981',   // Verde
    autoridad: '#3b82f6',   // Azul
    admin: '#8b5cf6',       // Violeta
  },

  // Estados de Denuncia
  estados: {
    registrada: '#6b7280',    // Gris
    pendiente: '#f59e0b',     // Ámbar
    enProceso: '#3b82f6',     // Azul
    asignada: '#8b5cf6',      // Violeta
    resuelta: '#10b981',      // Verde
    cerrada: '#4b5563',       // Gris oscuro
  },

  // Prioridades de Denuncia
  prioridades: {
    baja: '#10b981',          // Verde
    media: '#f59e0b',         // Ámbar
    alta: '#ef4444',          // Rojo
  },

  // Colores Semánticos (para textos y fondos)
  text: {
    primary: '#111827',       // Gray 900
    secondary: '#6b7280',     // Gray 500
    muted: '#9ca3af',         // Gray 400
  },

  bg: {
    primary: '#ffffff',       // White
    secondary: '#f9fafb',     // Gray 50
    tertiary: '#f3f4f6',      // Gray 100
  },

  border: '#e5e7eb',          // Gray 200
  borderLight: '#f3f4f6',     // Gray 100
};

/**
 * Función helper para obtener color de estado de denuncia
 * @param {string} estado - Nombre del estado
 * @returns {string} Color hex correspondiente
 */
export const getEstadoColor = (estado) => {
  const estadoNormalizado = estado?.toLowerCase().replace(/\s+/g, '');

  const mapeo = {
    'registrada': COLORS.estados.registrada,
    'pendiente': COLORS.estados.pendiente,
    'enproceso': COLORS.estados.enProceso,
    'enrevision': COLORS.estados.enProceso,
    'asignada': COLORS.estados.asignada,
    'resuelta': COLORS.estados.resuelta,
    'cerrada': COLORS.estados.cerrada,
  };

  return mapeo[estadoNormalizado] || COLORS.gray[500];
};

/**
 * Función helper para obtener color de prioridad
 * @param {string} prioridad - Nombre de la prioridad
 * @returns {string} Color hex correspondiente
 */
export const getPrioridadColor = (prioridad) => {
  const prioridadNormalizada = prioridad?.toLowerCase();

  const mapeo = {
    'baja': COLORS.prioridades.baja,
    'media': COLORS.prioridades.media,
    'alta': COLORS.prioridades.alta,
    'urgente': COLORS.prioridades.alta,
  };

  return mapeo[prioridadNormalizada] || COLORS.gray[500];
};

/**
 * Función helper para obtener color de rol
 * @param {string} rol - Nombre del rol
 * @returns {string} Color hex correspondiente
 */
export const getRolColor = (rol) => {
  const rolNormalizado = rol?.toLowerCase().replace(/\s+/g, '');

  const mapeo = {
    'ciudadano': COLORS.roles.ciudadano,
    'autoridad': COLORS.roles.autoridad,
    'autoridadmunicipal': COLORS.roles.autoridad,
    'admin': COLORS.roles.admin,
    'administrador': COLORS.roles.admin,
  };

  return mapeo[rolNormalizado] || COLORS.gray[500];
};

/**
 * Gradientes predefinidos
 * Pueden usarse con style={{ background: GRADIENTS.primary }}
 */
export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
  primaryLight: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.primary} 100%)`,
  success: `linear-gradient(135deg, ${COLORS.success} 0%, #059669 100%)`,
  danger: `linear-gradient(135deg, ${COLORS.danger} 0%, #dc2626 100%)`,
};

export default COLORS;
