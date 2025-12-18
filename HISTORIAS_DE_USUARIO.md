# Historias de Usuario - Plataforma de Denuncias Ciudadanas

## Estado del Proyecto: 85% Completado

**Base de Datos:** MongoDB Atlas ✅
**Backend API:** Node.js + Express ✅
**Frontend:** React 19 + Vite ✅

---

## Sprint 1: Autenticación y Gestión de Usuarios ✅ COMPLETADO

### HU-001: Registro de Ciudadano
**Como** ciudadano
**Quiero** registrarme en la plataforma
**Para** poder realizar denuncias

**Criterios de Aceptación:**
- ✅ El formulario solicita: nombres, apellidos, DNI, email, contraseña
- ✅ Validación de email único
- ✅ Validación de DNI único (8 dígitos)
- ✅ Contraseña con mínimo 6 caracteres
- ✅ Almacenamiento seguro con bcrypt
- ✅ Redirección automática al login tras registro exitoso

**Implementación:**
- **Backend:** `Servidor/src/models/Usuario.js` - método `crear()`
- **Backend:** `Servidor/src/controllers/authController.js` - método `registrarCiudadano()`
- **Backend:** `Servidor/src/routes/authRoutes.js` - POST `/auth/registro-ciudadano`
- **Frontend:** `src/pages/auth/RegisterPage/RegisterPage.jsx`
- **Frontend:** `src/services/authService.js` - método `registrarCiudadano()`

---

### HU-002: Registro de Autoridad
**Como** autoridad municipal
**Quiero** solicitar registro en la plataforma
**Para** gestionar denuncias

**Criterios de Aceptación:**
- ✅ El formulario solicita: nombres, apellidos, DNI, email, contraseña, cargo, área
- ✅ Validación de email y DNI únicos
- ✅ Estado inicial: "pendiente" (requiere aprobación de admin)
- ✅ Mensaje informativo sobre proceso de aprobación

**Implementación:**
- **Backend:** `Servidor/src/models/Usuario.js` - método `crear()` con tipo_usuario=2
- **Backend:** `Servidor/src/controllers/authController.js` - método `registrarAutoridad()`
- **Backend:** `Servidor/src/routes/authRoutes.js` - POST `/auth/registro-autoridad`
- **Frontend:** `src/pages/auth/RegisterAutoridadPage/RegisterAutoridadPage.jsx`

---

### HU-003: Inicio de Sesión
**Como** usuario registrado
**Quiero** iniciar sesión
**Para** acceder a mis funcionalidades

**Criterios de Aceptación:**
- ✅ Login con email y contraseña
- ✅ Generación de token JWT válido por 7 días
- ✅ Validación de credenciales con bcrypt
- ✅ Redirección según tipo de usuario (ciudadano/autoridad/admin)
- ✅ Mensaje de error para credenciales inválidas

**Implementación:**
- **Backend:** `Servidor/src/controllers/authController.js` - método `login()`
- **Backend:** `Servidor/src/routes/authRoutes.js` - POST `/auth/login`
- **Backend:** `Servidor/src/middleware/auth.js` - middleware de autenticación JWT
- **Frontend:** `src/pages/auth/LoginPage/LoginPage.jsx`
- **Frontend:** `src/context/AuthContext.jsx` - gestión de estado de autenticación
- **Frontend:** `src/services/authService.js` - método `login()`

---

### HU-004: Cerrar Sesión
**Como** usuario autenticado
**Quiero** cerrar sesión
**Para** proteger mi cuenta

**Criterios de Aceptación:**
- ✅ Botón visible en navegación/header
- ✅ Eliminación de token del localStorage
- ✅ Redirección a página de login
- ✅ Limpieza del contexto de autenticación

**Implementación:**
- **Frontend:** `src/context/AuthContext.jsx` - método `cerrarSesion()`
- **Frontend:** `src/components/common/Header/Header.jsx` - botón cerrar sesión
- **Frontend:** `src/components/common/Navigation/Navigation.jsx` - opción en menú

---

## Sprint 2: Sistema de Denuncias ✅ COMPLETADO

### HU-005: Crear Nueva Denuncia
**Como** ciudadano autenticado
**Quiero** registrar una nueva denuncia
**Para** reportar problemas en mi comunidad

