# Configuración de MongoDB Atlas

Este documento describe cómo configurar el backend para usar MongoDB Atlas.

## Cambios Realizados

### 1. Migración de MySQL a MongoDB

El sistema ha sido completamente migrado de MySQL a MongoDB. Los cambios principales incluyen:

- ✅ Reemplazo de `mysql2` por `mongoose`
- ✅ Conversión de todos los modelos a esquemas de Mongoose
- ✅ Actualización de la configuración de base de datos
- ✅ Soporte para transacciones mediante sesiones de MongoDB
- ✅ Índices optimizados para consultas frecuentes

### 2. Modelos Migrados

Los siguientes modelos han sido migrados a Mongoose:

- `Usuario` - Gestión de usuarios (ciudadanos y autoridades)
- `Categoria` - Categorías de denuncias
- `EstadoDenuncia` - Estados del flujo de denuncias
- `Denuncia` - Denuncias ciudadanas
- `Comentario` - Comentarios en denuncias
- `EvidenciaFoto` - Evidencias fotográficas
- `PasswordResetToken` - Tokens de recuperación de contraseña
- `HistorialEstado` - Historial de cambios de estado de denuncias

## Configuración

### 1. Crear Cuenta en MongoDB Atlas

1. Visita [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (el tier gratuito M0 es suficiente para desarrollo)

### 2. Configurar Acceso a la Base de Datos

1. En MongoDB Atlas, ve a "Database Access"
2. Crea un nuevo usuario de base de datos con permisos de lectura y escritura
3. Guarda el nombre de usuario y contraseña (los necesitarás para el URI)

### 3. Configurar Acceso de Red

1. En MongoDB Atlas, ve a "Network Access"
2. Agrega tu dirección IP actual, o usa `0.0.0.0/0` para permitir acceso desde cualquier IP (solo para desarrollo)

### 4. Obtener el URI de Conexión

1. En MongoDB Atlas, ve a "Database" > "Connect"
2. Selecciona "Connect your application"
3. Copia el connection string (URI)
4. Reemplaza `<password>` con la contraseña de tu usuario de base de datos
5. Reemplaza `<database>` con el nombre de tu base de datos (ej: `denuncias_db`)

El URI debería verse así:
```
mongodb+srv://usuario:contraseña@cluster.mongodb.net/denuncias_db?retryWrites=true&w=majority
```

### 5. Configurar Variables de Entorno

1. En el directorio `Servidor/`, crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

2. Edita el archivo `.env` y configura las siguientes variables:

```env
# MongoDB Atlas URI
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/denuncias_db?retryWrites=true&w=majority

# Puerto del servidor
PORT=5000

# JWT Secret (genera una clave segura)
JWT_SECRET=tu_clave_secreta_super_segura_aqui

# Configuración de Email (opcional, para recuperación de contraseña)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_de_aplicacion
EMAIL_FROM=noreply@denuncias.com
```

### 6. Instalar Dependencias

```bash
npm install
```

### 7. Inicializar la Base de Datos

Este comando creará las categorías y estados iniciales en la base de datos:

```bash
npm run init-db
```

Deberías ver una salida similar a:
```
✓ Conexión exitosa a MongoDB Atlas
📋 Inicializando categorías...
✅ 8 categorías creadas exitosamente
📊 Inicializando estados de denuncia...
✅ 7 estados creados exitosamente
```

### 8. Iniciar el Servidor

```bash
npm run dev
```

Si todo está configurado correctamente, deberías ver:
```
✓ Conexión exitosa a MongoDB Atlas
🚀 Servidor corriendo en http://localhost:5000
📡 API disponible en http://localhost:5000/api/v1
```

## Estructura de la Base de Datos

### Colecciones

- `usuarios` - Usuarios del sistema
- `categorias` - Categorías de denuncias
- `estados_denuncia` - Estados de denuncias
- `denuncias` - Denuncias registradas
- `comentarios` - Comentarios en denuncias
- `evidencias_foto` - Evidencias fotográficas
- `password_reset_tokens` - Tokens de recuperación
- `historial_estados` - Historial de cambios de estado

### Índices

Los modelos incluyen índices optimizados para:
- Búsqueda por email y documento de identidad
- Filtrado de denuncias por categoría, estado y ciudadano
- Búsqueda de texto completo en títulos y descripciones de denuncias
- Ordenamiento por fecha

## Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm run init-db` - Inicializa la base de datos con datos básicos

## Diferencias con MySQL

### IDs

MongoDB usa `_id` como identificador único (tipo ObjectId) en lugar de IDs auto-incrementales.
Los modelos incluyen propiedades virtuales para mantener compatibilidad con el código existente:
- `id_usuario` apunta a `_id`
- `id_denuncia` apunta a `_id`
- `id_categoria` apunta a `_id`
- etc.

### Transacciones

MongoDB soporta transacciones multi-documento mediante sesiones.
Los métodos que requieren transacciones (como crear denuncias con historial) usan `mongoose.startSession()`.

### Búsquedas

MongoDB usa un sistema de consultas diferente:
- SQL: `WHERE campo = valor`
- MongoDB: `{ campo: valor }`
- SQL: `LIKE '%texto%'`
- MongoDB: `{ campo: { $regex: 'texto', $options: 'i' } }`

## Solución de Problemas

### Error: "MongoServerError: bad auth"

- Verifica que el usuario y contraseña en el URI sean correctos
- Verifica que el usuario tenga permisos de lectura/escritura

### Error: "MongoTimeoutError"

- Verifica que tu IP esté en la lista de acceso de red en MongoDB Atlas
- Verifica tu conexión a internet

### Error: "MongooseServerSelectionError"

- Verifica que el URI de conexión sea correcto
- Verifica que el cluster esté activo en MongoDB Atlas

## Monitoreo

Puedes monitorear tu base de datos desde MongoDB Atlas:
1. Ve a "Database" > "Metrics"
2. Visualiza operaciones, conexiones, uso de almacenamiento, etc.

## Respaldos

MongoDB Atlas incluye respaldos automáticos en todos los tiers, incluso en el gratuito.
Puedes restaurar desde un backup en la pestaña "Backups".

## Limitaciones del Tier Gratuito (M0)

- 512 MB de almacenamiento
- Conexiones compartidas
- Sin respaldos bajo demanda (solo point-in-time en últimos 2 días)
- Adecuado para desarrollo y pruebas

Para producción, considera un tier pagado con más recursos y características.
