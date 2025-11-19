# INFORME TÉCNICO FRONTEND
## PLATAFORMA WEB PARA DENUNCIA CIUDADANA DE PROBLEMAS URBANOS

> Informe técnico completo con arquitectura, especificaciones y guía de implementación del frontend

## 📑 Navegación de Documentación

- **[⬅️ README Principal](README.md)** - Vista general del proyecto
- **[📱 README Frontend](README_FRONTEND.md)** - Estado actual y funcionalidades
- **[🔌 README Backend](README_BACKEND.md)** - Documentación del servidor
- **[🎨 Sistema de Diseño](DESIGN_SYSTEM.md)** - Guía de diseño completa
- **[📖 Informe Backend](Backend.md)** - Especificaciones técnicas del servidor

---

## 1. CONTEXTO DEL PROYECTO

Desarrollar el frontend completo en React para una Plataforma Web de Denuncia Ciudadana de Problemas Urbanos. La interfaz debe ser intuitiva, responsive y permitir una experiencia fluida tanto para ciudadanos que reportan problemas como para autoridades que gestionan las denuncias.

---

## 2. STACK TECNOLÓGICO DEFINIDO

- **Librería**: React 18+ (con React Hooks)
- **Lenguaje**: JavaScript (JSX)
- **Enrutamiento**: React Router DOM v6
- **Gestión de Estado**: Context API
- **Peticiones HTTP**: Axios
- **Mapas**: Leaflet con react-leaflet
- **Formularios**: React Hook Form
- **Validación**: Yup
- **Estilos**: CSS Modules + Variables CSS personalizadas
- **Iconografía**: React Icons o Lucide React

---

## 3. ARQUITECTURA GENERAL DEL FRONTEND

### 3.1 Patrón Arquitectónico

Implementar arquitectura basada en componentes con separación clara de responsabilidades:

- **Pages**: Vistas principales de la aplicación
- **Components**: Componentes reutilizables
- **Contexts**: Manejo de estado global con Context API
- **Services**: Lógica de comunicación con el backend
- **Hooks**: Custom hooks para lógica reutilizable
- **Utils**: Funciones auxiliares y helpers
- **Assets**: Recursos estáticos (imágenes, iconos)

### 3.2 Estructura de Carpetas Propuesta

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.module.css
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Loading/
│   │   │   ├── Alert/
│   │   │   └── Pagination/
│   │   │
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   └── Navbar/
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm/
│   │   │   ├── RegisterForm/
│   │   │   └── ForgotPasswordForm/
│   │   │
│   │   ├── denuncias/
│   │   │   ├── DenunciaCard/
│   │   │   ├── DenunciaForm/
│   │   │   ├── DenunciaDetalle/
│   │   │   ├── EvidenciaUpload/
│   │   │   ├── MapaPicker/
│   │   │   ├── HistorialEstados/
│   │   │   └── FiltrosDenuncias/
│   │   │
│   │   ├── dashboard/
│   │   │   ├── StatsCard/
│   │   │   ├── GraficoPorCategoria/
│   │   │   ├── GraficoPorEstado/
│   │   │   ├── MapaCalor/
│   │   │   └── TablaDenuncias/
│   │   │
│   │   └── admin/
│   │       ├── UsuariosTable/
│   │       ├── CategoriaManager/
│   │       └── AuditoriaLog/
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── LandingPage/
│   │   │   ├── LoginPage/
│   │   │   ├── RegisterPage/
│   │   │   └── ForgotPasswordPage/
│   │   │
│   │   ├── ciudadano/
│   │   │   ├── HomePage/
│   │   │   ├── CrearDenunciaPage/
│   │   │   ├── MisDenunciasPage/
│   │   │   ├── DetalleDenunciaPage/
│   │   │   ├── SeguimientoPage/
│   │   │   ├── PerfilPage/
│   │   │   └── MapaDenunciasPage/
│   │   │
│   │   ├── autoridad/
│   │   │   ├── DashboardAutoridadPage/
│   │   │   ├── GestionDenunciasPage/
│   │   │   ├── MisAsignadasPage/
│   │   │   ├── ReportesPage/
│   │   │   └── PerfilAutoridadPage/
│   │   │
│   │   └── admin/
│   │       ├── DashboardAdminPage/
│   │       ├── GestionUsuariosPage/
│   │       ├── GestionCategoriasPage/
│   │       ├── EstadisticasGlobalesPage/
│   │       └── AuditoriaPage/
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── DenunciaContext.jsx
│   │   └── NotificationContext.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── denunciaService.js
│   │   ├── usuarioService.js
│   │   ├── categoriaService.js
│   │   ├── reporteService.js
│   │   └── geoService.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useDenuncias.js
│   │   ├── useGeolocation.js
│   │   ├── useDebounce.js
│   │   └── useFileUpload.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── helpers.js
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── RoleRoute.jsx
│   │
│   ├── styles/
│   │   ├── variables.css
│   │   ├── globals.css
│   │   └── reset.css
│   │
│   ├── App.jsx
│   ├── App.css
│   └── index.js
│
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## 4. SISTEMA DE DISEÑO

