# 🎨 Frontend - Plataforma de Denuncias Ciudadanas

## 👨‍💻 Desarrollador Principal del Frontend

**Dennis Moises Ccapatinta Qqueccaño**  
Código: 140984  
Universidad Nacional San Antonio Abad del Cusco  
Escuela Profesional de Informática y de Sistemas

---

## 📋 Responsabilidades Asumidas

Como desarrollador principal del frontend, mis responsabilidades incluyeron:

### ✅ Desarrollo de Componentes
- **40+ componentes React** reutilizables y modulares
- Sistema de diseño unificado con paleta de colores consistente
- Componentes comunes (Button, Input, Alert, Loading, etc.)
- Componentes específicos de negocio (MapaPicker, UploadFotos, Comentarios)

### ✅ Implementación de Páginas
- **Dashboard del Ciudadano** (HomePage)
- **Dashboard de Autoridades** (DashboardAutoridadPage)
- **Sistema de Autenticación** (Login, Register, ForgotPassword)
- **Gestión de Denuncias** (Nueva, Lista, Detalle)
- **Gestión de Perfil** (Edición, Cambio de contraseña)
- **Reportes y Estadísticas** (Gráficos con Recharts)

### ✅ Integración con Backend
- **6 servicios API completos** (authService, denunciaService, usuarioService, etc.)
- Manejo de errores y estados de carga
- Interceptores de Axios para autenticación JWT
- Gestión de tokens y refresh automático

### ✅ Diseño UI/UX
- Diseño **Mobile-First** responsive
- Paleta de colores basada en variables CSS
- Tipografía: DM Serif Text + Montserrat
- Animaciones con Lottie React
- Sistema de notificaciones Toast

### ✅ Funcionalidades Avanzadas
- **Geolocalización** con Leaflet y React Leaflet
- **Upload de imágenes** con preview
- **Gráficos estadísticos** con Recharts
- **Rutas protegidas** por rol de usuario
- **Context API** para estado global

---

## 🛠️ Stack Tecnológico Implementado

```javascript
{
  "framework": "React 19.1.1",
  "buildTool": "Vite",
  "routing": "React Router DOM v7.9.3",
  "stateManagement": "Context API + Hooks",
  "httpClient": "Axios v1.12.2",
  "maps": "Leaflet v1.9.4 + React Leaflet v5.0.0",
  "charts": "Recharts v3.4.1",
  "animations": "React Lottie Player v2.1.0",
  "styling": "CSS Modules"
}
```

---

## 📊 Métricas del Frontend Desarrollado

| Métrica | Valor |
|---------|-------|
| **Total de Componentes** | 45+ |
| **Total de Páginas** | 12 |
| **Servicios API** | 6 |
| **Hooks Personalizados** | 4 |
| **Líneas de Código** | ~8,500 |
| **Archivos JavaScript/JSX** | 62 |
| **Archivos CSS** | 38 |

---

## 🎯 Características Implementadas

### Sistema de Autenticación
- ✅ Login con validación
- ✅ Registro diferenciado (Ciudadano/Autoridad)
- ✅ Recuperación de contraseña
- ✅ Verificación de tokens
- ✅ Logout con limpieza de sesión

### Dashboard Ciudadano
- ✅ Resumen de denuncias (Total, Pendientes, En Proceso, Resueltas)
- ✅ Denuncias recientes (últimas 3)
- ✅ Accesos rápidos (Nueva denuncia, Mis denuncias, Perfil, Ayuda)
- ✅ Gráficos estadísticos

### Gestión de Denuncias
- ✅ Crear denuncia con geolocalización
- ✅ Upload de hasta 5 fotos de evidencia
- ✅ Listado con filtros y búsqueda
- ✅ Vista de detalle completa
- ✅ Timeline de estados
- ✅ Sistema de comentarios

### Dashboard de Autoridades
- ✅ Vista de todas las denuncias
- ✅ Métricas calculadas (Pendientes, Asignadas, Resueltas, Urgentes)
- ✅ Filtros avanzados
- ✅ Identificación de denuncias urgentes (>7 días)
- ✅ Cambio de estados

