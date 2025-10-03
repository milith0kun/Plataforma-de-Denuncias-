Cusco - Perú
2025
PLATAFORMA WEB PARA DENUNCIA CIUDADANA DE PROBLEMAS URBANOS

1. INFORMACIÓN GENERAL DEL PROYECTO
Nombre del Proyecto: Plataforma Web para Denuncia Ciudadana de Problemas Urbanos

Stakeholders Principales:
Ciudadanía general
Autoridades municipales
Organizaciones vecinales
Entidades públicas de servicios urbanos
2. CONTEXTO Y JUSTIFICACIÓN
2.1 Problemática Identificada
La gestión de problemas urbanos presenta deficiencias significativas en la comunicación entre ciudadanos y autoridades. Los canales tradicionales de denuncia resultan ineficientes, generando pérdida de reportes, falta de seguimiento y deterioro de la confianza institucional. Esta situación impacta directamente en la calidad de vida urbana y la efectividad de las políticas públicas.
2.2 Oportunidad de Mejora
La implementación de una solución tecnológica integral permitirá optimizar los procesos de reporte, seguimiento y resolución de incidencias urbanas, fortaleciendo la participación ciudadana y mejorando la respuesta institucional.

3. OBJETIVOS DEL SISTEMA
3.1 Objetivo General
Desarrollar una plataforma web que facilite el reporte ciudadano de problemas urbanos y permita el seguimiento integral de su proceso de resolución.
3.2 Objetivos Específicos
Implementar un sistema de registro diferenciado para ciudadanos y autoridades
Habilitar funcionalidades de denuncia con evidencia fotográfica y geolocalización precisa
Establecer un sistema de seguimiento en tiempo real del estado de las denuncias
Crear un dashboard administrativo para la gestión eficiente por parte de autoridades
Generar reportes estadísticos y analíticos sobre incidencias y resoluciones

4. ALCANCE DEL PROYECTO
4.1 Dentro del Alcance
Desarrollo de aplicación web responsive compatible con dispositivos móviles y desktop
Sistema completo de gestión de usuarios con roles diferenciados
Módulo integral de denuncias con multimedia y geolocalización
Sistema de workflow para seguimiento de estados
Panel de control administrativo con funcionalidades completas
Módulo de reportes y estadísticas
Integración con servicios de mapas y geolocalización
Sistema de notificaciones automáticas
4.2 Fuera del Alcance
Aplicación móvil nativa
Integración directa con sistemas legacy municipales existentes
Módulo de pagos o facturación
Funcionalidades de red social o chat en tiempo real
Sistema de votación o ranking de denuncias
5. REQUERIMIENTOS FUNCIONALES
5.1 Gestión de Usuarios
RF-01: Registro de Ciudadanos
El sistema debe permitir el registro de ciudadanos con validación de identidad
Campos obligatorios: nombres, apellidos, documento de identidad, email, teléfono, dirección
Validación de datos contra bases públicas cuando sea posible
RF-02: Registro de Autoridades
El sistema debe permitir el registro de usuarios con rol de autoridad
Asignación de permisos específicos según el tipo de autoridad
RF-03: Gestión de Perfiles
Los usuarios deben poder actualizar su información personal
Historial de actividad y denuncias realizadas
RF-04: Sistema de Autenticación
Implementación de login seguro con email/contraseña
Funcionalidad de recuperación de contraseña
Opción de autenticación de dos roles
5.2 Módulo de Denuncias
RF-05: Creación de Denuncias
Formulario intuitivo para reporte de incidencias urbanas
Categorización predefinida: baches, alumbrado, limpieza, vandalismo, otros
Campo de descripción detallada obligatorio
Fecha y hora automática de registro
RF-06: Evidencia Fotográfica
Carga de múltiples imágenes por denuncia (máximo 5)
Validación de formatos: JPG, PNG, WebP (En evaluacion) 
Compresión automática para optimizar almacenamiento
Visualización en galería dentro de la denuncia
RF-07: Geolocalización Precisa
Detección automática de ubicación del dispositivo
Opción de ajuste manual en mapa interactivo
Dirección descriptiva automática basada en coordenadas
RF-08: Estados de Denuncia
Flujo de estados: Registrada → En Revisión → Asignada → En Proceso → Resuelta → Cerrada
Comentarios obligatorios en cada cambio de estado
5.3 Sistema de Seguimiento
RF-09: Tracking de Denuncias
Código único de seguimiento por denuncia
Línea de tiempo visual con historial completo
Notificaciones automáticas por cambios de estado
RF-10: Comunicación Bidireccional
Sistema de comentarios entre denunciante y autoridad
Notificaciones push 
Confirmación denunciante  y autoridad 
5.4 Panel Administrativo
RF-11: Dashboard de Autoridades
Vista general de denuncias por jurisdicción
Filtros por estado, categoría, fecha y ubicación
Métricas de rendimiento en tiempo real
RF-12: Gestión de Denuncias
Herramientas de edición y actualización masiva
Sistema de priorización automática y manual
Exportación de datos en formatos estándar 
Funcionalidad de duplicación y merge de denuncias
RF-13: Administración de Usuarios
Gestión completa de cuentas ciudadanas y de autoridad
Asignación y modificación de roles y permisos
Suspensión temporal o permanente de cuentas
Auditoría de acciones administrativas
5.5 Reportes y Estadísticas
RF-14: Reportes Estadísticos
Generación de reportes por período, categoría y ubicación
Métricas de tiempo promedio de resolución
Tendencias y patrones de incidencias
RF-15: Visualización de Datos
Gráficos interactivos y dashboards personalizables
Exportación de reportes en PDF y Excel
Programación de reportes automáticos
5.6 Funcionalidades Transversales
RF-16: Sistema de Búsqueda
Búsqueda avanzada por múltiples criterios
Filtros combinables y guardables
Búsqueda geográfica por radio de distancia
Indexación completa para respuesta rápida
RF-17: Notificaciones Inteligentes
Configuración granular de tipos de notificación
Múltiples canales: email, SMS, push notifications
Notificaciones basadas en proximidad geográfica
Resumen periódico de actividad

