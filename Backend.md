📋 Informe Técnico / Prompt para el Backend
Asunto: Generación de la Especificación Técnica para la API RESTful de la "Plataforma Web para Denuncia Ciudadana de Problemas Urbanos".

Instrucción:
Desarrolla la especificación técnica completa para el backend de la plataforma. La API debe ser de tipo RESTful, diseñada para ser robusta, segura y escalable, sirviendo como el núcleo para todas las operaciones del frontend. La especificación debe estar detallada en las siguientes secciones:

1. Arquitectura y Stack Tecnológico
Lenguaje/Entorno: Node.js

Framework: Express.js para la gestión de rutas y middleware.

Base de Datos: MySQL. La interacción se gestionará a través de un ORM como Sequelize, que mapeará los modelos directamente desde el esquema SQL proporcionado.

Autenticación: Se implementará mediante JSON Web Tokens (JWT). El token contendrá el id_usuario y el id_tipo_usuario para la autorización basada en roles.

Manejo de Archivos: Se usará Multer para gestionar la carga de imágenes (evidencias fotográficas, RF-06).

2. Modelos de Datos (Basados en el ORM Sequelize)
Define los modelos que se corresponderán directamente con las tablas de la base de datos proporcionada:

TipoUsuario

Categoria

EstadoDenuncia

Usuario (con relaciones a TipoUsuario)

Denuncia (con relaciones a Usuario, Categoria y EstadoDenuncia)

EvidenciaFoto (con relación a Denuncia)

HistorialEstado (con relaciones a Denuncia, EstadoDenuncia y Usuario)

3. Definición de Endpoints de la API
Diseña los siguientes endpoints RESTful, agrupados por recurso. Asegura que cada endpoint implemente la lógica de negocio descrita en los requerimientos.

3.1. Autenticación y Usuarios (/api/auth, /api/usuarios)

POST /api/auth/register: Registro de nuevos ciudadanos (RF-01). Valida los datos y hashea la contraseña antes de guardarla en la tabla usuario.

POST /api/auth/login: Autenticación de usuarios (RF-04). Devuelve un JWT si las credenciales son correctas.

GET /api/usuarios/me: Obtiene el perfil del usuario autenticado (RF-03).

PUT /api/usuarios/me: Actualiza la información del perfil del usuario autenticado (RF-03).

GET /api/admin/usuarios: [Rol: Autoridad] Lista todos los usuarios para gestión (RF-13).

PUT /api/admin/usuarios/:id: [Rol: Autoridad] Modifica un usuario (ej. suspender cuenta) (RF-13).

3.2. Denuncias (/api/denuncias)

POST /api/denuncias: [Rol: Ciudadano] Creación de una nueva denuncia (RF-05). Debe manejar la carga de hasta 5 imágenes (RF-06) y datos de geolocalización (RF-07). Al crear, se debe registrar el primer estado en historial_estado.

GET /api/denuncias: Obtiene una lista paginada de denuncias. Permite filtros por categoría, estado y ubicación geográfica (RF-11, RF-16).

GET /api/denuncias/:id: Obtiene el detalle completo de una denuncia, incluyendo su historial de estados y las evidencias fotográficas (RF-09).

PUT /api/admin/denuncias/:id/estado: [Rol: Autoridad] Cambia el estado de una denuncia (RF-08). Requiere un comentario y crea un nuevo registro en historial_estado.

POST /api/denuncias/:id/comentarios: Permite la comunicación entre el ciudadano y la autoridad, adjunta a la denuncia (RF-10).

3.3. Recursos Auxiliares (/api/categorias, /api/estados)

GET /api/categorias: Devuelve la lista de todas las categorías de problemas urbanos disponibles.

GET /api/estados: Devuelve la lista de todos los posibles estados de una denuncia, respetando el orden_flujo.

3.4. Reportes y Estadísticas (/api/reportes)

GET /api/reportes/resumen: [Rol: Autoridad] Provee métricas clave para el dashboard (RF-11), como total de denuncias por estado.

GET /api/reportes/por-periodo: [Rol: Autoridad] Genera reportes estadísticos filtrados por fechas, categoría y ubicación (RF-14).

4. Lógica de Negocio y Seguridad
Autorización: Implementa un middleware que verifique el JWT en las rutas protegidas y restrinja el acceso según el rol (id_tipo_usuario). Por ejemplo, solo los usuarios con rol "Autoridad" pueden acceder a los endpoints /api/admin/*.

Validación de Datos: Utiliza una librería como Joi o express-validator para validar todos los datos de entrada en las solicitudes (body, params, query).

Gestión de Errores: Define un manejador de errores global que envíe respuestas consistentes en formato JSON con códigos de estado HTTP apropiados.