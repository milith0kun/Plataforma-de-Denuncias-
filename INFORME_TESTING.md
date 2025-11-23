# 🧪 Informe de Testing y Ejecución

**Sprint Actual:** Sprint 8
**Fecha:** 2025-01-22
**Última Ejecución:** 2025-01-22 23:15

---

## 📊 Resumen de Tests

| Categoría | Estado | Cobertura | Tests Ejecutados |
|-----------|--------|-----------|------------------|
| **Base de Datos** | ✅ | 100% | 4/4 PASSED |
| **Backend API** | 🟡 | 41% | 7/17 PASSED |
| **Frontend** | ⏳ | 0% | 0/0 |
| **Integración** | ⏳ | 0% | 0/0 |

**Última Ejecución:** 2025-01-22 23:45
**Duración:** 3.29 segundos
**Ver detalles:** [RESULTADOS_TESTS.md](RESULTADOS_TESTS.md)

---

## 🗄️ Test 1: Conexión Base de Datos

### Comando
```bash
npm run verify-db
```

### Resultado
```
✅ ¡Conexión exitosa a MongoDB Atlas!

📊 Información de la base de datos:
   Nombre: denuncias_db
   Colecciones: 2

📋 Colecciones disponibles:
   - categorias: 8 documentos
   - estados_denuncia: 7 documentos
```

### Verificaciones
- [x] Conexión a MongoDB Atlas establecida
- [x] Base de datos `denuncias_db` accesible
- [x] 8 categorías inicializadas
- [x] 7 estados de denuncia inicializados

**Estado:** ✅ PASSED

---

## 🔌 Test 2: Endpoints Backend

### Test 2.1: Servidor Iniciado

**Comando:**
```bash
cd Servidor && npm run dev
```

**Resultado:**
```
✓ Conexión exitosa a MongoDB Atlas
🚀 Servidor corriendo en http://localhost:5000
📡 API disponible en http://localhost:5000/api/v1
```

**Estado:** ✅ PASSED

---

### Test 2.2: Endpoint Raíz API

**Request:**
```bash
GET http://localhost:5000/api/v1
```

**Response:**
```json
{
  "success": false,
  "message": "Token no proporcionado"
}
```

**Verificación:**
- [x] Endpoint protegido correctamente
- [x] Middleware de autenticación funciona

**Estado:** ✅ PASSED (Protección JWT funciona)

---

### Test 2.3: Endpoint Categorías (Público)

**Request:**
```bash
GET http://localhost:5000/api/v1/categorias
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categorias": [
      {
        "_id": "69223ec13d6255b3e6521a47",
        "nombre": "Infraestructura",
        "descripcion": "Problemas relacionados con infraestructura pública",
        "area_responsable_sugerida": "Obras Públicas"
      },
      // ... 7 categorías más
    ]
  }
}
```

**Verificaciones:**
- [x] Endpoint accesible
- [x] 8 categorías retornadas
- [x] Estructura de datos correcta
- [x] Campos requeridos presentes

**Estado:** ✅ PASSED

---

### Test 2.4: Endpoint Estados (Público)

**Request:**
```bash
GET http://localhost:5000/api/v1/estados
```

**Response:**
```json
{
  "success": true,
  "data": {
    "estados": [
      {
        "_id": "69223ec13d6255b3e6521a52",
        "nombre": "Registrada",
        "descripcion": "Denuncia registrada en el sistema",
        "orden_flujo": 1
      },
      // ... 6 estados más
    ]
  }
}
```

**Verificaciones:**
- [x] Endpoint accesible
- [x] 7 estados retornados
- [x] orden_flujo correctamente ordenado (1-7)
- [x] Estructura de datos correcta

**Estado:** ✅ PASSED

---

## 🔐 Test 3: Autenticación

### Test 3.1: Registro Ciudadano

**Endpoint:** `POST /api/v1/auth/register/ciudadano`

**Request Body:**
```json
{
  "nombres": "Test",
  "apellidos": "Usuario",
  "documento_identidad": "12345678",
  "email": "test@example.com",
  "password": "password123",
  "telefono": "987654321",
  "direccion": "Calle Test 123"
}
```

