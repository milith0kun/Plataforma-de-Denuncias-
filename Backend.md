# INFORME TÉCNICO BACKEND
## PLATAFORMA WEB PARA DENUNCIA CIUDADANA DE PROBLEMAS URBANOS

> Informe técnico completo con arquitectura, API REST y especificaciones del backend

## 📑 Navegación de Documentación

- **[⬅️ README Principal](README.md)** - Vista general del proyecto
- **[🔌 README Backend](README_BACKEND.md)** - Estado actual y endpoints
- **[📱 README Frontend](README_FRONTEND.md)** - Documentación del cliente
- **[🎨 Sistema de Diseño](DESIGN_SYSTEM.md)** - Guía de diseño completa
- **[📖 Informe Frontend](Frontend.md)** - Especificaciones técnicas del frontend

---

## 1. CONTEXTO DEL PROYECTO

Desarrollar el backend completo para una Plataforma Web de Denuncia Ciudadana de Problemas Urbanos. El sistema permitirá a los ciudadanos reportar incidencias urbanas con evidencia fotográfica y geolocalización, mientras que las autoridades podrán gestionar, dar seguimiento y resolver estas denuncias de manera eficiente.

---

## 2. STACK TECNOLÓGICO DEFINIDO

- **Runtime**: Node.js (versión LTS más reciente)
- **Framework**: Express.js
- **Base de Datos**: MySQL 8.0+
- **ORM/Query Builder**: Sequelize o directamente con mysql2
- **Autenticación**: JWT (JSON Web Tokens) con estrategia simple
- **Almacenamiento de Imágenes**: Sistema de archivos local (carpeta uploads/)
- **Validación**: express-validator
- **Seguridad**: helmet, cors, bcrypt para hashing de contraseñas
- **Variables de Entorno**: dotenv

---

## 3. ARQUITECTURA GENERAL DEL BACKEND

### 3.1 Patrón Arquitectónico

Implementar arquitectura MVC (Model-View-Controller) adaptada para API REST:

- **Models**: Entidades de base de datos con sus relaciones
- **Controllers**: Lógica de negocio y orquestación de servicios
- **Routes**: Definición de endpoints y middlewares
- **Services**: Lógica de negocio compleja reutilizable
- **Middlewares**: Validaciones, autenticación, manejo de errores
- **Utils**: Funciones auxiliares y helpers

### 3.2 Estructura de Carpetas Propuesta

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración de conexión MySQL
│   │   ├── jwt.js               # Configuración de tokens
│   │   └── multer.js            # Configuración para carga de archivos
│   │
│   ├── models/
│   │   ├── index.js             # Exportación centralizada de modelos
│   │   ├── TipoUsuario.js
│   │   ├── Usuario.js
│   │   ├── Categoria.js
│   │   ├── EstadoDenuncia.js
│   │   ├── Denuncia.js
│   │   ├── EvidenciaFoto.js
│   │   └── HistorialEstado.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── usuarioController.js
│   │   ├── denunciaController.js
│   │   ├── categoriaController.js
│   │   ├── estadoController.js
│   │   ├── reporteController.js
│   │   └── adminController.js
│   │
│   ├── routes/
│   │   ├── index.js             # Enrutador principal
│   │   ├── authRoutes.js
│   │   ├── usuarioRoutes.js
│   │   ├── denunciaRoutes.js
│   │   ├── categoriaRoutes.js
│   │   ├── reporteRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js    # Verificación de JWT
│   │   ├── roleMiddleware.js    # Verificación de roles
│   │   ├── validationMiddleware.js
│   │   ├── uploadMiddleware.js  # Multer para imágenes
│   │   └── errorHandler.js      # Manejo centralizado de errores
│   │
│   ├── services/
│   │   ├── emailService.js      # Envío de notificaciones por email
│   │   ├── geoService.js        # Conversión de coordenadas a direcciones
│   │   ├── imageService.js      # Compresión y procesamiento de imágenes
│   │   └── estadisticaService.js # Cálculos para reportes
│   │
│   ├── utils/
│   │   ├── responseHelper.js    # Formato estándar de respuestas
│   │   ├── validators.js        # Funciones de validación personalizadas
│   │   └── constants.js         # Constantes del sistema
│   │
│   ├── database/
│   │   ├── migrations/          # Scripts SQL de creación de tablas
│   │   └── seeders/             # Datos iniciales
│   │
│   └── app.js                   # Configuración de Express
│
├── uploads/                     # Almacenamiento local de imágenes
│   └── denuncias/
│       └── [id_denuncia]/
│
├── .env                         # Variables de entorno
├── .env.example                 # Plantilla de variables
├── server.js                    # Punto de entrada de la aplicación
└── package.json
```

---

## 4. DISEÑO DE LA API REST

### 4.1 Principios de Diseño

- Nomenclatura RESTful coherente
- Versionado de API: `/api/v1/`
- Respuestas en formato JSON estandarizado
- Códigos HTTP apropiados (200, 201, 400, 401, 403, 404, 500)
- Paginación para listados extensos
- Filtrado y ordenamiento mediante query parameters

### 4.2 Formato de Respuesta Estándar

**Respuestas exitosas:**
```json
{
  "success": true,
  "data": {},
  "message": "Operación exitosa"
}
```

**Respuestas de error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error",
    "details": []
  }
}
```

