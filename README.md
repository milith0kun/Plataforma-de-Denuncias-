# 🏙️ Plataforma Web para Denuncia Ciudadana de Problemas Urbanos

> Sistema integral para la gestión de denuncias ciudadanas con geolocalización, evidencia fotográfica y seguimiento en tiempo real.

� **[Guía de Despliegue](QUICKSTART.md)** | 📚 **[Inicio Rápido](INICIO_RAPIDO.md)** | 📋 **[Checklist Despliegue](DEPLOYMENT-CHECKLIST.md)** | 🎨 **[Sistema de Diseño](DESIGN_SYSTEM.md)**

---

## 🌐 Producción

**URL:** https://plataformadenuncias.myvnc.com  
**API:** https://plataformadenuncias.myvnc.com/api/v1  
**Estado:** [![Status](https://img.shields.io/badge/status-ready-brightgreen)]()

---

## 📋 Descripción del Proyecto

Plataforma web que permite a los ciudadanos reportar problemas urbanos (baches, alumbrado público, limpieza, etc.) mientras que las autoridades pueden gestionar, dar seguimiento y resolver estas denuncias de manera eficiente. El sistema incluye geolocalización, carga de evidencia fotográfica, seguimiento de estados y dashboards analíticos.

### Características Principales

- 🔐 **Sistema de Autenticación Completo** - Registro, login y recuperación de contraseña
- 📍 **Geolocalización** - Ubicación precisa de denuncias con mapas interactivos
- 📸 **Evidencia Fotográfica** - Carga de hasta 5 imágenes por denuncia
- 📊 **Dashboard de Autoridades** - Gestión y seguimiento de denuncias
- 🔄 **Seguimiento de Estados** - Historial completo de cambios
- 📈 **Reportes y Estadísticas** - Análisis de datos y exportación
- 👤 **Gestión de Perfil** - Edición de datos personales y cambio de contraseña
- 🎨 **Interfaz Responsive** - Diseño adaptable a dispositivos móviles

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18+** con Hooks
- **React Router DOM v6** - Enrutamiento
- **Context API** - Gestión de estado
- **Axios** - Peticiones HTTP
- **Vite** - Build tool
- **Lottie React** - Animaciones
- **CSS Modules** - Estilos modulares

### Backend
- **Node.js** con Express.js
- **MongoDB Atlas** - Base de datos en la nube
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Express-validator** - Validaciones
- **Multer** - Upload de archivos

---

## 📁 Estructura del Proyecto

```
Plataforma-de-Denuncias-/
├── src/                          # Código fuente del frontend
│   ├── components/               # Componentes React
│   ├── pages/                    # Páginas de la aplicación
│   ├── contexts/                 # Context API
│   ├── services/                 # Servicios API
│   ├── hooks/                    # Custom hooks
│   └── routes/                   # Configuración de rutas
│
├── Servidor/                     # Backend Node.js
│   └── src/
│       ├── config/               # Configuraciones
│       ├── controllers/          # Controladores
│       ├── models/               # Modelos de datos
│       ├── routes/               # Rutas API
│       ├── middlewares/          # Middlewares
│       └── services/             # Servicios de negocio
│
├── public/                       # Archivos estáticos
│
├── 📚 Documentación/
│   ├── INICIO_RAPIDO.md          # Guía de inicio rápido
│   ├── VERIFICACION_FINAL.md     # Informe completo de testing y verificación
│   ├── CORRECCIONES_ESTILOS.md   # Correcciones CSS aplicadas al sistema
│   ├── INFORME_BACKEND.md        # Documentación técnica backend
│   ├── INFORME_FRONTEND.md       # Documentación técnica frontend
│   ├── INFORME_TESTING.md        # Procedimientos de testing
│   ├── RESULTADOS_TESTS.md       # Resultados detallados de 17 pruebas
│   ├── SPRINT_RESUMEN.md         # Resumen ejecutivo Sprint 8
│   ├── HISTORIAS_DE_USUARIO.md   # Historias de usuario (85% completado)
│   └── DESIGN_SYSTEM.md          # Sistema de diseño y colores
│
└── README.md                     # Este archivo
```

---

## 🎨 Sistema de Diseño

### Paleta de Colores

| Color | Código HEX | Uso |
|-------|------------|-----|
| **Primary** | `#153595` | Azul principal oscuro - Elementos principales, botones primarios |
| **Primary Light** | `#A5C1EB` | Azul claro - Fondos suaves, hover states |
| **Primary Dark** | `#03193B` | Azul navy - Textos oscuros, cabeceras, navegación |
| **Success** | `#10b981` | Verde - Confirmaciones, estados completados |
| **Warning** | `#f59e0b` | Ámbar - Advertencias, estados pendientes |
| **Danger** | `#ef4444` | Rojo - Errores, alertas, botones de eliminación |
| **Info** | `#3b82f6` | Azul - Información, notificaciones |

**Ver sistema completo**: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) incluye colores para roles, estados de denuncia, prioridades y sistema de grises.

### Tipografía

- **Títulos (H1-H6)**: [DM Serif Text](https://fonts.google.com/specimen/DM+Serif+Text)
- **Contenido y UI**: [Montserrat](https://fonts.google.com/specimen/Montserrat)
  - Light (300)
  - Regular (400)
  - Medium (500)
  - Bold (700)

### Principios de Diseño

- ✅ Diseño **mobile-first** con breakpoints responsive
- ✅ Espaciado consistente basado en múltiplos de **8px**
- ✅ Feedback visual inmediato en interacciones
- ✅ Accesibilidad y contraste adecuados (WCAG AA)
- ✅ Componentes reutilizables y modulares

---

## 🚀 Instalación y Ejecución

### Prerrequisitos

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **MySQL** 8.0+ ([Descargar](https://dev.mysql.com/downloads/))
- **npm** o **yarn**

### Instalación del Frontend

```bash
# En la raíz del proyecto
npm install

# Ejecutar en modo desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

### Instalación del Backend

```bash
# Navegar a la carpeta del servidor
cd Servidor

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Crear la base de datos
# Ejecutar los scripts en Servidor/src/database/schema.sql

# Iniciar el servidor
npm run dev

# El servidor estará disponible en http://localhost:5000
```

---

## 📈 Estado del Proyecto

### ✅ Sprint 1 - Completado

- Sistema de autenticación completo (ciudadanos y autoridades)
- Gestión de perfil de usuario
- Recuperación de contraseña
- Componentes comunes reutilizables
- Dashboard principal del ciudadano

### 🔧 Sprint 2 - En Desarrollo

- Sistema completo de denuncias
- Geolocalización con mapas interactivos
- Carga de evidencias fotográficas
- Sistema de estados de denuncia

### 📋 Sprint 3 - Planificado

- Dashboard de autoridades
- Sistema de comentarios
- Seguimiento de denuncias
- Asignación de denuncias

### 📋 Sprint 4 - Planificado

- Reportes y estadísticas
- Búsqueda avanzada
- Panel de administración
- Exportación de datos

---

## 📚 Documentación del Proyecto

### 🚀 Guías de Inicio
- **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Configuración e instalación rápida

### 📊 Informes Técnicos por Área
- **[INFORME_BACKEND.md](INFORME_BACKEND.md)** - API REST, modelos, endpoints (95% ✅)
- **[INFORME_FRONTEND.md](INFORME_FRONTEND.md)** - Componentes, páginas, servicios (70% 🔄)
- **[INFORME_TESTING.md](INFORME_TESTING.md)** - Pruebas ejecutadas y pendientes

### 📖 Planificación y Diseño
- **[HISTORIAS_DE_USUARIO.md](HISTORIAS_DE_USUARIO.md)** - Estado 85%, sprints completados
- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Sistema de diseño, colores y tipografía

---

## 🔗 URLs y Endpoints

### Frontend (Desarrollo)
- **URL Base**: `http://localhost:5173`

### Backend (Desarrollo)
- **URL Base**: `http://localhost:5000`
- **API Base**: `http://localhost:5000/api/v1`

### Rutas Principales

#### Rutas Públicas
- `/` - Landing Page
- `/login` - Inicio de sesión
- `/register` - Registro de usuarios
- `/forgot-password` - Recuperación de contraseña

#### Rutas Privadas (Ciudadano)
- `/home` - Dashboard del ciudadano
- `/perfil` - Gestión de perfil
- `/denuncias` - Mis denuncias
- `/nueva-denuncia` - Crear denuncia

---

## 🐛 Problemas Conocidos

- ⚠️ Warning en LottieIcon sobre importación dinámica (no crítico)
- Consultar los archivos README específicos para más detalles

---

## 👥 Equipo de Desarrollo

### Roles del Sistema

1. **Ciudadano** - Reporta problemas urbanos
2. **Autoridad Municipal** - Gestiona y resuelve denuncias
3. **Administrador** - Administra el sistema completo

---

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Convenciones de Código

- **Frontend**: ESLint + Prettier (configuración en `eslint.config.js`)
- **Backend**: Seguir estructura MVC establecida
- **Commits**: Mensajes descriptivos en español
- **Variables CSS**: Usar variables definidas en lugar de valores hardcoded

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

---

## 📞 Contacto

**Equipo de Desarrollo**
- Email Frontend: desarrollo@plataforma-denuncias.com
- Email Backend: backend@plataforma-denuncias.com

---

## 📝 Notas de Versión

### Versión 2.0.0 (Sprint 1 - Completado)

- Sistema de autenticación JWT completo
- Registro diferenciado para ciudadanos y autoridades
- Gestión de perfil de usuario con edición y cambio de contraseña
- Recuperación de contraseña con tokens temporales
- Componentes comunes reutilizables (Button, Input, Alert, Loading)
- Navegación protegida por roles
- Diseño responsive con sistema de colores unificado

---

*Última actualización: Enero 2025*