### Reportes y Estadísticas
- ✅ Gráfico de barras (denuncias por categoría)
- ✅ Gráfico de líneas (tendencia mensual)
- ✅ Gráfico circular (distribución por estado)
- ✅ KPIs (total, tasa de resolución, tiempo promedio)

### Sistema de Diseño
- ✅ Paleta de colores unificada (50+ variables CSS)
- ✅ Componentes base reutilizables
- ✅ Diseño responsive (Mobile, Tablet, Desktop)
- ✅ Animaciones y transiciones suaves
- ✅ Sistema de notificaciones Toast

---

## 🏗️ Arquitectura del Frontend

```
src/
├── components/           # 45+ componentes reutilizables
│   ├── auth/            # Login, Register
│   ├── common/          # Button, Input, Alert, Loading, etc.
│   ├── denuncias/       # MapaPicker, UploadFotos, Comentarios
│   ├── layout/          # Layout principal
│   └── perfil/          # Gestión de perfil
│
├── pages/               # 12 páginas principales
│   ├── public/          # Landing, About
│   ├── auth/            # Login, Register, ForgotPassword
│   ├── ciudadano/       # HomePage, Denuncias, NuevaDenuncia
│   └── autoridad/       # DashboardAutoridad, Gestión
│
├── contexts/            # Estado global
│   └── AuthContext.jsx  # Autenticación
│
├── services/            # 6 servicios API
│   ├── authService.js
│   ├── denunciaService.js
│   ├── usuarioService.js
│   ├── comentarioService.js
│   ├── estadisticasService.js
│   └── api.js           # Configuración Axios
│
├── hooks/               # Hooks personalizados
│   ├── useAuth.js
│   ├── useDenuncias.js
│   └── useToast.js
│
├── routes/              # Configuración de rutas
│   └── AppRoutes.jsx
│
├── constants/           # Constantes y colores
│   └── colors.js
│
└── styles/              # Estilos globales
    └── index.css        # Variables CSS, reset
```

---

## 🎨 Sistema de Diseño Implementado

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

/* Sistema de Grises (50-900) */
--gray-50: #f9fafb
--gray-100: #f3f4f6
...
--gray-900: #111827
```

### Tipografía

- **Títulos (H1-H6):** DM Serif Text
- **Contenido y UI:** Montserrat (300, 400, 500, 700)

---

## 🚀 Cómo Ejecutar el Frontend

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# La aplicación estará en http://localhost:5173
```

---

## 📖 Documentación Adicional

- **[INFORME_FRONTEND.md](../INFORME_FRONTEND.md)** - Documentación técnica completa
- **[DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md)** - Sistema de diseño y colores
- **[HISTORIAS_DE_USUARIO.md](../HISTORIAS_DE_USUARIO.md)** - Historias implementadas

---

## 🎓 Aprendizajes y Logros

Durante el desarrollo del frontend, logré:

1. ✅ **Dominar React Hooks** - useState, useEffect, useContext, useCallback, useMemo
2. ✅ **Implementar Context API** - Gestión de estado global sin Redux
3. ✅ **Integrar Leaflet** - Mapas interactivos con geolocalización
4. ✅ **Usar Recharts** - Visualización de datos con gráficos
5. ✅ **Diseñar Mobile-First** - Responsive design en todos los componentes
6. ✅ **Optimizar Rendimiento** - Lazy loading, memo, código limpio
7. ✅ **Aplicar Best Practices** - Código modular, reutilizable, documentado

---

## 📝 Notas de Versión

### Versión 2.0.0 (Diciembre 2024)

- ✅ Sistema de autenticación completo
- ✅ Dashboard ciudadano funcional
- ✅ Dashboard autoridad funcional
- ✅ CRUD denuncias completo
- ✅ Sistema de comentarios
- ✅ Reportes con gráficos
- ✅ Diseño responsive
- ✅ Paleta de colores unificada

---

## 🤝 Contacto

**Dennis Moises Ccapatinta Qqueccaño**  
Código: 140984  
Universidad Nacional San Antonio Abad del Cusco  
GitHub: [@dennis-ccapatinta](https://github.com/dennis-ccapatinta)

---

**⭐ Desarrollo de Software I - 2024**  
*Docente: Gabriela Zúñiga Rojas*
