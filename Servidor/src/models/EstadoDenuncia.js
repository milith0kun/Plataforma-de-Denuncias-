import mongoose from 'mongoose';

const estadoDenunciaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true,
    default: ''
  },
  orden_flujo: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'estados_denuncia'
});

// Índices
estadoDenunciaSchema.index({ nombre: 1 });
estadoDenunciaSchema.index({ orden_flujo: 1 });

// Virtual para id_estado (para compatibilidad con controladores)
estadoDenunciaSchema.virtual('id_estado').get(function() {
  return this._id;
});

// Configurar toJSON para incluir virtuals
estadoDenunciaSchema.set('toJSON', { virtuals: true });
estadoDenunciaSchema.set('toObject', { virtuals: true });

// Métodos estáticos
estadoDenunciaSchema.statics.obtenerTodos = async function() {
  return await this.find().sort({ orden_flujo: 1 });
};

estadoDenunciaSchema.statics.obtenerPorId = async function(id_estado) {
  return await this.findById(id_estado);
};

estadoDenunciaSchema.statics.obtenerPorNombre = async function(nombre) {
  return await this.findOne({ nombre });
};

estadoDenunciaSchema.statics.esTransicionValida = async function(id_estado_actual, id_estado_nuevo) {
  try {
    const estadoActual = await this.findById(id_estado_actual);
    const estadoNuevo = await this.findById(id_estado_nuevo);

    if (!estadoActual || !estadoNuevo) {
      return false;
    }

    // Permitir transición si el nuevo estado está en un rango razonable
    return estadoNuevo.orden_flujo >= estadoActual.orden_flujo - 10 &&
           estadoNuevo.orden_flujo <= estadoActual.orden_flujo + 20;
  } catch (error) {
    console.error('Error al validar transición:', error);
    return false;
  }
};

const EstadoDenuncia = mongoose.model('EstadoDenuncia', estadoDenunciaSchema);

export default EstadoDenuncia;
