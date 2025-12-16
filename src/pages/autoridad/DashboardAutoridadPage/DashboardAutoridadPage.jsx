import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  LayoutDashboard, FileText, AlertCircle, CheckCircle2, 
  Clock, TrendingUp, Users, MapPin, Filter, Calendar,
  BarChart3, Download, Menu, X, Activity, ChevronRight, Eye
} from 'lucide-react';
import Header from '../../../components/common/Header/Header';
import denunciaService from '../../../services/denunciaService';
import estadisticasService from '../../../services/estadisticasService';
import styles from './DashboardAutoridadPageNew.module.css';

const DashboardAutoridadPage = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [metricas, setMetricas] = useState({
    total: 0,
    pendientes: 0,
    enProceso: 0,
    resueltas: 0,
    urgentes: 0
  });
  const [estadisticas, setEstadisticas] = useState(null);
  const [denunciasRecientes, setDenunciasRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroTiempo, setFiltroTiempo] = useState('mes');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const [denunciasRes, statsRes] = await Promise.all([
        denunciaService.obtenerDenuncias({ limite: 100, orden: 'fecha_registro', direccion: 'DESC' }),
        estadisticasService.obtenerEstadisticasGenerales().catch(() => null)
      ]);

      if (denunciasRes.success) {
        const denuncias = denunciasRes.data.denuncias;
        
        const pendientes = denuncias.filter(d => ['Registrada', 'En Revisión'].includes(d.estado_nombre)).length;
        const enProceso = denuncias.filter(d => ['Asignada', 'En Proceso'].includes(d.estado_nombre)).length;
        const resueltas = denuncias.filter(d => d.estado_nombre === 'Resuelta').length;
        const urgentes = denuncias.filter(d => {
          const dias = Math.floor((new Date() - new Date(d.fecha_registro)) / (1000 * 60 * 60 * 24));
          return ['Registrada', 'En Revisión'].includes(d.estado_nombre) && dias > 7;
        }).length;

        setMetricas({
          total: denuncias.length,
          pendientes,
          enProceso,
          resueltas,
          urgentes
        });

        setDenunciasRecientes(denuncias.slice(0, 8));
      }

      if (statsRes?.success) {
        setEstadisticas(statsRes.data);
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const obtenerColorEstado = (estado) => {
    const colores = {
      'Registrada': '#f59e0b',
      'En Revisión': '#f59e0b',
      'Asignada': '#8b5cf6',
      'En Proceso': '#3b82f6',
      'Resuelta': '#10b981',
      'Cerrada': '#6b7280'
    };
    return colores[estado] || '#6b7280';
  };

  const datosEstados = estadisticas?.porEstado || [];
  const datosCategorias = estadisticas?.porCategoria?.slice(0, 5) || [];
  const datosTendencia = estadisticas?.tendenciaMensual || [];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (cargando) {
    return (
      <>
        <Header variant="private" />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header variant="private" />
      <div className={styles.dashboardContainer}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.collapsed : ''}`}>
          <div className={styles.sidebarHeader}>
            <button className={styles.toggleButton} onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} />
            </button>
          </div>
          
          <nav className={styles.sidebarNav}>
            <a href="#dashboard" className={styles.navItem}>
              <LayoutDashboard size={20} />
              {sidebarOpen && <span>Dashboard</span>}
            </a>
            <a href="/denuncias" className={styles.navItem}>
              <FileText size={20} />
              {sidebarOpen && <span>Denuncias</span>}
            </a>
            <a href="/mapa-denuncias" className={styles.navItem}>
              <MapPin size={20} />
              {sidebarOpen && <span>Mapa</span>}
            </a>
            <a href="/usuarios" className={styles.navItem}>
              <Users size={20} />
              {sidebarOpen && <span>Usuarios</span>}
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Dashboard Header */}
          <div className={styles.dashboardHeader}>
            <div className={styles.headerLeft}>
              <h1 className={styles.dashboardTitle}>Dashboard de Autoridad</h1>
              <p className={styles.dashboardSubtitle}>
                Bienvenido, {usuario?.nombres} {usuario?.apellidos} - {usuario?.cargo}
              </p>
            </div>
            <div className={styles.headerRight}>
              <select 
                className={styles.filterSelect}
                value={filtroTiempo}
                onChange={(e) => setFiltroTiempo(e.target.value)}
              >
                <option value="hoy">Hoy</option>
                <option value="semana">Esta Semana</option>
                <option value="mes">Este Mes</option>
                <option value="año">Este Año</option>
              </select>
              <button className={styles.exportButton}>
                <Download size={18} />
                <span>Exportar</span>
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard} data-type="primary">
              <div className={styles.metricHeader}>
                <Clock size={24} />
                <span className={styles.metricLabel}>Total</span>
              </div>
              <p className={styles.metricValue}>{metricas.total}</p>
              <p className={styles.metricChange}>Denuncias registradas</p>
            </div>

            <div className={styles.metricCard} data-type="warning">
              <div className={styles.metricHeader}>
                <AlertCircle size={24} />
                <span className={styles.metricLabel}>Pendientes</span>
              </div>
              <p className={styles.metricValue}>{metricas.pendientes}</p>
              <p className={styles.metricChange}>Requieren atención</p>
            </div>

            <div className={styles.metricCard} data-type="info">
              <div className={styles.metricHeader}>
                <TrendingUp size={24} />
                <span className={styles.metricLabel}>En Proceso</span>
              </div>
              <p className={styles.metricValue}>{metricas.enProceso}</p>
              <p className={styles.metricChange}>En gestión activa</p>
            </div>

            <div className={styles.metricCard} data-type="success">
              <div className={styles.metricHeader}>
                <CheckCircle2 size={24} />
                <span className={styles.metricLabel}>Resueltas</span>
              </div>
              <p className={styles.metricValue}>{metricas.resueltas}</p>
              <p className={styles.metricChange}>Completadas</p>
            </div>
          </div>

          {/* Charts Grid */}
          {estadisticas && (
            <div className={styles.chartsGrid}>
              {/* Tendencia Mensual */}
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>
                  <TrendingUp size={20} />
                  Tendencia Mensual
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={datosTendencia}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="mes" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px' 
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="cantidad" stroke="#3b82f6" strokeWidth={2} name="Denuncias" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Distribución por Estado */}
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>
                  <Activity size={20} />
                  Distribución por Estado
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={datosEstados}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {datosEstados.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Denuncias por Categoría */}
              <div className={styles.chartCard} style={{ gridColumn: 'span 2' }}>
                <h3 className={styles.chartTitle}>
                  <BarChart3 size={20} />
                  Denuncias por Categoría
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosCategorias}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px' 
                      }} 
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Recent Denuncias Table */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h3 className={styles.tableTitle}>
                <FileText size={20} />
                Denuncias Recientes
              </h3>
              <a href="/denuncias" className={styles.viewAllLink}>
                Ver todas
                <ChevronRight size={16} />
              </a>
            </div>

            <div className={styles.tableWrapper}>
              {denunciasRecientes.length === 0 ? (
                <div className={styles.emptyState}>
                  <FileText size={48} />
                  <p>No hay denuncias recientes</p>
                </div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Categoría</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {denunciasRecientes.map((denuncia) => (
                      <tr key={denuncia.id_denuncia}>
                        <td>
                          <div className={styles.cellContent}>
                            <strong>{denuncia.titulo}</strong>
                          </div>
                        </td>
                        <td>
                          <span className={styles.categoryBadge}>
                            {denuncia.categoria_nombre}
                          </span>
                        </td>
                        <td>
                          <span 
                            className={styles.statusBadge}
                            style={{ backgroundColor: obtenerColorEstado(denuncia.estado_nombre) }}
                          >
                            {denuncia.estado_nombre}
                          </span>
                        </td>
                        <td>{formatearFecha(denuncia.fecha_registro)}</td>
                        <td>
                          <button
                            className={styles.actionButton}
                            onClick={() => window.location.href = `/denuncias/${denuncia.id_denuncia}`}
                          >
                            <Eye size={16} />
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardAutoridadPage;