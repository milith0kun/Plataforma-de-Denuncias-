import db from '../config/database.js';

/**
 * Obtener estadísticas generales del sistema
 */
export const obtenerEstadisticasGenerales = async (req, res) => {
  try {
    const idUsuario = req.usuario.id_usuario;
    const tipoUsuario = req.usuario.tipo_usuario_id;

    // Si es ciudadano, solo sus denuncias; si es autoridad/admin, todas
    const whereCiudadano = tipoUsuario === 1 ? 'WHERE d.id_usuario_denunciante = ?' : '';
    const params = tipoUsuario === 1 ? [idUsuario] : [];

    // Total de denuncias
    const [totalResult] = await db.query(
      `SELECT COUNT(*) as total FROM denuncias d ${whereCiudadano}`,
      params
    );
    const total = totalResult[0].total;

    // Por estado
    const [porEstado] = await db.query(
      `SELECT
        e.nombre as estado,
        COUNT(d.id_denuncia) as cantidad
      FROM denuncias d
      INNER JOIN estados e ON d.id_estado_actual = e.id_estado
      ${whereCiudadano}
      GROUP BY e.id_estado, e.nombre
      ORDER BY e.id_estado`,
      params
    );

    // Por categoría
    const [porCategoria] = await db.query(
      `SELECT
        c.nombre as categoria,
        COUNT(d.id_denuncia) as cantidad
      FROM denuncias d
      INNER JOIN categorias c ON d.id_categoria = c.id_categoria
      ${whereCiudadano}
      GROUP BY c.id_categoria, c.nombre
      ORDER BY cantidad DESC`,
      params
    );

    // Tendencia mensual (últimos 6 meses)
    const [tendenciaMensual] = await db.query(
      `SELECT
        DATE_FORMAT(d.fecha_registro, '%Y-%m') as mes,
        COUNT(d.id_denuncia) as cantidad
      FROM denuncias d
      ${whereCiudadano}
      ${whereCiudadano ? 'AND' : 'WHERE'} d.fecha_registro >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY mes
      ORDER BY mes ASC`,
      params
    );

    // Prioridad de denuncias (si el campo existe)
    const [porPrioridad] = await db.query(
      `SELECT
        COALESCE(d.prioridad, 'Sin asignar') as prioridad,
        COUNT(d.id_denuncia) as cantidad
      FROM denuncias d
      ${whereCiudadano}
      GROUP BY prioridad
      ORDER BY
        CASE
          WHEN d.prioridad = 'Alta' THEN 1
          WHEN d.prioridad = 'Media' THEN 2
          WHEN d.prioridad = 'Baja' THEN 3
          ELSE 4
        END`,
      params
    );

    res.json({
      success: true,
      data: {
        total,
        porEstado,
        porCategoria,
        tendenciaMensual,
        porPrioridad
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas generales:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener estadísticas',
        details: error.message
      }
    });
  }
};

/**
 * Obtener estadísticas por categoría específica
 */
export const obtenerEstadisticasPorCategoria = async (req, res) => {
  try {
    const { idCategoria } = req.params;
    const idUsuario = req.usuario.id_usuario;
    const tipoUsuario = req.usuario.tipo_usuario_id;

    const whereCiudadano = tipoUsuario === 1
      ? 'AND d.id_usuario_denunciante = ?'
      : '';
    const params = tipoUsuario === 1
      ? [idCategoria, idUsuario]
      : [idCategoria];

    // Estadísticas de la categoría
    const [stats] = await db.query(
      `SELECT
        c.nombre as categoria,
        COUNT(d.id_denuncia) as total,
        SUM(CASE WHEN e.nombre IN ('Registrada', 'En Revisión') THEN 1 ELSE 0 END) as pendientes,
        SUM(CASE WHEN e.nombre IN ('Asignada', 'En Proceso') THEN 1 ELSE 0 END) as enProceso,
        SUM(CASE WHEN e.nombre = 'Resuelta' THEN 1 ELSE 0 END) as resueltas,
        AVG(DATEDIFF(COALESCE(d.fecha_resolucion, NOW()), d.fecha_registro)) as tiempoPromedioResolucion
      FROM denuncias d
      INNER JOIN categorias c ON d.id_categoria = c.id_categoria
      LEFT JOIN estados e ON d.id_estado_actual = e.id_estado
      WHERE d.id_categoria = ? ${whereCiudadano}
      GROUP BY c.id_categoria, c.nombre`,
      params
    );

    if (stats.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Categoría no encontrada o sin denuncias' }
      });
    }

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Error al obtener estadísticas por categoría:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener estadísticas de categoría',
        details: error.message
      }
    });
  }
};

/**
 * Obtener resumen rápido para dashboard
 */
export const obtenerResumen = async (req, res) => {
  try {
    const idUsuario = req.usuario.id_usuario;
    const tipoUsuario = req.usuario.tipo_usuario_id;

    const whereCiudadano = tipoUsuario === 1 ? 'WHERE d.id_usuario_denunciante = ?' : '';
    const params = tipoUsuario === 1 ? [idUsuario] : [];

    const [resumen] = await db.query(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN e.nombre IN ('Registrada', 'En Revisión') THEN 1 ELSE 0 END) as pendientes,
        SUM(CASE WHEN e.nombre IN ('Asignada', 'En Proceso') THEN 1 ELSE 0 END) as enProceso,
        SUM(CASE WHEN e.nombre = 'Resuelta' THEN 1 ELSE 0 END) as resueltas,
        SUM(CASE WHEN e.nombre = 'Cerrada' THEN 1 ELSE 0 END) as cerradas,
        SUM(CASE WHEN d.fecha_registro >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as ultimaSemana,
        SUM(CASE WHEN d.fecha_registro >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as ultimoMes
      FROM denuncias d
      LEFT JOIN estados e ON d.id_estado_actual = e.id_estado
      ${whereCiudadano}`,
      params
    );

    res.json({
      success: true,
      data: resumen[0]
    });
  } catch (error) {
    console.error('Error al obtener resumen:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener resumen',
        details: error.message
      }
    });
  }
};

export default {
  obtenerEstadisticasGenerales,
  obtenerEstadisticasPorCategoria,
  obtenerResumen
};