**Criterios de Aceptación:**
- ✅ Formulario con: título, descripción, categoría, ubicación, opción anónima
- ✅ Carga dinámica de categorías desde la API
- ✅ Validación de campos obligatorios
- ✅ Estado inicial automático: "Registrada"
- ✅ Confirmación visual tras registro exitoso
- ✅ Redirección a lista de denuncias

**Implementación:**
- **Backend:** `Servidor/src/models/Denuncia.js` - método `crear()`
- **Backend:** `Servidor/src/models/Categoria.js` - método `obtenerTodas()`
- **Backend:** `Servidor/src/controllers/denunciaController.js` - método `crearDenuncia()`
- **Backend:** `Servidor/src/routes/denunciaRoutes.js` - POST `/denuncias`
- **Backend:** Tabla `denuncia` con trigger para historial de estados
- **Frontend:** `src/pages/ciudadano/NuevaDenunciaPage/NuevaDenunciaPage.jsx`
- **Frontend:** `src/services/denunciaService.js` - método `crearDenuncia()`

---

### HU-006: Listar Mis Denuncias
**Como** ciudadano autenticado
**Quiero** ver todas mis denuncias
**Para** hacer seguimiento de su estado

**Criterios de Aceptación:**
- ✅ Lista con todas las denuncias del usuario autenticado
- ✅ Filtro por estado: Todas, Pendientes, En Proceso, Resueltas
- ✅ Estadísticas visibles: Total, Pendientes, En Proceso, Resueltas
- ✅ Información mostrada: título, descripción, fecha, ubicación, categoría, estado
- ✅ Botones de acción: Ver Detalles, Seguimiento
- ✅ Mapeo de estados de BD a filtros de UI

**Implementación:**
- **Backend:** `Servidor/src/models/Denuncia.js` - método `obtenerConFiltros()`
- **Backend:** `Servidor/src/controllers/denunciaController.js` - método `obtenerDenuncias()`
- **Backend:** Filtrado automático por id_ciudadano del usuario autenticado
- **Frontend:** `src/pages/ciudadano/DenunciasPage/DenunciasPage.jsx`
- **Frontend:** Función `mapearEstadoAFiltro()` para agrupar estados
- **Frontend:** `src/services/denunciaService.js` - método `obtenerDenuncias()`

---

### HU-007: Dashboard de Ciudadano
**Como** ciudadano autenticado
**Quiero** ver un resumen de mis denuncias
**Para** tener una vista general rápida

**Criterios de Aceptación:**
- ✅ Bienvenida personalizada con nombre del usuario
- ✅ Tarjetas con estadísticas: Total, Pendientes, En Proceso, Resueltas
- ✅ Accesos rápidos a: Nueva Denuncia, Mis Denuncias, Mi Perfil, Ayuda
- ✅ Lista de denuncias recientes (últimas 3)
- ✅ Carga de datos desde API real

**Implementación:**
- **Backend:** Reutiliza endpoint GET `/denuncias` con filtros
- **Frontend:** `src/pages/ciudadano/HomePage/HomePage.jsx`
- **Frontend:** `src/services/denunciaService.js` - método `obtenerEstadisticasUsuario()`
- **Frontend:** Cálculo de estadísticas en el frontend desde todas las denuncias

---

### HU-008: Dashboard de Autoridad
**Como** autoridad municipal
**Quiero** ver todas las denuncias del sistema
**Para** gestionarlas eficientemente

**Criterios de Aceptación:**
- ✅ Vista de todas las denuncias (no solo del usuario)
- ✅ Métricas calculadas: Pendientes, Asignadas, Resueltas, Urgentes
- ✅ Identificación de denuncias urgentes (pendientes > 7 días)
- ✅ Filtros por estado
- ✅ Lista con información completa de cada denuncia

**Implementación:**
- **Backend:** Endpoint GET `/denuncias` sin filtro de id_ciudadano para autoridades
- **Backend:** Lógica en controlador que detecta tipo de usuario
- **Frontend:** `src/pages/autoridad/DashboardAutoridadPage/DashboardAutoridadPage.jsx`
- **Frontend:** Cálculo de métricas incluyendo denuncias urgentes

---

### HU-009: Gestión de Categorías
**Como** sistema
**Quiero** proporcionar categorías predefinidas
**Para** clasificar las denuncias

**Criterios de Aceptación:**
- ✅ Endpoint para listar todas las categorías
- ✅ Endpoint para obtener categoría por ID
- ✅ Modelo con campos: id, nombre, descripción, área responsable
- ✅ Datos precargados en la base de datos

