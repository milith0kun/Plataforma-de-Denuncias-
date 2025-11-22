import mongoose from 'mongoose';
import HistorialEstado from './HistorialEstado.js';
import EstadoDenuncia from './EstadoDenuncia.js';

const denunciaSchema = new mongoose.Schema({
  id_ciudadano: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  id_categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  id_estado_actual: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EstadoDenuncia',
    required: true
  },
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion_detallada: {
    type: String,
    required: true,
    trim: true
  },
  latitud: {
    type: Number,
    default: null
  },
  longitud: {
    type: Number,
    default: null
  },
  direccion_geolocalizada: {
    type: String,
    trim: true,
    default: null
  },
  es_anonima: {
    type: Boolean,
    default: false
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  ultima_actualizacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'denuncias'
});

// Índices
denunciaSchema.index({ id_ciudadano: 1 });
denunciaSchema.index({ id_categoria: 1 });
denunciaSchema.index({ id_estado_actual: 1 });
denunciaSchema.index({ fecha_registro: -1 });
denunciaSchema.index({ titulo: 'text', descripcion_detallada: 'text' });

// Virtual para id_denuncia (para compatibilidad con controladores)
denunciaSchema.virtual('id_denuncia').get(function() {
  return this._id;
});

// Configurar toJSON para incluir virtuals
denunciaSchema.set('toJSON', { virtuals: true });
denunciaSchema.set('toObject', { virtuals: true });

// Middleware para actualizar fecha de última actualización
denunciaSchema.pre('save', function(next) {
  this.ultima_actualizacion = new Date();
  next();
});

// Métodos estáticos
denunciaSchema.statics.crear = async function(datosDenuncia) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      id_ciudadano,
      id_categoria,
      titulo,
      descripcion_detallada,
      latitud,
      longitud,
      direccion_geolocalizada,
      es_anonima = false
    } = datosDenuncia;

    // Obtener el estado inicial "Registrada"
    let estadoInicial = await EstadoDenuncia.findOne({ nombre: 'Registrada' });

    // Si no existe el estado, crear uno por defecto
    if (!estadoInicial) {
      estadoInicial = await EstadoDenuncia.create([{
        nombre: 'Registrada',
        descripcion: 'Denuncia registrada en el sistema',
        orden_flujo: 1
      }], { session });
      estadoInicial = estadoInicial[0];
    }

    // Crear la denuncia
    const denuncia = new this({
      id_ciudadano,
      id_categoria,
      id_estado_actual: estadoInicial._id,
      titulo,
      descripcion_detallada,
      latitud: latitud || null,
      longitud: longitud || null,
      direccion_geolocalizada: direccion_geolocalizada || null,
      es_anonima
    });

    await denuncia.save({ session });

    // Registrar el estado inicial en el historial
    await HistorialEstado.create([{
      id_denuncia: denuncia._id,
      id_estado_anterior: null,
      id_estado_nuevo: estadoInicial._id,
      id_usuario_cambio: id_ciudadano,
      comentario: 'Denuncia registrada'
    }], { session });

    await session.commitTransaction();
    return denuncia._id;
  } catch (error) {
    await session.abortTransaction();
    console.error('Error al crear denuncia:', error);
    throw error;
  } finally {
    session.endSession();
  }
};

denunciaSchema.statics.obtenerPorId = async function(id_denuncia) {
  try {
    const denuncia = await this.findById(id_denuncia)
      .populate('id_categoria', 'nombre')
      .populate('id_estado_actual', 'nombre')
      .populate('id_ciudadano', 'nombres apellidos email')
      .lean();

    if (!denuncia) {
      return null;
    }

    // Si es anónima, ocultar datos del ciudadano
    if (denuncia.es_anonima) {
      denuncia.id_ciudadano = {
        nombres: 'Anónimo',
        apellidos: '',
        email: null
      };
    }

    // Renombrar campos para compatibilidad
    if (denuncia.id_categoria) {
      denuncia.categoria_nombre = denuncia.id_categoria.nombre;
    }
    if (denuncia.id_estado_actual) {
      denuncia.estado_nombre = denuncia.id_estado_actual.nombre;
    }
    if (denuncia.id_ciudadano) {
      denuncia.ciudadano_nombres = denuncia.id_ciudadano.nombres;
      denuncia.ciudadano_apellidos = denuncia.id_ciudadano.apellidos;
      denuncia.ciudadano_email = denuncia.id_ciudadano.email;
    }

    return denuncia;
  } catch (error) {
    console.error('Error al obtener denuncia por ID:', error);
    throw error;
  }
};

