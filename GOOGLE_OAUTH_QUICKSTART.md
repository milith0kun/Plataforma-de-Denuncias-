# Guía Rápida: Configurar Google OAuth 2.0

## Resumen Rápido

Para habilitar "Continuar con Google" en tu aplicación:

### 1. Google Cloud Console

Ve a https://console.cloud.google.com/apis/credentials

**Crear Credenciales > ID de cliente de OAuth 2.0:**

- **Tipo:** Aplicación web
- **Nombre:** Plataforma de Denuncias
- **Orígenes autorizados:**
  ```
  http://localhost:3001
  http://localhost:3000
  ```
- **URIs de redireccionamiento:**
  ```
  http://localhost:3001/auth/google/callback
  http://localhost:3000/auth/google/callback
  ```

Copia el **Client ID** que se genera (termina en `.apps.googleusercontent.com`)

### 2. Configurar Frontend

Edita el archivo `.env` en la raíz del proyecto:

```env
VITE_GOOGLE_CLIENT_ID=TU-CLIENT-ID-AQUI.apps.googleusercontent.com
```

### 3. Configurar Backend

Edita el archivo `Servidor/.env`:

```env
GOOGLE_CLIENT_ID=TU-CLIENT-ID-AQUI.apps.googleusercontent.com
```

### 4. Instalar Dependencia

```bash
cd Servidor
npm install google-auth-library
```

### 5. Reiniciar Servidores

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd Servidor
npm run dev
```

## ¡Listo!

El botón "Continuar con Google" ya funcionará completamente.

---

## Documentación Detallada

- `OAUTH_SETUP.md` - Configuración completa del frontend
- `Servidor/GOOGLE_OAUTH_BACKEND.md` - Detalles del backend

## Notas

- La configuración puede tardar 5-10 minutos en aplicarse
- Usa el mismo Client ID en frontend y backend
- Para producción, agrega tus dominios reales a los URIs autorizados
