import { useEffect } from 'react';

/**
 * Página de callback para Google OAuth
 * Esta página captura el token del hash y lo envía al opener
 */
const GoogleCallback = () => {
  useEffect(() => {
    try {
      // Obtener el hash de la URL
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      
      const idToken = params.get('id_token');
      const error = params.get('error');

      if (error) {
        console.error('Error de Google OAuth:', error);
        // Enviar error al opener
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: error
          }, window.location.origin);
        }
      } else if (idToken) {
        console.log('Token recibido, enviando al opener');
        // Enviar token al opener
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_SUCCESS',
            credential: idToken
          }, window.location.origin);
        }
      } else {
        console.error('No se encontró token ni error en la URL');
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: 'No se recibió token de autenticación'
          }, window.location.origin);
        }
      }

      // Cerrar esta ventana después de un breve delay
      setTimeout(() => {
        window.close();
      }, 1000);

    } catch (error) {
      console.error('Error procesando callback:', error);
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_AUTH_ERROR',
          error: error.message
        }, window.location.origin);
      }
      setTimeout(() => window.close(), 1000);
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          animation: 'spin 1s linear infinite'
        }}>
          ⚡
        </div>
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>
          Procesando autenticación...
        </h2>
        <p style={{ opacity: 0.9, fontSize: '0.875rem' }}>
          Esta ventana se cerrará automáticamente
        </p>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GoogleCallback;
