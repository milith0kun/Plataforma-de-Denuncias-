import dotenv from 'dotenv';
import { conectarDB } from '../config/database.js';
import Categoria from '../models/Categoria.js';
import EstadoDenuncia from '../models/EstadoDenuncia.js';

dotenv.config();

const categoriasIniciales = [
  {
    nombre: 'Infraestructura',
    descripcion: 'Problemas relacionados con infraestructura pública',
    area_responsable_sugerida: 'Obras Públicas'
  },
  {
    nombre: 'Servicios Públicos',
    descripcion: 'Problemas con servicios públicos (agua, luz, gas)',
    area_responsable_sugerida: 'Servicios Públicos'
  },
  {
    nombre: 'Tránsito',
    descripcion: 'Problemas de tránsito y señalización',
    area_responsable_sugerida: 'Tránsito'
  },
  {
    nombre: 'Seguridad',
    descripcion: 'Problemas de seguridad ciudadana',
    area_responsable_sugerida: 'Seguridad'
  },
  {
    nombre: 'Limpieza',
    descripcion: 'Problemas de limpieza y recolección de residuos',
    area_responsable_sugerida: 'Limpieza Urbana'
  },
  {
    nombre: 'Medio Ambiente',
    descripcion: 'Problemas ambientales',
    area_responsable_sugerida: 'Medio Ambiente'
  },
  {
    nombre: 'Transparencia',
    descripcion: 'Denuncias sobre transparencia y corrupción',
    area_responsable_sugerida: 'Contraloría'
  },
  {
    nombre: 'Otros',
    descripcion: 'Otras categorías no especificadas',
    area_responsable_sugerida: 'Mesa de Entrada'
  }
];

const estadosIniciales = [
  {
    nombre: 'Registrada',
    descripcion: 'Denuncia registrada en el sistema',
    orden_flujo: 1
  },
  {
    nombre: 'En Revisión',
    descripcion: 'Denuncia en proceso de revisión',
    orden_flujo: 2
  },
  {
    nombre: 'Asignada',
    descripcion: 'Denuncia asignada a un área responsable',
    orden_flujo: 3
  },
  {
    nombre: 'En Proceso',
    descripcion: 'Denuncia en proceso de resolución',
    orden_flujo: 4
  },
  {
    nombre: 'Resuelta',
    descripcion: 'Denuncia resuelta',
    orden_flujo: 5
  },
  {
    nombre: 'Cerrada',
    descripcion: 'Denuncia cerrada',
    orden_flujo: 6
  },
  {
    nombre: 'Rechazada',
    descripcion: 'Denuncia rechazada',
    orden_flujo: 7
  }
];

async function inicializarBaseDatos() {
  try {
    console.log('🔄 Iniciando proceso de inicialización de base de datos...\n');

    // Conectar a MongoDB
    const conexionExitosa = await conectarDB();

    if (!conexionExitosa) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // Verificar e insertar categorías
    console.log('📋 Inicializando categorías...');
    const categoriasExistentes = await Categoria.countDocuments();

    if (categoriasExistentes === 0) {
      await Categoria.insertMany(categoriasIniciales);
      console.log(`✅ ${categoriasIniciales.length} categorías creadas exitosamente`);
    } else {
      console.log(`ℹ️  Ya existen ${categoriasExistentes} categorías en la base de datos`);
    }

    // Verificar e insertar estados
    console.log('\n📊 Inicializando estados de denuncia...');
    const estadosExistentes = await EstadoDenuncia.countDocuments();

    if (estadosExistentes === 0) {
      await EstadoDenuncia.insertMany(estadosIniciales);
      console.log(`✅ ${estadosIniciales.length} estados creados exitosamente`);
    } else {
      console.log(`ℹ️  Ya existen ${estadosExistentes} estados en la base de datos`);
    }

    console.log('\n✅ Inicialización de base de datos completada exitosamente\n');
    console.log('📝 Categorías disponibles:');
    const categorias = await Categoria.find().select('nombre descripcion');
    categorias.forEach(cat => {
      console.log(`   - ${cat.nombre}: ${cat.descripcion}`);
    });

    console.log('\n📝 Estados disponibles:');
    const estados = await EstadoDenuncia.find().sort({ orden_flujo: 1 }).select('nombre descripcion orden_flujo');
    estados.forEach(estado => {
      console.log(`   ${estado.orden_flujo}. ${estado.nombre}: ${estado.descripcion}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante la inicialización:', error);
    process.exit(1);
  }
}

// Ejecutar inicialización
inicializarBaseDatos();