### 4.3 Endpoints Principales por Módulo

#### Módulo de Autenticación (`/api/v1/auth`)

- **POST** `/register/ciudadano` - Registro de ciudadano
- **POST** `/register/autoridad` - Registro de autoridad
- **POST** `/login` - Inicio de sesión
- **POST** `/logout` - Cierre de sesión
- **POST** `/forgot-password` - Solicitud de recuperación de contraseña
- **POST** `/reset-password` - Restablecimiento de contraseña
- **GET** `/verify-token` - Validación de token actual

#### Módulo de Usuarios (`/api/v1/usuarios`)

- **GET** `/profile` - Obtener perfil del usuario autenticado
- **PUT** `/profile` - Actualizar perfil
- **GET** `/historial-denuncias` - Historial de denuncias del usuario
- **PUT** `/cambiar-password` - Cambio de contraseña

#### Módulo de Denuncias (`/api/v1/denuncias`)

- **POST** `/` - Crear nueva denuncia
- **GET** `/` - Listar denuncias (con filtros y paginación)
- **GET** `/:id` - Obtener detalle de denuncia específica
- **PUT** `/:id` - Actualizar denuncia (solo ciudadano propietario)
- **DELETE** `/:id` - Eliminar denuncia
- **POST** `/:id/evidencias` - Agregar fotos a denuncia existente
- **DELETE** `/evidencias/:idEvidencia` - Eliminar foto específica
- **GET** `/:id/historial` - Obtener historial completo de estados
- **POST** `/:id/comentarios` - Agregar comentario a la denuncia
- **GET** `/mapa` - Obtener denuncias para visualización en mapa
- **GET** `/cercanas` - Buscar denuncias por proximidad (lat, lng, radio)

#### Módulo de Gestión de Estados (`/api/v1/estados`)

- **PUT** `/denuncias/:id/estado` - Cambiar estado de denuncia (solo autoridades)
- **POST** `/denuncias/:id/asignar` - Asignar denuncia a autoridad específica
- **GET** `/denuncias/mis-asignadas` - Denuncias asignadas al usuario autoridad

#### Módulo de Categorías (`/api/v1/categorias`)

- **GET** `/` - Listar todas las categorías
- **POST** `/` - Crear nueva categoría (solo admin)
- **PUT** `/:id` - Actualizar categoría (solo admin)
- **DELETE** `/:id` - Eliminar categoría (solo admin)

#### Módulo de Reportes y Estadísticas (`/api/v1/reportes`)

- **GET** `/estadisticas-generales` - Métricas generales del sistema
- **GET** `/por-categoria` - Denuncias agrupadas por categoría
- **GET** `/por-estado` - Denuncias agrupadas por estado
- **GET** `/tiempo-resolucion` - Tiempos promedio de resolución
- **GET** `/tendencias` - Análisis de tendencias por período
- **GET** `/mapa-calor` - Datos para mapa de calor
- **POST** `/exportar` - Generar reporte descargable (PDF/Excel)

#### Módulo de Administración (`/api/v1/admin`)

- **GET** `/usuarios` - Listar todos los usuarios
- **PUT** `/usuarios/:id/estado` - Activar/desactivar usuario
- **PUT** `/usuarios/:id/rol` - Cambiar rol de usuario
- **DELETE** `/usuarios/:id` - Eliminar usuario
- **GET** `/auditoria` - Registro de acciones administrativas
- **GET** `/denuncias/todas` - Vista completa de denuncias para dashboard admin
- **PUT** `/denuncias/:id/prioridad` - Cambiar prioridad de denuncia

---

## 5. DIVISIÓN POR HISTORIAS DE USUARIO

### SPRINT 1 (4 semanas)

#### HU-01: Registro e Inicio de Sesión de Ciudadanos

**Requerimientos asociados:** RF-01, RF-04

**Tareas backend:**
- Crear modelo Usuario y TipoUsuario
- Implementar endpoint de registro con validación de datos
- Implementar hash de contraseñas con bcrypt
- Crear endpoint de login con generación de JWT
- Middleware de autenticación JWT
- Endpoint de validación de token
- Manejo de errores de autenticación

#### HU-02: Registro e Inicio de Sesión de Autoridades

