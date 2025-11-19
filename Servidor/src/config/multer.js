/**
 * Configuración de Multer para upload de archivos
 */

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio base para uploads
const uploadsDir = path.join(__dirname, '../../uploads');

// Asegurar que los directorios existan
const directoriosNecesarios = [
  path.join(uploadsDir, 'evidencias'),
  path.join(uploadsDir, 'temp')
];

directoriosNecesarios.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const destDir = path.join(uploadsDir, 'evidencias', String(year), month);

    // Crear directorio si no existe
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    // Generar nombre único: denuncia-{id}-{timestamp}-{random}.ext
    const id_denuncia = req.params.id || 'temp';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const ext = path.extname(file.originalname);
    const filename = `denuncia-${id_denuncia}-${timestamp}-${random}${ext}`;

    cb(null, filename);
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  // Tipos MIME permitidos
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se aceptan JPG, PNG y WebP'), false);
  }
};

// Configuración de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB por archivo
    files: 5 // Máximo 5 archivos por vez
  }
});

// Middleware para manejo de errores de Multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Tamaño máximo: 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Demasiados archivos. Máximo: 5 archivos'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Campo de archivo inesperado'
      });
    }
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Error al subir archivo'
    });
  }

  next();
};

export default upload;
