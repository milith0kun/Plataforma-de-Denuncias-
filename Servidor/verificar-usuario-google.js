import mongoose from 'mongoose';
import Usuario from './src/models/Usuario.js';
import dotenv from 'dotenv';

dotenv.config();

const verificarUsuario = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Buscar usuario con google_id
    const usuario = await Usuario.findOne({ google_id: { $exists: true } }).lean();

    if (usuario) {
      console.log('📋 Usuario creado con Google OAuth:');
      console.log('=====================================');
      console.log(`ID: ${usuario._id}`);
      console.log(`Nombres: ${usuario.nombres}`);
      console.log(`Apellidos: ${usuario.apellidos}`);
      console.log(`Email: ${usuario.email}`);
      console.log(`Documento: ${usuario.documento_identidad}`);
      console.log(`Tipo Usuario: ${usuario.id_tipo_usuario} (${usuario.id_tipo_usuario === 1 ? 'Ciudadano' : 'Autoridad'})`);
      console.log(`Google ID: ${usuario.google_id}`);
      console.log(`Foto Perfil: ${usuario.foto_perfil}`);
      console.log(`Email Verificado: ${usuario.verificado_email}`);
      console.log(`Teléfono: ${usuario.telefono || 'No registrado'}`);
      console.log(`Dirección: ${usuario.direccion_registro || 'No registrada'}`);
      console.log(`Activo: ${usuario.activo}`);
      console.log(`Fecha Registro: ${usuario.fecha_registro}`);
      console.log(`Password Hash: ${usuario.password_hash ? 'SÍ TIENE (⚠️ NO DEBERÍA)' : 'NO TIENE (✅ Correcto)'}`);
      console.log('=====================================\n');
    } else {
      console.log('❌ No se encontró ningún usuario con Google OAuth');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

verificarUsuario();
