import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const runTest = async () => {
    try {
        const email = `testuser${Math.floor(Math.random() * 10000)}@example.com`;
        const password = 'password123';

        console.log(`1. Registrando usuario ${email}...`);
        const registroRes = await axios.post(`${API_URL}/auth/register/ciudadano`, {
            nombres: 'Test',
            apellidos: 'User',
            email: email,
            password: password,
            telefono: '1234567890',
            documento_identidad: `DOC${Math.floor(Math.random() * 100000)}`
        });

        const token = registroRes.data.data.token;
        console.log('✅ Registro exitoso. Token obtenido.');

        const headers = {
            Authorization: `Bearer ${token}`
        };

        console.log('\n2. Obteniendo categorías...');
        const categoriasRes = await axios.get(`${API_URL}/categorias`, { headers });
        const categorias = categoriasRes.data.data.categorias;

        if (categorias.length === 0) {
            throw new Error('No hay categorías disponibles');
        }

        const idCategoria = categorias[0].id_categoria; // Usar el ID real de la primera categoría
        console.log(`✅ Categoría obtenida: ${categorias[0].nombre} (ID: ${idCategoria})`);

        console.log('\n3. Creando denuncia...');
        const denunciaData = {
            titulo: 'Denuncia de prueba script',
            descripcion_detallada: 'Esta es una denuncia creada desde el script de prueba para verificar el flujo.',
            id_categoria: idCategoria,
            latitud: 4.6097,
            longitud: -74.0817,
            direccion_geolocalizada: 'Calle Falsa 123',
            es_anonima: false
        };

        const crearRes = await axios.post(`${API_URL}/denuncias`, denunciaData, { headers });
        console.log('✅ Denuncia creada exitosamente:', crearRes.data.data.denuncia.id_denuncia);

        console.log('\n4. Listando denuncias...');
        const listarRes = await axios.get(`${API_URL}/denuncias`, { headers });
        console.log(`✅ Listado exitoso. Se encontraron ${listarRes.data.data.denuncias.length} denuncias.`);

        console.log('\n🎉 Flujo completo verificado correctamente en el backend.');

    } catch (error) {
        console.error('\n❌ Error en la prueba:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
};

runTest();
