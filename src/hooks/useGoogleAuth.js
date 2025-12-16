import { useEffect, useState } from 'react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const useGoogleAuth = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    // Verificar si ya está cargado
    if (window.google) {
      setIsGoogleLoaded(true);
      return;
    }

    // Cargar el script de Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Google Identity Services cargado');
      setIsGoogleLoaded(true);
    };

    script.onerror = () => {
      console.error('Error al cargar Google Identity Services');
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initializeGoogleLogin = (callback) => {
    if (!window.google || !GOOGLE_CLIENT_ID) {
      console.error('Google OAuth no está configurado correctamente');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: callback,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  };

  const loginWithGoogle = (onSuccess, onError) => {
    if (!window.google) {
      console.error('Google SDK no cargado aún');
      onError?.('Google SDK no está cargado. Por favor, recarga la página.');
      return;
    }

    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'your-google-client-id.apps.googleusercontent.com') {
      console.error('Client ID no configurado');
      onError?.('Google OAuth no está configurado. Verifica el archivo .env');
      return;
    }

    try {
      // Callback para manejar la respuesta
      const handleCredentialResponse = async (response) => {
        try {
          if (response.credential) {
            console.log('✅ Credential recibido desde Google');
            onSuccess?.(response.credential);
          } else {
            console.error('❌ No se recibió credencial');
            onError?.('No se recibió credencial de Google');
          }
        } catch (error) {
          console.error('Error procesando respuesta de Google:', error);
          onError?.(error.message);
        }
      };

      // Inicializar con el callback
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: 'popup', // Usar popup en lugar de redirect
      });

      // Intentar mostrar el prompt de Google One Tap
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          const reason = notification.getNotDisplayedReason();
          console.warn('Google One Tap no se mostró:', reason);
          
          // Si falla por origen no registrado, usar flujo OAuth2 manual
          if (reason === 'unregistered_origin' || reason === 'invalid_client') {
            console.log('🔄 Usando flujo OAuth2 alternativo...');
            initiateOAuth2Flow(handleCredentialResponse, onError);
          } else {
            console.log('Intentando flujo OAuth estándar...');
          }
        }
        if (notification.isSkippedMoment()) {
          console.log('Usuario cerró el popup de Google');
        }
      });
    } catch (error) {
      console.error('Error al inicializar Google login:', error);
      onError?.(error.message);
    }
  };

  // Flujo OAuth2 alternativo usando ventana popup
  const initiateOAuth2Flow = (onSuccess, onError) => {
    try {
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const scope = 'openid profile email';
      
      // Construir URL de autorización de Google
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'token id_token');
      authUrl.searchParams.set('scope', scope);
      authUrl.searchParams.set('nonce', Math.random().toString(36).substring(7));
      authUrl.searchParams.set('prompt', 'select_account');

      console.log('Abriendo ventana de autenticación:', authUrl.toString());
      
      // Abrir ventana popup
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        authUrl.toString(),
        'Google Login',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
      );

      if (!popup) {
        onError?.('No se pudo abrir la ventana de autenticación. Verifica que no estén bloqueadas las ventanas emergentes.');
        return;
      }

      // Escuchar el mensaje desde el popup
      const messageHandler = (event) => {
        // Verificar origen por seguridad
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          console.log('✅ Autenticación exitosa desde popup');
          console.log('Credential recibido:', event.data.credential);
          window.removeEventListener('message', messageHandler);
          
          try {
            if (popup && !popup.closed) popup.close();
          } catch (e) {
            console.warn('No se pudo cerrar popup:', e);
          }
          
          // Llamar directamente con el credential (no envuelto en response)
          if (event.data.credential) {
            onSuccess({ credential: event.data.credential });
          } else {
            onError?.('No se recibió credential del popup');
          }
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          console.error('❌ Error en autenticación:', event.data.error);
          window.removeEventListener('message', messageHandler);
          try {
            if (popup && !popup.closed) popup.close();
          } catch (e) {
            console.warn('No se pudo cerrar popup:', e);
          }
          onError?.(event.data.error);
        }
      };

      window.addEventListener('message', messageHandler);

      // Timeout de 5 minutos
      const timeout = setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        if (popup && !popup.closed) {
          popup.close();
          onError?.('Tiempo de espera agotado');
        }
      }, 300000);

      // Limpiar si el usuario cierra el popup manualmente
      const checkClosed = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(checkClosed);
            clearTimeout(timeout);
            window.removeEventListener('message', messageHandler);
          }
        } catch (e) {
          // Ignorar errores de COOP al verificar popup.closed
          // Esto puede pasar con Cross-Origin-Opener-Policy
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error en flujo OAuth2:', error);
      onError?.(error.message);
    }
  };

  const renderGoogleButton = (containerId, options = {}) => {
    if (!window.google || !GOOGLE_CLIENT_ID) {
      console.error('Google OAuth no está configurado');
      return;
    }

    const defaultOptions = {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: '100%',
      ...options
    };

    window.google.accounts.id.renderButton(
      document.getElementById(containerId),
      defaultOptions
    );
  };

  return {
    loginWithGoogle,
    renderGoogleButton,
    initializeGoogleLogin,
    isGoogleLoaded,
    isConfigured: !!GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your-google-client-id.apps.googleusercontent.com'
  };
};
