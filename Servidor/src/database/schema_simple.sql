-- Crear base de datos
CREATE DATABASE IF NOT EXISTS plataforma_denuncias_urbanas
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE plataforma_denuncias_urbanas;

-- Tabla tipos_usuario
CREATE TABLE IF NOT EXISTS tipos_usuario (
    id_tipo INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_tipo VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_tipo INT UNSIGNED NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    documento_identidad VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tipo) REFERENCES tipos_usuario(id_tipo)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Insertar tipos de usuario
INSERT INTO tipos_usuario (nombre_tipo, descripcion) VALUES
('Ciudadano', 'Usuario que realiza denuncias'),
('Autoridad_Municipal', 'Usuario con rol de gestión y resolución'),
('Administrador', 'Usuario de gestión de plataforma');
