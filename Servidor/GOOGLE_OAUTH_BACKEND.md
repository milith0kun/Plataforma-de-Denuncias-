# Backend - Google OAuth Setup

## 1. Instalar dependencia

```bash
cd Servidor
npm install google-auth-library
```

## 2. Configurar variables de entorno

Agregar al archivo `Servidor/.env`:

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## 3. Endpoint implementado

Ya se agregó el endpoint `/auth/google` en el backend que:

1. Recibe el credential token de Google
2. Verifica el token usando google-auth-library
3. Extrae el email, nombre y foto del usuario
4. Busca o crea el usuario en la base de datos
5. Retorna un JWT token para la sesión

## 4. Uso en el frontend

El hook `useGoogleAuth` ya está configurado para:
- Cargar el SDK de Google Identity Services
- Mostrar el popup de autenticación
- Enviar el token al backend
- Manejar la respuesta y redirección

## 5. Flujo completo

1. Usuario hace clic en "Continuar con Google"
2. Se abre popup de Google para seleccionar cuenta
3. Google retorna un JWT token
4. Frontend envía el token al backend `/auth/google`
5. Backend verifica el token con Google
6. Backend crea/actualiza usuario y retorna sesión
7. Frontend guarda token y redirige al dashboard
