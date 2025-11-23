# 🎨 Informe Técnico - Frontend React

**Sprint Actual:** Sprint 8
**Fecha:** 2025-01-22
**Estado:** 70% Completado 🔄

---

## 📊 Estado General

### Tecnologías
- **Framework:** React 19.1.1 + Vite
- **Routing:** React Router DOM v7.9.3
- **HTTP Client:** Axios v1.12.2
- **Mapas:** Leaflet v1.9.4 + React Leaflet v5.0.0
- **Gráficos:** Recharts v3.4.1
- **Animaciones:** React Lottie Player v2.1.0
- **Estilos:** CSS Modules

### Arquitectura
```
src/
├── main.jsx                    # Punto de entrada
├── App.jsx                     # Componente raíz
├── components/                 # Componentes reutilizables
│   ├── auth/                   # Login, Register
│   ├── common/                 # Button, Input, Alert, etc
│   ├── denuncias/              # MapaPicker, UploadFotos, Comentarios
│   ├── perfil/                 # Edición perfil
│   └── layout/                 # Layout principal
├── pages/                      # Páginas por rol
│   ├── public/                 # Landing, Login, Register
│   ├── auth/                   # Forgot, Reset Password
│   ├── ciudadano/              # Dashboard, Denuncias, etc
│   └── autoridad/              # Dashboard, Gestión
├── contexts/                   # Context API
│   └── AuthContext.jsx         # Estado autenticación
├── services/                   # Servicios API (6)
├── hooks/                      # Custom hooks
├── routes/                     # Configuración rutas
└── constants/                  # Constantes y colores
```

---

## 🎨 Sistema de Diseño

### Paleta de Colores
```css
/* Colores Principales */
--primary: #153595          /* Azul principal */
--primary-light: #A5C1EB    /* Azul claro */
--primary-dark: #03193B     /* Azul navy */

/* Colores Semánticos */
--success: #10b981          /* Verde */
--warning: #f59e0b          /* Ámbar */
--danger: #ef4444           /* Rojo */
--info: #3b82f6             /* Azul */

/* Grises (50-900) */
--gray-50: #f9fafb
--gray-100: #f3f4f6
...
--gray-900: #111827
```

### Tipografía
- **Títulos:** DM Serif Text
- **Contenido:** Montserrat (300, 400, 500, 700)

### Componentes Base
- ✅ Button (4 variantes: primary, secondary, danger, outline)
- ✅ Input (text, email, password, textarea)
- ✅ Alert (success, error, warning, info)
- ✅ Loading (spinner animado)
- ✅ Header (con navegación)
- ✅ MetricCard (para dashboards)

---

## 📄 Páginas Implementadas

### Públicas (100% ✅)
```
/                    - LandingPage
/login               - LoginPage
/register            - RegisterPage (Ciudadano)
/register-authority  - RegisterAuthorityPage
/forgot-password     - ForgotPasswordPage
/reset-password      - ResetPasswordPage
```

### Ciudadano (80% 🔄)
```
/inicio              - HomePage (Dashboard)          ✅
/perfil              - PerfilPage                    ✅
/denuncias           - DenunciasPage (lista)         ✅
/nueva-denuncia      - NuevaDenunciaPage             ✅
/denuncias/:id       - DetalleDenunciaPage           ✅
/reportes            - ReportesPage                  🔄 (70%)
```

### Autoridad (60% 🔄)
```
/dashboard-autoridad           - DashboardAutoridadPage    ✅
/autoridad/gestion-denuncias   - GestionDenunciasPage      🔄 (50%)
```

---

## 🔧 Componentes Específicos

### 1. Denuncias
| Componente | Estado | Integrado | Descripción |
|------------|--------|-----------|-------------|
| `MapaPicker.jsx` | ✅ | ⏳ | Selección ubicación (Leaflet) |
| `UploadFotos.jsx` | ✅ | ⏳ | Upload hasta 5 imágenes |
| `Comentarios.jsx` | ✅ | ⏳ | Sistema de comentarios |

**Pendiente:**
- Integrar MapaPicker en NuevaDenunciaPage
- Integrar UploadFotos en NuevaDenunciaPage
- Integrar Comentarios en DetalleDenunciaPage

