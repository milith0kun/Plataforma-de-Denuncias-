/**
 * Paleta de colores unificada del sistema
 * Estos colores deben coincidir con las variables CSS definidas en src/index.css
 *
 * USO:
 * import { COLORS } from '@/constants/colors';
 * const color = COLORS.primary;
 */

export const COLORS = {
  // Colores Principales - Sistema de Diseño Unificado
  primary: '#3b82f6',       // Azul principal (blue-500)
  primaryLight: '#60a5fa',  // Azul claro (blue-400)
  primaryDark: '#2563eb',   // Azul oscuro (blue-600)

  // Colores de Estado
  success: '#10b981',       // Verde - Éxito/Completado (green-500)
  warning: '#f59e0b',       // Ámbar - Advertencia/Pendiente (amber-500)
  danger: '#ef4444',        // Rojo - Error/Urgente (red-500)
  info: '#3b82f6',          // Azul - Información (blue-500)

  // Colores Neutrales - Sistema de grises unificado
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f8fafc',          // slate-50
    100: '#f1f5f9',         // slate-100
    200: '#e2e8f0',         // slate-200
    300: '#cbd5e1',         // slate-300
    400: '#94a3b8',         // slate-400
    500: '#64748b',         // slate-500
    600: '#475569',         // slate-600
    700: '#334155',         // slate-700
    800: '#1e293b',         // slate-800
    900: '#0f172a',         // slate-900
  },

  // Colores de Roles de Usuario
  roles: {
    ciudadano: '#10b981',   // Verde (green-500)
    autoridad: '#3b82f6',   // Azul (blue-500)
    admin: '#8b5cf6',       // Violeta (violet-500)
  },

  // Estados de Denuncia - Unificados
  estados: {
    registrada: '#64748b',    // Gris (slate-500)
    pendiente: '#f59e0b',     // Ámbar (amber-500)
    enProceso: '#8b5cf6',     // Violeta (violet-500)
    asignada: '#3b82f6',      // Azul (blue-500)
    resuelta: '#10b981',      // Verde (green-500)
    cerrada: '#475569',       // Gris oscuro (slate-600)
  },

  // Prioridades de Denuncia
  prioridades: {
    baja: '#10b981',          // Verde (green-500)
    media: '#f59e0b',         // Ámbar (amber-500)
    alta: '#ef4444',          // Rojo (red-500)
  },

  // Colores Semánticos (para textos y fondos)
  text: {
    primary: '#1e293b',       // slate-800
    secondary: '#64748b',     // slate-500
    muted: '#94a3b8',         // slate-400
  },

  bg: {
    primary: '#ffffff',       // White
    secondary: '#f8fafc',     // slate-50
    tertiary: '#f1f5f9',      // slate-100
  },

  border: '#e2e8f0',          // slate-200
  borderLight: '#f1f5f9',     // slate-100
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