Para la especificación completa del sistema de diseño, consultar **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)**.

### 4.1 Resumen de Variables CSS

**Colores principales:**
- `--color-primary-main: #7592EB` - Azul principal
- `--color-primary-light: #A5C1EB` - Azul claro
- `--color-primary-dark: #03193B` - Azul oscuro

**Tipografía:**
- Títulos: `--font-headings` (DM Serif Text)
- Contenido: `--font-body` (Montserrat)

**Espaciado:** Múltiplos de 8px (`--spacing-xs` a `--spacing-3xl`)

### 4.2 Principios de Diseño

✅ Diseño mobile-first con breakpoints responsive
✅ Espaciado consistente basado en múltiplos de 8px
✅ Paleta de colores limitada y coherente (WCAG AA)
✅ Feedback visual inmediato en interacciones
✅ Componentes reutilizables y modulares

**Ver más**: [Sistema de Diseño completo](DESIGN_SYSTEM.md)

---

## 5. FLUJO DE NAVEGACIÓN Y PÁGINAS

### 5.1 Landing Page (Pública)

**Propósito:** Primera impresión del sistema, explicación del servicio y call-to-action

**Secciones:**

1. **Hero Section**
   - Título principal con tipografía DM Serif Text
   - Subtítulo descriptivo
   - Botones destacados: "Reportar Problema" y "Iniciar Sesión"
   - Imagen o ilustración representativa

2. **Sección de Beneficios**
   - Cards con iconografía
   - Explicación de las ventajas del sistema
   - Testimonios o estadísticas de impacto

3. **Sección de Cómo Funciona**
   - Pasos visuales del proceso de denuncia
   - Numeración clara (1, 2, 3)

4. **Sección de Categorías**
   - Grid visual de tipos de problemas reportables
   - Iconos representativos

5. **Mapa Interactivo de Denuncias Públicas**
   - Visualización de denuncias resueltas o en proceso
   - Sin información sensible

6. **Call to Action Final**
   - Invitación al registro
   - Footer con información de contacto

### 5.2 Páginas de Autenticación

**Login Page**
- Formulario simple: email y contraseña
- Link a "Olvidé mi contraseña"
- Link a "Registrarse"
- Validación en tiempo real
- Mensajes de error claros

**Register Page - Ciudadano**
- Formulario multi-step o single-page
- Campos: nombres, apellidos, documento, email, teléfono, dirección, contraseña
- Validación de fortaleza de contraseña
- Checkbox de términos y condiciones
- Confirmación de contraseña

**Register Page - Autoridad**
- Similar a ciudadano con campos adicionales
- Validación especial según el tipo de autoridad
- Posible aprobación manual por admin

