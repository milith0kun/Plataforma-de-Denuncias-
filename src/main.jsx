/**
 * ============================================================================
 * PUNTO DE ENTRADA DE LA APLICACIÓN - MAIN
 * ============================================================================
 * 
 * @file main.jsx
 * @description Punto de entrada principal que renderiza la aplicación React
 *              en el DOM. Configura el modo estricto para detectar problemas
 *              potenciales durante el desarrollo.
 * 
 * @author Dennis Moises Ccapatinta Qqueccaño - 140984
 * @team Grupo 3 - Desarrollo de Software I
 * @date 2024-12-18
 * @version 2.0.0
 * 
 * @responsabilidades
 * - Desarrollo completo del frontend de la plataforma
 * - Implementación de todos los componentes React
 * - Diseño e implementación de UI/UX
 * - Integración con backend mediante servicios API
 * 
 * @tecnologías
 * - React 19.1.1
 * - Vite (Build tool)
 * - React Router DOM
 * - Axios para peticiones HTTP
 * 
 * ============================================================================
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * Renderiza la aplicación React en el elemento root del HTML
 * 
 * @description
 * - StrictMode: Activa comprobaciones adicionales y advertencias
 *   para detectar problemas en la aplicación durante desarrollo
 * - createRoot: Método moderno de React 18+ para crear la raíz de la app
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
