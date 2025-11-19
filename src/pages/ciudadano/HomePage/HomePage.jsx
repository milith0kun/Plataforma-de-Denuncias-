import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import LottieIcon from '../../../components/LottieIcon/LottieIcon';
import denunciaService from '../../../services/denunciaService';
import './HomePage.css';

// Importar iconos JSON
import SpeedIcon from '../../../assets/icons/speed.json';
import TransparencyIcon from '../../../assets/icons/transparency.json';
import SecurityIcon from '../../../assets/icons/security.json';
import ServicesIcon from '../../../assets/icons/services.json';
import BuildingsIcon from '../../../assets/icons/buildings.json';
import MobileIcon from '../../../assets/icons/mobile.json';
import InfrastructureIcon from '../../../assets/icons/infrastructure.json';

const HomePage = () => {
  const navigate = useNavigate();
  const { usuario, estaAutenticado, esCiudadano, esAutoridad, esAdmin } = useAuth();

  // Estados para datos de la API
  const [estadisticas, setEstadisticas] = useState({
    denunciasRealizadas: 0,
    denunciasPendientes: 0,
    denunciasEnProceso: 0,
    denunciasResueltas: 0
  });
  const [denunciasRecientes, setDenunciasRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos de la API
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);

      // Obtener estadísticas
      const stats = await denunciaService.obtenerEstadisticasUsuario();
      setEstadisticas({
        denunciasRealizadas: stats.total,
        denunciasPendientes: stats.pendientes,
        denunciasEnProceso: stats.enProceso,
        denunciasResueltas: stats.resueltas
      });

      // Obtener denuncias recientes (últimas 3)
      const response = await denunciaService.obtenerDenuncias({
        limite: 3,
        orden: 'fecha_registro',
        direccion: 'DESC'
      });

      if (response.success) {
        setDenunciasRecientes(response.data.denuncias);
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  // Función para navegar a diferentes secciones
  const navegarA = (ruta) => {
    navigate(ruta);
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Mostrar estado de carga
  if (cargando) {
    return (
      <>
        <Header />
        <section className="dashboard-section">
          <div className="dashboard-container">
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando datos...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <>
        <Header />
        <section className="dashboard-section">
          <div className="dashboard-container">
            <div className="error-container">
              <p className="error-message">⚠️ {error}</p>
              <button onClick={cargarDatos} className="retry-button">
                Reintentar
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Header />

      <section className="dashboard-section">
        <div className="dashboard-container">
          <div className="welcome-section">
            <div className="welcome-content">
              <h1 className="welcome-title">
                ¡Bienvenido, {usuario?.nombres} {usuario?.apellidos}! 👋
              </h1>
              <p className="welcome-subtitle">
                Gestiona tus denuncias y contribuye a mejorar tu comunidad
              </p>
              <div className="user-info">
                <p><strong>Email:</strong> {usuario?.email}</p>
                <p><strong>Tipo de usuario:</strong> {usuario?.tipo_usuario}</p>
                <p><strong>Estado:</strong> {estaAutenticado ? '✅ Autenticado' : '❌ No autenticado'}</p>
                {esCiudadano && <p><strong>Rol:</strong> 🏠 Ciudadano</p>}
                {esAutoridad && <p><strong>Rol:</strong> 🏛️ Autoridad Municipal</p>}
                {esAdmin && <p><strong>Rol:</strong> ⚙️ Administrador</p>}
              </div>
            </div>
            <div className="welcome-stats">
              <div className="stat-card">
                <span className="stat-number">{estadisticas.denunciasRealizadas}</span>
                <span className="stat-label">Denuncias Realizadas</span>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card stat-pendientes">
              <div className="stat-icon">
                <LottieIcon 
                  src={SpeedIcon} 
                  alt="Pendientes" 
                  width={40} 
                  height={40}
                  className="stat-lottie-icon"
                />
              </div>
              <div className="stat-info">
                <span className="stat-number">{estadisticas.denunciasPendientes}</span>
                <span className="stat-label">Pendientes</span>
              </div>
            </div>
            
            <div className="stat-card stat-proceso">
              <div className="stat-icon">
                <LottieIcon 
                  src={TransparencyIcon} 
                  alt="En Proceso" 
                  width={40} 
                  height={40}
                  className="stat-lottie-icon"
                />
              </div>
              <div className="stat-info">
                <span className="stat-number">{estadisticas.denunciasEnProceso}</span>
                <span className="stat-label">En Proceso</span>
              </div>
            </div>
            
            <div className="stat-card stat-resueltas">
              <div className="stat-icon">
                <LottieIcon 
                  src={SecurityIcon} 
                  alt="Resueltas" 
                  width={40} 
                  height={40}
                  className="stat-lottie-icon"
                />
              </div>
              <div className="stat-info">
                <span className="stat-number">{estadisticas.denunciasResueltas}</span>
                <span className="stat-label">Resueltas</span>
              </div>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Accesos Rápidos</h2>
            <div className="quick-access-grid">
              <div className="quick-access-card primary" onClick={() => navigate('/ciudadano/nueva-denuncia')}>
                <div className="quick-access-icon">
                  <LottieIcon 
                    src={ServicesIcon} 
                    alt="Nueva Denuncia" 
                    width={50} 
                    height={50}
                    className="quick-access-lottie-icon"
                  />
                </div>
                <div className="quick-access-content">
                  <h3 className="quick-access-title">Nueva Denuncia</h3>
                  <p className="quick-access-description">Reporta un problema en tu comunidad</p>
                </div>
                <button className="quick-access-btn">Crear</button>
              </div>

              <div className="quick-access-card secondary" onClick={() => navigate('/ciudadano/mis-denuncias')}>
                <div className="quick-access-icon">
                  <LottieIcon 
                    src={BuildingsIcon} 
                    alt="Mis Denuncias" 
                    width={50} 
                    height={50}
                    className="quick-access-lottie-icon"
                  />
                </div>
                <div className="quick-access-content">
                  <h3 className="quick-access-title">Mis Denuncias</h3>
                  <p className="quick-access-description">Revisa el estado de tus reportes</p>
                </div>
                <button className="quick-access-btn">Ver</button>
              </div>

              <div className="quick-access-card tertiary" onClick={() => navigate('/ciudadano/perfil')}>
                <div className="quick-access-icon">
                  <LottieIcon 
                    src={MobileIcon} 
                    alt="Mi Perfil" 
                    width={50} 
                    height={50}
                    className="quick-access-lottie-icon"
                  />
                </div>
                <div className="quick-access-content">
                  <h3 className="quick-access-title">Mi Perfil</h3>
                  <p className="quick-access-description">Actualiza tu información personal</p>
                </div>
                <button className="quick-access-btn">Editar</button>
              </div>

              <div className="quick-access-card quaternary" onClick={() => navigate('/ciudadano/ayuda')}>
                <div className="quick-access-icon">
                  <LottieIcon 
                    src={InfrastructureIcon} 
                    alt="Ayuda" 
                    width={50} 
                    height={50}
                    className="quick-access-lottie-icon"
                  />
                </div>
                <div className="quick-access-content">
                  <h3 className="quick-access-title">Ayuda</h3>
                  <p className="quick-access-description">Encuentra respuestas a tus preguntas</p>
                </div>
                <button className="quick-access-btn">Explorar</button>
              </div>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Denuncias Recientes</h2>
            {denunciasRecientes.length === 0 ? (
              <div className="empty-state">
                <p>No tienes denuncias registradas aún.</p>
                <button onClick={() => navigate('/nueva-denuncia')} className="quick-access-btn">
                  Crear Primera Denuncia
                </button>
              </div>
            ) : (
              <div className="denuncias-recientes">
                {denunciasRecientes.map((denuncia) => (
                  <div
                    key={denuncia.id_denuncia}
                    className="denuncia-card"
                    onClick={() => navigate(`/denuncias/${denuncia.id_denuncia}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="denuncia-header">
                      <h3 className="denuncia-title">{denuncia.titulo}</h3>
                      <span className={`denuncia-estado ${denuncia.estado_nombre?.toLowerCase().replace(/\s+/g, '')}`}>
                        {denuncia.estado_nombre}
                      </span>
                    </div>
                    <div className="denuncia-info">
                      <span className="denuncia-categoria">{denuncia.categoria_nombre}</span>
                      <span className="denuncia-fecha">{formatearFecha(denuncia.fecha_registro)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
