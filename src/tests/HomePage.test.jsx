import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/ciudadano/HomePage/HomePage';
import { AuthContext } from '../contexts/AuthContext';

// Mock de servicios
vi.mock('../services/denunciaService', () => ({
  default: {
    obtenerEstadisticasUsuario: vi.fn(() => Promise.resolve({
      total: 10,
      pendientes: 3,
      enProceso: 4,
      resueltas: 3
    })),
    obtenerDenuncias: vi.fn(() => Promise.resolve({
      success: true,
      data: {
        denuncias: [
          {
            id_denuncia: '1',
            titulo: 'Test Denuncia',
            categoria_nombre: 'Infraestructura',
            estado_nombre: 'Pendiente',
            fecha_registro: new Date().toISOString()
          }
        ]
      }
    }))
  }
}));

describe('HomePage', () => {
  const mockAuthContext = {
    usuario: {
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'juan@example.com'
    },
    estaAutenticado: true,
    esCiudadano: () => true,
    esAutoridad: () => false,
    esAdmin: () => false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar correctamente', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <HomePage />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Esperar a que carguen los datos
    await waitFor(() => {
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });

    // Verificar que se muestre el saludo
    expect(screen.getByText(/Hola, Juan/i)).toBeInTheDocument();
  });

  it('debe mostrar las estadísticas correctamente', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <HomePage />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument(); // Total
      expect(screen.getByText('3')).toBeInTheDocument(); // Pendientes
      expect(screen.getByText('4')).toBeInTheDocument(); // En Proceso
    });
  });

  it('debe mostrar estado de carga inicialmente', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <HomePage />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Cargando datos...')).toBeInTheDocument();
  });

  it('debe mostrar las denuncias recientes', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <HomePage />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Denuncia')).toBeInTheDocument();
      expect(screen.getByText('Infraestructura')).toBeInTheDocument();
    });
  });
});