**Forgot Password Page**
- Input de email
- Mensaje de confirmación de envío
- Instrucciones claras

### 5.3 Área de Ciudadano (Protegida)

**HomePage/Dashboard Ciudadano**
- Resumen de denuncias activas del usuario
- Acceso rápido a "Nueva Denuncia"
- Notificaciones recientes
- Mapa con ubicación de sus denuncias

**Crear Denuncia Page**
- Formulario en steps:
  1. Información básica (categoría, título, descripción)
  2. Ubicación (mapa interactivo + detección automática)
  3. Evidencia fotográfica (drag & drop)
  4. Revisión y confirmación

**Mis Denuncias Page**
- Lista/grid de denuncias del usuario
- Filtros por estado y categoría
- Barra de búsqueda
- Tarjetas con información resumida
- Badges de estado con colores diferenciados

**Detalle de Denuncia Page**
- Información completa de la denuncia
- Galería de fotos
- Mapa con marcador de ubicación
- Línea de tiempo de cambios de estado
- Sección de comentarios/comunicación
- Botones de acción según estado

**Seguimiento Page**
- Búsqueda por código de seguimiento
- Timeline visual del proceso
- Estado actual destacado

**Perfil Page**
- Edición de datos personales
- Cambio de contraseña
- Historial de actividad

**Mapa de Denuncias Page**
- Mapa interactivo con todas las denuncias del usuario
- Clusterización de marcadores
- Filtros laterales
- Popup con info al hacer clic en marcador

### 5.4 Área de Autoridad (Protegida)

**Dashboard Autoridad Page**
- Métricas clave (denuncias pendientes, asignadas, resueltas)
- Gráficos de categorías
- Tabla de denuncias recientes
- Filtros y búsqueda

**Gestión de Denuncias Page**
- Tabla completa con paginación
- Filtros avanzados (estado, categoría, fecha, ubicación)
- Acciones masivas
- Vista de mapa opcional
- Exportación de datos

**Mis Asignadas Page**
- Lista de denuncias asignadas específicamente
- Priorización visual
- Acciones rápidas de cambio de estado

**Reportes Page**
- Generación de reportes personalizados
- Selección de período, categoría, estado
- Visualización de gráficos
- Descarga en PDF/Excel

**Perfil Autoridad Page**
- Similar a perfil ciudadano
- Información de área de responsabilidad

### 5.5 Área de Administrador (Protegida)

**Dashboard Admin Page**
- Vista global del sistema
- Estadísticas completas
- Gráficos de tendencias
- Alertas del sistema

**Gestión de Usuarios Page**
- Tabla completa de todos los usuarios
- Búsqueda y filtros por rol
- Acciones: activar/desactivar, cambiar rol, eliminar
- Modal de edición de usuario

**Gestión de Categorías Page**
- CRUD completo de categorías
- Reordenamiento
- Asignación de áreas responsables

**Estadísticas Globales Page**
- Dashboards personalizables
- Comparativas temporales
- Métricas de rendimiento del sistema

**Auditoría Page**
- Log de todas las acciones administrativas
- Filtros por usuario, acción, fecha
- Exportación de registros

---

## 6. DIVISIÓN POR HISTORIAS DE USUARIO

### SPRINT 1 (4 semanas)

#### HU-01: Registro e Inicio de Sesión de Ciudadanos

**Páginas involucradas:** LoginPage, RegisterPage (Ciudadano)

**Componentes a desarrollar:**
- LoginForm con validación
- RegisterForm con multi-step (opcional)
- Alert para mensajes de éxito/error
- Loading spinner

**Contexts:** AuthContext (creación y configuración)

**Services:** authService (login, register, logout)

**Hooks:** useAuth (custom hook para acceder a AuthContext)

**Validaciones:** email, contraseña, documento de identidad

#### HU-02: Registro e Inicio de Sesión de Autoridades

