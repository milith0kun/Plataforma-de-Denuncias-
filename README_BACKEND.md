# 🚀 BACKEND - PLATAFORMA WEB PARA DENUNCIA CIUDADANA

## 📋 Estado Actual del Proyecto

### ✅ Implementado (Sprint 1 - Completado)

#### 🔐 Sistema de Autenticación Completo
- **Registro de Ciudadanos**: Endpoint funcional con validaciones
- **Registro de Autoridades**: Endpoint con validaciones específicas
- **Inicio de Sesión**: Autenticación JWT implementada
- **Recuperación de Contraseña**: Sistema completo con tokens temporales
- **Verificación de Tokens**: Middleware de autenticación

#### 👤 Gestión de Usuarios
- **Perfil de Usuario**: Obtener y actualizar información personal
- **Cambio de Contraseña**: Endpoint seguro con validaciones
- **Historial de Actividad**: Registro de acciones del usuario

#### 🛡️ Seguridad Implementada
- **JWT Tokens**: Autenticación basada en tokens
- **Bcrypt**: Hash seguro de contraseñas
- **Validaciones**: express-validator para datos de entrada
- **Middlewares**: Autenticación y autorización por roles
- **CORS**: Configurado para frontend

#### 📧 Servicios Adicionales
- **Email Service**: Envío de correos para recuperación de contraseña
- **Validaciones Personalizadas**: Middlewares específicos por funcionalidad

---

## 🏗️ Arquitectura Implementada

### Patrón MVC
- **Models**: Usuario, PasswordResetToken
- **Controllers**: AuthController, UsuarioController
- **Routes**: Rutas organizadas por módulos
- **Middlewares**: Validación, autenticación, autorización
- **Services**: Lógica de negocio reutilizable

---

## 🚀 Tecnologías Utilizadas

- **Node.js** (Runtime)
- **Express.js** (Framework web)
- **MySQL** (Base de datos)
- **JWT** (Autenticación)
- **Bcrypt** (Hash de contraseñas)
- **Express-validator** (Validaciones)
- **Nodemailer** (Envío de emails)
- **CORS** (Cross-Origin Resource Sharing)

---

## 📁 Estructura del Proyecto

```
Servidor/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración MySQL
│   │   └── jwt.js               # Configuración JWT
│   ├── controllers/
│   │   ├── authController.js    # Lógica de autenticación
│   │   └── usuarioController.js # Lógica de usuarios
│   ├── middlewares/
│   │   ├── authMiddleware.js    # Verificación JWT
│   │   ├── roleMiddleware.js    # Verificación de roles
│   │   ├── validationMiddleware.js
│   │   ├── perfilValidations.js
│   │   └── validators/
│   │       ├── autoridadValidator.js
│   │       └── passwordResetValidator.js
│   ├── models/
│   │   ├── Usuario.js           # Modelo de usuario
│   │   └── PasswordResetToken.js
│   ├── routes/
│   │   ├── index.js             # Enrutador principal
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   └── usuarioRoutes.js     # Rutas de usuarios
│   ├── services/
│   │   └── emailService.js      # Servicio de emails
│   ├── utils/
│   │   └── constants.js         # Constantes del sistema
│   ├── database/
│   │   ├── schema.sql           # Esquema de base de datos
│   │   ├── schema_simple.sql
│   │   └── migration_autoridad.sql
│   └── app.js                   # Configuración Express
├── server.js                    # Punto de entrada
├── package.json
└── .env                         # Variables de entorno
```

---

## 🔗 API Endpoints Implementados

### Base URL: `http://localhost:5000/api/v1`

#### 🔐 Autenticación (`/auth`)
```
POST   /auth/register/ciudadano     # Registro de ciudadano
POST   /auth/register/autoridad     # Registro de autoridad
POST   /auth/login                  # Inicio de sesión
GET    /auth/verify-token           # Verificar token JWT
POST   /auth/forgot-password        # Solicitar recuperación
POST   /auth/reset-password         # Restablecer contraseña
GET    /auth/verify-reset-token/:token # Verificar token de recuperación
```

#### 👤 Usuarios (`/usuarios`)
```
GET    /usuarios/profile            # Obtener perfil
PUT    /usuarios/profile            # Actualizar perfil
PUT    /usuarios/cambiar-password   # Cambiar contraseña
GET    /usuarios/historial-actividad # Historial de actividad
```

