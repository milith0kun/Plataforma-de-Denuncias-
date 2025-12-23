import mongoose from 'mongoose';

const evidenciaFotoSchema = new mongoose.Schema({
  id_denuncia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Denuncia',
    required: true
  },
  url_archivo: {
    type: String,
    required: true,
    trim: true
  },
  nombre_archivo: {
    type: String,
    trim: true,
    default: ''
  },
  fecha_carga: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'evidencias_foto'
});

// Índices
evidenciaFotoSchema.index({ id_denuncia: 1 });
evidenciaFotoSchema.index({ fecha_carga: -1 });

// Virtual para id_evidencia (para compatibilidad con controladores)
evidenciaFotoSchema.virtual('id_evidencia').get(function () {
  return this._id;
});

// Virtual para url y ruta (para compatibilidad con el frontend)
evidenciaFotoSchema.virtual('url').get(function () {
  return this.url_archivo;
});

evidenciaFotoSchema.virtual('ruta').get(function () {
  return this.url_archivo;
});

// Configurar toJSON para incluir virtuals
evidenciaFotoSchema.set('toJSON', { virtuals: true });
evidenciaFotoSchema.set('toObject', { virtuals: true });

// Métodos estáticos
evidenciaFotoSchema.statics.crear = async function (datosEvidencia) {
  const evidencia = new this(datosEvidencia);
  return await evidencia.save();
};

evidenciaFotoSchema.statics.crearMultiples = async function (id_denuncia, evidencias) {
  const evidenciasConDenuncia = evidencias.map(ev => ({
    ...ev,
    id_denuncia
  }));
  return await this.insertMany(evidenciasConDenuncia);
};

evidenciaFotoSchema.statics.obtenerPorDenuncia = async function (id_denuncia) {
  return await this.find({ id_denuncia }).sort({ fecha_carga: 1 });
};

evidenciaFotoSchema.statics.obtenerPorId = async function (id_evidencia) {
  return await this.findById(id_evidencia);
};

evidenciaFotoSchema.statics.eliminar = async function (id_evidencia) {
  const evidencia = await this.findById(id_evidencia);
  if (!evidencia) {
    throw new Error('Evidencia no encontrada');
  }

  const url_archivo = evidencia.url_archivo;
  await evidencia.deleteOne();

  return {
    success: true,
    url_archivo
  };
};

evidenciaFotoSchema.statics.eliminarPorDenuncia = async function (id_denuncia) {
  const evidencias = await this.find({ id_denuncia });
  const urls = evidencias.map(e => e.url_archivo);

  await this.deleteMany({ id_denuncia });

  return urls;
};

evidenciaFotoSchema.statics.contarPorDenuncia = async function (id_denuncia) {
  return await this.countDocuments({ id_denuncia });
};

const EvidenciaFoto = mongoose.model('EvidenciaFoto', evidenciaFotoSchema);

export default EvidenciaFoto;
