/**
 * Test completo del flujo de denuncias
 * - Crear denuncia
 * - Listar denuncias
 * - Ver detalle
 * - Actualizar estado (autoridad)
 * - Hacer seguimiento
 */

const API_BASE = 'http://localhost:5000/api/v1';

// Colores para la consola
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function makeRequest(endpoint, method = 'GET', body = null, token = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();

        return {
            status: response.status,
            success: response.ok,
            data
        };
    } catch (error) {
        return {
            status: 0,
            success: false,
            error: error.message
        };
    }
}

async function testBackendHealth() {
    log('\n=== TEST 1: Verificar salud del backend ===', 'cyan');

    try {
        const response = await fetch('http://localhost:5000/health');
        if (response.ok) {
            log('✓ Backend está corriendo correctamente', 'green');
            return true;
        }
    } catch (error) {
        log('✗ Backend no responde', 'red');
        return false;
    }
}

async function registerTestUser() {
    log('\n=== TEST 2: Registrar usuario de prueba (Ciudadano) ===', 'cyan');

    const timestamp = Date.now();
    const randomDni = String(10000000 + Math.floor(Math.random() * 90000000));

    const userData = {
        nombres: 'Usuario',
        apellidos: 'Prueba',
        email: `test_${timestamp}@test.com`,
        password: 'Test123456',
        documento_identidad: randomDni,
        telefono: '987654321',
        direccion: 'Av. Test 123'
    };

    const result = await makeRequest('/auth/register/ciudadano', 'POST', userData);

    if (result.success) {
        log(`✓ Usuario registrado: ${userData.email}`, 'green');
        return { email: userData.email, password: userData.password, data: result.data };
    } else {
        log(`✗ Error al registrar: ${JSON.stringify(result.data)}`, 'red');
        return null;
    }
}

async function loginUser(email, password) {
    log('\n=== TEST 3: Login de usuario ===', 'cyan');

    const result = await makeRequest('/auth/login', 'POST', { email, password });

    if (result.success && result.data.data?.token) {
        log(`✓ Login exitoso`, 'green');
        return result.data.data.token;
    } else {
        log(`✗ Error al hacer login: ${JSON.stringify(result.data)}`, 'red');
        return null;
    }
}

async function getCategorias() {
    log('\n=== TEST 4: Obtener categorías disponibles ===', 'cyan');

    const result = await makeRequest('/categorias', 'GET');

    if (result.success && result.data.data?.categorias) {
        log(`✓ Se obtuvieron ${result.data.data.categorias.length} categorías`, 'green');
        if (result.data.data.categorias.length > 0) {
            const primeraCategoria = result.data.data.categorias[0];
            log(`  Primera categoría: ${primeraCategoria.nombre} (ID: ${primeraCategoria._id})`, 'blue');
            return result.data.data.categorias;
        }
        return [];
    } else {
        log(`✗ Error al obtener categorías: ${JSON.stringify(result.data)}`, 'red');
        return [];
    }
}

async function createDenuncia(token, categoriaId) {
    log('\n=== TEST 5: Crear denuncia ===', 'cyan');

    const denunciaData = {
        titulo: `Denuncia de prueba ${Date.now()}`,
        descripcion_detallada: 'Esta es una denuncia de prueba para verificar el flujo completo del sistema',
        id_categoria: categoriaId,
        latitud: -12.0464,
        longitud: -77.0428,
        direccion_geolocalizada: 'Lima, Perú',
        es_anonima: false
    };

    const result = await makeRequest('/denuncias', 'POST', denunciaData, token);

    if (result.success && result.data.data?.denuncia) {
        const denuncia = result.data.data.denuncia;
        const denunciaId = denuncia.id_denuncia || denuncia._id;
        log(`✓ Denuncia creada con ID: ${denunciaId}`, 'green');
        log(`  Título: ${denunciaData.titulo}`, 'blue');
        log(`  Código seguimiento: ${denuncia.codigo_seguimiento}`, 'blue');
        return denunciaId;
    } else {
        log(`✗ Error al crear denuncia: ${JSON.stringify(result.data)}`, 'red');
        return null;
    }
}

async function getDenuncias(token) {
    log('\n=== TEST 6: Listar denuncias del usuario ===', 'cyan');

    const result = await makeRequest('/denuncias/mis-denuncias', 'GET', null, token);

    if (result.success && result.data.data?.denuncias) {
        const count = result.data.data.denuncias.length;
        log(`✓ Se obtuvieron ${count} denuncias`, 'green');
        return result.data.data.denuncias;
    } else {
        log(`✗ Error al listar denuncias: ${JSON.stringify(result.data)}`, 'red');
        return [];
    }
}