**Requerimientos asociados:** RF-02, RF-04

**Tareas backend:**
- Extensión del modelo Usuario para roles de autoridad
- Endpoint de registro diferenciado para autoridades
- Sistema de permisos básicos por tipo de usuario
- Middleware de verificación de roles
- Validaciones específicas para datos de autoridades

#### HU-03: Gestión de Perfil de Usuario

**Requerimientos asociados:** RF-03

**Tareas backend:**
- Endpoint para obtener perfil del usuario autenticado
- Endpoint para actualizar información personal
- Validaciones de actualización de datos
- Endpoint de cambio de contraseña
- Historial de actividad del usuario

#### HU-04: Recuperación de Contraseña

**Requerimientos asociados:** RF-04

**Tareas backend:**
- Endpoint de solicitud de recuperación
- Generación de tokens temporales de recuperación

- Endpoint de restablecimiento de contraseña
- Expiración automática de tokens

---

### SPRINT 2 (4 semanas)

#### HU-05: Creación de Denuncia con Categorización

**Requerimientos asociados:** RF-05

**Tareas backend:**
- Crear modelos Denuncia, Categoria, EstadoDenuncia
- Endpoint de creación de denuncia
- Validación de campos obligatorios
- Asignación automática de estado inicial "Registrada"
- Generación de código único de seguimiento
- Seeder para categorías predefinidas

#### HU-06: Carga de Evidencia Fotográfica

**Requerimientos asociados:** RF-06

**Tareas backend:**
- Crear modelo EvidenciaFoto
- Configuración de Multer para carga de archivos
- Middleware de validación de archivos (formato, tamaño)
- Endpoint de carga de múltiples imágenes
- Servicio de compresión de imágenes
- Almacenamiento en estructura de carpetas por denuncia
- Endpoint de eliminación de evidencias
- Límite de 5 imágenes por denuncia

#### HU-07: Geolocalización de Denuncias

**Requerimientos asociados:** RF-07

**Tareas backend:**
- Campos de latitud y longitud en modelo Denuncia
- Validación de coordenadas válidas
- Integración con servicio de geocodificación inversa
- Generación automática de dirección descriptiva
- Endpoint de búsqueda por proximidad geográfica
- Índices espaciales en base de datos para consultas eficientes

#### HU-08: Sistema de Estados de Denuncia

**Requerimientos asociados:** RF-08

**Tareas backend:**
- Crear modelo HistorialEstado
- Seeder para estados predefinidos con orden de flujo
- Endpoint de cambio de estado (solo autoridades)
- Validación de transiciones válidas de estado
- Registro automático en historial con comentario obligatorio
- Actualización automática de ultima_actualizacion en denuncia

---

### SPRINT 3 (4 semanas)

#### HU-09: Seguimiento de Denuncias

**Requerimientos asociados:** RF-09

**Tareas backend:**
- Endpoint de detalle de denuncia con historial completo
- Endpoint de búsqueda por código de seguimiento
- Generación de línea de tiempo ordenada cronológicamente
- Endpoint de notificaciones de cambios de estado
- Sistema de suscripción a actualizaciones

#### HU-10: Sistema de Comentarios

**Requerimientos asociados:** RF-10

**Tareas backend:**
- Extensión de HistorialEstado para incluir comentarios
- Endpoint de agregar comentarios a denuncia
- Validación de permisos (denunciante y autoridades)
- Notificaciones automáticas al agregar comentarios
- Ordenamiento cronológico de comentarios

#### HU-11: Dashboard de Autoridades

**Requerimientos asociados:** RF-11

**Tareas backend:**
- Endpoint de listado con filtros múltiples (estado, categoría, fecha, ubicación)
- Paginación y ordenamiento dinámico
- Endpoint de métricas en tiempo real
- Agregaciones por jurisdicción
- Contador de denuncias por estado
- Denuncias urgentes o prioritarias

#### HU-12: Gestión de Denuncias por Autoridades

**Requerimientos asociados:** RF-12

**Tareas backend:**
- Endpoint de asignación de denuncias a autoridades
- Actualización masiva de estados
- Sistema de priorización manual
- Endpoint de fusión de denuncias duplicadas
- Endpoint de marcado de denuncias relacionadas
- Exportación de datos en CSV/JSON

---

### SPRINT 4 (4 semanas)

#### HU-13: Administración de Usuarios

**Requerimientos asociados:** RF-13

**Tareas backend:**
- Endpoints CRUD completos de usuarios (solo admin)
- Endpoint de listado con búsqueda y filtros
- Activación/desactivación de cuentas
- Cambio de roles y permisos
- Registro de auditoría de acciones administrativas
- Prevención de auto-eliminación de admin

#### HU-14: Reportes Estadísticos

