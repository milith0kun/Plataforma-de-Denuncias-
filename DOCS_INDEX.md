# 📚 Índice de Documentación - Plataforma de Denuncias Ciudadanas

> Guía completa de navegación por toda la documentación del proyecto

---

## 🏠 Punto de Partida

### [README.md](README.md)
**Inicio aquí** - Documento principal del proyecto

- Descripción general del sistema
- Tecnologías utilizadas (Frontend + Backend)
- Instrucciones de instalación y ejecución
- Estado actual del proyecto por sprints
- Guía rápida de rutas y endpoints

**¿Cuándo leerlo?** Primera vez que accedes al proyecto, o para una vista general rápida.

---

## 🎨 Diseño y UX

### [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
**Sistema de Diseño Completo**

- Paleta de colores con códigos HEX
- Tipografías (DM Serif Text y Montserrat)
- Sistema de espaciado (múltiplos de 8px)
- Breakpoints responsive
- Componentes UI (botones, inputs, cards)
- Accesibilidad y buenas prácticas

**¿Cuándo leerlo?** Al diseñar nuevos componentes, al hacer cambios visuales, o para mantener consistencia de diseño.

---

## 🌐 Frontend

### [README_FRONTEND.md](README_FRONTEND.md)
**Documentación Práctica del Frontend**

- Estado actual de funcionalidades implementadas
- Estructura de carpetas y archivos
- Componentes disponibles
- Rutas de navegación
- Servicios API integrados
- Instrucciones de instalación específicas

**¿Cuándo leerlo?** Antes de trabajar en el frontend, para conocer qué está implementado y dónde encontrar cada cosa.

### [Frontend.md](Frontend.md)
**Informe Técnico Completo - Frontend**

- Arquitectura detallada (MVC adaptado)
- División por Historias de Usuario (HU-01 a HU-16)
- Especificaciones técnicas de cada componente
- Gestión de estado con Context API
- Custom hooks y servicios
- Flujo completo de navegación por páginas
- Estrategia de testing

**¿Cuándo leerlo?** Para entender la arquitectura completa, al planificar nuevas funcionalidades, o al hacer refactoring profundo.

---

## 🔌 Backend

### [README_BACKEND.md](README_BACKEND.md)
**Documentación Práctica del Backend**

- Estado actual de endpoints implementados
- Estructura MVC del servidor
- API endpoints disponibles (con ejemplos)
- Configuración de base de datos
- Seguridad y validaciones
- Instrucciones de instalación y deployment

**¿Cuándo leerlo?** Antes de trabajar en el backend, para conocer endpoints existentes y estructura del código.

### [Backend.md](Backend.md)
**Informe Técnico Completo - Backend**

- Arquitectura completa (Models, Controllers, Routes)
- API REST diseñada (todos los endpoints planificados)
- División por Historias de Usuario (Sprint 1-4)
- Consideraciones de seguridad (JWT, bcrypt, validaciones)
- Optimización y rendimiento
- Estrategia de testing y deployment

**¿Cuándo leerlo?** Para entender el diseño completo del backend, al planificar nuevas rutas API, o al trabajar en seguridad.

---

## 📖 Guía de Navegación por Rol

