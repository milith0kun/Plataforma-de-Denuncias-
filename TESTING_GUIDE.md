# Guía de Testing - Plataforma de Denuncias

## Testing Frontend

### Configuración
El proyecto usa **Vitest** + **React Testing Library** para tests del frontend.

### Comandos Disponibles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con interfaz visual
npm run test:ui

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo watch (desarrollo)
npm test -- --watch
```

### Estructura de Tests

```
src/
├── tests/
│   ├── setup.js          # Configuración global
│   ├── HomePage.test.jsx # Test de HomePage
│   └── ...               # Más tests
```

### Ejemplo de Test

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MiComponente from './MiComponente';

describe('MiComponente', () => {
  it('debe renderizar correctamente', () => {
    render(<MiComponente />);
    expect(screen.getByText('Hola')).toBeInTheDocument();
  });
});
```

### Cobertura de Tests Frontend

Tests actuales:
- ✅ **HomePage**: Tests de renderizado, carga de datos, estadísticas

Pendientes:
- ⏳ DashboardAutoridadPage
- ⏳ NuevaDenunciaPage
- ⏳ DetalleDenunciaPage
- ⏳ Componentes comunes (Header, Footer, etc.)

---

## Testing Backend

### Configuración
El proyecto usa **Jest** + **Supertest** para tests del backend.

### Comandos Disponibles

```bash
# Ejecutar todos los tests backend
npm run test:backend

# O desde el directorio Servidor
cd Servidor
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

### Estructura de Tests

```
Servidor/
├── src/
│   ├── tests/
│   │   ├── denuncia.test.js  # Test de denuncias
│   │   └── ...               # Más tests
│   └── ...
└── jest.config.json
```

### Ejemplo de Test Backend

```javascript
import request from 'supertest';
import app from '../app.js';

describe('POST /api/v1/denuncias', () => {
  it('debe crear una nueva denuncia', async () => {
    const response = await request(app)
      .post('/api/v1/denuncias')
      .set('Authorization', 'Bearer token')
      .send({
        titulo: 'Test',
        descripcion: 'Prueba'
      });

    expect(response.status).toBe(201);
  });
});
```

### Cobertura de Tests Backend

Tests actuales:
- ✅ **Denuncia Controller**: Tests de creación, listado, validación
- ✅ **Denuncia Model**: Tests de validación de modelo

Pendientes:
- ⏳ Auth Controller
- ⏳ Usuario Controller
- ⏳ Estadísticas Controller
- ⏳ Middlewares (auth, validación)

---

## Variables de Entorno para Testing

Crea un archivo `.env.test` en la raíz del proyecto Servidor:

```env
MONGODB_URI_TEST=mongodb://localhost:27017/denuncias_test
JWT_SECRET=test_secret_key_for_testing
NODE_ENV=test
```

---

## Mejores Prácticas

### Frontend
1. **Usar `screen` de Testing Library** para queries
2. **Esperar operaciones asíncronas** con `waitFor`
3. **Mock de servicios externos** con `vi.mock()`
4. **Tests unitarios** para componentes aislados
5. **Tests de integración** para flujos completos

### Backend
1. **Limpiar BD después de tests** con `afterAll/afterEach`
2. **Usar BD de prueba separada** (nunca usar BD de producción)
3. **Mock de servicios externos** (emails, APIs, etc.)
4. **Tests de endpoints** con Supertest
5. **Tests de modelos** con validaciones Mongoose

---

## CI/CD Integration

Para integrar en GitHub Actions:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run frontend tests
        run: npm test
      
      - name: Run backend tests
        run: npm run test:backend
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

---

## Recursos Adicionales

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

---

## Troubleshooting

### Error: Cannot find module '@vitejs/plugin-react'
```bash
npm install --save-dev @vitejs/plugin-react
```

### Error: ReferenceError: IntersectionObserver is not defined
Ya está configurado en `src/tests/setup.js`

### Error: MongoDB connection timeout
Verifica que MongoDB esté corriendo:
```bash
mongod --version
```

### Tests de backend fallan con módulos ES
Asegúrate de tener `"type": "module"` en `package.json`