6. REQUERIMIENTOS NO FUNCIONALES
6.1 Rendimiento
Tiempo de respuesta máximo de 3 segundos para operaciones estándar
Carga de imágenes optimizada con compresión automática
Caché inteligente para consultas frecuentes
6.2 Escalabilidad
Arquitectura preparada para crecimiento horizontal
Base de datos 
6.3 Seguridad
Protección contra ataques comunes (SQL Injection)
Cumplimiento con normativas de protección de datos
6.4 Usabilidad
Interfaz intuitiva siguiendo principios de UX/UI
Responsive design para todos los dispositivos

6.6 Compatibilidad
Soporte para navegadores modernos (últimas 2 versiones)
Integración con servicios de mapas estándar
APIs abiertas para futuras integraciones










Documento de Roles y Responsabilidades
1. Product Owner (PO) – Rol Rotativo
Responsabilidades:
Definir y priorizar los requisitos del sistema (MVP y siguientes).


Mantener y refinar el Product Backlog.


Asegurar que el desarrollo aporte valor al usuario final.


Coordinar con el equipo la validación de requisitos y cambios.


Asignación:
Este rol será rotativo entre los integrantes del equipo de desarrollo, cambiando en cada iteración o sprint.
2. Scrum Master (SM)
Responsabilidades:
Facilitar las reuniones de coordinación (daily meets, retrospectivas, revisiones).


Eliminar impedimentos que afecten el progreso.


Promover la aplicación de las prácticas ágiles dentro del equipo.


Asegurar la comunicación y seguimiento de acuerdos.


Asignado a: Luis Alejandro Ramos Aguirre 225425
3. Equipo de Desarrollo (Full Stack Developers)
Responsabilidades Generales:
Analizar, diseñar, programar y probar las funcionalidades del sistema.


Participar en la planificación y estimación de tareas en cada iteración.


Asegurar la calidad del software mediante pruebas y revisiones.


Documentar los avances y compartir hallazgos en las daily meets.


Rotar en el rol de Product Owner según lo acordado.


Integrantes:

Andy Yoseph Quispe Huanca 221949 – Full Stack Developer


Edmil Jampier Saire Bustamante 174449] – Full Stack Developer


Dennis Moises Ccapatinta Qqueccaño 140984 – Full Stack Developer
Luis Alejandro Ramos Aguirre 225425  – Full Stack Developer 

4. Dinámica de Roles
El rol de Product Owner rotará entre los desarrolladores en cada iteración.


El equipo se organizará de manera colaborativa y auto-gestionada.


Todos los integrantes participan activamente en las ceremonias ágiles.