### 2. Perfil
| Componente | Estado | Descripción |
|------------|--------|-------------|
| `FormularioEdicionPerfil.jsx` | ✅ | Editar datos usuario |
| `CambioPasswordModal.jsx` | ✅ | Modal cambio contraseña |
| `HistorialActividad.jsx` | ✅ | Timeline actividad |

**Estado:** 100% Completo ✅

### 3. Navegación
| Componente | Estado | Descripción |
|------------|--------|-------------|
| `Header.jsx` | ✅ | Cabecera con menú |
| `Navigation.jsx` | ✅ | Menú lateral |
| `PrivateRoute.jsx` | ✅ | Protección rutas |

**Estado:** 100% Completo ✅

---

## 🔌 Servicios API

### 1. authService.js ✅
```javascript
registrarCiudadano(datos)
registrarAutoridad(datos)
login(email, password)
verificarToken()
solicitarRecuperacion(email)
restablecerPassword(token, password)
```

### 2. denunciaService.js ✅
```javascript
crearDenuncia(datos)
obtenerDenuncias(filtros)
obtenerDenunciaPorId(id)
actualizarDenuncia(id, datos)
cambiarEstado(id, estado, comentario)
eliminarDenuncia(id)
obtenerCategorias()
obtenerEstados()
subirEvidencias(id, archivos)
obtenerEvidencias(id)
```

### 3. usuarioService.js ✅
```javascript
obtenerPerfil()
actualizarPerfil(datos)
cambiarPassword(passwordActual, passwordNueva)
obtenerHistorialActividad()
```

### 4. comentarioService.js ✅ (No integrado)
```javascript
obtenerComentarios(idDenuncia)
crearComentario(idDenuncia, datos)
actualizarComentario(idComentario, texto)
eliminarComentario(idComentario)
obtenerEstadisticas(idDenuncia)
```

### 5. estadisticasService.js ✅ (Parcialmente usado)
```javascript
obtenerEstadisticasGenerales()
obtenerResumen()
obtenerEstadisticasPorCategoria(id)
```

### 6. api.js (Base)
```javascript
// Configuración Axios
baseURL: http://localhost:5000/api/v1
Authorization: Bearer {token}
Interceptores: request, response, error
```

---

## 🎯 Context API

### AuthContext.jsx ✅
```javascript
Estados:
  - usuario
  - estaAutenticado
  - cargando

Métodos:
  - login(email, password)
  - logout()
  - registrarCiudadano(datos)
  - registrarAutoridad(datos)
  - verificarSesion()

Helpers:
  - esCiudadano()
  - esAutoridad()
  - esAdmin()
```

---

## 🛣️ Rutas Protegidas

### Sistema de Protección
```javascript
<PrivateRoute requireRole="ciudadano">
  <HomePage />
</PrivateRoute>

<PrivateRoute requireRole="autoridad">
  <DashboardAutoridadPage />
</PrivateRoute>

<PrivateRoute> {/* Cualquier autenticado */}
  <PerfilPage />
</PrivateRoute>
```

### Redirecciones Inteligentes
```javascript
/dashboard → Redirige según rol:
  - Ciudadano → /inicio
  - Autoridad → /dashboard-autoridad
  - No autenticado → /login
```

---

## 📊 Dashboards

### Dashboard Ciudadano (HomePage) ✅
**Componentes:**
- Bienvenida personalizada
- 4 tarjetas de métricas (Total, Pendientes, En Proceso, Resueltas)
- Accesos rápidos (4 botones)
- Lista denuncias recientes (últimas 3)

**Estado:** 100% Funcional

### Dashboard Autoridad ✅
**Componentes:**
- Métricas calculadas (Pendientes, Asignadas, Resueltas, Urgentes)
- Filtros por estado
- Lista completa de denuncias
- Identificación denuncias urgentes (>7 días)

**Estado:** 100% Funcional

---

## 🎨 Páginas Detalladas

### NuevaDenunciaPage (80% 🔄)
**Implementado:**
- ✅ Formulario completo (título, descripción, categoría, ubicación)
- ✅ Validación de campos
- ✅ Opción anónima
- ✅ Carga de categorías dinámica
- ✅ Creación exitosa

