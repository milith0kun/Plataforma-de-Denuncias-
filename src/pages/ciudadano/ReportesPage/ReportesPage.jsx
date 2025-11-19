import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import Header from '../../../components/common/Header/Header';
import estadisticasService from '../../../services/estadisticasService';
import styles from './ReportesPage.module.css';

// Colores para gráficos
const COLORS_ESTADO = ['#f59e0b', '#3b82f6', '#10b981', '#6b7280'];
const COLORS_CATEGORIA = ['#153595', '#A5C1EB', '#03193B', '#10b981', '#f59e0b', '#ef4444'];

const ReportesPage = () => {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await estadisticasService.obtenerEstadisticasGenerales();
      if (response.success) {
        setEstadisticas(response.data);
      }
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
      setError(err.message || 'Error al cargar las estadísticas');
    } finally {
      setCargando(false);
    }
  };

  // Preparar datos para el gráfico de líneas de tendencia
  const prepararDatosTendencia = () => {
    if (!estadisticas?.tendenciaMensual) return [];
    return estadisticas.tendenciaMensual.map(item => ({
      mes: new Date(item.mes + '-01').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
      cantidad: item.cantidad
    }));
  };

  if (cargando) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando estadísticas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>⚠️ {error}</p>
            <button onClick={cargarEstadisticas} className={styles.retryBtn}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Reportes y Estadísticas</h1>
          <p className={styles.subtitle}>
            Análisis visual de las denuncias registradas
          </p>
        </div>

        {/* Resumen general */}
        <div className={styles.resumenGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Total de Denuncias</span>
              <span className={styles.statValue}>{estadisticas?.total || 0}</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏳</div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Pendientes</span>
              <span className={styles.statValue}>
                {estadisticas?.porEstado?.find(e => e.estado.includes('Registrada') || e.estado.includes('Revisión'))?.cantidad || 0}
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⚙️</div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>En Proceso</span>
              <span className={styles.statValue}>
                {estadisticas?.porEstado?.find(e => e.estado.includes('Proceso') || e.estado.includes('Asignada'))?.cantidad || 0}
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Resueltas</span>
              <span className={styles.statValue}>
                {estadisticas?.porEstado?.find(e => e.estado.includes('Resuelta'))?.cantidad || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className={styles.chartsGrid}>
          {/* Gráfico de barras por estado */}
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Denuncias por Estado</h2>
            {estadisticas?.porEstado && estadisticas.porEstado.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={estadisticas.porEstado}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="estado" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cantidad" fill="#153595" name="Cantidad de denuncias">
                    {estadisticas.porEstado.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_ESTADO[index % COLORS_ESTADO.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className={styles.noData}>No hay datos disponibles</p>
            )}
          </div>

          {/* Gráfico de pastel por categoría */}
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Denuncias por Categoría</h2>
            {estadisticas?.porCategoria && estadisticas.porCategoria.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={estadisticas.porCategoria}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ categoria, percent }) => `${categoria}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="cantidad"
                  >
                    {estadisticas.porCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_CATEGORIA[index % COLORS_CATEGORIA.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className={styles.noData}>No hay datos disponibles</p>
            )}
          </div>

          {/* Gráfico de líneas - Tendencia temporal */}
          <div className={`${styles.chartCard} ${styles.chartCardFull}`}>
            <h2 className={styles.chartTitle}>Tendencia de Denuncias (Últimos 6 Meses)</h2>
            {prepararDatosTendencia().length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={prepararDatosTendencia()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cantidad"
                    stroke="#153595"
                    strokeWidth={2}
                    name="Denuncias registradas"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className={styles.noData}>No hay datos disponibles</p>
            )}
          </div>

          {/* Tabla de categorías */}
          <div className={`${styles.chartCard} ${styles.chartCardFull}`}>
            <h2 className={styles.chartTitle}>Detalle por Categoría</h2>
            {estadisticas?.porCategoria && estadisticas.porCategoria.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Categoría</th>
                      <th className={styles.textCenter}>Cantidad</th>
                      <th className={styles.textCenter}>Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estadisticas.porCategoria.map((cat, index) => {
                      const porcentaje = ((cat.cantidad / estadisticas.total) * 100).toFixed(1);
                      return (
                        <tr key={index}>
                          <td>{cat.categoria}</td>
                          <td className={styles.textCenter}>{cat.cantidad}</td>
                          <td className={styles.textCenter}>{porcentaje}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.noData}>No hay datos disponibles</p>
            )}
          </div>
        </div>

        {/* Botón de volver */}
        <div className={styles.actions}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportesPage;