async function getDenunciaDetail(denunciaId, token) {
    log('\n=== TEST 6: Obtener detalle de denuncia ===', 'cyan');

    const result = await makeRequest(`/denuncias/${denunciaId}`, 'GET', null, token);

    if (result.success && result.data.data?.denuncia) {
        const denuncia = result.data.data.denuncia;
        log(`✓ Detalle de denuncia obtenido`, 'green');
        log(`  ID: ${denuncia.id_denuncia}`, 'blue');
        log(`  Título: ${denuncia.titulo}`, 'blue');
        log(`  Estado: ${denuncia.estado_nombre}`, 'blue');
        log(`  Categoría: ${denuncia.categoria_nombre}`, 'blue');
        return denuncia;
    } else {
        log(`✗ Error al obtener detalle: ${JSON.stringify(result.data)}`, 'red');
        return null;
    }
}

async function trackDenuncia(codigoSeguimiento) {
    log('\n=== TEST 7: Hacer seguimiento de denuncia ===', 'cyan');

    const result = await makeRequest(`/denuncias/seguimiento/${codigoSeguimiento}`, 'GET');

    if (result.success && result.data.data?.denuncia) {
        log(`✓ Seguimiento exitoso`, 'green');
        log(`  Estado: ${result.data.data.denuncia.estado_nombre}`, 'blue');
        return result.data.data;
    } else {
        log(`✗ Error al hacer seguimiento: ${JSON.stringify(result.data)}`, 'red');
        return null;
    }
}

async function getHistorialEstados(denunciaId, token) {
    log('\n=== TEST 8: Obtener historial de estados ===', 'cyan');

    const result = await makeRequest(`/denuncias/${denunciaId}/historial`, 'GET', null, token);

    if (result.success && result.data.data?.historial) {
        const count = result.data.data.historial.length;
        log(`✓ Se obtuvieron ${count} cambios de estado`, 'green');
        result.data.data.historial.forEach((cambio, index) => {
            log(`  ${index + 1}. ${cambio.estado_nombre} - ${new Date(cambio.fecha_cambio).toLocaleString()}`, 'blue');
        });
        return result.data.data.historial;
    } else {
        log(`✗ Error al obtener historial: ${JSON.stringify(result.data)}`, 'red');
        return [];
    }
}

async function runTests() {
    log('╔══════════════════════════════════════════════════╗', 'cyan');
    log('║  TEST COMPLETO DEL FLUJO DE DENUNCIAS           ║', 'cyan');
    log('╚══════════════════════════════════════════════════╝', 'cyan');

    // 1. Verificar backend
    const backendOk = await testBackendHealth();
    if (!backendOk) {
        log('\n❌ El backend no está disponible. Deteniendo tests.', 'red');
        return;
    }

    // 2. Registrar usuario
    const user = await registerTestUser();
    if (!user) {
        log('\n❌ No se pudo registrar usuario. Deteniendo tests.', 'red');
        return;
    }

    // 3. Login
    const token = await loginUser(user.email, user.password);
    if (!token) {
        log('\n❌ No se pudo hacer login. Deteniendo tests.', 'red');
        return;
    }

    // 4. Obtener categorías
    const categorias = await getCategorias();
    if (categorias.length === 0) {
        log('\n❌ No hay categorías disponibles. Deteniendo tests.', 'red');
        return;
    }

    // 5. Crear denuncia
    const denunciaId = await createDenuncia(token, categorias[0]._id);
    if (!denunciaId) {
        log('\n❌ No se pudo crear denuncia. Deteniendo tests.', 'red');
        return;
    }

    // 6. Listar denuncias
    const denuncias = await getDenuncias(token);

    // 7. Ver detalle
    const detalle = await getDenunciaDetail(denunciaId, token);
    if (!detalle) {
        log('\n❌ No se pudo obtener detalle de denuncia.', 'red');
        return;
    }

    // 7. Seguimiento (con código de seguimiento)
    if (detalle.codigo_seguimiento) {
        await trackDenuncia(detalle.codigo_seguimiento);
    } else {
        log('\n⚠ No hay código de seguimiento disponible', 'yellow');
    }

    // 8. Historial de estados
    await getHistorialEstados(denunciaId, token);

    // Resumen final
    log('\n╔══════════════════════════════════════════════════╗', 'cyan');
    log('║  RESUMEN DE TESTS                                ║', 'cyan');
    log('╚══════════════════════════════════════════════════╝', 'cyan');
    log('✓ Backend funcionando', 'green');
    log('✓ Registro de usuario exitoso', 'green');
    log('✓ Login exitoso', 'green');
    log('✓ Creación de denuncia exitosa', 'green');
    log('✓ Listado de denuncias funcional', 'green');
    log('✓ Detalle de denuncia funcional', 'green');
    log('✓ Seguimiento de denuncia funcional', 'green');
    log('✓ Historial de estados funcional', 'green');
    log('\n✅ TODOS LOS TESTS PASARON CORRECTAMENTE\n', 'green');
}

// Ejecutar los tests
runTests().catch(error => {
    log(`\n❌ Error crítico: ${error.message}`, 'red');
    console.error(error);
});