**Páginas involucradas:** RegisterPage (Autoridad)

**Componentes a desarrollar:**
- Extensión de RegisterForm para autoridades
- Campos adicionales según tipo de autoridad

**Actualización de AuthContext** para manejar roles

**Validaciones específicas** de autoridad

#### HU-03: Gestión de Perfil de Usuario

**Páginas involucradas:** PerfilPage

**Componentes a desarrollar:**
- FormularioEdicionPerfil
- CambioPasswordModal
- HistorialActividad (tabla simple)

**Services:** usuarioService (getProfile, updateProfile, changePassword)

**Validaciones** de actualización de datos

#### HU-04: Recuperación de Contraseña

**Páginas involucradas:** ForgotPasswordPage, ResetPasswordPage

**Componentes a desarrollar:**
- ForgotPasswordForm
- ResetPasswordForm

**Services:** authService (forgotPassword, resetPassword)

**Feedback visual** de envío de email

---

### SPRINT 2 (4 semanas)

#### HU-05: Creación de Denuncia con Categorización

**Páginas involucradas:** CrearDenunciaPage

**Componentes a desarrollar:**
- DenunciaFormStep1 (información básica)
- SelectorCategoria (dropdown o cards)
- TextareaDescripcion con contador de caracteres

**Context:** DenunciaContext (para manejar formulario multi-step)

**Services:** denunciaService (crearDenuncia), categoriaService (getCategorias)

**Validaciones** de campos obligatorios

#### HU-06: Carga de Evidencia Fotográfica

**Páginas involucradas:** CrearDenunciaPage (step 3)

**Componentes a desarrollar:**
- EvidenciaUpload (drag & drop zone)
- ImagePreview con opción de eliminar
- ProgressBar de carga

**Hooks:** useFileUpload (manejo de archivos, validación, compresión)

**Validaciones:** tipo de archivo, tamaño máximo, límite de 5 imágenes

**Feedback visual** durante carga

#### HU-07: Geolocalización de Denuncias

**Páginas involucradas:** CrearDenunciaPage (step 2)

**Componentes a desarrollar:**
- MapaPicker (Leaflet interactivo)
- BotonDetectarUbicacion
- InputDireccion (autocomplete opcional)

**Hooks:** useGeolocation (detección automática)

**Services:** geoService (geocodificación inversa)

**Manejo de permisos** del navegador para geolocalización

#### HU-08: Sistema de Estados de Denuncia

**Páginas involucradas:** DetalleDenunciaPage, GestionDenunciasPage

**Componentes a desarrollar:**
- BadgeEstado (visual diferenciado por estado)
- SelectorEstado (solo para autoridades)
- ModalCambioEstado con textarea para comentario

**Services:** denunciaService (cambiarEstado)

**Validaciones** de permisos según rol

---

### SPRINT 3 (4 semanas)

#### HU-09: Seguimiento de Denuncias

**Páginas involucradas:** SeguimientoPage, DetalleDenunciaPage

**Componentes a desarrollar:**
- InputCodigoSeguimiento con botón de búsqueda
- TimelineEstados (línea de tiempo visual)
- CardCambioEstado (cada nodo del timeline)

**Services:** denunciaService (getHistorial)

**Animaciones sutiles** en timeline

#### HU-10: Sistema de Comentarios

**Páginas involucradas:** DetalleDenunciaPage

**Componentes a desarrollar:**
- SeccionComentarios
- FormularioComentario
- ListaComentarios
- CardComentario (con avatar, fecha, rol del usuario)

**Services:** denunciaService (agregarComentario, getComentarios)

**Context:** NotificationContext (para notificaciones en tiempo real)

#### HU-11: Dashboard de Autoridades

**Páginas involucradas:** DashboardAutoridadPage

**Componentes a desarrollar:**
- StatsCard (denuncias por estado)
- GraficoPorCategoria (chart.js o recharts)
- TablaDenunciasRecientes
- FiltrosRapidos

