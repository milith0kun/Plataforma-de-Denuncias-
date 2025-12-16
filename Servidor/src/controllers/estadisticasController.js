import Denuncia from '../models/Denuncia.js';
import Categoria from '../models/Categoria.js';
import EstadoDenuncia from '../models/EstadoDenuncia.js';

/**
 * Obtener estadísticas generales del sistema
 */
export const obtenerEstadisticasGenerales = async (req, res) => {
  try {
    const idUsuario = req.usuario.id_usuario;
    const tipoUsuario = req.usuario.id_tipo_usuario;

    // Filtro basado en tipo de usuario
    const filtro = tipoUsuario === 1 ? { id_ciudadano: idUsuario } : {};

    // Obtener todas las denuncias con populate
    const denuncias = await Denuncia.find(filtro)
      .populate('id_categoria', 'nombre')
      .populate('id_estado_actual', 'nombre')
      .lean();

    // Total de denuncias
    const total = denuncias.length;

    // Por estado
    const estadosMap = {};
    denuncias.forEach(d => {
      const estado = d.id_estado_actual?.nombre || 'Sin estado';
      estadosMap[estado] = (estadosMap[estado] || 0) + 1;
    });
    const porEstado = Object.entries(estadosMap).map(([estado, cantidad]) => ({
      estado,
      cantidad
    }));

    // Por categoría
    const categoriasMap = {};
    denuncias.forEach(d => {
      const categoria = d.id_categoria?.nombre || 'Sin categoría';
      categoriasMap[categoria] = (categoriasMap[categoria] || 0) + 1;
    });
    const porCategoria = Object.entries(categoriasMap)
      .map(([categoria, cantidad]) => ({ categoria, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    // Tendencia mensual (últimos 6 meses)
    const seiseMesesAtras = new Date();
    seiseMesesAtras.setMonth(seiseMesesAtras.getMonth() - 6);
    
    const mesesMap = {};
    denuncias
      .filter(d => new Date(d.fecha_registro) >= seiseMesesAtras)
      .forEach(d => {
        const fecha = new Date(d.fecha_registro);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        mesesMap[mes] = (mesesMap[mes] || 0) + 1;
      });
    
    const tendenciaMensual = Object.entries(mesesMap)
      .map(([mes, cantidad]) => ({ mes, cantidad }))
      .sort((a, b) => a.mes.localeCompare(b.mes));

    res.json({
      success: true,
      data: {
        total,
        porEstado,
        porCategoria,
        tendenciaMensual
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
    const tipoUsuario = req.usuario.id_tipo_usuario;

    const filtro = { id_categoria: idCategoria };
    if (tipoUsuario === 1) {
      filtro.id_ciudadano = idUsuario;
    }

    const denuncias = await Denuncia.find(filtro)
      .populate('id_estado_actual', 'nombre')
      .lean();

    const categoria = await Categoria.obtenerPorId(idCategoria);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        error: { message: 'Categoría no encontrada' }
      });
    }

    const total = denuncias.length;
    const pendientes = denuncias.filter(d => 
      ['Registrada', 'En Revisión'].includes(d.id_estado_actual?.nombre)
    ).length;
    const enProceso = denuncias.filter(d => 
      ['Asignada', 'En Proceso'].includes(d.id_estado_actual?.nombre)
    ).length;
    const resueltas = denuncias.filter(d => 
      d.id_estado_actual?.nombre === 'Resuelta'
    ).length;

    res.json({
      success: true,
      data: {
        categoria: categoria.nombre,
        total,
        pendientes,
        enProceso,
        resueltas
      }
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
    const tipoUsuario = req.usuario.id_tipo_usuario;

    const filtro = tipoUsuario === 1 ? { id_ciudadano: idUsuario } : {};

    const denuncias = await Denuncia.find(filtro)
      .populate('id_estado_actual', 'nombre')
      .lean();

    const ahora = new Date();
    const hace7Dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
    const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);

    const resumen = {
      total: denuncias.length,
      pendientes: denuncias.filter(d => 
        ['Registrada', 'En Revisión'].includes(d.id_estado_actual?.nombre)
      ).length,
      enProceso: denuncias.filter(d => 
        ['Asignada', 'En Proceso'].includes(d.id_estado_actual?.nombre)
      ).length,
      resueltas: denuncias.filter(d => 
        d.id_estado_actual?.nombre === 'Resuelta'
      ).length,
      cerradas: denuncias.filter(d => 
        d.id_estado_actual?.nombre === 'Cerrada'
      ).length,
      ultimaSemana: denuncias.filter(d => 
        new Date(d.fecha_registro) >= hace7Dias
      ).length,
      ultimoMes: denuncias.filter(d => 
        new Date(d.fecha_registro) >= hace30Dias
      ).length
    };

    res.json({
      success: true,
      data: resumen
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
