import mongoose from 'mongoose';

const historialEstadoSchema = new mongoose.Schema({
  id_denuncia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Denuncia',
    required: true
  },
  id_estado_anterior: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EstadoDenuncia',
    default: null
  },
  id_estado_nuevo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EstadoDenuncia',
    required: true
  },
  id_usuario_cambio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  comentario: {
    type: String,
    trim: true,
    default: ''
  },
  fecha_cambio: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'historial_estados'
});

// Índices
historialEstadoSchema.index({ id_denuncia: 1, fecha_cambio: -1 });
historialEstadoSchema.index({ id_usuario_cambio: 1 });

// Métodos estáticos
historialEstadoSchema.statics.crear = async function(datos) {
  const historial = new this(datos);
  return await historial.save();
};

historialEstadoSchema.statics.obtenerPorDenuncia = async function(id_denuncia) {
  return await this.find({ id_denuncia })
    .populate('id_estado_anterior', 'nombre')
    .populate('id_estado_nuevo', 'nombre')
    .populate('id_usuario_cambio', 'nombres apellidos')
    .sort({ fecha_cambio: 1 });
};

const HistorialEstado = mongoose.model('HistorialEstado', historialEstadoSchema);

export default HistorialEstado;