**Services:** reporteService (getEstadisticas, getDenunciasPorCategoria)

**Responsive cards** con grid system

#### HU-12: Gestión de Denuncias por Autoridades

**Páginas involucradas:** GestionDenunciasPage

**Componentes a desarrollar:**
- FiltrosDenuncias (sidebar o collapsible)
- TablaDenuncias con paginación
- AccionesMasivas (dropdown de acciones)
- ToggleVistaMapaTabla
- BotonExportar

**Services:** denunciaService (getDenuncias con filtros), reporteService (exportar)

**Hooks:** useDebounce (para búsqueda en tiempo real)

---

### SPRINT 4 (4 semanas)

#### HU-13: Administración de Usuarios

**Páginas involucradas:** GestionUsuariosPage

**Componentes a desarrollar:**
- TablaUsuarios con búsqueda y filtros
- ModalEditarUsuario
- DropdownAcciones (activar/desactivar, cambiar rol, eliminar)
- ConfirmacionModal (para acciones críticas)

**Services:** usuarioService (getUsuarios, updateUsuario, deleteUsuario)

**Validaciones** de permisos (no auto-eliminación)

#### HU-14: Reportes Estadísticos

**Páginas involucradas:** ReportesPage

**Componentes a desarrollar:**
- FormularioGenerarReporte
- SelectorPeriodo (date range picker)
- MultiSelectorCategorias y Estados
- VistaPreviewReporte

**Services:** reporteService (generarReporte, getEstadisticas)

**Visualización** de datos antes de exportar

#### HU-15: Visualización de Datos y Exportación

**Páginas involucradas:** ReportesPage, EstadisticasGlobalesPage

**Componentes a desarrollar:**
- GraficoPorEstado (pie chart)
- GraficoTendencias (line chart)
- GraficoTiempoResolucion (bar chart)
- BotonDescargarPDF
- BotonDescargarExcel

**Librerías:** recharts o chart.js para gráficos

**Services:** reporteService (exportarPDF, exportarExcel)

#### HU-16: Búsqueda Avanzada

**Páginas involucradas:** MisDenunciasPage, GestionDenunciasPage

**Componentes a desarrollar:**
- PanelBusquedaAvanzada (collapsible)
- InputBusquedaTexto con debounce
- FiltrosCombinables (checkboxes, selects, date pickers)
- BotonesGuardarFiltro
- ListaFiltrosGuardados

**Hooks:** useDebounce, useFiltros (custom hook para lógica de filtros)

**Services:** denunciaService (busquedaAvanzada)

**Persistencia** de filtros en localStorage

---

## 7. GESTIÓN DE ESTADO CON CONTEXT API

### 7.1 AuthContext

**Responsabilidad:** Manejo de autenticación y usuario actual

**Estado:**
- `user`: Objeto con datos del usuario autenticado
- `token`: JWT almacenado
- `isAuthenticated`: Boolean
- `isLoading`: Boolean

**Funciones:**
- `login(credentials)`
- `logout()`
- `register(userData)`
- `updateProfile(updatedData)`
- `checkAuth()`

**Persistencia:** LocalStorage para token

### 7.2 DenunciaContext

**Responsabilidad:** Manejo de denuncias en formulario multi-step

**Estado:**
- `denunciaEnProceso`: Datos del formulario
- `currentStep`: Paso actual
- `categorias`: Lista de categorías disponibles

**Funciones:**
- `updateDenunciaData(data)`
- `nextStep()`
- `prevStep()`
- `submitDenuncia()`
- `resetForm()`

### 7.3 NotificationContext

**Responsabilidad:** Manejo de notificaciones y alertas

**Estado:**
- `notifications`: Array de notificaciones

**Funciones:**
- `showSuccess(message)`
- `showError(message)`
- `showWarning(message)`
- `showInfo(message)`
- `clearNotifications()`

