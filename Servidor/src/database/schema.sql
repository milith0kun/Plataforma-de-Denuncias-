-- 1. CREACIÓN DE LA BASE DE DATOS
CREATE DATABASE IF NOT EXISTS `plataforma_denuncias_urbanas`
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `plataforma_denuncias_urbanas`;

---

-- 2. TABLAS DE CLASIFICACIÓN (Para escalabilidad y evitar duplicación de datos)

-- Tipos de Usuario (Para el RF-02 y RF-04)
-- Anticipa diferentes roles (Ciudadano, Autoridad Municipal, Administrador)
CREATE TABLE `tipo_usuario` (
    `id_tipo_usuario` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Ej: Ciudadano, Autoridad_Municipal, Administrador',
    `descripcion` VARCHAR(255)
);

-- Categorías de Problemas Urbanos (Para el RF-05)
-- Facilita la gestión y generación de reportes estadísticos.
CREATE TABLE `categoria` (
    `id_categoria` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Ej: Baches, Alumbrado, Limpieza, Vandalismo',
    `descripcion` VARCHAR(255),
    `area_responsable_sugerida` VARCHAR(100) COMMENT 'Ej: Obras Públicas, Servicios Urbanos'
);

-- Estados de la Denuncia (Para el RF-08)
-- Define el flujo de trabajo y asegura la consistencia de los estados.
CREATE TABLE `estado_denuncia` (
    `id_estado` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Ej: Registrada, En Revisión, Asignada, En Proceso, Resuelta, Cerrada',
    `descripcion` VARCHAR(255),
    `orden_flujo` INT UNIQUE COMMENT 'Define el orden lógico del flujo de estados'
);

---

-- 3. TABLAS PRINCIPALES

-- Usuarios (Para el RF-01, RF-02, RF-03, RF-04)
-- Usa claves foráneas para `id_tipo_usuario` para definir el rol.
CREATE TABLE `usuario` (
    `id_usuario` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `id_tipo_usuario` INT UNSIGNED NOT NULL,
    `nombres` VARCHAR(100) NOT NULL,
    `apellidos` VARCHAR(100) NOT NULL,
    `documento_identidad` VARCHAR(20) UNIQUE NOT NULL COMMENT 'Para validación de identidad (RF-01)',
    `email` VARCHAR(150) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL COMMENT 'Almacenar siempre el hash de la contraseña',
    `telefono` VARCHAR(20),
    `direccion_registro` VARCHAR(255),
    `activo` BOOLEAN DEFAULT TRUE,
    `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (`id_tipo_usuario`) REFERENCES `tipo_usuario`(`id_tipo_usuario`)
        ON UPDATE CASCADE ON DELETE RESTRICT 
) COMMENT 'Incluye ciudadanos y autoridades/administradores';


-- Denuncias (Para el RF-05, RF-07)
-- El corazón del sistema, relacionado con el ciudadano, la categoría y el estado actual.
CREATE TABLE `denuncia` (
    `id_denuncia` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `id_ciudadano` BIGINT UNSIGNED NOT NULL COMMENT 'FK al usuario que realiza la denuncia',
    `id_categoria` INT UNSIGNED NOT NULL,
    `id_estado_actual` INT UNSIGNED NOT NULL COMMENT 'Estado actual de la denuncia (RF-08)',
    `titulo` VARCHAR(200) NOT NULL,
    `descripcion_detallada` TEXT NOT NULL,
    `latitud` DECIMAL(10, 8) NOT NULL COMMENT 'Geolocalización precisa (RF-07)',
    `longitud` DECIMAL(11, 8) NOT NULL COMMENT 'Geolocalización precisa (RF-07)',
    `direccion_geolocalizada` VARCHAR(255) COMMENT 'Dirección descriptiva automática (RF-07)',
    `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `ultima_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Relaciones
    FOREIGN KEY (`id_ciudadano`) REFERENCES `usuario`(`id_usuario`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id_categoria`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`id_estado_actual`) REFERENCES `estado_denuncia`(`id_estado`)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Evidencia Fotográfica (Para el RF-06)
-- Tabla separada para manejar la multimedia, permitiendo múltiples imágenes por denuncia.
CREATE TABLE `evidencia_foto` (
    `id_evidencia` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `id_denuncia` BIGINT UNSIGNED NOT NULL,
    `url_archivo` VARCHAR(255) NOT NULL COMMENT 'Ruta o URL donde se almacena la imagen',
    `fecha_carga` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (`id_denuncia`) REFERENCES `denuncia`(`id_denuncia`)
        ON UPDATE CASCADE ON DELETE CASCADE -- Si se elimina la denuncia, se eliminan las fotos
);

---

-- 4. TABLAS DE SEGUIMIENTO Y AUDITORÍA (Prevención de problemas futuros)