**Implementación:**
- **Backend:** `Servidor/src/models/Categoria.js`
- **Backend:** `Servidor/src/controllers/categoriaController.js`
- **Backend:** `Servidor/src/routes/categoriaRoutes.js` - GET `/categorias`, GET `/categorias/:id`
- **Frontend:** `src/services/denunciaService.js` - método `obtenerCategorias()`

---

### HU-010: Gestión de Estados
**Como** sistema
**Quiero** gestionar estados de denuncias con flujo válido
**Para** mantener consistencia en el ciclo de vida

**Criterios de Aceptación:**
- ✅ Estados definidos: Registrada, Pendiente, En Proceso, Asignada, Resuelta, Cerrada
- ✅ Orden de flujo con validación de transiciones
- ✅ Historial de cambios de estado con fecha y comentario
- ✅ Trigger automático para registrar en historial

**Implementación:**
- **Backend:** `Servidor/src/models/EstadoDenuncia.js`
- **Backend:** Tabla `estado_denuncia` con campo `orden_flujo`
- **Backend:** Tabla `historial_estado_denuncia` para auditoría
- **Backend:** Trigger `after_denuncia_estado_change` para registro automático
- **Backend:** Método `esTransicionValida()` para validar cambios
- **Backend:** `Servidor/src/controllers/estadoController.js`
- **Backend:** `Servidor/src/routes/estadoRoutes.js` - GET `/estados`

---

## Sprint 3: Diseño y Paleta Unificada ✅ COMPLETADO

### HU-011: Sistema de Diseño Unificado
**Como** desarrollador
**Quiero** una paleta de colores única y consistente
**Para** mantener coherencia visual en toda la aplicación

**Criterios de Aceptación:**
- ✅ Eliminación de todas las variables de color duplicadas
- ✅ Paleta completa de grises (gray-50 a gray-900)
- ✅ Colores semánticos para estados de denuncia
- ✅ Colores semánticos para roles de usuario
- ✅ Colores semánticos para prioridades
- ✅ Variables CSS reutilizables
- ✅ Constantes JavaScript con funciones helper

**Implementación:**
- **Frontend:** `src/index.css` - 50+ variables CSS unificadas
- **Frontend:** `src/constants/colors.js` - constantes y funciones helper
- **Frontend:** Funciones: `getEstadoColor()`, `getRolColor()`, `getPrioridadColor()`
- **Refactoring:** Actualización de 20+ componentes para usar nueva paleta

**Antes:** 437 colores hardcodeados, variables duplicadas
**Después:** Sistema unificado con paleta única declarada

---

## Sprint 4: Detalle y Seguimiento de Denuncias ✅ COMPLETADO (Backend)

### HU-012: Ver Detalle de Denuncia
**Como** usuario
**Quiero** ver información completa de una denuncia
**Para** conocer todos sus detalles

**Criterios de Aceptación:**
- ⏳ Vista con toda la información: título, descripción, categoría, ubicación, fecha
- ⏳ Información del denunciante (si no es anónima)
- ⏳ Estado actual con color semántico
- ⏳ Historial completo de cambios de estado
- ⏳ Galería de fotos de evidencia
- ⏳ Navegación a página de seguimiento

**Implementación:**
- **Backend:** ✅ Endpoint GET `/denuncias/:id` implementado
- **Backend:** ✅ Endpoint GET `/denuncias/:id/evidencias` implementado
- **Frontend:** ✅ `src/pages/ciudadano/DetalleDenunciaPage/DetalleDenunciaPage.jsx` creado
- **Frontend:** ⏳ Componente `TimelineEstados.jsx` pendiente
- **Frontend:** ⏳ Componente `GaleriaEvidencias.jsx` pendiente

---

### HU-013: Seguimiento de Denuncia
**Como** ciudadano
**Quiero** ver el progreso de mi denuncia
**Para** saber en qué estado se encuentra

**Criterios de Aceptación:**
- ⏳ Timeline visual con todos los estados
- ⏳ Indicador del estado actual
- ⏳ Fechas de cada cambio de estado
- ⏳ Comentarios de las autoridades en cada cambio
- ⏳ Vista responsive y clara

**Implementación Pendiente:**
- **Backend:** Método `obtenerHistorialEstados()` en `Denuncia.js`
- **Frontend:** Crear `src/pages/SeguimientoDenunciaPage/SeguimientoDenunciaPage.jsx`
- **Frontend:** Componente `TimelineVertical.jsx` con diseño visual atractivo

