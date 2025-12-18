/**
 * ============================================================================
 * COMPONENTE PRINCIPAL DE LA APLICACIÓN
 * ============================================================================
 * 
 * @file App.jsx
 * @description Componente raíz de la aplicación que configura los providers
 *              globales y el sistema de rutas. Este es el punto de entrada
 *              principal para toda la interfaz de usuario.
 * 
 * @author Dennis Moises Ccapatinta Qqueccaño
 * @date 2024-12-18
 * @version 2.0.0
 * 
 * @dependencies
 * - AuthContext: Proveedor de autenticación global
 * - ToastProvider: Sistema de notificaciones toast
 * - AppRoutes: Configuración de rutas de la aplicación
 * 
 * @structure
 * App
 *  ├── AuthProvider (Contexto de autenticación)
 *  │    └── ToastProvider (Sistema de notificaciones)
 *  │         └── AppRoutes (Rutas de navegación)
 * 
 * ============================================================================
 */

import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/common/ToastContainer/ToastContainer';
import AppRoutes from './routes/AppRoutes';
import './App.css';

/**
 * Componente principal de la aplicación
 * 
 * Encapsula toda la aplicación con los providers necesarios para:
 * - Gestión de autenticación (AuthProvider)
 * - Sistema de notificaciones (ToastProvider)
 * - Enrutamiento de páginas (AppRoutes)
 * 
 * @returns {JSX.Element} Estructura completa de la aplicación
 */
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
