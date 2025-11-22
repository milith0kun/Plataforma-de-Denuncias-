import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  id_tipo_usuario: {
    type: Number,
    required: true,
    enum: [1, 2], // 1: Ciudadano, 2: Autoridad
    default: 1
  },
  nombres: {
    type: String,
    required: true,
    trim: true
  },
  apellidos: {
    type: String,
    required: true,
    trim: true
  },
  documento_identidad: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  telefono: {
    type: String,
    trim: true,
    default: null
  },
  direccion_registro: {
    type: String,
    trim: true,
    default: null
  },
  password_hash: {
    type: String,
    required: true
  },
  // Campos específicos de autoridad
  cargo: {
    type: String,
    trim: true,
    default: null
  },
  area_responsabilidad: {
    type: String,
    trim: true,
    default: null
  },
  numero_empleado: {
    type: String,
    trim: true,
    unique: true,
    sparse: true, // permite múltiples valores null
    default: null
  },
  fecha_ingreso: {
    type: Date,
    default: null
  },
  estado_verificacion: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado'],
    default: 'aprobado'
  },
  // Campos de control
  activo: {
    type: Boolean,
    default: true
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'usuarios'
});

// Índices
usuarioSchema.index({ email: 1 });
usuarioSchema.index({ documento_identidad: 1 });
usuarioSchema.index({ numero_empleado: 1 }, { sparse: true });

// Virtual para nombre completo
usuarioSchema.virtual('nombreCompleto').get(function() {
  return `${this.nombres} ${this.apellidos}`;
});

// Virtual para nombre de tipo de usuario
usuarioSchema.virtual('nombre_tipo').get(function() {
  return this.id_tipo_usuario === 1 ? 'Ciudadano' : 'Autoridad';
});

// Virtual para id_usuario (para compatibilidad con controladores)
usuarioSchema.virtual('id_usuario').get(function() {
  return this._id;
});

// Configurar toJSON para incluir virtuals
usuarioSchema.set('toJSON', { virtuals: true });
usuarioSchema.set('toObject', { virtuals: true });

// Métodos estáticos
usuarioSchema.statics.crear = async function(datosUsuario) {
  const usuario = new this(datosUsuario);
  await usuario.save();
  return usuario._id;
};

usuarioSchema.statics.buscarPorEmail = async function(email) {
  return await this.findOne({ email: email.toLowerCase() });
};

usuarioSchema.statics.buscarPorId = async function(id_usuario) {
  return await this.findById(id_usuario);
};

usuarioSchema.statics.buscarPorDocumento = async function(documento_identidad) {
  return await this.findOne({ documento_identidad });
};

usuarioSchema.statics.emailExiste = async function(email) {
  const count = await this.countDocuments({ email: email.toLowerCase() });
  return count > 0;
};

usuarioSchema.statics.documentoExiste = async function(documento_identidad) {
  const count = await this.countDocuments({ documento_identidad });
  return count > 0;
};

usuarioSchema.statics.numeroEmpleadoExiste = async function(numero_empleado) {
  const count = await this.countDocuments({ numero_empleado });
  return count > 0;
};

usuarioSchema.statics.emailExisteParaOtroUsuario = async function(email, id_usuario) {
  const count = await this.countDocuments({
    email: email.toLowerCase(),
    _id: { $ne: id_usuario }
  });
  return count > 0;
};

usuarioSchema.statics.documentoExisteParaOtroUsuario = async function(documento_identidad, id_usuario) {
  const count = await this.countDocuments({
    documento_identidad,
    _id: { $ne: id_usuario }
  });
  return count > 0;
};

// Métodos de instancia
usuarioSchema.methods.actualizarPerfil = async function(datosActualizacion) {
  const { nombres, apellidos, telefono, direccion } = datosActualizacion;

  if (nombres) this.nombres = nombres;
  if (apellidos) this.apellidos = apellidos;
  if (telefono !== undefined) this.telefono = telefono;
  if (direccion !== undefined) this.direccion_registro = direccion;

  return await this.save();
};

usuarioSchema.methods.cambiarPassword = async function(nuevoPasswordHash) {
  this.password_hash = nuevoPasswordHash;
  return await this.save();
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
