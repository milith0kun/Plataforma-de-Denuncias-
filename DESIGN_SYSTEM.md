# 🎨 Sistema de Diseño - Plataforma de Denuncias Ciudadanas

> Guía completa de diseño visual, componentes y estándares de interfaz

---

## 📐 Paleta de Colores

### Colores Principales

| Variable CSS | Código HEX | Muestra | Uso Recomendado |
|--------------|------------|---------|-----------------|
| `--color-primary` | `#153595` | ![#153595](https://via.placeholder.com/20/153595/000000?text=+) | Azul principal oscuro - Botones primarios, enlaces, elementos destacados |
| `--color-primary-light` | `#A5C1EB` | ![#A5C1EB](https://via.placeholder.com/20/A5C1EB/000000?text=+) | Azul claro - Fondos suaves, hover states, badges informativos |
| `--color-primary-dark` | `#03193B` | ![#03193B](https://via.placeholder.com/20/03193B/000000?text=+) | Azul muy oscuro/navy - Headers, textos oscuros, navegación |

### Colores de Estado

| Variable CSS | Código HEX | Muestra | Uso Recomendado |
|--------------|------------|---------|-----------------|
| `--color-success` | `#10b981` | ![#10b981](https://via.placeholder.com/20/10b981/000000?text=+) | Verde - Éxito, confirmaciones, estados completados |
| `--color-warning` | `#f59e0b` | ![#f59e0b](https://via.placeholder.com/20/f59e0b/000000?text=+) | Ámbar - Advertencias, estados pendientes, información importante |
| `--color-danger` | `#ef4444` | ![#ef4444](https://via.placeholder.com/20/ef4444/000000?text=+) | Rojo - Errores, alertas críticas, botones de eliminación |
| `--color-info` | `#3b82f6` | ![#3b82f6](https://via.placeholder.com/20/3b82f6/000000?text=+) | Azul - Información, notificaciones |

### Colores Neutrales (Sistema de Grises)

| Variable CSS | Código HEX | Muestra | Uso Recomendado |
|--------------|------------|---------|-----------------|
| `--color-white` | `#ffffff` | ![#ffffff](https://via.placeholder.com/20/ffffff/000000?text=+) | Blanco puro - Fondos principales |
| `--color-gray-50` | `#f9fafb` | ![#f9fafb](https://via.placeholder.com/20/f9fafb/000000?text=+) | Gris muy claro - Fondos secundarios |
| `--color-gray-100` | `#f3f4f6` | ![#f3f4f6](https://via.placeholder.com/20/f3f4f6/000000?text=+) | Gris claro - Fondos terciarios |
| `--color-gray-200` | `#e5e7eb` | ![#e5e7eb](https://via.placeholder.com/20/e5e7eb/000000?text=+) | Gris - Bordes, divisores |
| `--color-gray-300` | `#d1d5db` | ![#d1d5db](https://via.placeholder.com/20/d1d5db/000000?text=+) | Gris medio claro |
| `--color-gray-400` | `#9ca3af` | ![#9ca3af](https://via.placeholder.com/20/9ca3af/000000?text=+) | Gris medio - Textos secundarios deshabilitados |
| `--color-gray-500` | `#6b7280` | ![#6b7280](https://via.placeholder.com/20/6b7280/000000?text=+) | Gris - Textos secundarios |
| `--color-gray-600` | `#4b5563` | ![#4b5563](https://via.placeholder.com/20/4b5563/000000?text=+) | Gris oscuro |
| `--color-gray-700` | `#374151` | ![#374151](https://via.placeholder.com/20/374151/000000?text=+) | Gris muy oscuro |
| `--color-gray-800` | `#1f2937` | ![#1f2937](https://via.placeholder.com/20/1f2937/000000?text=+) | Gris casi negro |
| `--color-gray-900` | `#111827` | ![#111827](https://via.placeholder.com/20/111827/000000?text=+) | Gris máximo oscuro - Textos principales |
| `--color-black` | `#000000` | ![#000000](https://via.placeholder.com/20/000000/000000?text=+) | Negro puro |

### Colores de Roles de Usuario

| Variable CSS | Código HEX | Color | Rol |
|--------------|------------|-------|-----|
| `--color-role-ciudadano` | `#10b981` | Verde | Ciudadanos |
| `--color-role-autoridad` | `#3b82f6` | Azul | Autoridades |
| `--color-role-admin` | `#8b5cf6` | Violeta | Administradores |

---

## 🔤 Tipografía

### Familias de Fuentes

#### Títulos y Encabezados
- **Familia**: [DM Serif Text](https://fonts.google.com/specimen/DM+Serif+Text)
- **Variable CSS**: `--font-headings`
- **Peso recomendado**: 700 (Bold)
- **Uso**: H1, H2, H3, H4, H5, H6, títulos de sección

#### Contenido y UI
- **Familia**: [Montserrat](https://fonts.google.com/specimen/Montserrat)
- **Variable CSS**: `--font-body`
- **Pesos disponibles**:
  - 300 (Light) - Textos secundarios
  - 400 (Regular) - Texto base
  - 500 (Medium) - Énfasis moderado
  - 600 (Semibold) - Subtítulos, labels importantes
  - 700 (Bold) - Énfasis fuerte, CTAs

### Escala de Tamaños

| Elemento | Variable CSS | Tamaño | Uso |
|----------|--------------|--------|-----|
| **H1** | `--font-size-h1` | 2.5rem (40px) | Títulos principales de página |
| **H2** | `--font-size-h2` | 2rem (32px) | Títulos de sección |
| **H3** | `--font-size-h3` | 1.75rem (28px) | Subsecciones importantes |
| **H4** | `--font-size-h4` | 1.5rem (24px) | Títulos de tarjetas |
| **H5** | `--font-size-h5` | 1.25rem (20px) | Subtítulos menores |
| **H6** | `--font-size-h6` | 1rem (16px) | Títulos pequeños |
| **Large** | `--font-size-large` | 1.125rem (18px) | Textos destacados |
| **Base** | `--font-size-base` | 1rem (16px) | Texto normal |
| **Small** | `--font-size-small` | 0.875rem (14px) | Textos secundarios, notas |

### Pesos de Fuente

```css
--font-weight-light: 300
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

---

## 📏 Espaciado

Sistema basado en **múltiplos de 8px** para consistencia visual:

| Variable | Valor | Píxeles | Uso Recomendado |
|----------|-------|---------|-----------------|
| `--spacing-xs` | 0.25rem | 4px | Espacios mínimos, separación entre iconos y texto |
| `--spacing-sm` | 0.5rem | 8px | Padding interno de componentes pequeños |
| `--spacing-md` | 1rem | 16px | Espaciado estándar entre elementos |
| `--spacing-lg` | 1.5rem | 24px | Separación entre secciones |
| `--spacing-xl` | 2rem | 32px | Márgenes de página, secciones principales |
| `--spacing-2xl` | 3rem | 48px | Separación entre módulos grandes |
| `--spacing-3xl` | 4rem | 64px | Espaciado hero sections |

---

## 📱 Responsive Design

### Breakpoints

```css
--breakpoint-sm: 640px   /* Mobile grande / Tablet pequeña */
--breakpoint-md: 768px   /* Tablet */
--breakpoint-lg: 1024px  /* Desktop pequeño */
--breakpoint-xl: 1280px  /* Desktop grande */
```

### Estrategia Mobile-First

1. **Base (< 640px)**: Diseño vertical, stack de elementos
2. **Tablet (≥ 768px)**: Introducir layouts de 2 columnas
3. **Desktop (≥ 1024px)**: Layouts completos de 3-4 columnas
4. **Large Desktop (≥ 1280px)**: Aprovechar espacio horizontal

### Ejemplos de Uso

```css
/* Mobile First */
.container {
  padding: var(--spacing-md);
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-lg);
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-xl);
    grid-template-columns: 1fr 1fr 1fr;
  }
}
```

---

## 🔘 Componentes

### Botones

#### Variantes

**Primary**
- Background: `var(--color-primary-main)`
- Color: `var(--color-neutral-white)`
- Uso: Acciones principales

**Secondary**
- Background: `transparent`
- Border: `2px solid var(--color-primary-main)`
- Color: `var(--color-primary-main)`
- Uso: Acciones secundarias

**Danger**
- Background: `var(--color-danger)`
- Color: `var(--color-neutral-white)`
- Uso: Eliminaciones, acciones destructivas

#### Tamaños

| Tamaño | Padding | Font Size | Height |
|--------|---------|-----------|--------|
| Small | 8px 16px | 0.875rem | 32px |
| Medium | 12px 24px | 1rem | 40px |
| Large | 16px 32px | 1.125rem | 48px |

### Inputs

- **Altura**: 40px (Medium), 48px (Large)
- **Border**: 1px solid `#ddd`
- **Border Radius**: `var(--border-radius-md)` (0.5rem)
- **Focus**: outline 2px solid `var(--color-primary-main)`
- **Error**: border 2px solid `var(--color-danger)`

### Cards

```css
.card {
  background: var(--color-neutral-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
}
```

---

## 🌓 Sombras

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

**Uso recomendado**:
- `sm`: Hover states sutiles
- `md`: Cards, modales pequeños
- `lg`: Modales importantes, dropdowns
- `xl`: Overlays principales

---

## 🔲 Bordes

```css
--border-radius-sm: 0.25rem  /* 4px - Badges, tags */
--border-radius-md: 0.5rem   /* 8px - Inputs, botones */
--border-radius-lg: 0.75rem  /* 12px - Cards */
--border-radius-xl: 1rem     /* 16px - Modales */
```

---

## 🎯 Iconografía

### Sistema de Iconos

- **Librería**: [Lottie React](https://www.npmjs.com/package/lottie-react) para animaciones
- **Tamaños estándar**: 16px, 24px, 32px, 48px
- **Color por defecto**: `var(--color-neutral-dark)`

### Categorías de Iconos

1. **Limpieza**: `cleaning-icon.json`
2. **Infraestructura**: `infrastructure-icon.json`
3. **Seguridad**: `security-icon.json`
4. **Iluminación**: `lighting-icon.json`
5. **Áreas Verdes**: `park-icon.json`
6. **Tráfico**: `traffic-icon.json`

---

## ♿ Accesibilidad

### Contraste de Colores

Todos los pares de colores cumplen con **WCAG AA**:

✅ Texto oscuro sobre fondo blanco: 16.5:1
✅ Texto blanco sobre primary: 4.8:1
✅ Texto blanco sobre danger: 6.2:1

### Navegación por Teclado

- Todos los elementos interactivos son accesibles con Tab
- Estados `:focus` visibles con outline de 2px
- Skip links disponibles para navegación rápida

### Atributos ARIA

```html
<!-- Botones con acción -->
<button aria-label="Cerrar modal">×</button>

<!-- Inputs con labels -->
<label for="email">Email</label>
<input id="email" type="email" aria-required="true">

<!-- Estados dinámicos -->
<div role="alert" aria-live="polite">
  Denuncia creada exitosamente
</div>
```

---

## 🎨 Gradientes

```css
/* Gradiente principal */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* Uso en backgrounds */
.hero {
  background: var(--gradient-primary);
}
```

---

## 📋 Estados de Denuncia

| Estado | Variable CSS | Código HEX | Color | Descripción |
|--------|--------------|------------|-------|-------------|
| **Registrada** | `--color-estado-registrada` | `#6b7280` | Gris (Gray 500) | Recién creada, sin asignar |
| **Pendiente** | `--color-estado-pendiente` | `#f59e0b` | Ámbar/Amarillo | En espera de revisión |
| **Asignada** | `--color-estado-asignada` | `#8b5cf6` | Violeta | Asignada a autoridad específica |
| **En Proceso** | `--color-estado-en-proceso` | `#3b82f6` | Azul | En resolución activa |
| **Resuelta** | `--color-estado-resuelta` | `#10b981` | Verde | Completada exitosamente |
| **Cerrada** | `--color-estado-cerrada` | `#4b5563` | Gris oscuro (Gray 600) | Finalizada y archivada |

### Prioridades de Denuncia

| Prioridad | Variable CSS | Código HEX | Color |
|-----------|--------------|------------|-------|
| **Baja** | `--color-prioridad-baja` | `#10b981` | Verde |
| **Media** | `--color-prioridad-media` | `#f59e0b` | Ámbar |
| **Alta** | `--color-prioridad-alta` | `#ef4444` | Rojo |

### Colores Semánticos

| Variable CSS | Código HEX | Uso |
|--------------|------------|-----|
| `--color-text-primary` | `#111827` (Gray 900) | Texto principal |
| `--color-text-secondary` | `#6b7280` (Gray 500) | Texto secundario |
| `--color-text-muted` | `#9ca3af` (Gray 400) | Texto deshabilitado/sutil |
| `--color-bg-primary` | `#ffffff` | Fondo principal |
| `--color-bg-secondary` | `#f9fafb` (Gray 50) | Fondo secundario |
| `--color-bg-tertiary` | `#f3f4f6` (Gray 100) | Fondo terciario |
| `--color-border` | `#e5e7eb` (Gray 200) | Bordes estándar |
| `--color-border-light` | `#f3f4f6` (Gray 100) | Bordes suaves |

---

## 🔄 Animaciones y Transiciones

### Duración Estándar

```css
transition: all 0.3s ease;
```

### Hover States

```css
.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
}
```

---

## 📝 Buenas Prácticas

### ✅ Hacer

- Usar variables CSS en lugar de valores hardcoded
- Mantener espaciado en múltiplos de 8px
- Aplicar border-radius consistentes
- Validar contraste de colores
- Incluir estados hover, focus, active

### ❌ Evitar

- Colores hardcoded en componentes
- Tamaños de fuente en píxeles absolutos sin variable
- Sombras personalizadas (usar las definidas)
- Olvidar estados de accesibilidad

---

## 🔗 Referencias

- **Archivo de variables**: `src/index.css`
- **Componentes comunes**: `src/components/common/`
- **Figma/Diseños**: (Agregar link cuando esté disponible)
- **Google Fonts**: [DM Serif Text](https://fonts.google.com/specimen/DM+Serif+Text) | [Montserrat](https://fonts.google.com/specimen/Montserrat)

---

## 📞 Contacto

Para consultas sobre el sistema de diseño:
- **Email**: desarrollo@plataforma-denuncias.com
- **Documentación técnica**: Ver [Frontend.md](Frontend.md)

---

*Última actualización: Enero 2025*