**Pendiente:**
- ⏳ Integrar MapaPicker para ubicación
- ⏳ Integrar UploadFotos para evidencias
- ⏳ Preview de ubicación en mapa
- ⏳ Preview de imágenes antes de enviar

### DetalleDenunciaPage (70% 🔄)
**Implementado:**
- ✅ Información completa de denuncia
- ✅ Estado actual con color semántico
- ✅ Datos del denunciante (si no es anónima)
- ✅ Fecha y ubicación

**Pendiente:**
- ⏳ Integrar Comentarios.jsx
- ⏳ Timeline de estados
- ⏳ Galería de evidencias fotográficas
- ⏳ Botón de seguimiento

### ReportesPage (50% 🔄)
**Implementado:**
- ✅ Estructura base
- ✅ Recharts instalado
- ✅ Servicio estadísticasService

**Pendiente:**
- ⏳ Gráfico de barras (denuncias por categoría)
- ⏳ Gráfico de líneas (denuncias por mes)
- ⏳ Gráfico circular (distribución por estado)
- ⏳ KPIs (total, tasa resolución, tiempo promedio)
- ⏳ Filtros por rango de fechas

### GestionDenunciasPage (50% 🔄)
**Implementado:**
- ✅ Página creada
- ✅ Endpoint backend listo

**Pendiente:**
- ⏳ Lista de denuncias con acciones
- ⏳ Modal cambiar estado
- ⏳ Modal asignar área
- ⏳ Filtros avanzados
- ⏳ Actualización en tiempo real

---

## 🎨 Responsive Design

### Breakpoints
```css
/* Mobile First */
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

### Componentes Responsive
- ✅ Header (hamburger menu en móvil)
- ✅ Navigation (sidebar colapsable)
- ✅ Cards (stack en móvil, grid en desktop)
- ✅ Forms (1 columna móvil, 2 columnas desktop)
- ✅ Tablas (scroll horizontal en móvil)

---

## ✅ Checklist de Completitud

### Completado (70%)
- [x] Autenticación completa
- [x] Rutas protegidas por roles
- [x] Dashboard ciudadano funcional
- [x] Dashboard autoridad funcional
- [x] CRUD denuncias (crear, listar, ver)
- [x] Gestión de perfil completa
- [x] Sistema de colores unificado
- [x] Diseño responsive
- [x] Context API (AuthContext)
- [x] 6 servicios API completos
- [x] Componentes base (Button, Input, Alert, etc)

### En Progreso (15%)
- [ ] Integrar MapaPicker en formularios
- [ ] Integrar UploadFotos en NuevaDenuncia
- [ ] Integrar Comentarios en DetalleDenuncia
- [ ] Completar página Reportes con gráficos
- [ ] Timeline de estados en Seguimiento

### Pendiente (15%)
- [ ] Galería de evidencias con lightbox
- [ ] Modal cambiar estado (autoridades)
- [ ] Modal asignar área
- [ ] Notificaciones en tiempo real
- [ ] Búsqueda avanzada de denuncias
- [ ] Exportar reportes (PDF/Excel)
- [ ] Tests unitarios (Jest + React Testing Library)
- [ ] Tests E2E (Cypress)

---

## 🔧 Comandos de Desarrollo

```bash
# Desarrollo
npm run dev               # Puerto 5173

# Producción
npm run build             # Build para producción
npm run preview           # Preview del build

# Linting
npm run lint              # ESLint
```

---

## 📦 Dependencias Clave

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.9.3",
  "axios": "^1.12.2",
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0",
  "recharts": "^3.4.1",
  "react-lottie-player": "^2.1.0"
}
```

---

## 🎯 Próximos Pasos (Prioridad)

1. **Alta Prioridad:**
   - Integrar UploadFotos en NuevaDenunciaPage
   - Integrar Comentarios en DetalleDenunciaPage
   - Completar ReportesPage con gráficos Recharts

2. **Media Prioridad:**
   - Integrar MapaPicker completamente
   - Implementar GaleriaEvidencias con lightbox
   - Timeline de estados en SeguimientoDenunciaPage

3. **Baja Prioridad:**
   - Modal gestión de estados (autoridades)
   - Búsqueda avanzada
   - Exportación de reportes

---

**Frontend completado al 70% - Requiere integración de componentes existentes**
