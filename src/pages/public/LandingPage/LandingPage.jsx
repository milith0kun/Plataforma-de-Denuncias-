import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import Header from '../../../components/common/Header/Header';
import LottieIcon from '../../../components/LottieIcon/LottieIcon';
import '../../../components/LottieIcon/LottieIcon.css';

// Importar animaciones Lottie JSON
import TransparencyIcon from '../../../assets/icons/transparency.json';
import SpeedIcon from '../../../assets/icons/speed.json';
import MobileIcon from '../../../assets/icons/mobile.json';
import SecurityIcon from '../../../assets/icons/security.json';
import InfrastructureIcon from '../../../assets/icons/infrastructure.json';
import CleaningIcon from '../../../assets/icons/cleaning.json';
import TrafficIcon from '../../../assets/icons/traffic.json';
import RecycleIcon from '../../../assets/icons/Recycle.json';
import ServicesIcon from '../../../assets/icons/services.json';
import BuildingsIcon from '../../../assets/icons/buildings.json';

const LandingPage = () => {
  const beneficios = [
    {
      icono: TransparencyIcon,
      titulo: 'Transparencia Total',
      descripcion: 'Seguimiento completo de tu denuncia desde el reporte hasta la resolución'
    },
    {
      icono: SpeedIcon,
      titulo: 'Respuesta Rápida',
      descripcion: 'Las autoridades competentes reciben notificaciones inmediatas'
    },
    {
      icono: MobileIcon,
      titulo: 'Fácil de Usar',
      descripcion: 'Interfaz intuitiva que permite reportar problemas en pocos pasos'
    },
    {
      icono: SecurityIcon,
      titulo: 'Seguro y Confiable',
      descripcion: 'Tus datos están protegidos y puedes reportar de forma anónima'
    }
  ];

  const pasos = [
    {
      numero: '1',
      titulo: 'Reporta el Problema',
      descripcion: 'Describe la situación, agrega fotos y ubica el lugar exacto'
    },
    {
      numero: '2',
      titulo: 'Seguimiento Automático',
      descripcion: 'Recibe un código de seguimiento y notificaciones del progreso'
    },
    {
      numero: '3',
      titulo: 'Resolución',
      descripcion: 'Las autoridades trabajan en la solución y te mantienen informado'
    }
  ];

  const categorias = [
    { icono: InfrastructureIcon, nombre: 'Infraestructura', descripcion: 'Calles, aceras, puentes' },
    { icono: CleaningIcon, nombre: 'Limpieza', descripcion: 'Basura, residuos, reciclaje' },
    { icono: TrafficIcon, nombre: 'Tránsito', descripcion: 'Semáforos, señalización' },
    { icono: RecycleIcon, nombre: 'Medio Ambiente', descripcion: 'Áreas verdes, contaminación' },
    { icono: ServicesIcon, nombre: 'Servicios Públicos', descripcion: 'Alumbrado, agua, electricidad' },
    { icono: BuildingsIcon, nombre: 'Edificaciones', descripcion: 'Construcciones irregulares' }
  ];

  const estadisticas = [
    { numero: '2,847', label: 'Denuncias Resueltas' },
    { numero: '156', label: 'Denuncias Activas' },
    { numero: '89%', label: 'Tasa de Resolución' },
    { numero: '3.2', label: 'Días Promedio' }
  ];

  return (
    <div className="landing-page">
      {/* Header Unificado */}
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Mejora tu Ciudad con Cada Denuncia
            </h1>
            <p className="hero-subtitle">
              Plataforma digital para reportar problemas urbanos y hacer seguimiento 
              hasta su resolución. Tu voz importa para construir una ciudad mejor.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="primary-button">
                Reportar Problema
              </Link>
              <Link to="/login" className="secondary-button">
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {estadisticas.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.numero}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Beneficios */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">¿Por qué usar nuestra plataforma?</h2>
            <p className="section-subtitle">
              Conectamos ciudadanos con autoridades para resolver problemas urbanos de manera eficiente
            </p>
          </div>
          <div className="benefits-grid">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="benefit-card">
                <LottieIcon 
                  src={beneficio.icono} 
                  alt={beneficio.titulo} 
                  className="benefit-icon"
                  width={60}
                  height={60}
                />
                <h3 className="benefit-title">{beneficio.titulo}</h3>
                <p className="benefit-description">{beneficio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">¿Cómo funciona?</h2>
            <p className="section-subtitle">
              Proceso simple y transparente para reportar y resolver problemas urbanos
            </p>
          </div>
          <div className="steps-container">
            {pasos.map((paso, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{paso.numero}</div>
                <h3 className="step-title">{paso.titulo}</h3>
                <p className="step-description">{paso.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Tipos de Problemas que Puedes Reportar</h2>
            <p className="section-subtitle">
              Amplia variedad de categorías para cubrir todos los aspectos urbanos
            </p>
          </div>
          <div className="categories-grid">
            {categorias.map((categoria, index) => (
              <div key={index} className="category-card">
                <LottieIcon 
                  src={categoria.icono} 
                  alt={categoria.nombre} 
                  className="category-icon"
                  width={50}
                  height={50}
                />
                <h3 className="category-name">{categoria.nombre}</h3>
                <p className="category-description">{categoria.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">¿Listo para hacer la diferencia?</h2>
            <p className="cta-subtitle">
              Únete a miles de ciudadanos que ya están mejorando su ciudad
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="primary-button">
                Crear Cuenta Gratis
              </Link>
              <Link to="/seguimiento" className="secondary-button">
                Buscar Denuncia
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <img src="/Establish.svg" alt="Logo" className="logo-icon" />
                <span className="logo-text">DenunciasCiudadanas</span>
              </div>
              <p className="footer-description">
                Plataforma digital para mejorar la comunicación entre ciudadanos y autoridades.
              </p>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">Enlaces Útiles</h4>
              <ul className="footer-links">
                <li><Link to="/login">Iniciar Sesión</Link></li>
                <li><Link to="/register">Registrarse</Link></li>
                <li><Link to="/seguimiento">Seguimiento</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">Contacto</h4>
              <p>Email: info@denunciasciudadanas.gov</p>
              <p>Teléfono: (01) 234-5678</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 DenunciasCiudadanas. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;