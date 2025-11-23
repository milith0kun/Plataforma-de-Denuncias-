# 🔌 Informe Técnico - Backend API

**Sprint Actual:** Sprint 8
**Fecha:** 2025-01-22
**Estado:** 95% Completado ✅

---

## 📊 Estado General

### Tecnologías
- **Framework:** Node.js + Express.js v4.18.2
- **Base de Datos:** MongoDB Atlas (Mongoose v9.0.0)
- **Autenticación:** JWT (jsonwebtoken v9.0.2)
- **Seguridad:** bcrypt v5.1.1
- **Validación:** express-validator v7.0.1
- **Upload:** Multer v2.0.2
- **CORS:** cors v2.8.5

### Arquitectura
```
Servidor/
├── server.js                    # Punto de entrada
├── src/
│   ├── config/
│   │   ├── database.js         # Conexión MongoDB Atlas
│   │   └── multer.js           # Configuración upload
│   ├── models/                 # Modelos Mongoose (8)
│   ├── controllers/            # Controladores (7)
│   ├── routes/                 # Rutas API (8)
│   ├── middlewares/            # Middlewares (5)
│   └── scripts/
│       └── initDatabase.js     # Inicialización BD
```

---

## 🛠️ API REST Implementada

### Base URL
```
http://localhost:5000/api/v1
```

### Endpoints por Módulo

#### 1. Autenticación (`/auth`)
```
POST   /register/ciudadano       - Registro de ciudadano
POST   /register/autoridad        - Registro de autoridad
POST   /login                     - Inicio de sesión (JWT)
GET    /verify-token              - Verificar token válido
POST   /forgot-password           - Solicitar recuperación
POST   /reset-password            - Resetear contraseña
GET    /verify-reset-token/:token - Verificar token recuperación
```

**Estado:** ✅ 100% Implementado

#### 2. Denuncias (`/denuncias`)
```
POST   /                         - Crear denuncia
GET    /                         - Listar denuncias (filtros + rol)
GET    /:id                      - Obtener por ID
PUT    /:id                      - Actualizar denuncia
PUT    /:id/estado               - Cambiar estado (autoridades)
DELETE /:id                      - Eliminar denuncia
POST   /:id/evidencias           - Subir fotos (hasta 5)
GET    /:id/evidencias           - Obtener evidencias
```

**Estado:** ✅ 100% Implementado

#### 3. Comentarios (`/comentarios` y `/denuncias/:id/comentarios`)
```
POST   /denuncias/:id/comentarios           - Crear comentario
GET    /denuncias/:id/comentarios           - Listar comentarios
GET    /denuncias/:id/comentarios/estadisticas - Estadísticas
PUT    /comentarios/:idComentario           - Actualizar
DELETE /comentarios/:idComentario           - Eliminar
```

**Estado:** ✅ 100% Implementado

#### 4. Usuarios (`/usuarios`)
```
GET    /profile                  - Obtener perfil
PUT    /profile                  - Actualizar perfil
PUT    /cambiar-password         - Cambiar contraseña
GET    /historial-actividad      - Historial de actividad
```

**Estado:** ✅ 100% Implementado

#### 5. Estadísticas (`/estadisticas`)
```
GET    /                         - Estadísticas generales (por rol)
GET    /resumen                  - Resumen dashboard
GET    /categoria/:id            - Estadísticas por categoría
```

**Estado:** ✅ 100% Implementado

#### 6. Categorías (`/categorias`)
```
GET    /                         - Listar todas (8)
GET    /:id                      - Obtener por ID
```

**Estado:** ✅ 100% Implementado

#### 7. Estados (`/estados`)
```
GET    /                         - Listar todos (7)
```

**Estado:** ✅ 100% Implementado

---

## 🗄️ Modelos de Datos

### 1. Usuario
```javascript
{
  nombres: String (required),
  apellidos: String (required),
  documento_identidad: String (unique, required),
  email: String (unique, required),
  password: String (hashed),
  tipo_usuario_id: Number (1: Ciudadano, 2: Autoridad, 3: Admin),
  telefono: String,
  direccion: String,
  estado_usuario: String (enum: activo, inactivo, pendiente),
  // Campos específicos de autoridades
  cargo: String,
  area: String,
  numero_empleado: String
}
```

### 2. Denuncia
```javascript
{
  titulo: String (required),
  descripcion: String (required),
  categoria_id: ObjectId (ref: Categoria),
  estado_id: ObjectId (ref: EstadoDenuncia),
  ciudadano_id: ObjectId (ref: Usuario),
  ubicacion: String,
  latitud: Number,
  longitud: Number,
  es_anonima: Boolean,
  prioridad: String (enum: baja, media, alta),
  area_asignada: String
}
```

### 3. Comentario
```javascript
{
  denuncia_id: ObjectId (ref: Denuncia),
  usuario_id: ObjectId (ref: Usuario),
  comentario: String (required, max: 1000),
  es_interno: Boolean,
  fecha_comentario: Date
}
```

