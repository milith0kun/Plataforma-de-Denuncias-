/**
 * ============================================================================
 * SCRIPT: DOCUMENTACIÓN MASIVA DEL FRONTEND
 * ============================================================================
 * Autor: Dennis Moises Ccapatinta Qqueccaño
 * Código: 140984
 * Fecha: 18/12/2024
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

// Header estándar para archivos JSX
const getJSXHeader = (fileName, description, category) => `/**
 * ============================================================================
 * ${category}
 * ============================================================================
 * 
 * @file ${fileName}
 * @description ${description}
 * 
 * @author Dennis Moises Ccapatinta Qqueccaño - 140984
 * @date 2024-12-18
 * @version 2.0.0
 * @proyecto Plataforma de Denuncias Ciudadanas
 * 
 * @responsabilidades
 * - Desarrollo e implementación del frontend completo
 * - Diseño de componentes React reutilizables
 * - Integración con API REST del backend
 * 
 * ============================================================================
 */

`;

// Header estándar para archivos CSS
const getCSSHeader = (fileName) => `/**
 * ============================================================================
 * ESTILOS: ${fileName}
 * ============================================================================
 * 
 * @file ${fileName}
 * @author Dennis Moises Ccapatinta Qqueccaño - 140984
 * @date 2024-12-18
 * 
 * @description
 * Hoja de estilos que define la apariencia visual y comportamiento responsive
 * 
 * @enfoque Mobile-First
 * @sistema-diseño Variables CSS unificadas
 * 
 * ============================================================================
 */