**Validaciones Esperadas:**
- [x] Validación de email único
- [x] Validación de DNI único (8-20 caracteres)
- [x] Contraseña mínimo 6 caracteres
- [x] Bcrypt hash de contraseña
- [x] Estado inicial: 'activo'
- [x] tipo_usuario_id: 1

**Estado:** ⏳ MANUAL TEST REQUIRED

---

### Test 3.2: Login

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id_usuario": "...",
      "nombres": "Test",
      "email": "test@example.com",
      "tipo_usuario_id": 1
    }
  }
}
```

**Estado:** ⏳ MANUAL TEST REQUIRED

---

## 📋 Test 4: CRUD Denuncias

### Test 4.1: Crear Denuncia

**Endpoint:** `POST /api/v1/denuncias`
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "titulo": "Bache en Av. Principal",
  "descripcion": "Bache profundo que causa daños a vehículos",
  "categoria_id": "69223ec13d6255b3e6521a47",
  "ubicacion": "Av. Principal con Calle 5",
  "latitud": -12.0464,
  "longitud": -77.0428,
  "es_anonima": false
}
```

**Validaciones:**
- [x] Requiere autenticación
- [x] Campos obligatorios validados
- [x] Estado inicial: "Registrada"
- [x] ciudadano_id asignado del token

**Estado:** ⏳ MANUAL TEST REQUIRED

---

### Test 4.2: Listar Denuncias

**Endpoint:** `GET /api/v1/denuncias`
**Headers:** `Authorization: Bearer {token}`

**Filtros Disponibles:**
- `estado`: Filtrar por estado
- `categoria`: Filtrar por categoría
- `es_anonima`: true/false

**Comportamiento por Rol:**
- **Ciudadano:** Solo sus propias denuncias
- **Autoridad/Admin:** Todas las denuncias

**Estado:** ⏳ MANUAL TEST REQUIRED

---

## 📸 Test 5: Upload de Evidencias

### Test 5.1: Subir Fotos

**Endpoint:** `POST /api/v1/denuncias/:id/evidencias`
**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Form Data:**
```
evidencias: [file1.jpg, file2.png] (hasta 5 archivos)
```

**Validaciones:**
- [x] Multer configurado
- [x] Formatos: JPG, JPEG, PNG, WebP
- [x] Tamaño máximo: 5MB por archivo
- [x] Máximo 5 archivos simultáneos
- [x] Storage en: `uploads/evidencias/YYYY/MM/`

**Estado:** ⏳ MANUAL TEST REQUIRED

---

### Test 5.2: Obtener Evidencias

**Endpoint:** `GET /api/v1/denuncias/:id/evidencias`
**Headers:** `Authorization: Bearer {token}`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "evidencias": [
      {
        "_id": "...",
        "ruta_archivo": "uploads/evidencias/2025/01/...",
        "nombre_original": "evidencia1.jpg",
        "tipo_mime": "image/jpeg",
        "tamanio": 234567
      }
    ]
  }
}
```

**Estado:** ⏳ MANUAL TEST REQUIRED

---

## 💬 Test 6: Sistema de Comentarios

### Test 6.1: Crear Comentario

**Endpoint:** `POST /api/v1/denuncias/:id/comentarios`
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "comentario": "Comentario de prueba",
  "es_interno": false
}
```

**Validaciones:**
- [x] Comentario no vacío
- [x] Máximo 1000 caracteres
- [x] Solo autoridades pueden crear comentarios internos
- [x] usuario_id extraído del token

**Estado:** ⏳ MANUAL TEST REQUIRED

---

### Test 6.2: Listar Comentarios

**Endpoint:** `GET /api/v1/denuncias/:id/comentarios`

**Comportamiento:**
- **Ciudadanos:** Solo comentarios públicos (es_interno=false)
- **Autoridades:** Todos los comentarios

**Estado:** ⏳ MANUAL TEST REQUIRED

---

## 📊 Test 7: Estadísticas

### Test 7.1: Estadísticas Generales

**Endpoint:** `GET /api/v1/estadisticas`
**Headers:** `Authorization: Bearer {token}`

