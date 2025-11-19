# 🌐 FRONTEND - PLATAFORMA WEB PARA DENUNCIA CIUDADANA

> Documentación del estado actual, estructura y funcionalidades implementadas del frontend

## 📑 Navegación Rápida

- **[⬅️ README Principal](README.md)** - Vista general del proyecto
- **[🎨 Sistema de Diseño](DESIGN_SYSTEM.md)** - Guía completa de diseño visual
- **[📖 Informe Técnico Frontend](Frontend.md)** - Arquitectura y especificaciones detalladas
- **[🔌 Documentación Backend](README_BACKEND.md)** - API y endpoints

---

## 📋 Estado Actual del Proyecto

### ✅ Implementado (Sprint 1 - Completado)

#### 🔐 Sistema de Autenticación
- **LoginForm**: Formulario de inicio de sesión con validación
- **RegisterForm**: Formulario de registro para ciudadanos
- **AuthContext**: Gestión de estado de autenticación
- **useAuth**: Hook personalizado para manejo de autenticación
- **PrivateRoute**: Protección de rutas privadas

#### 🎨 Componentes Comunes
- **Header**: Cabecera unificada con navegación
- **Navbar**: Barra de navegación responsive
- **Button**: Componente de botón reutilizable
- **Input**: Componente de entrada de datos
- **Alert**: Sistema de alertas y notificaciones
- **Loading**: Indicador de carga

#### 📱 Páginas Implementadas
- **LandingPage**: Página de inicio pública
- **LoginPage**: Página de inicio de sesión
- **RegisterPage**: Página de registro
- **HomePage**: Dashboard principal del ciudadano
- **PerfilPage**: Gestión de perfil de usuario
- **ForgotPasswordPage**: Recuperación de contraseña
- **ResetPasswordPage**: Restablecimiento de contraseña

#### 👤 Gestión de Perfil
- **FormularioEdicionPerfil**: Edición de datos personales
- **CambioPasswordModal**: Modal para cambio de contraseña
- **HistorialActividad**: Visualización de actividad del usuario

#### 🎭 Componentes Visuales
- **LottieIcon**: Iconos animados con Lottie
- Iconos JSON para diferentes categorías (limpieza, infraestructura, seguridad, etc.)

### 🔧 Servicios Implementados
- **authService**: Autenticación y registro
- **usuarioService**: Gestión de usuarios
- **api**: Configuración base de Axios

### 🎯 En Desarrollo (Sprint 2)
- Sistema de denuncias
- Geolocalización
- Carga de evidencias fotográficas
- Dashboard de autoridades

---

## 🚀 Tecnologías Utilizadas

- **React 18+** con Hooks
- **React Router DOM v6** para enrutamiento
- **Context API** para gestión de estado
- **Axios** para peticiones HTTP
- **CSS Modules** para estilos
- **Lottie React** para animaciones
- **Vite** como bundler

---

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── auth/                    # Componentes de autenticación
│   │   ├── LoginForm/
│   │   └── RegisterForm/
│   ├── common/                  # Componentes reutilizables
│   │   ├── Alert/
│   │   ├── Button/
│   │   ├── Header/
│   │   ├── Input/
│   │   ├── Loading/
│   │   └── Navbar/
│   ├── perfil/                  # Componentes de perfil
│   │   ├── FormularioEdicionPerfil.jsx
│   │   ├── CambioPasswordModal.jsx
│   │   └── HistorialActividad.jsx
│   └── LottieIcon/              # Iconos animados
├── pages/
│   ├── auth/                    # Páginas de autenticación
│   │   ├── ForgotPasswordPage/
│   │   └── ResetPasswordPage/
│   ├── ciudadano/               # Páginas del ciudadano
│   │   ├── HomePage/
│   │   ├── PerfilPage/
│   │   ├── DenunciasPage/
│   │   └── NuevaDenunciaPage/
│   └── public/                  # Páginas públicas
│       ├── LandingPage/
│       ├── LoginPage/
│       └── RegisterPage/
├── contexts/
│   └── AuthContext.jsx          # Contexto de autenticación
├── hooks/
│   └── useAuth.js               # Hook de autenticación
├── services/
│   ├── api.js                   # Configuración de Axios
│   ├── authService.js           # Servicios de autenticación
│   └── usuarioService.js        # Servicios de usuario
├── routes/
│   ├── AppRoutes.jsx            # Configuración de rutas
│   └── PrivateRoute.jsx         # Rutas protegidas
└── assets/
    └── icons/                   # Iconos Lottie JSON