**Requerimientos asociados:** RF-14

**Tareas backend:**
- Servicio de cálculo de estadísticas
- Endpoint de reportes por período personalizado
- Agregaciones por categoría y ubicación
- Cálculo de tiempos promedio de resolución
- Identificación de tendencias y patrones
- Comparativas entre períodos

#### HU-15: Visualización de Datos y Exportación

**Requerimientos asociados:** RF-15

**Tareas backend:**
- Endpoint de datos para gráficos (formato adaptado)
- Generación de archivos PDF con librería (ej: PDFKit)
- Generación de archivos Excel con librería (ej: ExcelJS)
- Programación de reportes automáticos periódicos
- Endpoint de descarga de archivos generados

#### HU-16: Búsqueda Avanzada

**Requerimientos asociados:** RF-16

**Tareas backend:**
- Endpoint de búsqueda con múltiples criterios combinables
- Implementación de búsqueda full-text en descripciones
- Búsqueda geográfica por radio de distancia
- Filtros guardables por usuario
- Ordenamiento personalizado
- Índices optimizados en base de datos

---

## 6. CONSIDERACIONES DE SEGURIDAD

### 6.1 Autenticación y Autorización

- Hash de contraseñas con bcrypt (mínimo 10 rounds)
- Tokens JWT con expiración configurable (recomendado: 24 horas)
- Refresh tokens para renovación segura
- Validación de roles en cada endpoint protegido
- Blacklist de tokens para logout efectivo

### 6.2 Protección de Datos

- Sanitización de inputs con express-validator
- Prevención de SQL Injection mediante prepared statements
- Validación estricta de tipos de archivo
- Límite de tamaño de archivos (máximo 5MB por imagen)
- Headers de seguridad con Helmet
- CORS configurado específicamente para frontend

### 6.3 Validaciones

- Validación de formato de email
- Validación de longitud de contraseñas (mínimo 8 caracteres)
- Validación de formato de documento de identidad
- Validación de coordenadas geográficas válidas
- Validación de transiciones de estado permitidas

---

## 7. CONSIDERACIONES DE RENDIMIENTO

### 7.1 Base de Datos

- Índices en campos de búsqueda frecuente (email, documento_identidad, id_ciudadano, id_estado_actual)
- Índices compuestos para filtros combinados
- Índices espaciales para consultas geográficas
- Conexión pool configurada adecuadamente
- Lazy loading de relaciones

### 7.2 Optimizaciones

- Compresión automática de imágenes al subir
- Limitación de tamaño de respuestas con paginación
- Caché de datos estáticos (categorías, estados)
- Queries optimizadas con JOINs eficientes
- Limitación de rate limiting para prevenir abuso

### 7.3 Manejo de Archivos

- Almacenamiento organizado por ID de denuncia
- Generación de thumbnails para listados
- Validación de existencia antes de servir archivos
- Limpieza de archivos huérfanos

---

## 8. VARIABLES DE ENTORNO NECESARIAS

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=plataforma_denuncias_urbanas

# JWT
JWT_SECRET=clave_secreta_segura_y_larga
JWT_EXPIRE=24h

# Servidor
PORT=5000
NODE_ENV=development

# Uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Email (para notificaciones)
EMAIL_HOST=smtp.ejemplo.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=

# Geocodificación
GEO_API_KEY=
```

---

## 9. DATOS INICIALES (SEEDERS)

### 9.1 Tipos de Usuario

1. Ciudadano
2. Autoridad Municipal
3. Administrador

### 9.2 Categorías de Problemas

1. Baches en vías públicas
2. Alumbrado público deficiente
3. Limpieza y recolección de basura
4. Vandalismo y grafitis
5. Fugas de agua
6. Otros

### 9.3 Estados de Denuncia

1. Registrada (orden: 1)
2. En Revisión (orden: 2)
3. Asignada (orden: 3)
4. En Proceso (orden: 4)
5. Resuelta (orden: 5)
6. Cerrada (orden: 6)

---

## 10. PRUEBAS Y VALIDACIÓN

### 10.1 Estrategia de Testing

- Pruebas unitarias de servicios críticos
- Pruebas de integración de endpoints
- Validación de flujos completos de autenticación
- Pruebas de carga de imágenes
- Validación de permisos y roles

### 10.2 Herramientas Sugeridas

- Jest para pruebas unitarias
- Supertest para pruebas de endpoints
- Postman/Insomnia para pruebas manuales

---

## 11. CONCLUSIÓN

Este informe técnico proporciona una guía completa para el desarrollo del backend de la Plataforma de Denuncias Urbanas. La arquitectura propuesta garantiza escalabilidad, seguridad y mantenibilidad, mientras que la división por sprints e historias de usuario facilita el desarrollo iterativo y colaborativo del equipo.