import mongoose from 'mongoose';

const comentarioSchema = new mongoose.Schema({
  id_denuncia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Denuncia',
    required: true
  },
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  comentario: {
    type: String,
    required: true,
    trim: true
  },
  es_interno: {
    type: Boolean,
    default: false
  },
  fecha_comentario: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'comentarios'
});

// Índices
comentarioSchema.index({ id_denuncia: 1, fecha_comentario: -1 });
comentarioSchema.index({ id_usuario: 1 });

// Métodos estáticos
comentarioSchema.statics.crear = async function(datosComentario) {
  try {
    const comentario = new this(datosComentario);
    await comentario.save();

    // Obtener el comentario completo con populate
    return await this.obtenerPorId(comentario._id);
  } catch (error) {
    throw error;
  }
};

comentarioSchema.statics.obtenerPorId = async function(id) {
  try {
    return await this.findById(id)
      .populate('id_usuario', 'nombres apellidos id_tipo_usuario')
      .lean();
  } catch (error) {
    throw error;
  }
};

comentarioSchema.statics.obtenerPorDenuncia = async function(idDenuncia, incluirInternos = false) {
  try {
    const query = { id_denuncia: idDenuncia };

    // Si no se incluyen internos, filtrar
    if (!incluirInternos) {
      query.es_interno = false;
    }

    const comentarios = await this.find(query)
      .populate('id_usuario', 'nombres apellidos id_tipo_usuario')
      .sort({ fecha_comentario: -1 })
      .lean();

    // Agregar campo tipo_usuario para compatibilidad
    return comentarios.map(comentario => ({
      ...comentario,
      id_comentario: comentario._id,
      tipo_usuario_id: comentario.id_usuario?.id_tipo_usuario,
      tipo_usuario: comentario.id_usuario?.id_tipo_usuario === 1 ? 'Ciudadano' : 'Autoridad',
      nombres: comentario.id_usuario?.nombres,
      apellidos: comentario.id_usuario?.apellidos
    }));
  } catch (error) {
    throw error;
  }
};

comentarioSchema.statics.actualizar = async function(id, nuevoComentario) {
  try {
    await this.findByIdAndUpdate(
      id,
      { comentario: nuevoComentario },
      { new: true }
    );

    return await this.obtenerPorId(id);
  } catch (error) {
    throw error;
  }
};

comentarioSchema.statics.eliminar = async function(id) {
  try {
    const resultado = await this.findByIdAndDelete(id);
    return resultado !== null;
  } catch (error) {
    throw error;
  }
};

comentarioSchema.statics.perteneceAUsuario = async function(idComentario, idUsuario) {
  try {
    const comentario = await this.findOne({
      _id: idComentario,
      id_usuario: idUsuario
    });
    return comentario !== null;
  } catch (error) {
    throw error;
  }
};

comentarioSchema.statics.obtenerEstadisticas = async function(idDenuncia) {
  try {
    const estadisticas = await this.aggregate([
      { $match: { id_denuncia: new mongoose.Types.ObjectId(idDenuncia) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          publicos: {
            $sum: { $cond: [{ $eq: ['$es_interno', false] }, 1, 0] }
          },
          internos: {
            $sum: { $cond: [{ $eq: ['$es_interno', true] }, 1, 0] }
          },
          primer_comentario: { $min: '$fecha_comentario' },
          ultimo_comentario: { $max: '$fecha_comentario' }
        }
      }
    ]);

    if (estadisticas.length === 0) {
      return {
        total: 0,
        publicos: 0,
        internos: 0,
        primer_comentario: null,
        ultimo_comentario: null
      };
    }

    return estadisticas[0];
  } catch (error) {
    throw error;
  }
};

const Comentario = mongoose.model('Comentario', comentarioSchema);

export default Comentario;
