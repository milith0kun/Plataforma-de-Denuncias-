import mongoose from 'mongoose';
import crypto from 'crypto';

const passwordResetTokenSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  fecha_expiracion: {
    type: Date,
    required: true
  },
  ip_solicitud: {
    type: String,
    default: null
  },
  usado: {
    type: Boolean,
    default: false
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'password_reset_tokens'
});

// Índices
passwordResetTokenSchema.index({ token: 1 });
passwordResetTokenSchema.index({ id_usuario: 1 });
passwordResetTokenSchema.index({ fecha_expiracion: 1 });

// Método estático para generar token único
passwordResetTokenSchema.statics.generarToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

// Método estático para crear token de recuperación
passwordResetTokenSchema.statics.crear = async function(id_usuario, ip_solicitud = null) {
  const token = this.generarToken();
  const fecha_expiracion = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  const resetToken = new this({
    id_usuario,
    token,
    fecha_expiracion,
    ip_solicitud
  });

  await resetToken.save();
  return token;
};

// Método estático para buscar token válido
passwordResetTokenSchema.statics.buscarTokenValido = async function(token) {
  return await this.findOne({
    token,
    usado: false,
    fecha_expiracion: { $gt: new Date() }
  }).populate('id_usuario', 'email nombres apellidos');
};

// Método estático para marcar token como usado
passwordResetTokenSchema.statics.marcarComoUsado = async function(token) {
  const resultado = await this.updateOne(
    { token },
    { usado: true }
  );
  return resultado.modifiedCount > 0;
};

// Método estático para invalidar todos los tokens de un usuario
passwordResetTokenSchema.statics.invalidarTokensUsuario = async function(id_usuario) {
  await this.updateMany(
    { id_usuario, usado: false },
    { usado: true }
  );
};

// Método estático para limpiar tokens expirados
passwordResetTokenSchema.statics.limpiarTokensExpirados = async function() {
  const resultado = await this.deleteMany({
    $or: [
      { fecha_expiracion: { $lt: new Date() } },
      { usado: true }
    ]
  });
  return resultado.deletedCount;
};

// Método estático para verificar si existe un token reciente
passwordResetTokenSchema.statics.existeTokenReciente = async function(id_usuario, minutos = 5) {
  const fechaLimite = new Date(Date.now() - minutos * 60 * 1000);
  const count = await this.countDocuments({
    id_usuario,
    fecha_creacion: { $gt: fechaLimite },
    usado: false
  });
  return count > 0;
};

const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

export default PasswordResetToken;
