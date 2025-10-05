import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PrivateRoute from './PrivateRoute';

// Páginas públicas
import LandingPage from '../pages/public/LandingPage/LandingPage';
import LoginPage from '../pages/public/LoginPage/LoginPage';
import RegisterPage from '../pages/public/RegisterPage/RegisterPage';

// Páginas de autenticación
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage/ResetPasswordPage';

// Páginas privadas
import HomePage from '../pages/ciudadano/HomePage/HomePage';
import PerfilPage from '../pages/ciudadano/PerfilPage/PerfilPage';
import DenunciasPage from '../pages/ciudadano/DenunciasPage/DenunciasPage';
import NuevaDenunciaPage from '../pages/ciudadano/NuevaDenunciaPage/NuevaDenunciaPage';

const AppRoutes = () => {
  const { estaAutenticado } = useAuth();

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rutas de autenticación */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Rutas privadas */}
        <Route path="/inicio" element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        } />
        <Route path="/perfil" element={
          <PrivateRoute>
            <PerfilPage />
          </PrivateRoute>
        } />
        <Route path="/denuncias" element={
          <PrivateRoute>
            <DenunciasPage />
          </PrivateRoute>
        } />
        <Route path="/nueva-denuncia" element={
          <PrivateRoute>
            <NuevaDenunciaPage />
          </PrivateRoute>
        } />

        {/* Redirección para usuarios autenticados */}
        <Route path="/dashboard" element={
          estaAutenticado ? <Navigate to="/inicio" replace /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
