import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PrivateRoute from './PrivateRoute';

// Páginas públicas
import LoginPage from '../pages/public/LoginPage/LoginPage';
import RegisterPage from '../pages/public/RegisterPage/RegisterPage';

// Páginas privadas
import HomePage from '../pages/ciudadano/HomePage/HomePage';

const AppRoutes = () => {
  const { estaAutenticado } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route 
          path="/login" 
          element={estaAutenticado ? <Navigate to="/" /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={estaAutenticado ? <Navigate to="/" /> : <RegisterPage />} 
        />

        {/* Rutas privadas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