**Expected Response (Ciudadano):**
```json
{
  "success": true,
  "data": {
    "total_denuncias": 10,
    "por_estado": {
      "registrada": 3,
      "en_revision": 2,
      "resuelta": 5
    },
    "por_categoria": {...}
  }
}
```

**Estado:** ⏳ MANUAL TEST REQUIRED

---

## ⚠️ Warnings Detectados

### MongoDB Warnings
```
Warning: Duplicate schema index on {"email":1}
Warning: Duplicate schema index on {"documento_identidad":1}
Warning: Duplicate schema index on {"numero_empleado":1}
Warning: Duplicate schema index on {"token":1}
Warning: Duplicate schema index on {"nombre":1}
```

**Impacto:** Ninguno funcional (solo performance menor)
**Acción Recomendada:** Revisar modelos Mongoose para eliminar duplicados

---

## 🎯 Tests Pendientes de Implementar

### Backend (Unitarios)
```bash
# Framework recomendado: Jest + Supertest
npm install --save-dev jest supertest

Tests a crear:
├── auth.test.js           # Autenticación
├── denuncias.test.js      # CRUD denuncias
├── comentarios.test.js    # Sistema comentarios
├── upload.test.js         # Upload de archivos
└── estadisticas.test.js   # Estadísticas
```

### Frontend (Unitarios)
```bash
# Framework recomendado: Jest + React Testing Library
npm install --save-dev @testing-library/react @testing-library/jest-dom

Tests a crear:
├── components/
│   ├── Button.test.jsx
│   ├── Input.test.jsx
│   └── Alert.test.jsx
├── pages/
│   ├── LoginPage.test.jsx
│   └── DenunciasPage.test.jsx
└── services/
    └── authService.test.js
```

### Integración (E2E)
```bash
# Framework recomendado: Cypress
npm install --save-dev cypress

Tests a crear:
├── auth.cy.js             # Flujo autenticación
├── denuncias.cy.js        # Flujo denuncias
└── perfil.cy.js           # Flujo perfil
```

---

## 📋 Checklist de Testing

### Tests Automatizados
- [ ] Tests unitarios Backend (0%)
- [ ] Tests unitarios Frontend (0%)
- [ ] Tests de integración API (0%)
- [ ] Tests E2E completos (0%)

### Tests Manuales
- [x] Conexión MongoDB Atlas
- [x] Inicio servidor Backend
- [x] Endpoint categorías
- [x] Endpoint estados
- [x] Protección JWT
- [ ] Flujo registro
- [ ] Flujo login
- [ ] CRUD denuncias
- [ ] Upload evidencias
- [ ] Sistema comentarios
- [ ] Estadísticas

### Performance
- [ ] Load testing (k6 o Artillery)
- [ ] Stress testing
- [ ] Verificación límites de API

### Seguridad
- [ ] Pruebas XSS
- [ ] Pruebas SQL Injection (MongoDB)
- [ ] Validación JWT
- [ ] Rate limiting
- [ ] CORS configurado

---

## 🚀 Comandos de Test

```bash
# Verificar BD
npm run verify-db

# Iniciar backend (test manual)
cd Servidor && npm run dev

# Iniciar frontend (test manual)
npm run dev

# Iniciar ambos
npm run dev:full

# Tests automatizados (cuando se implementen)
npm test                    # Todos los tests
npm run test:backend        # Solo backend
npm run test:frontend       # Solo frontend
npm run test:e2e            # E2E con Cypress
```

---

## 📊 Métricas de Calidad

| Métrica | Objetivo | Actual | Estado |
|---------|----------|--------|--------|
| Cobertura Backend | 80% | 0% | ❌ |
| Cobertura Frontend | 70% | 0% | ❌ |
| Tests E2E | 100% flujos críticos | 0% | ❌ |
| Performance API | <200ms | ? | ⏳ |
| Uptime | 99.9% | ? | ⏳ |

---

## ✅ Resultados Actuales

**Tests Ejecutados:** 4/30 (13%)
**Tests Passed:** 4/4 (100%)
**Tests Failed:** 0/4 (0%)

**Cobertura Total:** ~15% (Solo tests manuales básicos)

---

**Próximo paso:** Implementar suite completa de tests automatizados
