// Script para limpiar todos los usuarios de la base de datos
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function limpiarUsuarios() {
    try {
        console.log('🔗 Conectando a MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conexión exitosa a MongoDB Atlas\n');

        // Obtener la base de datos
        const db = mongoose.connection.db;

        // Contar usuarios antes de eliminar
        const usuariosAntes = await db.collection('usuarios').countDocuments();
        console.log(`📊 Usuarios encontrados: ${usuariosAntes}`);

        // Eliminar todos los usuarios
        const resultadoUsuarios = await db.collection('usuarios').deleteMany({});
        console.log(`🗑️  Usuarios eliminados: ${resultadoUsuarios.deletedCount}`);

        // También eliminar denuncias relacionadas
        const denunciasAntes = await db.collection('denuncias').countDocuments();
        console.log(`📊 Denuncias encontradas: ${denunciasAntes}`);

        const resultadoDenuncias = await db.collection('denuncias').deleteMany({});
        console.log(`🗑️  Denuncias eliminadas: ${resultadoDenuncias.deletedCount}`);

        // Eliminar comentarios
        const comentariosAntes = await db.collection('comentarios').countDocuments();
        console.log(`📊 Comentarios encontrados: ${comentariosAntes}`);

        const resultadoComentarios = await db.collection('comentarios').deleteMany({});
        console.log(`🗑️  Comentarios eliminados: ${resultadoComentarios.deletedCount}`);

        // Eliminar evidencias
        const evidenciasAntes = await db.collection('evidencias_foto').countDocuments();
        console.log(`📊 Evidencias encontradas: ${evidenciasAntes}`);

        const resultadoEvidencias = await db.collection('evidencias_foto').deleteMany({});
        console.log(`🗑️  Evidencias eliminadas: ${resultadoEvidencias.deletedCount}`);

        // Eliminar historial de estados
        const historialAntes = await db.collection('historial_estados').countDocuments();
        console.log(`📊 Historial de estados encontrado: ${historialAntes}`);

        const resultadoHistorial = await db.collection('historial_estados').deleteMany({});
        console.log(`🗑️  Historial eliminado: ${resultadoHistorial.deletedCount}`);

        // Eliminar tokens de recuperación
        const tokensAntes = await db.collection('password_reset_tokens').countDocuments();
        console.log(`📊 Tokens de recuperación encontrados: ${tokensAntes}`);

        const resultadoTokens = await db.collection('password_reset_tokens').deleteMany({});
        console.log(`🗑️  Tokens eliminados: ${resultadoTokens.deletedCount}`);

        console.log('\n✅ ¡Base de datos limpia! Puedes empezar de cero.');
        console.log('📌 Las categorías y estados de denuncia se mantienen intactos.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Desconectado de MongoDB');
        process.exit(0);
    }
}

limpiarUsuarios();
