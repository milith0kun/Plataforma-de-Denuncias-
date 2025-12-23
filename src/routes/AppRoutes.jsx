import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Páginas públicas
import LandingPage from '../pages/public/LandingPage/LandingPage';
import LoginPage from '../pages/public/LoginPage/LoginPage';
import RegisterPage from '../pages/public/RegisterPage/RegisterPage';
import RegisterAuthorityPage from '../pages/public/RegisterAuthorityPage/RegisterAuthorityPage';

// Páginas de autenticación
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage/ResetPasswordPage';
import GoogleCallback from '../pages/auth/GoogleCallback';

// Páginas privadas (ciudadanos)
import HomePage from '../pages/ciudadano/HomePage/HomePage';
import PerfilPage from '../pages/ciudadano/PerfilPage/PerfilPage';
import DenunciasPage from '../pages/ciudadano/DenunciasPage/DenunciasPage';
import NuevaDenunciaPage from '../pages/ciudadano/NuevaDenunciaPage/NuevaDenunciaPage';
import DetalleDenunciaPage from '../pages/ciudadano/DetalleDenunciaPage/DetalleDenunciaPage';
import ReportesPage from '../pages/ciudadano/ReportesPage/ReportesPage';
import SeguimientoDenunciaPage from '../pages/SeguimientoDenunciaPage/SeguimientoDenunciaPage';
import MapaDenunciasPage from '../pages/MapaDenunciasPage/MapaDenunciasPage';

// Páginas privadas (autoridades)
import DashboardAutoridadPage from '../pages/autoridad/DashboardAutoridadPage/DashboardAutoridadPage';
import GestionDenunciasPage from '../pages/autoridad/GestionDenunciasPage/GestionDenunciasPage';

// Componentes de protección
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  const { estaAutenticado, esAutoridad, esCiudadano } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-authority" element={<RegisterAuthorityPage />} />

        {/* Rutas de autenticación */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        {/* Rutas privadas para ciudadanos */}
        <Route
          path="/home"
          element={
            <PrivateRoute requireRole="ciudadano">
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/inicio"
          element={<Navigate to="/home" replace />}
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <PerfilPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/denuncias"
          element={
            <PrivateRoute>
              <DenunciasPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/nueva-denuncia"
          element={
            <PrivateRoute requireRole="ciudadano">
              <NuevaDenunciaPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/denuncias/:id"
          element={
            <PrivateRoute>
              <DetalleDenunciaPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <PrivateRoute>
              <ReportesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/seguimiento"
          element={
            <PrivateRoute>
              <SeguimientoDenunciaPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/seguimiento/:id"
          element={
            <PrivateRoute>
              <SeguimientoDenunciaPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/mapa-denuncias"
          element={
            <PrivateRoute>
              <MapaDenunciasPage />
            </PrivateRoute>
          }
        />

        {/* Rutas privadas para autoridades */}
        <Route
          path="/dashboard-autoridad"
          element={
            <PrivateRoute requireRole="autoridad">
              <DashboardAutoridadPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/gestionar-denuncias"
          element={
            <PrivateRoute requireRole="autoridad">
              <GestionDenunciasPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/autoridad/gestion-denuncias"
          element={<Navigate to="/gestionar-denuncias" replace />}
        />
        <Route
          path="/estadisticas"
          element={
            <PrivateRoute requireRole="autoridad">
              <DashboardAutoridadPage />
            </PrivateRoute>
          }
        />

        {/* Redirección inteligente del dashboard basada en rol */}
        <Route
          path="/dashboard"
          element={
            estaAutenticado ? (
              esAutoridad ? <Navigate to="/dashboard-autoridad" replace /> :
                esCiudadano ? <Navigate to="/home" replace /> :
                  <Navigate to="/login" replace />
            ) : <Navigate to="/login" replace />
          }
        />

        {/* Redirección por defecto basada en autenticación y rol */}
        <Route
          path="*"
          element={
            estaAutenticado ? (
              esAutoridad ? <Navigate to="/dashboard-autoridad" replace /> :
                esCiudadano ? <Navigate to="/home" replace /> :
                  <Navigate to="/" replace />
            ) : <Navigate to="/" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

