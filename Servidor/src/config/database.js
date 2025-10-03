import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la conexión a MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'denuncias_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Verificar la conexión
const verificarConexion = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Conexión exitosa a MySQL');
    connection.release();
    return true;
  } catch (error) {
    console.error('✗ Error al conectar con MySQL:', error.message);
    return false;
  }
};

export { pool, verificarConexion };
