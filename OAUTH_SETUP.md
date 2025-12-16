# Configuración OAuth 2.0 - Google

## Configuración en Google Cloud Console

### 1. Crear ID de Cliente OAuth 2.0

**Tipo de aplicación:** Aplicación web  
**Nombre:** Plataforma de Denuncias

### 2. Orígenes autorizados de JavaScript

Para desarrollo local:
```
http://localhost:3001
http://localhost:3000
```

Para producción (cuando despliegues):
```
https://tu-dominio.com
```

### 3. URIs de redireccionamiento autorizados

Para desarrollo local:
```
http://localhost:3001/auth/google/callback
http://localhost:3000/auth/google/callback
```

Para producción:
```
https://tu-dominio.com/auth/google/callback
```

## Configuración en la Aplicación

### 1. Agregar Client ID al archivo .env

Después de crear el ID de cliente en Google Cloud Console, agrega esta línea a tu archivo `.env`:

```env
VITE_GOOGLE_CLIENT_ID=tu-client-id-aqui.apps.googleusercontent.com
```

### 2. Pantalla de consentimiento OAuth

Configura estos datos en la pantalla de consentimiento:
- **Nombre de la aplicación:** Plataforma de Denuncias Urbanas
- **Correo de soporte:** tu-email@dominio.com
- **Logo:** (Opcional) Sube el logo Establish.svg
- **Ámbitos (Scopes):**
  - `userinfo.email`
  - `userinfo.profile`
  - `openid`

### 3. Usuarios de prueba

Mientras la app esté en modo de prueba, agrega los correos de los usuarios que podrán autenticarse.

## Implementación

La integración OAuth ya está lista en el código. Solo necesitas:

1. Crear el ID de cliente en Google Cloud Console
2. Copiar el Client ID
3. Pegarlo en el archivo `.env` como `VITE_GOOGLE_CLIENT_ID`
4. Reiniciar el servidor de desarrollo

## Notas

- La configuración puede tardar entre 5 minutos y algunas horas en aplicarse
- Asegúrate de que los URIs coincidan exactamente (sin barras al final)
- En producción, deberás actualizar los URIs autorizados