---

## Sprint 5: Evidencias Fotográficas ✅ COMPLETADO (Backend) 🔄 EN PROGRESO (Frontend)

### HU-014: Subir Fotos de Evidencia
**Como** ciudadano
**Quiero** adjuntar fotos a mi denuncia
**Para** proporcionar evidencia visual

**Criterios de Aceptación:**
- ⏳ Carga múltiple de imágenes (hasta 5 por denuncia)
- ⏳ Formatos aceptados: JPG, PNG, WebP
- ⏳ Tamaño máximo: 5MB por imagen
- ⏳ Preview antes de subir
- ⏳ Validación de formato y tamaño
- ⏳ Almacenamiento en servidor
- ⏳ Asociación con denuncia en BD

**Implementación:**
- **Backend:** ✅ Multer instalado (v2.0.2)
- **Backend:** ✅ Storage configurado en `Servidor/src/config/multer.js`
- **Backend:** ✅ Middleware de validación implementado
- **Backend:** ✅ Endpoint POST `/denuncias/:id/evidencias` implementado
- **Backend:** ✅ Upload de hasta 5 imágenes simultáneas
- **Frontend:** ✅ Componente `UploadFotos.jsx` creado
- **Frontend:** ⏳ Integración en `NuevaDenunciaPage.jsx` pendiente
- **Frontend:** ⏳ Preview de imágenes pendiente

**Estructura de Almacenamiento:**
```
uploads/
  evidencias/
    2025/
      01/
        denuncia-123-1.jpg
        denuncia-123-2.jpg
```

---

### HU-015: Ver Fotos de Evidencia
**Como** usuario
**Quiero** ver las fotos adjuntas a una denuncia
**Para** visualizar la evidencia

**Criterios de Aceptación:**
- ⏳ Galería de imágenes en página de detalle
- ⏳ Thumbnails clickeables
- ⏳ Lightbox para ver imagen completa
- ⏳ Navegación entre fotos
- ⏳ Información: fecha de subida, tamaño

**Implementación:**
- **Backend:** ✅ Endpoint GET `/denuncias/:id/evidencias` implementado
- **Backend:** ✅ Servir archivos estáticos configurado
- **Frontend:** ⏳ Componente `GaleriaEvidencias.jsx` pendiente
- **Frontend:** ⏳ Lightbox pendiente
- **Frontend:** ⏳ Integración en `DetalleDenunciaPage.jsx` pendiente

---

## Sprint 6: Gestión de Estados por Autoridades ✅ COMPLETADO (Backend) ⏳ PENDIENTE (Frontend)

### HU-016: Cambiar Estado de Denuncia
**Como** autoridad
**Quiero** actualizar el estado de una denuncia
**Para** reflejar su progreso

**Criterios de Aceptación:**
- ⏳ Lista de denuncias con opción de cambiar estado
- ⏳ Selector con estados válidos según transición
- ⏳ Campo obligatorio para comentario del cambio
- ⏳ Validación de transiciones en backend
- ⏳ Registro automático en historial
- ⏳ Actualización de `ultima_actualizacion`

**Implementación:**
- **Backend:** ✅ Endpoint PUT `/denuncias/:id/estado` implementado
- **Backend:** ✅ Validación de transiciones implementada
- **Backend:** ✅ Registro automático en historial
- **Frontend:** ✅ `src/pages/autoridad/GestionDenunciasPage/GestionDenunciasPage.jsx` creado
- **Frontend:** ⏳ Componente `ModalCambiarEstado.jsx` pendiente
- **Frontend:** ⏳ Integración completa pendiente

---

### HU-017: Asignar Denuncia a Área
**Como** autoridad
**Quiero** asignar una denuncia a un área específica
**Para** derivarla al responsable

**Criterios de Aceptación:**
- ⏳ Campo `area_asignada` en tabla `denuncia`
- ⏳ Lista de áreas predefinidas (Obras Públicas, Limpieza, Seguridad, etc.)
- ⏳ Cambio automático de estado a "Asignada"
- ⏳ Registro en historial
- ⏳ Notificación al área asignada (futuro)

