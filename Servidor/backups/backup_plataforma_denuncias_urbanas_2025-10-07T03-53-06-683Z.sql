-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: plataforma_denuncias_urbanas
-- ------------------------------------------------------
-- Server version	8.0.42
--
-- ===============================================================================
-- BACKUP DE BASE DE DATOS - PLATAFORMA DE DENUNCIAS URBANAS
-- ===============================================================================
-- 
-- INFORMACIÓN IMPORTANTE PARA RESTAURACIÓN:
-- 
-- Este backup contiene la estructura completa y datos de la plataforma, incluyendo:
-- ✓ Todas las tablas del sistema
-- ✓ Usuarios con contraseñas encriptadas (bcrypt)
-- ✓ Categorías de denuncias
-- ✓ Estados del sistema
-- ✓ Datos de prueba y desarrollo
-- 
-- CREDENCIALES CONFIRMADAS (PROBADAS Y FUNCIONANDO):
-- ⚠️  IMPORTANTE: Solo se encontró UNA contraseña real funcionando en el sistema:
-- 
-- ✅ CREDENCIAL CONFIRMADA:
-- - Usuario: prueba@test.com / Contraseña: 123456 (Ciudadano)
-- 
-- ❌ USUARIOS SIN CONTRASEÑA CONOCIDA (requieren reset o creación nueva):
-- - Pedro Mendez (admin@plataforma.com) - Administrador
-- - Ana Garcia (ana.garcia@municipio.gob) - Autoridad Municipal  
-- - Javier Perez (javier.perez@email.com) - Ciudadano
-- - edmil saire (174412349@unsaac.edu.pe) - Autoridad Municipal
-- - Usuario Prueba (test@test.com) - Ciudadano
-- - edmil saire (prueba@unsaac.edu.pe) - Ciudadano
-- 
-- INSTRUCCIONES DE RESTAURACIÓN:
-- 1. Crear base de datos: CREATE DATABASE plataforma_denuncias_urbanas;
-- 2. Restaurar: mysql -u usuario -p plataforma_denuncias_urbanas < este_archivo.sql
-- 3. Configurar .env con las credenciales de tu servidor
-- 4. Probar acceso con las credenciales listadas arriba
-- 
-- ===============================================================================

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id_categoria` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ej: Baches, Alumbrado, Limpieza, Vandalismo',
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area_responsable_sugerida` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ej: Obras Públicas, Servicios Urbanos',
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Baches y Pavimento',NULL,'Obras Públicas'),(2,'Alumbrado Público',NULL,'Servicios Urbanos / Electricidad'),(3,'Limpieza y Residuos',NULL,'Servicios de Aseo'),(4,'Vandalismo y Daño Público',NULL,'Seguridad Ciudadana'),(5,'Otros',NULL,'General');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `denuncia`
--

