import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({
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
  area_responsable_sugerida: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'categorias'
});

// Índices
categoriaSchema.index({ nombre: 1 });

// Virtual para id_categoria (para compatibilidad con controladores)
categoriaSchema.virtual('id_categoria').get(function() {
  return this._id;
});

// Configurar toJSON para incluir virtuals
categoriaSchema.set('toJSON', { virtuals: true });
categoriaSchema.set('toObject', { virtuals: true });

// Métodos estáticos
categoriaSchema.statics.obtenerTodas = async function() {
  return await this.find().sort({ nombre: 1 });
};

categoriaSchema.statics.obtenerPorId = async function(id_categoria) {
  return await this.findById(id_categoria);
};

categoriaSchema.statics.crear = async function(datos) {
  const categoria = new this(datos);
  return await categoria.save();
};

categoriaSchema.statics.actualizar = async function(id_categoria, datos) {
  const categoria = await this.findByIdAndUpdate(
    id_categoria,
    datos,
    { new: true, runValidators: true }
  );
  return categoria;
};

const Categoria = mongoose.model('Categoria', categoriaSchema);

export default Categoria;