**Implementación Pendiente:**
- **Backend:** Agregar campo `area_asignada` a tabla `denuncia`
- **Backend:** Endpoint PUT `/denuncias/:id/asignar`
- **Backend:** Método `asignarArea()` en `Denuncia.js`
- **Frontend:** Componente `ModalAsignarArea.jsx`
- **Frontend:** Integrar en `GestionDenunciasPage.jsx`

---

## Sprint 7: Sistema de Comentarios ✅ COMPLETADO (Backend) 🔄 EN PROGRESO (Frontend)

### HU-018: Agregar Comentario a Denuncia
**Como** usuario autenticado
**Quiero** agregar comentarios a una denuncia
**Para** proporcionar información adicional o hacer seguimiento

**Criterios de Aceptación:**
- ⏳ Formulario de comentario en página de detalle
- ⏳ Validación: mínimo 5 caracteres
- ⏳ Identificación de autor (ciudadano/autoridad)
- ⏳ Fecha y hora del comentario
- ⏳ Comentarios ordenados cronológicamente

**Implementación:**
- **Backend:** ✅ Modelo `Comentario` con MongoDB implementado
- **Backend:** ✅ Controller `comentarioController.js` implementado
- **Backend:** ✅ Endpoint POST `/denuncias/:id/comentarios` implementado
- **Backend:** ✅ Endpoint GET `/denuncias/:id/comentarios` implementado
- **Backend:** ✅ Endpoints PUT/DELETE para gestión individual
- **Backend:** ✅ Endpoint GET `/denuncias/:id/comentarios/estadisticas`
- **Frontend:** ✅ Componente `Comentarios.jsx` creado
- **Frontend:** ⏳ Integración en `DetalleDenunciaPage.jsx` pendiente

---

### HU-019: Ver Comentarios de Denuncia
**Como** usuario
**Quiero** ver todos los comentarios de una denuncia
**Para** seguir la conversación

**Criterios de Aceptación:**
- ⏳ Lista cronológica de comentarios
- ⏳ Avatar/icono según tipo de usuario
- ⏳ Nombre del autor
- ⏳ Fecha relativa (hace 2 horas, hace 1 día)
- ⏳ Comentarios internos solo visibles para autoridades

**Implementación:**
- **Backend:** ✅ Endpoint GET `/denuncias/:id/comentarios` implementado
- **Backend:** ✅ Filtrado de comentarios implementado
- **Frontend:** ⏳ Componente `ComentarioItem.jsx` pendiente
- **Frontend:** ⏳ Formateo de fechas pendiente

---

## Sprint 8: Reportes y Estadísticas ✅ COMPLETADO (Backend) 🔄 EN PROGRESO (Frontend)

### HU-020: Dashboard con Gráficos
**Como** autoridad/admin
**Quiero** ver estadísticas visuales
**Para** analizar tendencias y métricas

**Criterios de Aceptación:**
- ⏳ Gráfico de barras: denuncias por categoría
- ⏳ Gráfico de líneas: denuncias por mes
- ⏳ Gráfico circular: distribución por estado
- ⏳ KPIs: total, tasa de resolución, tiempo promedio
- ⏳ Filtros por rango de fechas

**Implementación:**
- **Backend:** ✅ `Servidor/src/controllers/estadisticasController.js` implementado
- **Backend:** ✅ Endpoint GET `/estadisticas` (general) implementado
- **Backend:** ✅ Endpoint GET `/estadisticas/resumen` implementado
- **Backend:** ✅ Endpoint GET `/estadisticas/categoria/:id` implementado
- **Backend:** ✅ Agregaciones con MongoDB implementadas
- **Frontend:** ✅ Recharts instalado (v3.4.1)
- **Frontend:** ✅ `src/pages/ciudadano/ReportesPage/ReportesPage.jsx` creado
- **Frontend:** 🔄 Gráficos en desarrollo
- **Frontend:** ⏳ Componentes de visualización pendientes

**Ejemplo de Endpoint:**
```javascript
// GET /api/v1/estadisticas/denuncias-por-categoria
{
  success: true,
  data: [
    { categoria: "Alumbrado Público", total: 45 },
    { categoria: "Baches y Vías", total: 32 },
    { categoria: "Limpieza", total: 28 }
  ]
}
```

---

### HU-021: Exportar Reportes
**Como** autoridad
**Quiero** exportar reportes en PDF/Excel
**Para** presentarlos en reuniones

**Criterios de Aceptación:**
- ⏳ Botón "Exportar a PDF"
- ⏳ Botón "Exportar a Excel"
- ⏳ PDF con gráficos y tabla de datos
- ⏳ Excel con múltiples hojas (datos, resumen, gráficos)
- ⏳ Inclusión de filtros aplicados

