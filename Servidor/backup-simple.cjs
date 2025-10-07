const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const execAsync = promisify(exec);

// Configuración de la base de datos desde .env
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'plataforma_denuncias_urbanas';
const DB_PORT = process.env.DB_PORT || 3306;

/**
 * Crear backup simple de la base de datos
 */
async function crearBackup() {
  try {
    console.log('🚀 Iniciando backup de la base de datos...');
    console.log(`📊 Base de datos: ${DB_NAME}`);
    console.log(`🖥️ Servidor: ${DB_HOST}:${DB_PORT}`);
    
    // Crear carpeta de backups si no existe
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
      console.log('📁 Carpeta de backups creada');
    }

    // Generar nombre del archivo con fecha y hora
    const fecha = new Date();
    const timestamp = fecha.toISOString()
      .replace(/[:.]/g, '-')
      .split('.')[0];
    
    const nombreArchivo = `backup_${DB_NAME}_${timestamp}.sql`;
    const rutaCompleta = path.join(backupDir, nombreArchivo);

    // Comando mysqldump simplificado
    const comando = `mysqldump -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} ${DB_PASSWORD ? `-p${DB_PASSWORD}` : ''} ${DB_NAME} > "${rutaCompleta}"`;
    
    console.log('💾 Ejecutando backup...');
    console.log(`🔧 Comando: mysqldump -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} ${DB_PASSWORD ? '-p***' : ''} ${DB_NAME}`);
    
    // Ejecutar el comando
    await execAsync(comando);
    
    // Verificar que el archivo se creó
    if (fs.existsSync(rutaCompleta)) {
      const stats = fs.statSync(rutaCompleta);
      const tamañoMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log('✅ Backup completado exitosamente!');
      console.log(`📁 Archivo: ${nombreArchivo}`);
      console.log(`📊 Tamaño: ${tamañoMB} MB`);
      console.log(`🕒 Fecha: ${fecha.toLocaleString()}`);
      console.log(`📂 Ubicación: ${rutaCompleta}`);
      
      return {
        archivo: nombreArchivo,
        ruta: rutaCompleta,
        tamaño: tamañoMB,
        fecha: fecha
      };
    } else {
      throw new Error('El archivo de backup no se creó');
    }
    
  } catch (error) {
    console.error('❌ Error al crear backup:', error.message);
    
    // Verificar si mysqldump está disponible
    if (error.message.includes('mysqldump') || error.message.includes('not found')) {
      console.error('💡 Asegúrate de tener MySQL instalado y mysqldump en el PATH del sistema');
      console.error('💡 En Windows, agrega la carpeta bin de MySQL al PATH (ej: C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin)');
    }
    
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  crearBackup()
    .then(() => {
      console.log('🎉 Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error.message);
      process.exit(1);
    });
}

module.exports = crearBackup;