```

---

## 🎨 Sistema de Diseño

Para información completa sobre colores, tipografía, espaciado y componentes, consulta el **[Sistema de Diseño](DESIGN_SYSTEM.md)** dedicado.

**Resumen rápido**:
- **Color Primario**: #153595 (Azul oscuro)
- **Colores de Estado**: Success (#10b981), Warning (#f59e0b), Danger (#ef4444)
- **Tipografía Títulos**: DM Serif Text
- **Tipografía Contenido**: Montserrat
- **Espaciado**: Múltiplos de 8px
- **Breakpoints**: Mobile-first (640px, 768px, 1024px, 1280px)

---

## 🔄 Flujo de Navegación Actual

### Rutas Públicas
- `/` - Landing Page
- `/login` - Inicio de sesión
- `/register` - Registro
- `/forgot-password` - Recuperación de contraseña
- `/reset-password/:token` - Restablecimiento

### Rutas Privadas (Ciudadano)
- `/home` - Dashboard principal
- `/perfil` - Gestión de perfil
- `/denuncias` - Mis denuncias
- `/nueva-denuncia` - Crear denuncia

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Comandos
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

---

## 🔗 Integración con Backend

### URL Base
- **Desarrollo**: `http://localhost:5000/api/v1`

### Endpoints Utilizados
- `POST /auth/login` - Inicio de sesión
- `POST /auth/register/ciudadano` - Registro
- `POST /auth/forgot-password` - Recuperación
- `POST /auth/reset-password` - Restablecimiento
- `GET /auth/verify-token` - Verificación de token
- `GET /usuarios/profile` - Obtener perfil
- `PUT /usuarios/profile` - Actualizar perfil
- `PUT /usuarios/cambiar-password` - Cambiar contraseña

---

## 📈 Próximas Funcionalidades

### Sprint 2 (En Desarrollo)
- [ ] Sistema completo de denuncias
- [ ] Mapa interactivo con Leaflet
- [ ] Carga de evidencias fotográficas
- [ ] Geolocalización automática
- [ ] Categorización de problemas

### Sprint 3 (Planificado)
- [ ] Dashboard de autoridades
- [ ] Sistema de comentarios
- [ ] Seguimiento de denuncias
- [ ] Notificaciones en tiempo real

### Sprint 4 (Planificado)
- [ ] Reportes y estadísticas
- [ ] Búsqueda avanzada
- [ ] Exportación de datos
- [ ] Panel de administración

---

## 🐛 Problemas Conocidos

- ⚠️ Warning en LottieIcon sobre importación dinámica (no crítico)

---

## 👥 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

---

## 📚 Recursos Relacionados

### Documentación del Proyecto
- **[README Principal](README.md)** - Información general del proyecto
- **[Sistema de Diseño](DESIGN_SYSTEM.md)** - Guía de diseño visual y componentes
- **[Informe Técnico Frontend](Frontend.md)** - Arquitectura detallada y especificaciones
- **[Backend Documentation](README_BACKEND.md)** - Documentación del servidor y API

### Archivos de Configuración
- `src/index.css` - Variables CSS y estilos globales
- `eslint.config.js` - Configuración de ESLint
- `vite.config.js` - Configuración de Vite
- `package.json` - Dependencias y scripts

---

## 📞 Contacto

**Equipo de Desarrollo Frontend**
- Email: desarrollo@plataforma-denuncias.com
- Documentación técnica completa: [Frontend.md](Frontend.md)

---

*Última actualización: Enero 2025*