**Implementación Pendiente:**
- **Backend:** Instalar `pdfkit` y `exceljs`
- **Backend:** Endpoint GET `/estadisticas/exportar-pdf`
- **Backend:** Endpoint GET `/estadisticas/exportar-excel`
- **Backend:** Generación de documentos en servidor
- **Frontend:** Botones de descarga
- **Frontend:** Indicador de progreso durante generación

---

## Sprint 9: Mapas Interactivos 📅 PENDIENTE

### HU-022: Seleccionar Ubicación en Mapa
**Como** ciudadano
**Quiero** seleccionar la ubicación de mi denuncia en un mapa
**Para** proporcionar la localización exacta

**Criterios de Aceptación:**
- ⏳ Mapa interactivo en formulario de nueva denuncia
- ⏳ Marcador arrastrable para seleccionar ubicación
- ⏳ Geocodificación inversa para obtener dirección
- ⏳ Autocompletado de campo de dirección
- ⏳ Coordenadas guardadas (latitud, longitud)

**Implementación Pendiente:**
- **Frontend:** Instalar `react-leaflet` y `leaflet`: `npm install react-leaflet leaflet`
- **Frontend:** Crear componente `MapaPicker.jsx`
- **Frontend:** Integrar OpenStreetMap como proveedor de tiles
- **Frontend:** API de geocodificación: Nominatim (gratuita)
- **Frontend:** Integrar en `NuevaDenunciaPage.jsx`
- **Frontend:** CSS para leaflet: `import 'leaflet/dist/leaflet.css'`

**Ejemplo de Componente:**
```jsx
<MapaPicker
  center={[-12.0464, -77.0428]} // Lima, Perú
  zoom={13}
  onLocationSelect={(lat, lng, address) => {
    setFormData({
      ...formData,
      latitud: lat,
      longitud: lng,
      direccion_geolocalizada: address
    });
  }}
/>
```

---

### HU-023: Visualizar Denuncias en Mapa
**Como** usuario
**Quiero** ver todas las denuncias en un mapa
**Para** identificar zonas con más problemas

**Criterios de Aceptación:**
- ⏳ Mapa con marcadores de todas las denuncias
- ⏳ Colores de marcadores según estado
- ⏳ Popup al hacer clic con información básica
- ⏳ Clustering de marcadores para mejor rendimiento
- ⏳ Filtro por categoría y estado

**Implementación Pendiente:**
- **Frontend:** Crear `src/pages/MapaDenunciasPage/MapaDenunciasPage.jsx`
- **Frontend:** Componente `MapaVisualizacion.jsx`
- **Frontend:** Usar `react-leaflet-cluster` para clustering
- **Frontend:** Componente `MarkerDenuncia.jsx` personalizado
- **Frontend:** Componente `PopupDenuncia.jsx` con info

---

## Sprint 10: Panel de Administración 📅 PENDIENTE

### HU-024: Gestionar Usuarios
**Como** administrador
**Quiero** administrar usuarios del sistema
**Para** aprobar autoridades y gestionar accesos

**Criterios de Aceptación:**
- ⏳ Lista de todos los usuarios con filtros
- ⏳ Aprobación de autoridades pendientes
- ⏳ Activación/desactivación de cuentas
- ⏳ Edición de información de usuario
- ⏳ Eliminación de usuarios (soft delete)

**Implementación Pendiente:**
- **Backend:** Endpoint GET `/usuarios` (solo admin)
- **Backend:** Endpoint PUT `/usuarios/:id/aprobar`
- **Backend:** Endpoint PUT `/usuarios/:id/estado`
- **Backend:** Middleware de autorización para admin
- **Frontend:** Crear `src/pages/admin/GestionUsuariosPage/GestionUsuariosPage.jsx`
- **Frontend:** Componente `TablaUsuarios.jsx`
- **Frontend:** Componente `ModalEditarUsuario.jsx`

---

### HU-025: Gestionar Categorías
**Como** administrador
**Quiero** administrar categorías de denuncias
**Para** mantener el catálogo actualizado

**Criterios de Aceptación:**
- ⏳ Lista de todas las categorías
- ⏳ Crear nueva categoría
- ⏳ Editar categoría existente
- ⏳ Desactivar categoría (no eliminar si tiene denuncias)
- ⏳ Asignar área responsable