---

## 📊 Base de Datos

### Tablas Implementadas

#### `usuarios`
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- nombres (VARCHAR(100))
- apellidos (VARCHAR(100))
- documento_identidad (VARCHAR(20), UNIQUE)
- email (VARCHAR(255), UNIQUE)
- password_hash (VARCHAR(255))
- telefono (VARCHAR(20))
- direccion (TEXT)
- tipo_usuario_id (INT)
- activo (BOOLEAN)
- fecha_registro (TIMESTAMP)
- ultima_actividad (TIMESTAMP)
```

#### `tipos_usuario`
```sql
- id (INT, PRIMARY KEY)
- nombre (VARCHAR(50))
- descripcion (TEXT)
```

#### `password_reset_tokens`
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- usuario_id (INT)
- token (VARCHAR(255))
- expira_en (TIMESTAMP)
- usado (BOOLEAN)
- fecha_creacion (TIMESTAMP)
```

---

## 🔒 Seguridad Implementada

### Autenticación JWT
- Tokens con expiración configurable
- Middleware de verificación en rutas protegidas
- Refresh token capability

### Validaciones
- Email format validation
- Password strength requirements (mínimo 6 caracteres)
- Document ID format validation
- Input sanitization

### Hash de Contraseñas
- Bcrypt con salt rounds configurables
- Verificación segura en login

---

## ⚙️ Configuración

### Variables de Entorno (.env)
```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=plataforma_denuncias_urbanas

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRE=24h

# Servidor
PORT=5000
NODE_ENV=development

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_de_aplicacion
```

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+
- MySQL 8.0+
- npm o yarn

### Pasos de Instalación
```bash
# 1. Clonar el repositorio
cd Servidor

# 2. Instalar dependencias
npm install

# 3. Configurar base de datos
# Ejecutar scripts en database/schema.sql

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 5. Ejecutar en desarrollo
npm run dev

# 6. El servidor estará disponible en:
# http://localhost:5000
```

---

## 📝 Formato de Respuestas API

### Respuestas Exitosas
```json
{
  "success": true,
  "data": {
    // Datos de respuesta
  },
  "message": "Operación exitosa"
}
```

### Respuestas de Error
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

---

## 🧪 Testing

### Endpoints Probados
- ✅ Registro de ciudadanos
- ✅ Registro de autoridades  
- ✅ Inicio de sesión
- ✅ Recuperación de contraseña
- ✅ Gestión de perfil
- ✅ Cambio de contraseña

### Herramientas de Testing
- Postman collection disponible
- Validaciones automáticas implementadas

---

## 📈 Próximas Funcionalidades

### Sprint 2 (Planificado)
- [ ] Sistema de denuncias
- [ ] Carga de evidencias fotográficas
- [ ] Geolocalización
- [ ] Categorías de problemas
- [ ] Estados de denuncia

### Sprint 3 (Planificado)
- [ ] Dashboard de autoridades
- [ ] Sistema de comentarios
- [ ] Asignación de denuncias
- [ ] Notificaciones

### Sprint 4 (Planificado)
- [ ] Reportes y estadísticas
- [ ] Búsqueda avanzada
- [ ] Panel de administración
- [ ] Exportación de datos

---

## 🔧 Mantenimiento

### Logs del Sistema
- Logs de autenticación
- Logs de errores
- Logs de actividad de usuarios

### Monitoreo
- Estado de conexión a base de datos
- Rendimiento de endpoints
- Uso de memoria y CPU

---

## 🐛 Problemas Conocidos

- Ningún problema crítico identificado
- Sistema estable y funcional

---

## 📚 Documentación Adicional

- [HU04_RECUPERACION_PASSWORD.md](HU04_RECUPERACION_PASSWORD.md) - Documentación de recuperación de contraseña
- [VERIFICACION_HU01_HU02.md](VERIFICACION_HU01_HU02.md) - Verificación de historias de usuario
- [Backend.md](../Backend.md) - Documentación técnica completa

---

## 👥 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 📞 Contacto

**Equipo de Desarrollo Backend**
- Email: backend@plataforma-denuncias.com
- Documentación: [Backend.md](../Backend.md)

---

*Última actualización: Enero 2025*