-- Historial de Estado de la Denuncia (Para el RF-08 y auditoría)
-- Clave para el seguimiento: registra cada cambio de estado, quién lo hizo y por qué.
CREATE TABLE `historial_estado` (
    `id_historial` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `id_denuncia` BIGINT UNSIGNED NOT NULL,
    `id_estado_anterior` INT UNSIGNED COMMENT 'Estado antes del cambio',
    `id_estado_nuevo` INT UNSIGNED NOT NULL,
    `id_usuario_cambio` BIGINT UNSIGNED COMMENT 'Autoridad o Admin que realiza el cambio',
    `comentario` TEXT NOT NULL COMMENT 'Comentario obligatorio en cada cambio (RF-08)',
    `fecha_cambio` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (`id_denuncia`) REFERENCES `denuncia`(`id_denuncia`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (`id_estado_nuevo`) REFERENCES `estado_denuncia`(`id_estado`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`id_usuario_cambio`) REFERENCES `usuario`(`id_usuario`)
        ON UPDATE CASCADE ON DELETE SET NULL -- Si el usuario se elimina, se mantiene el historial
);


-- 1. DATOS INICIALES PARA tipo_usuario
INSERT INTO `tipo_usuario` (`id_tipo_usuario`, `nombre`, `descripcion`) VALUES
(1, 'Ciudadano', 'Usuario que realiza las denuncias (RF-01).'),
(2, 'Autoridad_Municipal', 'Usuario con rol de gestión y resolución (RF-02).'),
(3, 'Administrador', 'Usuario de gestión de plataforma y maestros.');

-- 2. DATOS INICIALES PARA categoria (RF-05)
INSERT INTO `categoria` (`id_categoria`, `nombre`, `area_responsable_sugerida`) VALUES
(1, 'Baches y Pavimento', 'Obras Públicas'),
(2, 'Alumbrado Público', 'Servicios Urbanos / Electricidad'),
(3, 'Limpieza y Residuos', 'Servicios de Aseo'),
(4, 'Vandalismo y Daño Público', 'Seguridad Ciudadana'),
(5, 'Otros', 'General');

-- 3. DATOS INICIALES PARA estado_denuncia (RF-08)
INSERT INTO `estado_denuncia` (`id_estado`, `nombre`, `orden_flujo`) VALUES
(1, 'Registrada', 10),
(2, 'En Revisión', 20),
(3, 'Asignada', 30),
(4, 'En Proceso', 40),
(5, 'Resuelta', 50),
(6, 'Cerrada', 60);

-- 4. DATOS INICIALES PARA usuario
-- NOTA: La columna 'password_hash' debe almacenar el hash real, aquí es solo un ejemplo.
INSERT INTO `usuario` (`id_tipo_usuario`, `nombres`, `apellidos`, `documento_identidad`, `email`, `password_hash`, `telefono`) VALUES
(1, 'Javier', 'Perez', '10101010', 'javier.perez@email.com', '$2y$10$HASHEDPASSWORD1', '987654321'), -- Ciudadano
(2, 'Ana', 'Garcia', '20202020', 'ana.garcia@municipio.gob', '$2y$10$HASHEDPASSWORD2', '999888777'), -- Autoridad Municipal
(3, 'Pedro', 'Mendez', '30303030', 'admin@plataforma.com', '$2y$10$HASHEDPASSWORD3', '900000000'); -- Administrador

-- 5. DATOS INICIALES PARA denuncia
INSERT INTO `denuncia` (`id_ciudadano`, `id_categoria`, `id_estado_actual`, `titulo`, `descripcion_detallada`, `latitud`, `longitud`, `direccion_geolocalizada`) VALUES
(1, 1, 3, 'Gran bache en calle principal', 'Hay un bache enorme frente al parque central que es peligroso para motos y autos.', 
' -13.520000', '-71.970000', 'Av. El Sol con Calle San Pedro'), -- Asignada
(1, 2, 1, 'Foco de poste quemado', 'El poste frente a mi casa no funciona desde hace 3 días, la calle está muy oscura.',
' -13.518500', '-71.975000', 'Jr. Puno 123'); -- Registrada

-- 6. DATOS INICIALES PARA evidencia_foto
INSERT INTO `evidencia_foto` (`id_denuncia`, `url_archivo`) VALUES
(1, '/uploads/denuncia_1/bache_foto_1.jpg'),
(1, '/uploads/denuncia_1/bache_foto_2.jpg');

-- 7. DATOS INICIALES PARA historial_estado (Refleja el flujo inicial)
-- Historial para Denuncia 1 (Registrada -> En Revisión -> Asignada)
INSERT INTO `historial_estado` (`id_denuncia`, `id_estado_nuevo`, `id_usuario_cambio`, `comentario`) VALUES
(1, 1, 1, 'Denuncia registrada por el ciudadano.'), -- Estado 1: Registrada
(1, 2, 3, 'Revisión inicial del administrador. Se procede a la asignación.'), -- Estado 2: En Revisión
(1, 3, 3, 'Asignada al área de Obras Públicas, contacto: Ana Garcia.'), -- Estado 3: Asignada
-- Historial para Denuncia 2 (Registrada)
(2, 1, 1, 'Denuncia registrada por el ciudadano.'); -- Estado 1: Registrada