### 4. EvidenciaFoto
```javascript
{
  denuncia_id: ObjectId (ref: Denuncia),
  ruta_archivo: String (required),
  nombre_original: String,
  tipo_mime: String,
  tamanio: Number
}
```

### 5. Categoria (8 categorías)
```javascript
{
  nombre: String (unique),
  descripcion: String,
  area_responsable_sugerida: String
}
```

### 6. EstadoDenuncia (7 estados)
```javascript
{
  nombre: String (unique),
  descripcion: String,
  orden_flujo: Number (1-7)
}
```

### 7. PasswordReset
```javascript
{
  usuario_id: ObjectId (ref: Usuario),
  token: String (unique),
  expira: Date,
  usado: Boolean
}
```

---

## 🔒 Seguridad Implementada

### Autenticación
- ✅ JWT con expiración de 24 horas
- ✅ Passwords hasheados con bcrypt (10 rounds)
- ✅ Tokens de recuperación con expiración (1 hora)

### Validación
- ✅ express-validator en todas las rutas
- ✅ Sanitización de inputs
- ✅ Validación de tipos de archivo (Multer)
- ✅ Límites de tamaño (5MB por archivo)

### Middlewares de Protección
```javascript
verificarToken          // Verifica JWT válido
requireUsuarioActivo    // Solo usuarios activos
requireRole(['rol'])    // Requiere rol específico
handleMulterError       // Manejo de errores de upload
```

---

## 📤 Upload de Archivos

### Configuración Multer
```javascript
Formatos aceptados: JPG, JPEG, PNG, WebP
Tamaño máximo: 5MB por archivo
Máximo archivos: 5 simultáneos
Ruta almacenamiento: uploads/evidencias/YYYY/MM/
```

### Estructura de Archivos
```
uploads/
  evidencias/
    2025/
      01/
        denuncia-{id}-{timestamp}-{random}.jpg
```

---

## 🔄 Flujo de Estados

```
1. Registrada    (inicial)
   ↓
2. En Revisión   (autoridad revisa)
   ↓
3. Asignada      (asignada a área)
   ↓
4. En Proceso    (en resolución)
   ↓
5. Resuelta      (problema resuelto)
   ↓
6. Cerrada       (cerrada definitivamente)

7. Rechazada     (estado terminal alternativo)
```

**Validación:** Se verifica orden_flujo para transiciones válidas

---

## 📊 Datos Iniciales

### Categorías (8)
1. Infraestructura → Obras Públicas
2. Servicios Públicos → Servicios Públicos
3. Tránsito → Tránsito
4. Seguridad → Seguridad
5. Limpieza → Limpieza Urbana
6. Medio Ambiente → Medio Ambiente
7. Transparencia → Contraloría
8. Otros → Mesa de Entrada

### Estados (7)
1. Registrada (orden: 1)
2. En Revisión (orden: 2)
3. Asignada (orden: 3)
4. En Proceso (orden: 4)
5. Resuelta (orden: 5)
6. Cerrada (orden: 6)
7. Rechazada (orden: 7)

---

## ⚠️ Warnings Conocidos

### Mongoose - Índices Duplicados
```
Warning: Duplicate schema index on {"email":1}
Warning: Duplicate schema index on {"documento_identidad":1}
Warning: Duplicate schema index on {"numero_empleado":1}
Warning: Duplicate schema index on {"token":1}
Warning: Duplicate schema index on {"nombre":1}
```

**Impacto:** Ninguno (solo warnings)
**Acción:** Revisar modelos para eliminar declaraciones duplicadas de índices

---

## 🧪 Comandos de Desarrollo

```bash
# Iniciar servidor desarrollo
npm run dev

# Inicializar/actualizar datos
npm run init-db

# Verificar conexión MongoDB
cd .. && npm run verify-db
```

---

## 📝 Variables de Entorno Requeridas

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=86400
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

---

## ✅ Checklist de Completitud

- [x] Autenticación JWT
- [x] Registro ciudadano/autoridad
- [x] Recuperación de contraseña
- [x] CRUD denuncias
- [x] Cambio de estados con validación
- [x] Upload evidencias fotográficas
- [x] Sistema de comentarios completo
- [x] Estadísticas por rol
- [x] Gestión de perfil
- [x] Historial de actividad
- [x] Protección de rutas por roles
- [x] Validación de inputs
- [x] Manejo de errores

---

## 🎯 Pendiente (5%)

- [ ] Optimizar queries MongoDB (índices adicionales)
- [ ] Eliminar warnings de Mongoose
- [ ] Implementar rate limiting
- [ ] Logging centralizado
- [ ] Tests unitarios (Jest)
- [ ] Tests de integración
- [ ] Documentación Swagger/OpenAPI

---

**Backend completado al 95% - Listo para integración con Frontend**