denunciaSchema.statics.obtenerConFiltros = async function(filtros = {}, paginacion = {}) {
  try {
    const {
      id_ciudadano,
      id_categoria,
      id_estado,
      busqueda,
      fecha_inicio,
      fecha_fin
    } = filtros;

    const {
      pagina = 1,
      limite = 10,
      orden = 'fecha_registro',
      direccion = 'DESC'
    } = paginacion;

    // Construir query
    const query = {};

    if (id_ciudadano) {
      query.id_ciudadano = id_ciudadano;
    }

    if (id_categoria) {
      query.id_categoria = id_categoria;
    }

    if (id_estado) {
      query.id_estado_actual = id_estado;
    }

    if (busqueda) {
      query.$or = [
        { titulo: { $regex: busqueda, $options: 'i' } },
        { descripcion_detallada: { $regex: busqueda, $options: 'i' } }
      ];
    }

    if (fecha_inicio || fecha_fin) {
      query.fecha_registro = {};
      if (fecha_inicio) {
        query.fecha_registro.$gte = new Date(fecha_inicio);
      }
      if (fecha_fin) {
        query.fecha_registro.$lte = new Date(fecha_fin);
      }
    }

    // Contar total
    const total = await this.countDocuments(query);

    // Calcular offset
    const offset = (pagina - 1) * limite;

    // Ordenamiento
    const ordenValidos = ['fecha_registro', 'ultima_actualizacion', 'titulo'];
    const ordenFinal = ordenValidos.includes(orden) ? orden : 'fecha_registro';
    const direccionFinal = direccion.toUpperCase() === 'ASC' ? 1 : -1;

    // Obtener denuncias
    let denuncias = await this.find(query)
      .populate('id_categoria', 'nombre')
      .populate('id_estado_actual', 'nombre')
      .populate('id_ciudadano', 'nombres apellidos')
      .sort({ [ordenFinal]: direccionFinal })
      .skip(offset)
      .limit(parseInt(limite))
      .lean();

    // Procesar denuncias para compatibilidad
    denuncias = denuncias.map(denuncia => {
      if (denuncia.es_anonima) {
        denuncia.id_ciudadano = {
          nombres: 'Anónimo',
          apellidos: ''
        };
      }

      // Renombrar campos
      if (denuncia.id_categoria) {
        denuncia.categoria_nombre = denuncia.id_categoria.nombre;
      }
      if (denuncia.id_estado_actual) {
        denuncia.estado_nombre = denuncia.id_estado_actual.nombre;
      }
      if (denuncia.id_ciudadano) {
        denuncia.ciudadano_nombres = denuncia.id_ciudadano.nombres;
        denuncia.ciudadano_apellidos = denuncia.id_ciudadano.apellidos;
      }

      return denuncia;
    });

    return {
      denuncias,
      total,
      pagina: parseInt(pagina),
      limite: parseInt(limite),
      totalPaginas: Math.ceil(total / limite)
    };
  } catch (error) {
    console.error('Error al obtener denuncias con filtros:', error);
    throw error;
  }
};

denunciaSchema.statics.cambiarEstado = async function(id_denuncia, id_estado_nuevo, id_usuario, comentario) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Obtener denuncia actual
    const denuncia = await this.findById(id_denuncia).session(session);

    if (!denuncia) {
      throw new Error('Denuncia no encontrada');
    }

    const id_estado_anterior = denuncia.id_estado_actual;

    // Actualizar estado
    denuncia.id_estado_actual = id_estado_nuevo;
    denuncia.ultima_actualizacion = new Date();
    await denuncia.save({ session });

    // Registrar en historial
    await HistorialEstado.create([{
      id_denuncia,
      id_estado_anterior,
      id_estado_nuevo,
      id_usuario_cambio: id_usuario,
      comentario
    }], { session });

    await session.commitTransaction();
    return true;
  } catch (error) {
    await session.abortTransaction();
    console.error('Error al cambiar estado:', error);
    throw error;
  } finally {
    session.endSession();
  }
};

denunciaSchema.statics.obtenerHistorialEstados = async function(id_denuncia) {
  try {
    return await HistorialEstado.obtenerPorDenuncia(id_denuncia);
  } catch (error) {
    console.error('Error al obtener historial de estados:', error);
    throw error;
  }
};

denunciaSchema.statics.actualizar = async function(id_denuncia, datos) {
  try {
    const camposPermitidos = ['titulo', 'descripcion_detallada', 'latitud', 'longitud', 'direccion_geolocalizada'];
    const datosActualizacion = {};

    for (const campo of camposPermitidos) {
      if (datos.hasOwnProperty(campo)) {
        datosActualizacion[campo] = datos[campo];
      }
    }

    if (Object.keys(datosActualizacion).length === 0) {
      return false;
    }

    datosActualizacion.ultima_actualizacion = new Date();

    const denuncia = await this.findByIdAndUpdate(
      id_denuncia,
      datosActualizacion,
      { new: true, runValidators: true }
    );

    return denuncia !== null;
  } catch (error) {
    console.error('Error al actualizar denuncia:', error);
    throw error;
  }
};

denunciaSchema.statics.eliminar = async function(id_denuncia) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Importar EvidenciaFoto aquí para evitar dependencias circulares
    const EvidenciaFoto = mongoose.model('EvidenciaFoto');

    // Eliminar evidencias
    await EvidenciaFoto.deleteMany({ id_denuncia }).session(session);

    // Eliminar historial
    await HistorialEstado.deleteMany({ id_denuncia }).session(session);

    // Eliminar denuncia
    const resultado = await this.findByIdAndDelete(id_denuncia).session(session);

    await session.commitTransaction();
    return resultado !== null;
  } catch (error) {
    await session.abortTransaction();
    console.error('Error al eliminar denuncia:', error);
    throw error;
  } finally {
    session.endSession();
  }
};

const Denuncia = mongoose.model('Denuncia', denunciaSchema);

export default Denuncia;
