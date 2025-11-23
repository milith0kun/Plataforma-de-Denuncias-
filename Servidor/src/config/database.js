import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/denuncias_db';

// Opciones de conexión de Mongoose
const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Función para conectar a MongoDB
const conectarDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, options);
    console.log('✓ Conexión exitosa a MongoDB Atlas');

    // Eventos de conexión
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose conectado a MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de conexión Mongoose:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose desconectado de MongoDB');
    });

    // Manejo de cierre de la aplicación
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 Conexión de Mongoose cerrada debido a la terminación de la aplicación');
      process.exit(0);
    });

    return true;
  } catch (error) {
    console.error('✗ Error al conectar con MongoDB:', error.message);
    return false;
  }
};

// Verificar la conexión
const verificarConexion = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('✓ MongoDB está conectado');
      return true;
    } else {
      return await conectarDB();
    }
  } catch (error) {
    console.error('✗ Error al verificar conexión con MongoDB:', error.message);
    return false;
  }
};

export { conectarDB, verificarConexion };
export default mongoose;
