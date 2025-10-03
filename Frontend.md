🖥️ Informe Técnico / Prompt para el Frontend
Asunto: Generación de la Arquitectura de Componentes y Flujo de Vistas para la "Plataforma Web para Denuncia Ciudadana de Problemas Urbanos".

Instrucción:
Desarrolla la especificación técnica completa para el frontend del proyecto utilizando React (con sintaxis JSX). La aplicación debe ser una Single Page Application (SPA), completamente responsive y con una interfaz de usuario intuitiva. La especificación debe detallar la arquitectura de componentes, el sistema de enrutamiento y la gestión del estado global.

1. Arquitectura y Stack Tecnológico
Framework: React. Se recomienda el uso de Vite para la inicialización y el entorno de desarrollo.

Enrutamiento: React Router DOM para gestionar la navegación entre las diferentes vistas de la SPA.

Gestión de Estado: Zustand o Redux Toolkit para un manejo centralizado y eficiente del estado global (autenticación de usuario, lista de denuncias, notificaciones).

Estilos: Implementación con Styled-Components o CSS Modules. Se deben declarar las variables de color y tipografía proporcionadas en un archivo global para su uso en toda la aplicación.

Tipografías: DM Serif Text para títulos (<h1> a <h6>) y Montserrat para el cuerpo del texto.

Colores: Usar las variables --color-primary-main, --color-danger, etc., para temas, botones y estados visuales.

Llamadas a la API: Axios para realizar las peticiones HTTP al backend, con una instancia configurada para incluir automáticamente el JWT en las cabeceras.

Mapas: Integración con Leaflet o Google Maps React wrapper para la geolocalización (RF-07).

2. Arquitectura de Componentes
Diseña una estructura de componentes modular y reutilizable.

2.1. Componentes de UI / Compartidos (/components/ui)

Button: Botón personalizable con variantes (primario, peligro, etc.).

Input: Campo de texto, contraseña, área de texto.

Card: Contenedor genérico para mostrar información (ej. resumen de denuncia).

Modal: Ventana emergente para confirmaciones o formularios.

Spinner: Indicador de carga.

Alert: Componente para mostrar mensajes de éxito o error.

2.2. Componentes de Layout (/components/layout)

Navbar: Barra de navegación superior. Debe ser dinámica, mostrando opciones diferentes para usuarios no autenticados, ciudadanos y autoridades.

Footer: Pie de página.

ProtectedRoute: Wrapper de ruta que redirige al login si el usuario no está autenticado o no tiene el rol requerido.

2.3. Componentes Específicos por Funcionalidad (/features)

Autenticación (/features/auth)

LoginForm: Formulario de inicio de sesión.

RegisterForm: Formulario de registro para ciudadanos (RF-01).

Denuncias (/features/denuncias)

DenunciaForm: Formulario completo para crear/editar una denuncia. Incluye campos de texto, selector de categoría, subida de imágenes y un componente de mapa interactivo (RF-05, RF-06, RF-07).

DenunciaCard: Tarjeta que muestra un resumen de una denuncia para ser usada en listas.

DenunciasList: Componente que renderiza una lista de DenunciaCard y gestiona la paginación.

DenunciaDetail: Muestra toda la información de una denuncia, incluyendo la galería de imágenes, el mapa, y una Timeline de estados (RF-09).

DenunciaTimeline: Visualiza el historial_estado de una denuncia de forma cronológica.

CommentsSection: Sistema de comentarios para la comunicación bidireccional (RF-10).

Dashboard de Autoridad (/features/dashboard)

DashboardMetrics: Muestra las métricas principales (RF-11).

DenunciasTable: Tabla avanzada con filtros, ordenamiento y paginación para gestionar denuncias (RF-12).

UsersTable: Tabla para la gestión de usuarios (RF-13).

ReportsGenerator: Interfaz para generar y visualizar reportes estadísticos con gráficos (usando una librería como Chart.js) (RF-14, RF-15).

3. Flujo de Vistas y Enrutamiento (Páginas)
Define las rutas principales de la aplicación.

Rutas Públicas:

/: Landing Page. Presenta el proyecto, muestra un mapa con denuncias públicas recientes y tiene botones de "Iniciar Sesión" y "Registrarse".

/login: Página que renderiza el LoginForm.

/register: Página que renderiza el RegisterForm.

Rutas para Ciudadanos (Protegidas):

/home: Vista principal del ciudadano, mostrando un mapa y una lista de sus denuncias.

/denuncias/nueva: Página que renderiza el DenunciaForm para crear un nuevo reporte.

/denuncia/:id: Página de detalle de una denuncia específica, renderizando DenunciaDetail.

/perfil: Página para que el usuario actualice sus datos (RF-03).

Rutas para Autoridades (Protegidas por Rol):

/dashboard: Vista principal del panel administrativo, renderizando DashboardMetrics y DenunciasTable.

/dashboard/denuncia/:id: Vista de gestión de una denuncia específica, con opciones para cambiar estado y comunicarse.

/dashboard/usuarios: Página para la gestión de usuarios, renderizando UsersTable.

/dashboard/reportes: Página que renderiza ReportsGenerator.