### 👨‍💻 **Desarrollador Frontend Nuevo**
1. Leer [README.md](README.md) - Vista general
2. Revisar [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - Aprender colores y componentes
3. Estudiar [README_FRONTEND.md](README_FRONTEND.md) - Conocer estructura actual
4. Consultar [Frontend.md](Frontend.md) cuando necesites arquitectura detallada

### 👩‍💻 **Desarrollador Backend Nuevo**
1. Leer [README.md](README.md) - Vista general
2. Revisar [README_BACKEND.md](README_BACKEND.md) - Conocer endpoints y estructura
3. Configurar base de datos según `Servidor/src/database/schema.sql`
4. Consultar [Backend.md](Backend.md) para arquitectura completa

### 🎨 **Diseñador UX/UI**
1. Revisar [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - Sistema completo de diseño
2. Consultar [README_FRONTEND.md](README_FRONTEND.md) - Ver componentes implementados
3. Revisar capturas de pantalla en raíz del proyecto

### 📊 **Product Manager / Scrum Master**
1. Leer [README.md](README.md) - Estado general del proyecto
2. Revisar [Frontend.md](Frontend.md) y [Backend.md](Backend.md) - División por Historias de Usuario
3. Consultar "Estado del Proyecto" en README para seguimiento de sprints

### 🔧 **DevOps / Deployment**
1. Leer sección "Instalación y Ejecución" en [README.md](README.md)
2. Revisar configuración en [README_BACKEND.md](README_BACKEND.md)
3. Verificar variables de entorno necesarias

---

## 📂 Estructura de Archivos de Documentación

```
Plataforma-de-Denuncias-/
├── README.md                    # 📌 Documento principal - EMPIEZA AQUÍ
├── DOCS_INDEX.md                # 📚 Este archivo - Índice de navegación
├── DESIGN_SYSTEM.md             # 🎨 Sistema de diseño completo
│
├── README_FRONTEND.md           # 🌐 Guía práctica del frontend
├── Frontend.md                  # 📖 Informe técnico frontend
│
├── README_BACKEND.md            # 🔌 Guía práctica del backend
└── Backend.md                   # 📖 Informe técnico backend
```

---

## 🔍 Búsqueda Rápida por Tema

### Colores y Diseño
➡️ [DESIGN_SYSTEM.md - Paleta de Colores](DESIGN_SYSTEM.md#-paleta-de-colores)

### Componentes React
➡️ [README_FRONTEND.md - Componentes Implementados](README_FRONTEND.md#-implementado-sprint-1---completado)
➡️ [Frontend.md - Componentes Comunes Reutilizables](Frontend.md#10-componentes-comunes-reutilizables)

### Endpoints API
➡️ [README_BACKEND.md - API Endpoints](README_BACKEND.md#-api-endpoints-implementados)
➡️ [Backend.md - Endpoints Principales](Backend.md#43-endpoints-principales-por-módulo)

### Autenticación
➡️ [README_FRONTEND.md - Sistema de Autenticación](README_FRONTEND.md#-sistema-de-autenticación)
➡️ [README_BACKEND.md - Autenticación JWT](README_BACKEND.md#-sistema-de-autenticación-completo)

### Base de Datos
➡️ [README_BACKEND.md - Base de Datos](README_BACKEND.md#-base-de-datos)
➡️ `Servidor/src/database/schema.sql` - Esquema SQL completo

### Instalación
➡️ [README.md - Instalación y Ejecución](README.md#-instalación-y-ejecución)

### Testing
➡️ [README_BACKEND.md - Testing](README_BACKEND.md#-testing)
➡️ [Frontend.md - Pruebas y Validación](Frontend.md#15-pruebas-y-validación)

---

## 🆘 FAQ - Preguntas Frecuentes

### ¿Qué documento leo primero?
**Respuesta:** [README.md](README.md) - Es el punto de entrada principal.

### ¿Dónde está el sistema de colores?
**Respuesta:** [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - Paleta completa con códigos HEX.

### ¿Cómo instalo el proyecto?
**Respuesta:** [README.md - Instalación](README.md#-instalación-y-ejecución)

### ¿Qué endpoints están disponibles?
**Respuesta:** [README_BACKEND.md - API Endpoints](README_BACKEND.md#-api-endpoints-implementados)

### ¿Qué componentes React existen?
**Respuesta:** [README_FRONTEND.md - Componentes](README_FRONTEND.md#-componentes-comunes)

### ¿Cuál es el color primario del proyecto?
**Respuesta:** `#7592EB` - Ver [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)

### ¿Cómo funciona la autenticación?
**Respuesta:** JWT - Ver [README_BACKEND.md - Autenticación](README_BACKEND.md#-sistema-de-autenticación-completo)

### ¿Qué Historias de Usuario están implementadas?
**Respuesta:** Sprint 1 completo - Ver [README.md - Estado del Proyecto](README.md#-estado-del-proyecto)

---

## 📝 Convenciones de Actualización

Al modificar la documentación:

1. **Mantener consistencia** entre todos los archivos
2. **Actualizar fecha** al final de cada documento modificado
3. **Verificar enlaces** entre documentos
4. **Sincronizar información** (ej: si cambias un color en DESIGN_SYSTEM.md, actualízalo en README_FRONTEND.md)

---

## 📞 Contacto

¿Documentación confusa o faltante?
- **Email**: desarrollo@plataforma-denuncias.com
- **Issues**: Reportar problemas en la documentación

---

*Última actualización: Enero 2025*
