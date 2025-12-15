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

      {/* Footer Mejorado */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            {/* Sección Principal */}
            <div className="footer-section footer-main">
              <div className="footer-logo">
                <div className="footer-logo-container">
                  <span className="footer-logo-top">Denuncias</span>
                  <span className="footer-logo-bottom">Ciudadanas</span>
                </div>
              </div>
              <p className="footer-description">
                Conectamos ciudadanos con autoridades para construir comunidades más seguras y mejores.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Enlaces Rápidos */}
            <div className="footer-section">
              <h4 className="footer-title">Acceso Rápido</h4>
              <ul className="footer-links">
                <li><Link to="/login">Iniciar Sesión</Link></li>
                <li><Link to="/register">Registrarse</Link></li>
                <li><Link to="/register-authority">Registro Autoridad</Link></li>
                <li><Link to="/seguimiento">Seguir Denuncia</Link></li>
              </ul>
            </div>

            {/* Recursos */}
            <div className="footer-section">
              <h4 className="footer-title">Recursos</h4>
              <ul className="footer-links">
                <li><a href="#how-it-works">Cómo Funciona</a></li>
                <li><a href="#categories">Categorías</a></li>
                <li><a href="#faq">Preguntas Frecuentes</a></li>
                <li><a href="#terms">Términos y Condiciones</a></li>
              </ul>
            </div>

            {/* Contacto */}
            <div className="footer-section">
              <h4 className="footer-title">Contacto</h4>
              <div className="footer-contact">
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>info@denunciasciudadanas.gov</span>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span>(01) 234-5678</span>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Lima, Perú</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="footer-copyright">
                &copy; 2025 <strong>Denuncias Ciudadanas</strong>. Todos los derechos reservados.
              </p>
              <div className="footer-bottom-links">
                <a href="#privacy">Política de Privacidad</a>
                <span className="separator">•</span>
                <a href="#cookies">Cookies</a>
                <span className="separator">•</span>
                <a href="#legal">Aviso Legal</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;