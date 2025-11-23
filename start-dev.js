import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colores para la consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    frontend: '\x1b[36m', // Cyan
    backend: '\x1b[33m',  // Yellow
    success: '\x1b[32m',  // Green
    error: '\x1b[31m',    // Red
};

console.log(`${colors.bright}${colors.success}🚀 Iniciando Plataforma de Denuncias...${colors.reset}\n`);

// Función para ejecutar un proceso
function runProcess(name, command, args, cwd, color) {
    const process = spawn(command, args, {
        cwd,
        shell: true,
        stdio: 'pipe'
    });

    process.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                console.log(`${color}[${name}]${colors.reset} ${line}`);
            }
        });
    });

    process.stderr.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                console.log(`${color}[${name}]${colors.reset} ${line}`);
            }
        });
    });

    process.on('close', (code) => {
        if (code !== 0) {
            console.log(`${colors.error}[${name}] Proceso terminado con código ${code}${colors.reset}`);
        }
    });

    return process;
}

// Iniciar Backend
console.log(`${colors.backend}📡 Iniciando Backend...${colors.reset}`);
const backend = runProcess(
    'Backend',
    'npm',
    ['run', 'dev'],
    join(__dirname, 'Servidor'),
    colors.backend
);

// Esperar un poco antes de iniciar el frontend
setTimeout(() => {
    console.log(`${colors.frontend}🎨 Iniciando Frontend...${colors.reset}\n`);
    const frontend = runProcess(
        'Frontend',
        'npm',
        ['run', 'dev'],
        __dirname,
        colors.frontend
    );

    // Manejar cierre del proceso
    process.on('SIGINT', () => {
        console.log(`\n${colors.bright}${colors.error}🛑 Deteniendo servicios...${colors.reset}`);
        backend.kill();
        frontend.kill();
        process.exit(0);
    });
}, 2000);

console.log(`${colors.success}✅ Servicios iniciados. Presiona Ctrl+C para detener.${colors.reset}\n`);
