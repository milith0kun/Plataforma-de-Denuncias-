import api from './api.js';

const authService = {
  // Registro de ciudadano
  async registrarCiudadano(datos) {
    const response = await api.post('/auth/register/ciudadano', datos);
    
    if (response.data.success) {
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.data.usuario));
    }
    
    return response.data;
  },

  // Login
  async login(credenciales) {
    const response = await api.post('/auth/login', credenciales);
    
    if (response.data.success) {
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.data.usuario));
    }
    
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  // Verificar token
  async verificarToken() {
    const response = await api.get('/auth/verify-token');
    return response.data;
  },

  // Obtener usuario actual del localStorage
  obtenerUsuarioActual() {
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  },

  // Verificar si hay sesión activa
  estaAutenticado() {
    return !!localStorage.getItem('token');
  }
};

export default authService;
