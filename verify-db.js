import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './Servidor/.env' });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Verificando configuración de MongoDB Atlas...\n');

async function verificarConexion() {
    try {
        console.log('📡 Intentando conectar a MongoDB Atlas...');

        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log('✅ ¡Conexión exitosa a MongoDB Atlas!\n');

        // Obtener información de la base de datos
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log('📊 Información de la base de datos:');
        console.log(`   Nombre: ${db.databaseName}`);
        console.log(`   Colecciones: ${collections.length}\n`);

        if (collections.length > 0) {
            console.log('📋 Colecciones disponibles:');
            for (const collection of collections) {
                const count = await db.collection(collection.name).countDocuments();
                console.log(`   - ${collection.name}: ${count} documentos`);
            }
        } else {
            console.log('⚠️  No hay colecciones aún. Ejecuta "npm run init-db" para crear datos iniciales.');
        }

        console.log('\n✅ Todo está configurado correctamente!');
        console.log('\n🚀 Para iniciar el proyecto completo, ejecuta:');
        console.log('   npm run dev:full\n');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error al conectar con MongoDB Atlas:');
        console.error(`   ${error.message}\n`);

        console.log('🔧 Posibles soluciones:');
        console.log('   1. Verifica que el archivo Servidor/.env tenga el MONGODB_URI correcto');
        console.log('   2. Asegúrate de que tu IP esté en la lista blanca de MongoDB Atlas');
        console.log('   3. Verifica tu conexión a internet');
        console.log('   4. Revisa que las credenciales sean correctas\n');

        process.exit(1);
    }
}

verificarConexion();