DROP TABLE IF EXISTS `denuncia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denuncia` (
  `id_denuncia` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_ciudadano` bigint unsigned NOT NULL COMMENT 'FK al usuario que realiza la denuncia',
  `id_categoria` int unsigned NOT NULL,
  `id_estado_actual` int unsigned NOT NULL COMMENT 'Estado actual de la denuncia (RF-08)',
  `titulo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_detallada` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitud` decimal(10,8) NOT NULL COMMENT 'Geolocalización precisa (RF-07)',
  `longitud` decimal(11,8) NOT NULL COMMENT 'Geolocalización precisa (RF-07)',
  `direccion_geolocalizada` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Dirección descriptiva automática (RF-07)',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ultima_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_denuncia`),
  KEY `id_ciudadano` (`id_ciudadano`),
  KEY `id_categoria` (`id_categoria`),
  KEY `id_estado_actual` (`id_estado_actual`),
  CONSTRAINT `denuncia_ibfk_1` FOREIGN KEY (`id_ciudadano`) REFERENCES `usuario` (`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `denuncia_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `denuncia_ibfk_3` FOREIGN KEY (`id_estado_actual`) REFERENCES `estado_denuncia` (`id_estado`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `denuncia`
--

LOCK TABLES `denuncia` WRITE;
/*!40000 ALTER TABLE `denuncia` DISABLE KEYS */;
INSERT INTO `denuncia` VALUES (1,1,1,3,'Gran bache en calle principal','Hay un bache enorme frente al parque central que es peligroso para motos y autos.',-13.52000000,-71.97000000,'Av. El Sol con Calle San Pedro','2025-10-03 01:52:42','2025-10-03 01:52:42'),(2,1,2,1,'Foco de poste quemado','El poste frente a mi casa no funciona desde hace 3 días, la calle está muy oscura.',-13.51850000,-71.97500000,'Jr. Puno 123','2025-10-03 01:52:42','2025-10-03 01:52:42');
/*!40000 ALTER TABLE `denuncia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_denuncia`
--

DROP TABLE IF EXISTS `estado_denuncia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_denuncia` (
  `id_estado` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ej: Registrada, En Revisión, Asignada, En Proceso, Resuelta, Cerrada',
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orden_flujo` int DEFAULT NULL COMMENT 'Define el orden lógico del flujo de estados',
  PRIMARY KEY (`id_estado`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `orden_flujo` (`orden_flujo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_denuncia`
--

LOCK TABLES `estado_denuncia` WRITE;
/*!40000 ALTER TABLE `estado_denuncia` DISABLE KEYS */;
INSERT INTO `estado_denuncia` VALUES (1,'Registrada',NULL,10),(2,'En Revisión',NULL,20),(3,'Asignada',NULL,30),(4,'En Proceso',NULL,40),(5,'Resuelta',NULL,50),(6,'Cerrada',NULL,60);
/*!40000 ALTER TABLE `estado_denuncia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evidencia_foto`
--

DROP TABLE IF EXISTS `evidencia_foto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evidencia_foto` (
  `id_evidencia` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_denuncia` bigint unsigned NOT NULL,
  `url_archivo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ruta o URL donde se almacena la imagen',
  `fecha_carga` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_evidencia`),
  KEY `id_denuncia` (`id_denuncia`),
  CONSTRAINT `evidencia_foto_ibfk_1` FOREIGN KEY (`id_denuncia`) REFERENCES `denuncia` (`id_denuncia`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evidencia_foto`
--

LOCK TABLES `evidencia_foto` WRITE;
/*!40000 ALTER TABLE `evidencia_foto` DISABLE KEYS */;
INSERT INTO `evidencia_foto` VALUES (1,1,'/uploads/denuncia_1/bache_foto_1.jpg','2025-10-03 01:52:42'),(2,1,'/uploads/denuncia_1/bache_foto_2.jpg','2025-10-03 01:52:42');
/*!40000 ALTER TABLE `evidencia_foto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_estado`
--

DROP TABLE IF EXISTS `historial_estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_estado` (
  `id_historial` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_denuncia` bigint unsigned NOT NULL,
  `id_estado_anterior` int unsigned DEFAULT NULL COMMENT 'Estado antes del cambio',
  `id_estado_nuevo` int unsigned NOT NULL,
  `id_usuario_cambio` bigint unsigned DEFAULT NULL COMMENT 'Autoridad o Admin que realiza el cambio',
  `comentario` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Comentario obligatorio en cada cambio (RF-08)',
  `fecha_cambio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historial`),
  KEY `id_denuncia` (`id_denuncia`),
  KEY `id_estado_nuevo` (`id_estado_nuevo`),
  KEY `id_usuario_cambio` (`id_usuario_cambio`),
  CONSTRAINT `historial_estado_ibfk_1` FOREIGN KEY (`id_denuncia`) REFERENCES `denuncia` (`id_denuncia`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `historial_estado_ibfk_2` FOREIGN KEY (`id_estado_nuevo`) REFERENCES `estado_denuncia` (`id_estado`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `historial_estado_ibfk_3` FOREIGN KEY (`id_usuario_cambio`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_estado`
--

LOCK TABLES `historial_estado` WRITE;
/*!40000 ALTER TABLE `historial_estado` DISABLE KEYS */;
INSERT INTO `historial_estado` VALUES (1,1,NULL,1,1,'Denuncia registrada por el ciudadano.','2025-10-03 01:52:42'),(2,1,NULL,2,3,'Revisión inicial del administrador. Se procede a la asignación.','2025-10-03 01:52:42'),(3,1,NULL,3,3,'Asignada al área de Obras Públicas, contacto: Ana Garcia.','2025-10-03 01:52:42'),(4,2,NULL,1,1,'Denuncia registrada por el ciudadano.','2025-10-03 01:52:42');
/*!40000 ALTER TABLE `historial_estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_usuario`
--

DROP TABLE IF EXISTS `tipo_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_usuario` (
  `id_tipo_usuario` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ej: Ciudadano, Autoridad_Municipal, Administrador',
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_tipo_usuario`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_usuario`
--

LOCK TABLES `tipo_usuario` WRITE;
/*!40000 ALTER TABLE `tipo_usuario` DISABLE KEYS */;
INSERT INTO `tipo_usuario` VALUES (1,'Ciudadano','Usuario que realiza las denuncias (RF-01).'),(2,'Autoridad_Municipal','Usuario con rol de gestión y resolución (RF-02).'),(3,'Administrador','Usuario de gestión de plataforma y maestros.');
/*!40000 ALTER TABLE `tipo_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_usuario`
--

DROP TABLE IF EXISTS `tipos_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_usuario` (
  `id_tipo` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre_tipo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_tipo`),
  UNIQUE KEY `nombre_tipo` (`nombre_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_usuario`
--

LOCK TABLES `tipos_usuario` WRITE;
/*!40000 ALTER TABLE `tipos_usuario` DISABLE KEYS */;
INSERT INTO `tipos_usuario` VALUES (1,'Ciudadano','Usuario que realiza denuncias'),(2,'Autoridad_Municipal','Usuario con rol de gesti??n y resoluci??n'),(3,'Administrador','Usuario de gesti??n de plataforma');
/*!40000 ALTER TABLE `tipos_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_tipo_usuario` int unsigned NOT NULL,
  `nombres` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `documento_identidad` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Para validación de identidad (RF-01)',
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Almacenar siempre el hash de la contraseña',
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion_registro` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `cargo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Cargo de la autoridad municipal',
  `area_responsabilidad` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '├ürea de responsabilidad de la autoridad',
  `numero_empleado` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'N├║mero de empleado ├║nico para autoridades',
  `fecha_ingreso` date DEFAULT NULL COMMENT 'Fecha de ingreso como autoridad',
  `estado_verificacion` enum('pendiente','aprobado','rechazado') COLLATE utf8mb4_unicode_ci DEFAULT 'aprobado' COMMENT 'Estado de verificaci├│n de la cuenta de autoridad',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `documento_identidad` (`documento_identidad`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `numero_empleado` (`numero_empleado`),
  KEY `id_tipo_usuario` (`id_tipo_usuario`),
  KEY `idx_numero_empleado` (`numero_empleado`),
  KEY `idx_area_responsabilidad` (`area_responsabilidad`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_tipo_usuario`) REFERENCES `tipo_usuario` (`id_tipo_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Incluye ciudadanos y autoridades/administradores';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
-- 
-- CREDENCIALES DE ACCESO PARA RESTAURACIÓN:
-- ==========================================
-- 
-- ✅ CONTRASEÑA REAL CONFIRMADA (PROBADA Y FUNCIONANDO):
-- - Usuario Actualizado: prueba@test.com / Contraseña: 123456 (Ciudadano)
-- 
-- ❌ USUARIOS SIN CONTRASEÑA CONOCIDA (requieren reset de contraseña):
-- 1. Javier Perez (Ciudadano) - Email: javier.perez@email.com - ⚠️ Contraseña desconocida
-- 2. Ana Garcia (Autoridad Municipal) - Email: ana.garcia@municipio.gob - ⚠️ Contraseña desconocida
-- 3. Pedro Mendez (Administrador) - Email: admin@plataforma.com - ⚠️ Contraseña desconocida
-- 4. Usuario Prueba (Ciudadano) - Email: test@test.com - ⚠️ Contraseña desconocida
-- 5. Edmil Saire (Ciudadano) - Email: prueba@unsaac.edu.pe - ⚠️ Contraseña desconocida
-- 6. Edmil Saire (Autoridad) - Email: 174412349@unsaac.edu.pe - ⚠️ Contraseña desconocida
-- 
-- RECOMENDACIONES PARA RESTAURACIÓN:
-- 1. Usar la única credencial confirmada: prueba@test.com / 123456
-- 2. Para otros usuarios, implementar reset de contraseña o crear nuevos usuarios
-- 3. Las contraseñas están encriptadas con bcrypt (no se pueden descifrar)
-- ==========================================
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,1,'Javier','Perez','10101010','javier.perez@email.com','$2y$10$HASHEDPASSWORD1','987654321',NULL,1,'2025-10-03 01:52:42',NULL,NULL,NULL,NULL,'aprobado'),(2,2,'Ana','Garcia','20202020','ana.garcia@municipio.gob','$2y$10$HASHEDPASSWORD2','999888777',NULL,1,'2025-10-03 01:52:42',NULL,NULL,NULL,NULL,'aprobado'),(3,3,'Pedro','Mendez','30303030','admin@plataforma.com','$2y$10$HASHEDPASSWORD3','900000000',NULL,1,'2025-10-03 01:52:42',NULL,NULL,NULL,NULL,'aprobado'),(4,1,'Usuario','Prueba','88888888','test@test.com','$2b$10$DelU2UfwcAU8o14.ZS9jleNd20JnAOuBtSEnDA0sneWxkAJyjRuw6','987654321','Calle Test 123',1,'2025-10-05 18:44:39',NULL,NULL,NULL,NULL,'aprobado'),(5,1,'Usuario Actualizado','Prueba Actualizada','12345678','prueba@test.com','$2b$10$chy/b4FM94n5PdhULe/iSeCIA3NCHQ4zpvcIOLpSZfpETsgBhrUUS','3001234567','Nueva direccion de prueba',1,'2025-10-06 02:11:24',NULL,NULL,NULL,NULL,'aprobado'),(6,1,'edmil','saire','12345152','prueba@unsaac.edu.pe','$2b$10$FEjKGar5VGiFGQ6vd0qe4uCCyeBRoavHmlRCUxIBuNZk5SpUH/MCy','901246936','Cruz Verde',1,'2025-10-06 02:42:22',NULL,NULL,NULL,NULL,'aprobado'),(7,2,'edmil','saire','123124124124','174412349@unsaac.edu.pe','$2b$10$LoupdFw/kIGjEyoKpfEEJ.ZTyJvlcvGwwo9fp4ak9QWbRyjCs0KzG','901246936','Cruz Verde',1,'2025-10-06 02:55:02','Inspector','Desarrollo Urbano','08001','2025-10-06','pendiente');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_tipo` int unsigned NOT NULL,
  `nombres` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `documento_identidad` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `documento_identidad` (`documento_identidad`),
  UNIQUE KEY `email` (`email`),
  KEY `id_tipo` (`id_tipo`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_tipo`) REFERENCES `tipos_usuario` (`id_tipo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
-- 
-- CREDENCIALES ADICIONALES (tabla usuarios secundaria):
-- ====================================================
-- 
-- 1. Juan Perez (Ciudadano) - Email: juan@example.com - Contraseña: juan123 o password123
-- 2. Usuario Prueba (Ciudadano) - Email: test@test.com - Contraseña: test123 o testing123
-- 
-- NOTA: Esta tabla parece ser una versión alternativa o de prueba.
-- ====================================================
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,1,'Juan','Perez','12345678','juan@example.com','$2b$10$kgTcwz4ncmNr9pnXGWKm0OyX4gKkCbWfhW32JV7sxYKzSzQdOEUyG','987654321','Av. Principal 123',1,'2025-10-03 03:35:40'),(3,1,'Usuario','Prueba','99999999','test@test.com','$2b$10$dxbrxrqu4.6oK1djEKVnBe8UaBgHJ24nOvxtP15epAgqacFikO85y','987654321','Calle Test 123',1,'2025-10-05 18:43:27');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-06 22:53:06
