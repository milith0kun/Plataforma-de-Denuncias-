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
  const registrarCiudadano = async (datos) => {
    try {
      setError(null);
      const respuesta = await authService.registrarCiudadano(datos);
      setUsuario(respuesta.data.usuario);
      return respuesta;
    } catch (error) {
      const mensajeError = error.response?.data?.message || 'Error al registrar ciudadano';
      setError(mensajeError);
      throw error;
    }
  };

  // Registrar autoridad
  const registrarAutoridad = async (datos) => {
    try {
      setError(null);
      const respuesta = await authService.registrarAutoridad(datos);
      setUsuario(respuesta.data.usuario);
      return respuesta;
    } catch (error) {
      const mensajeError = error.response?.data?.message || 'Error al registrar autoridad';
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

  // Solicitar recuperación de contraseña
  const solicitarRecuperacion = async (email) => {
    try {
      setError(null);
      const respuesta = await authService.solicitarRecuperacion(email);
      return respuesta;
    } catch (error) {
      const mensajeError = error.response?.data?.message || 'Error al solicitar recuperación';
      setError(mensajeError);
      throw error;
    }
  };

  // Restablecer contraseña
  const restablecerPassword = async (token, nuevaPassword) => {
    try {
      setError(null);
      const respuesta = await authService.restablecerPassword(token, nuevaPassword);
      return respuesta;
    } catch (error) {
      const mensajeError = error.response?.data?.message || 'Error al restablecer contraseña';
      setError(mensajeError);
      throw error;
    }
  };

  // Limpiar errores
  const limpiarError = () => {
    setError(null);
  };

  const value = {
    usuario,
    cargando,
    error,
    registrarCiudadano,
    registrarAutoridad,
    login,
    logout,
    solicitarRecuperacion,
    restablecerPassword,
    limpiarError,
    estaAutenticado: !!usuario,
    esAdmin: usuario?.tipo_usuario === 'Administrador',
    esAutoridad: usuario?.tipo_usuario === 'Autoridad_Municipal',
    esCiudadano: usuario?.tipo_usuario === 'Ciudadano'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