`;

// Archivos a documentar con sus descripciones
const archivos = {
    // Componentes de Autenticación
    'src/components/auth/RegisterForm/RegisterForm.jsx': {
        description: 'Formulario de registro de nuevos usuarios con validación completa de datos',
        category: 'COMPONENTE: FORMULARIO DE REGISTRO'
    },

    // Componentes Comunes
    'src/components/common/Button/Button.jsx': {
        description: 'Componente Button reutilizable con múltiples variantes y estados',
        category: 'COMPONENTE: BOTÓN REUTILIZABLE'
    },
    'src/components/common/Input/Input.jsx': {
        description: 'Componente Input con validación, tipos múltiples y manejo de errores',
        category: 'COMPONENTE: INPUT REUTILIZABLE'
    },
    'src/components/common/Alert/Alert.jsx': {
        description: 'Sistema de alertas con niveles (success, error, warning, info) y cierre automático',
        category: 'COMPONENTE: SISTEMA DE ALERTAS'
    },
    'src/components/common/Loading/Loading.jsx': {
        description: 'Indicador de carga animado para operaciones asíncronas',
        category: 'COMPONENTE: INDICADOR DE CARGA'
    },
    'src/components/common/Header/Header.jsx': {
        description: 'Cabecera principal de la aplicación con navegación y menú de usuario',
        category: 'COMPONENTE: HEADER PRINCIPAL'
    },
    'src/components/common/Navigation/Navigation.jsx': {
        description: 'Menú de navegación lateral organizado por roles de usuario',
        category: 'COMPONENTE: MENÚ DE NAVEGACIÓN'
    },
    'src/components/common/MetricCard/MetricCard.jsx': {
        description: 'Tarjeta de métrica para mostrar estadísticas en dashboards',
        category: 'COMPONENTE: TARJETA DE MÉTRICA'
    },
    'src/components/common/Toast/Toast.jsx': {
        description: 'Notificación toast para feedback al usuario',
        category: 'COMPONENTE: NOTIFICACIÓN TOAST'
    },
    'src/components/common/ProtectedRoute/ProtectedRoute.jsx': {
        description: 'Componente de ruta protegida con validación de autenticación y roles',
        category: 'COMPONENTE: RUTA PROTEGIDA'
    },

    // Componentes de Denuncias
    'src/components/denuncias/MapaPicker.jsx': {
        description: 'Selector de ubicación interactivo con Leaflet para denuncias',
        category: 'COMPONENTE: SELECTOR DE UBICACIÓN'
    },
    'src/components/denuncias/UploadFotos.jsx': {
        description: 'Componente de carga múltiple de evidencias fotográficas',
        category: 'COMPONENTE: UPLOAD DE FOTOS'
    },
    'src/components/denuncias/Comentarios.jsx': {
        description: 'Sistema de comentarios para denuncias con soporte público/interno',
        category: 'COMPONENTE: SISTEMA DE COMENTARIOS'
    },
    'src/components/denuncias/Timeline/Timeline.jsx': {
        description: 'Línea de tiempo visual del historial de estados de denuncia',
        category: 'COMPONENTE: TIMELINE DE ESTADOS'
    },

    // Páginas
    'src/pages/auth/LoginPage/LoginPage.jsx': {
        description: 'Página de inicio de sesión con autenticación JWT',
        category: 'PÁGINA: LOGIN'
    },
    'src/pages/auth/RegisterPage/RegisterPage.jsx': {
        description: 'Página de registro de nuevos usuarios',
        category: 'PÁGINA: REGISTRO'
    },
    'src/pages/auth/ForgotPasswordPage/ForgotPasswordPage.jsx': {
        description: 'Página de recuperación de contraseña por email',
        category: 'PÁGINA: RECUPERAR CONTRASEÑA'
    },
    'src/pages/ciudadano/HomePage/HomePage.jsx': {
        description: 'Dashboard principal del ciudadano con resumen y estadísticas',
        category: 'PÁGINA: DASHBOARD CIUDADANO'
    },
    'src/pages/ciudadano/DenunciasPage/DenunciasPage.jsx': {
        description: 'Listado completo de denuncias con filtros y búsqueda',
        category: 'PÁGINA: MIS DENUNCIAS'
    },
    'src/pages/ciudadano/NuevaDenunciaPage/NuevaDenunciaPage.jsx': {
        description: 'Formulario de creación de denuncia con geolocalización y evidencias',
        category: 'PÁGINA: NUEVA DENUNCIA'
    },
    'src/pages/ciudadano/DetalleDenunciaPage/DetalleDenunciaPage.jsx': {
        description: 'Vista detallada de denuncia con historial y comentarios',
        category: 'PÁGINA: DETALLE DE DENUNCIA'
    },
    'src/pages/ciudadano/PerfilPage/PerfilPage.jsx': {
        description: 'Gestión de perfil de usuario con edición de datos',
        category: 'PÁGINA: PERFIL DE USUARIO'
    },
    'src/pages/ciudadano/ReportesPage/ReportesPage.jsx': {
        description: 'Reportes y estadísticas con gráficos de Recharts',
        category: 'PÁGINA: REPORTES Y ESTADÍSTICAS'
    },
    'src/pages/autoridad/DashboardAutoridadPage/DashboardAutoridadPage.jsx': {
        description: 'Dashboard de autoridades con gestión de denuncias del sistema',
        category: 'PÁGINA: DASHBOARD AUTORIDAD'
    },

    // Servicios
    'src/services/api.js': {
        description: 'Configuración base de Axios con interceptores JWT',
        category: 'SERVICIO: CONFIGURACIÓN API'
    },
    'src/services/authService.js': {
        description: 'Servicio de autenticación (login, registro, recuperación)',
        category: 'SERVICIO: AUTENTICACIÓN'
    },
    'src/services/denunciaService.js': {
        description: 'Servicio de gestión completa de denuncias (CRUD)',
        category: 'SERVICIO: DENUNCIAS'
    },
    'src/services/usuarioService.js': {
        description: 'Servicio de gestión de perfil y datos de usuario',
        category: 'SERVICIO: USUARIOS'
    },
    'src/services/comentarioService.js': {
        description: 'Servicio de gestión de comentarios en denuncias',
        category: 'SERVICIO: COMENTARIOS'
    },
    'src/services/estadisticasService.js': {
        description: 'Servicio de obtención de estadísticas y métricas',
        category: 'SERVICIO: ESTADÍSTICAS'
    },

    // Contextos
    'src/contexts/AuthContext.jsx': {
        description: 'Contexto global de autenticación con estado de usuario',
        category: 'CONTEXTO: AUTENTICACIÓN GLOBAL'
    },

    // Hooks
    'src/hooks/useAuth.js': {
        description: 'Hook personalizado para acceder al contexto de autenticación',
        category: 'HOOK: USE AUTH'
    },
    'src/hooks/useDenuncias.js': {
        description: 'Hook personalizado para gestión de denuncias',
        category: 'HOOK: USE DENUNCIAS'
    },
    'src/hooks/useToast.js': {
        description: 'Hook personalizado para notificaciones toast',
        category: 'HOOK: USE TOAST'
    },

    // Rutas
    'src/routes/AppRoutes.jsx': {
        description: 'Configuración de rutas de la aplicación con React Router',
        category: 'CONFIGURACIÓN: RUTAS DE LA APLICACIÓN'
    },

    // Constants
    'src/constants/colors.js': {
        description: 'Constantes de colores y funciones helper para el sistema de diseño',
        category: 'CONSTANTES: SISTEMA DE COLORES'
    }
};

// Función para agregar header a archivo
function documentarArchivo(rutaArchivo, config) {
    const rutaCompleta = path.join(__dirname, rutaArchivo);

    if (!fs.existsSync(rutaCompleta)) {
        console.log(`[⚠] No encontrado: ${rutaArchivo}`);
        return false;
    }

    const contenido = fs.readFileSync(rutaCompleta, 'utf8');

    // Verificar si ya tiene documentación
    if (contenido.includes('@author Dennis')) {
        console.log(`[~] Ya documentado: ${path.basename(rutaArchivo)}`);
        return false;
    }

    const esCSS = rutaArchivo.endsWith('.css');
    const header = esCSS ?
        getCSSHeader(path.basename(rutaArchivo)) :
        getJSXHeader(path.basename(rutaArchivo), config.description, config.category);

    const nuevoContenido = header + contenido;

    fs.writeFileSync(rutaCompleta, nuevoContenido, 'utf8');
    console.log(`[✓] Documentado: ${path.basename(rutaArchivo)}`);
    return true;
}

// Procesar todos los archivos
console.log('========================================');
console.log(' INICIANDO DOCUMENTACIÓN MASIVA');
console.log(' Autor: Dennis Ccapatinta');
console.log('========================================\n');

let total = 0;
let documentados = 0;

Object.entries(archivos).forEach(([ruta, config]) => {
    total++;
    if (documentarArchivo(ruta, config)) {
        documentados++;
    }
});

// Documentar archivos CSS automáticamente
console.log('\n📁 Documentando archivos CSS...');
const directorios = [
    'src/components',
    'src/pages',
    'src'
];

function buscarCSS(directorio) {
    const rutaCompleta = path.join(__dirname, directorio);
    if (!fs.existsSync(rutaCompleta)) return;

    const archivos = fs.readdirSync(rutaCompleta);

    archivos.forEach(archivo => {
        const rutaArchivo = path.join(directorio, archivo);
        const rutaCompletaArchivo = path.join(__dirname, rutaArchivo);
        const stat = fs.statSync(rutaCompletaArchivo);

        if (stat.isDirectory()) {
            buscarCSS(rutaArchivo);
        } else if (archivo.endsWith('.css') || archivo.endsWith('.module.css')) {
            const contenido = fs.readFileSync(rutaCompletaArchivo, 'utf8');

            if (!contenido.includes('@author Dennis')) {
                const header = getCSSHeader(archivo);
                fs.writeFileSync(rutaCompletaArchivo, header + contenido, 'utf8');
                console.log(`[✓] CSS: ${archivo}`);
                total++;
                documentados++;
            }
        }
    });
}

directorios.forEach(dir => buscarCSS(dir));

console.log('\n========================================');
console.log(' RESUMEN');
console.log('========================================');
console.log(` Total procesados: ${total}`);
console.log(` Documentados: ${documentados}`);
console.log(` Ya documentados: ${total - documentados}`);
console.log('========================================\n');
console.log('✓ Proceso completado!\n');
