-- Script SQL para agregar tabla de comentarios
-- Fecha: 2025-01-19

USE plataforma_denuncias_urbanas;

-- Tabla de Comentarios
CREATE TABLE IF NOT EXISTS comentarios (
  id_comentario INT PRIMARY KEY AUTO_INCREMENT,
  id_denuncia INT NOT NULL,
  id_usuario INT NOT NULL,
  comentario TEXT NOT NULL,
  es_interno BOOLEAN DEFAULT FALSE COMMENT 'Si es true, solo visible para autoridades',
  fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (id_denuncia) REFERENCES denuncias(id_denuncia) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,

  INDEX idx_denuncia (id_denuncia),
  INDEX idx_usuario (id_usuario),
  INDEX idx_fecha (fecha_comentario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Comentarios y seguimiento de denuncias';

-- Insertar comentarios de ejemplo (opcional)
-- INSERT INTO comentarios (id_denuncia, id_usuario, comentario, es_interno) VALUES
-- (1, 1, 'Gracias por su reporte. Estamos revisando el caso.', FALSE),
-- (1, 2, 'El equipo técnico visitará la zona mañana.', TRUE);

SELECT 'Tabla de comentarios creada exitosamente' AS resultado;
