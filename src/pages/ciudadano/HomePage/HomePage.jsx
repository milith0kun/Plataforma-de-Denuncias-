import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import LottieIcon from '../../../components/LottieIcon/LottieIcon';
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

  // Datos de ejemplo para las estadísticas
  const estadisticas = {
    denunciasRealizadas: 12,
    denunciasPendientes: 3,
    denunciasEnProceso: 5,
    denunciasResueltas: 4
  };

  // Datos de ejemplo para denuncias recientes
  const denunciasRecientes = [
    {
      id: 1,
      titulo: "Bache en Av. Principal",
      estado: "En proceso",
      categoria: "Infraestructura",
      fecha: "2024-01-15"
    },
    {
      id: 2,
      titulo: "Ruido excesivo nocturno",
      estado: "Pendiente",
      categoria: "Ruido",
      fecha: "2024-01-14"
    },
    {
      id: 3,
      titulo: "Falta de iluminación",
      estado: "Resuelto",
      categoria: "Servicios",
      fecha: "2024-01-13"
    }
  ];

  // Función para navegar a diferentes secciones
  const navegarA = (ruta) => {
    navigate(ruta);
  };

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
            <div className="denuncias-recientes">
              {denunciasRecientes.map((denuncia, index) => (
                <div key={index} className="denuncia-card">
                  <div className="denuncia-header">
                    <h3 className="denuncia-title">{denuncia.titulo}</h3>
                    <span className={`denuncia-estado ${denuncia.estado.toLowerCase().replace(' ', '')}`}>
                      {denuncia.estado}
                    </span>
                  </div>
                  <div className="denuncia-info">
                    <span className="denuncia-categoria">{denuncia.categoria}</span>
                    <span className="denuncia-fecha">{denuncia.fecha}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
