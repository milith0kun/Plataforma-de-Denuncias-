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
    trim: true
  },
  email: {
    type: String,
    required: true,
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
    required: function () {
      // Solo requerido si no hay google_id
      return !this.google_id;
    }
  },
  // Campos de autenticación externa
  google_id: {
    type: String,
    sparse: true,
    default: null
  },
  foto_perfil: {
    type: String,
    default: null
  },
  verificado_email: {
    type: Boolean,
    default: false
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

// Índices únicos (declarados solo una vez)
usuarioSchema.index({ email: 1 }, { unique: true });
usuarioSchema.index({ documento_identidad: 1 }, { unique: true });
usuarioSchema.index({ numero_empleado: 1 }, { unique: true, sparse: true });
usuarioSchema.index({ google_id: 1 }, { unique: true, sparse: true });

// Virtual para nombre completo
usuarioSchema.virtual('nombreCompleto').get(function () {
  return `${this.nombres} ${this.apellidos}`;
});

// Virtual para nombre de tipo de usuario
usuarioSchema.virtual('nombre_tipo').get(function () {
  return this.id_tipo_usuario === 1 ? 'Ciudadano' : 'Autoridad';
});

// Virtual para id_usuario (para compatibilidad con controladores)
usuarioSchema.virtual('id_usuario').get(function () {
  return this._id;
});

// Configurar toJSON para incluir virtuals
usuarioSchema.set('toJSON', { virtuals: true });
usuarioSchema.set('toObject', { virtuals: true });

// Métodos estáticos
usuarioSchema.statics.crear = async function (datosUsuario) {
  const usuario = new this(datosUsuario);
  await usuario.save();
  return usuario._id;
};

usuarioSchema.statics.buscarPorEmail = async function (email) {
  return await this.findOne({ email: email.toLowerCase() });
};

usuarioSchema.statics.buscarPorId = async function (id_usuario) {
  return await this.findById(id_usuario);
};

usuarioSchema.statics.buscarPorDocumento = async function (documento_identidad) {
  return await this.findOne({ documento_identidad });
};

usuarioSchema.statics.emailExiste = async function (email) {
  const count = await this.countDocuments({ email: email.toLowerCase() });
  return count > 0;
};

usuarioSchema.statics.documentoExiste = async function (documento_identidad) {
  const count = await this.countDocuments({ documento_identidad });
  return count > 0;
};

usuarioSchema.statics.numeroEmpleadoExiste = async function (numero_empleado) {
  const count = await this.countDocuments({ numero_empleado });
  return count > 0;
};

usuarioSchema.statics.emailExisteParaOtroUsuario = async function (email, id_usuario) {
  const count = await this.countDocuments({
    email: email.toLowerCase(),
    _id: { $ne: id_usuario }
  });
  return count > 0;
};

usuarioSchema.statics.documentoExisteParaOtroUsuario = async function (documento_identidad, id_usuario) {
  const count = await this.countDocuments({
    documento_identidad,
    _id: { $ne: id_usuario }
  });
  return count > 0;
};

// Método para obtener historial de actividad del usuario
usuarioSchema.statics.obtenerHistorialActividad = async function (id_usuario, limite = 10) {
  try {
    // Importar modelos necesarios dinámicamente para evitar dependencias circulares
    const Denuncia = (await import('./Denuncia.js')).default;
    const HistorialEstado = (await import('./HistorialEstado.js')).default;

    // Obtener denuncias creadas por el usuario
    const denuncias = await Denuncia.find({ id_usuario })
      .select('titulo fecha_registro estado_actual')
      .sort({ fecha_registro: -1 })
      .limit(limite)
      .lean();

    // Obtener cambios de estado realizados por el usuario (si es autoridad)
    const cambiosEstado = await HistorialEstado.find({ id_usuario_cambio: id_usuario })
      .select('fecha_cambio comentario')
      .sort({ fecha_cambio: -1 })
      .limit(limite)
      .lean();

    // Crear array de actividades
    const actividades = [];

    // Agregar denuncias como actividades
    denuncias.forEach(denuncia => {
      actividades.push({
        tipo: 'denuncia_creada',
        descripcion: `Registraste la denuncia: "${denuncia.titulo}"`,
        fecha: denuncia.fecha_registro,
        icono: '📝'
      });
    });

    // Agregar cambios de estado como actividades
    cambiosEstado.forEach(cambio => {
      actividades.push({
        tipo: 'cambio_estado',
        descripcion: cambio.comentario || 'Actualizaste el estado de una denuncia',
        fecha: cambio.fecha_cambio,
        icono: '🔄'
      });
    });

    // Ordenar por fecha descendente y limitar
    actividades.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return actividades.slice(0, limite);
  } catch (error) {
    console.error('Error en obtenerHistorialActividad:', error);
    return [];
  }
};

// Métodos de instancia
usuarioSchema.methods.actualizarPerfil = async function (datosActualizacion) {
  const { nombres, apellidos, telefono, direccion } = datosActualizacion;

  if (nombres) this.nombres = nombres;
  if (apellidos) this.apellidos = apellidos;
  if (telefono !== undefined) this.telefono = telefono;
  if (direccion !== undefined) this.direccion_registro = direccion;

  return await this.save();
};

usuarioSchema.methods.cambiarPassword = async function (nuevoPasswordHash) {
  this.password_hash = nuevoPasswordHash;
  return await this.save();
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
