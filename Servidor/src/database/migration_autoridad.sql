-- Migración para agregar campos específicos de autoridades
-- HU-02: Registro e Inicio de Sesión de Autoridades

USE `plataforma_denuncias_urbanas`;

-- Agregar campos específicos para autoridades en la tabla usuario
ALTER TABLE `usuario` 
ADD COLUMN `cargo` VARCHAR(100) NULL COMMENT 'Cargo de la autoridad municipal',
ADD COLUMN `area_responsabilidad` VARCHAR(100) NULL COMMENT 'Área de responsabilidad de la autoridad',
ADD COLUMN `numero_empleado` VARCHAR(50) NULL UNIQUE COMMENT 'Número de empleado único para autoridades',
ADD COLUMN `fecha_ingreso` DATE NULL COMMENT 'Fecha de ingreso como autoridad',
ADD COLUMN `estado_verificacion` ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'aprobado' COMMENT 'Estado de verificación de la cuenta de autoridad';

-- Crear índice para búsquedas por número de empleado
CREATE INDEX `idx_numero_empleado` ON `usuario`(`numero_empleado`);

-- Crear índice para búsquedas por área de responsabilidad
CREATE INDEX `idx_area_responsabilidad` ON `usuario`(`area_responsabilidad`);

-- Comentario: Los ciudadanos tendrán estos campos en NULL
-- Solo las autoridades (id_tipo_usuario = 2) tendrán estos campos poblados
