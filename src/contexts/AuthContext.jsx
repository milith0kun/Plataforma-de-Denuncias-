import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Verificar sesión al cargar la aplicación
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        if (authService.estaAutenticado()) {
          const usuarioGuardado = authService.obtenerUsuarioActual();
          setUsuario(usuarioGuardado);
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        authService.logout();
      } finally {
        setCargando(false);
      }
    };

    verificarSesion();
  }, []);

  // Registrar ciudadano
  const registrar = async (datos) => {
    try {
      setError(null);
      const respuesta = await authService.registrarCiudadano(datos);
      setUsuario(respuesta.data.usuario);
      return respuesta;
    } catch (error) {
      const mensajeError = error.response?.data?.message || 'Error al registrar usuario';
      setError(mensajeError);
      throw error;
    }
  };

  // Login
  const login = async (credenciales) => {
    try {
      setError(null);
      const respuesta = await authService.login(credenciales);
      setUsuario(respuesta.data.usuario);
      return respuesta;
    } catch (error) {
      const mensajeError = error.response?.data?.message || 'Error al iniciar sesión';
      setError(mensajeError);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUsuario(null);
    setError(null);
  };

  const value = {
    usuario,
    cargando,
    error,
    registrar,
    login,
    logout,
    estaAutenticado: !!usuario
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