**Implementación Pendiente:**
- **Backend:** Endpoint POST `/categorias` (solo admin)
- **Backend:** Endpoint PUT `/categorias/:id` (solo admin)
- **Backend:** Endpoint DELETE `/categorias/:id` con validación
- **Frontend:** Crear `src/pages/admin/GestionCategoriasPage/GestionCategoriasPage.jsx`
- **Frontend:** Componente `FormularioCategoria.jsx`
- **Frontend:** Validación de eliminación

---

### HU-026: Estadísticas Globales del Sistema
**Como** administrador
**Quiero** ver métricas globales del sistema
**Para** monitorear su desempeño

**Criterios de Aceptación:**
- ⏳ Total de usuarios por tipo
- ⏳ Total de denuncias por estado
- ⏳ Denuncias registradas hoy/semana/mes
- ⏳ Tasa de resolución
- ⏳ Tiempo promedio de resolución
- ⏳ Categorías más reportadas

**Implementación Pendiente:**
- **Backend:** Endpoint GET `/estadisticas/globales` (solo admin)
- **Backend:** Queries complejas con agregaciones
- **Frontend:** Crear `src/pages/admin/DashboardAdminPage/DashboardAdminPage.jsx`
- **Frontend:** Componentes de visualización con recharts

---

## Sprints Futuros (Opcional) 🔮

### HU-027: Notificaciones Push
**Como** usuario
**Quiero** recibir notificaciones de cambios
**Para** estar al tanto del estado de mis denuncias

**Tecnologías:** Firebase Cloud Messaging, Web Push API

---

### HU-028: Sistema de Votación
**Como** ciudadano
**Quiero** votar denuncias importantes
**Para** darles mayor visibilidad

---

### HU-029: Chat en Tiempo Real
**Como** usuario
**Quiero** comunicarme en tiempo real con autoridades
**Para** resolver dudas rápidamente

**Tecnologías:** Socket.io, WebSockets

---

### HU-030: Aplicación Móvil
**Como** ciudadano
**Quiero** una app móvil nativa
**Para** reportar desde mi celular

**Tecnologías:** React Native, Expo

---

## Resumen de Estado

### Backend Completado (95%) ✅
- ✅ Autenticación completa (JWT, recuperación de contraseña)
- ✅ Gestión de usuarios (perfil, cambio password, historial)
- ✅ CRUD completo de denuncias
- ✅ Sistema de categorías (8 categorías)
- ✅ Sistema de estados (7 estados + validación de transiciones)
- ✅ Upload de evidencias fotográficas (Multer + hasta 5 imágenes)
- ✅ Sistema de comentarios completo
- ✅ Estadísticas y reportes (3 endpoints)
- ✅ MongoDB Atlas conectado y funcionando

### Frontend Completado (70%) 🔄
- ✅ Autenticación y rutas protegidas
- ✅ Dashboard ciudadano
- ✅ Dashboard autoridad
- ✅ Páginas: Denuncias, Nueva Denuncia, Detalle, Perfil
- ✅ Componentes: MapaPicker, UploadFotos, Comentarios
- ✅ Paleta de colores unificada
- ✅ Diseño responsive
- ✅ Leaflet instalado (v1.9.4)
- ✅ Recharts instalado (v3.4.1)

### Pendiente - Integración Frontend (15%)
- ⏳ Integrar UploadFotos en NuevaDenunciaPage
- ⏳ Integrar Comentarios en DetalleDenunciaPage
- ⏳ Completar página de Reportes con gráficos
- ⏳ Implementar GaleriaEvidencias con lightbox
- ⏳ Timeline de estados
- ⏳ Mapas interactivos completos

---

## Dependencias Técnicas

### Backend
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  },
  "pendientes": {
    "multer": "^1.4.5-lts.1",
    "pdfkit": "^0.13.0",
    "exceljs": "^4.3.0"
  }
}
```

### Frontend
```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.9.3",
    "axios": "^1.12.2",
    "react-lottie-player": "^2.1.0"
  },
  "pendientes": {
    "recharts": "^2.10.0",
    "react-leaflet": "^4.2.1",
    "leaflet": "^1.9.4",
    "react-leaflet-cluster": "^2.1.0",
    "react-image-lightbox": "^5.1.4"
  }
}
```

---

**Última actualización:** 2025-01-19
**Versión:** 2.0