---

## 8. SERVICIOS API

### 8.1 Configuración Base (api.js)

- Instancia de Axios con baseURL configurable
- Interceptor de request para agregar token JWT
- Interceptor de response para manejo global de errores
- Manejo de refresh token si aplica

### 8.2 authService.js

**Funciones:**
- `login(email, password)`
- `register(userData)`
- `logout()`
- `forgotPassword(email)`
- `resetPassword(token, newPassword)`
- `verifyToken()`

### 8.3 denunciaService.js

**Funciones:**
- `crearDenuncia(denunciaData)`
- `getDenuncias(filtros, paginacion)`
- `getDenunciaById(id)`
- `updateDenuncia(id, data)`
- `deleteDenuncia(id)`
- `cambiarEstado(id, nuevoEstado, comentario)`
- `agregarComentario(id, comentario)`
- `getDenunciasCercanas(lat, lng, radio)`
- `busquedaAvanzada(criterios)`
- `subirEvidencias(id, archivos)`
- `eliminarEvidencia(idEvidencia)`

### 8.4 usuarioService.js

**Funciones:**
- `getProfile()`
- `updateProfile(data)`
- `changePassword(oldPassword, newPassword)`
- `getUsuarios(filtros)` - Admin
- `updateUsuario(id, data)` - Admin
- `deleteUsuario(id)` - Admin

### 8.5 categoriaService.js

**Funciones:**
- `getCategorias()`
- `createCategoria(data)` - Admin
- `updateCategoria(id, data)` - Admin
- `deleteCategoria(id)` - Admin

### 8.6 reporteService.js

**Funciones:**
- `getEstadisticasGenerales()`
- `getDenunciasPorCategoria(periodo)`
- `getDenunciasPorEstado(periodo)`
- `getTiemposResolucion()`
- `generarReporte(configuracion)`
- `exportarPDF(reporteId)`
- `exportarExcel(reporteId)`

### 8.7 geoService.js

**Funciones:**
- `geocodificarInversa(lat, lng)`
- `buscarDireccion(texto)` - Autocomplete
- `calcularDistancia(punto1, punto2)`

---

## 9. CUSTOM HOOKS

### 9.1 useAuth

Encapsula la lógica de AuthContext para uso simplificado en componentes

### 9.2 useDenuncias

Manejo de estado local de denuncias con funciones de filtrado y ordenamiento

### 9.3 useGeolocation

Detección automática de ubicación del usuario con manejo de permisos y errores

### 9.4 useDebounce

Retrasa la ejecución de funciones (útil para búsquedas en tiempo real)

### 9.5 useFileUpload

Manejo completo de carga de archivos: validación, preview, progreso, compresión

### 9.6 usePagination

Lógica reutilizable de paginación

---

## 10. COMPONENTES COMUNES REUTILIZABLES

### 10.1 Button

- Variantes: primary, secondary, danger, outlined, text
- Tamaños: small, medium, large
- Estados: loading, disabled

### 10.2 Input

- Tipos: text, email, password, number, tel
- Con label y mensaje de error
- Validación visual

### 10.3 Card

- Container base para información agrupada
- Con header, body, footer opcionales

### 10.4 Modal

- Overlay oscuro
- Contenido centrado
- Botón de cierre
- Bloqueo de scroll del body

### 10.5 Loading

- Spinner global
- Skeleton loaders para contenido

### 10.6 Alert

- Tipos: success, error, warning, info
- Colores según tipo
- Auto-dismiss opcional

### 10.7 Pagination

- Números de página
- Botones prev/next
- Información de total de registros

---

## 11. RUTAS Y PROTECCIÓN

### 11.1 Rutas Públicas

- `/` - LandingPage
- `/login` - LoginPage
- `/register/ciudadano` - RegisterPage Ciudadano
- `/register/autoridad` - RegisterPage Autoridad
- `/forgot-password` - ForgotPasswordPage
- `/reset-password/:token` - ResetPasswordPage

