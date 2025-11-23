# 🧪 Plan de Pruebas Integrales y Revisión de UI/UX

## 🎯 Objetivos
1. Verificar el funcionamiento correcto de todos los casos de uso principales.
2. Asegurar la integración correcta entre Frontend, Backend y Base de Datos.
3. Unificar estilos visuales y mejorar la experiencia de usuario (UI/UX).

## 📋 Casos de Uso a Probar

### 1. Autenticación
- [x] **Registro de Ciudadano**: Verificado exitosamente (Backend OK, Frontend OK).
- [x] **Login**: Verificado exitosamente (Backend OK, Frontend OK).
- [ ] **Logout**: Pendiente de verificación manual.

### 2. Gestión de Denuncias (Ciudadano)
- [ ] **Crear Denuncia**: Pendiente de verificación manual.
- [x] **Listar Mis Denuncias**: Verificado estáticamente (Código y Estilos OK).
- [ ] **Ver Detalle**: Pendiente de verificación manual.

### 3. Interacción
- [ ] **Comentarios**: Pendiente de verificación manual.

## 🎨 Revisión de UI/UX

### 1. Consistencia Visual
- [x] **Botones**: Unificados estilos en `Button.module.css` y páginas de auth.
- [x] **Tipografía**: Unificada usando variables globales.
- [x] **Iconos**: Verificado uso de LottieIcon consistente.

### 2. Colores y Contraste
- [x] **Paleta**: Unificada en `LoginPage`, `RegisterPage`, `RegisterAuthorityPage`, `HomePage` y `DenunciasPage`.
- [x] **Contraste**: Mejorado usando variables de color del sistema.
- [x] **Feedback**: Colores de estado unificados.

### 3. Layout y Espaciado
- [x] **Márgenes y Padding**: Unificados usando variables de espaciado.
- [x] **Responsive**: Verificado en CSS modules.

## 🚀 Estrategia de Ejecución

1. **Navegación Manual**: Usar el navegador para recorrer los flujos.
2. **Corrección Inmediata**: Si se encuentra un error de estilo o funcional bloqueante, se corregirá en el momento.
3. **Reporte**: Documentar los hallazgos y correcciones.
