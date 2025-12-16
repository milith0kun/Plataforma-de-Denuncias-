#!/usr/bin/env node

/**
 * Script de prueba para verificar la configuración de Google OAuth
 * Ejecutar: node test-oauth.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verificando configuración de Google OAuth...\n');

// 1. Verificar archivo de credenciales
const credentialsPath = path.join(__dirname, 'client_secret_802542269966-b65t54g7a2hfanegnh7jgc731ujv6qlo.apps.googleusercontent.com.json');
if (fs.existsSync(credentialsPath)) {
  console.log('✅ Archivo de credenciales encontrado');
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  console.log(`   Client ID: ${credentials.web.client_id}`);
  console.log(`   Orígenes JS: ${credentials.web.javascript_origins.join(', ')}`);
  console.log(`   URIs redirect: ${credentials.web.redirect_uris.join(', ')}`);
} else {
  console.log('❌ Archivo de credenciales NO encontrado');
}

console.log('');

// 2. Verificar .env del frontend
const frontendEnvPath = path.join(__dirname, '.env');
if (fs.existsSync(frontendEnvPath)) {
  const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
  if (frontendEnv.includes('VITE_GOOGLE_CLIENT_ID=802542269966')) {
    console.log('✅ Frontend .env configurado correctamente');
    const match = frontendEnv.match(/VITE_GOOGLE_CLIENT_ID=(.*)/);
    if (match) console.log(`   ${match[0]}`);
  } else {
    console.log('⚠️  Frontend .env necesita actualización');
  }
} else {
  console.log('❌ Frontend .env NO encontrado');
}

console.log('');

// 3. Verificar .env del backend
const backendEnvPath = path.join(__dirname, 'Servidor', '.env');
if (fs.existsSync(backendEnvPath)) {
  const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
  if (backendEnv.includes('GOOGLE_CLIENT_ID=802542269966')) {
    console.log('✅ Backend .env configurado correctamente');
    const match = backendEnv.match(/GOOGLE_CLIENT_ID=(.*)/);
    if (match) console.log(`   ${match[0]}`);
  } else {
    console.log('⚠️  Backend .env necesita actualización');
  }
} else {
  console.log('❌ Backend .env NO encontrado');
}

console.log('');

// 4. Verificar dependencia
const backendPackagePath = path.join(__dirname, 'Servidor', 'package.json');
if (fs.existsSync(backendPackagePath)) {
  const backendPackage = JSON.parse(fs.readFileSync(backendPackagePath, 'utf8'));
  if (backendPackage.dependencies && backendPackage.dependencies['google-auth-library']) {
    console.log('✅ google-auth-library instalada');
    console.log(`   Versión: ${backendPackage.dependencies['google-auth-library']}`);
  } else {
    console.log('❌ google-auth-library NO instalada');
    console.log('   Ejecuta: cd Servidor && npm install google-auth-library');
  }
} else {
  console.log('❌ Backend package.json NO encontrado');
}

console.log('');

// 5. Verificar archivos clave
const archivosRequeridos = [
  'src/hooks/useGoogleAuth.js',
  'src/pages/public/LoginPage/LoginPage.jsx',
  'Servidor/src/controllers/authController.js',
  'Servidor/src/routes/authRoutes.js'
];

console.log('📁 Verificando archivos de implementación:\n');
archivosRequeridos.forEach(archivo => {
  const fullPath = path.join(__dirname, archivo);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${archivo}`);
  } else {
    console.log(`❌ ${archivo}`);
  }
});

console.log('\n');
console.log('━'.repeat(60));
console.log('');

// Resumen
console.log('📊 RESUMEN:\n');
console.log('Para probar Google OAuth:');
console.log('1. Asegúrate de que ambos servidores estén corriendo');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend:  http://localhost:5000');
console.log('');
console.log('2. Abre: http://localhost:3000/login');
console.log('');
console.log('3. Haz clic en "Continuar con Google"');
console.log('');
console.log('4. Selecciona tu cuenta de Google');
console.log('');
console.log('5. ¡Deberías ser redirigido al dashboard! 🎉');
console.log('');
console.log('━'.repeat(60));