### 11.2 Rutas Protegidas - Ciudadano

- `/home` - HomePage
- `/denuncias/crear` - CrearDenunciaPage
- `/denuncias/mis-denuncias` - MisDenunciasPage
- `/denuncias/:id` - DetalleDenunciaPage
- `/seguimiento` - SeguimientoPage
- `/perfil` - PerfilPage
- `/mapa` - MapaDenunciasPage

### 11.3 Rutas Protegidas - Autoridad

- `/autoridad/dashboard` - DashboardAutoridadPage
- `/autoridad/denuncias` - GestionDenunciasPage
- `/autoridad/asignadas` - MisAsignadasPage
- `/autoridad/reportes` - ReportesPage
- `/autoridad/perfil` - PerfilAutoridadPage

### 11.4 Rutas Protegidas - Admin

- `/admin/dashboard` - DashboardAdminPage
- `/admin/usuarios` - GestionUsuariosPage
- `/admin/categorias` - GestionCategoriasPage
- `/admin/estadisticas` - EstadisticasGlobalesPage
- `/admin/auditoria` - AuditoriaPage

### 11.5 Componentes de Protección

**PrivateRoute:** Verifica autenticación y redirige a login si es necesario

**RoleRoute:** Verifica el rol del usuario y redirige si no tiene permisos

---

## 12. CONSIDERACIONES DE UX/UI

### 12.1 Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Características:**
- Navigation adaptativa (hamburger menu en mobile)
- Grid system flexible

### 12.2 Feedback Visual

- Loading states en botones y acciones
- Skeleton loaders mientras carga contenido
- Mensajes de éxito/error visibles y temporales
- Validación en tiempo real en formularios
- Confirmaciones para acciones destructivas

### 12.3 Accesibilidad

- Contraste adecuado de colores
- Labels en todos los inputs
- Navegación por teclado
- Atributos ARIA donde sea necesario
- Textos alternativos en imágenes

### 12.4 Optimización de Rendimiento

- Lazy loading de componentes pesados
- Paginación en listados extensos
- Compresión de imágenes antes de subir
- Debounce en búsquedas
- Memoización de componentes con React.memo cuando sea apropiado

---

## 13. INTEGRACIÓN CON MAPAS (Leaflet)

### 13.1 Configuración Básica

- Instalación de react-leaflet
- Configuración de tiles (OpenStreetMap gratuitos)
- Estilos CSS de Leaflet importados

### 13.2 Componentes de Mapa

**MapaPicker**
- Mapa interactivo para seleccionar ubicación
- Marcador draggable
- Detección automática de ubicación
- Evento onChange al mover marcador

**MapaVisualizacion**
- Mapa de solo lectura
- Marcadores de denuncias
- Popup con información al hacer clic
- Clustering para múltiples marcadores cercanos

**MapaCalor**
- Visualización de concentración de denuncias
- Librería adicional: leaflet.heat

---

## 14. VARIABLES DE ENTORNO

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_MAP_TILES_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

---

## 15. PRUEBAS Y VALIDACIÓN

### 15.1 Estrategia de Testing

- Pruebas unitarias de componentes críticos
- Pruebas de integración de flujos completos
- Validación de formularios
- Testing de custom hooks

### 15.2 Herramientas Sugeridas

- Jest (incluido con Create React App)
- React Testing Library
- Mock Service Worker para mocking de API

---

## 16. CONCLUSIÓN

Este informe técnico proporciona una guía completa para el desarrollo del frontend de la Plataforma de Denuncias Urbanas. La arquitectura basada en componentes, la gestión de estado con Context API y la división clara por historias de usuario garantizan un desarrollo ordenado, mantenible y escalable. El uso de las variables CSS definidas asegura consistencia visual en todo el sistema.