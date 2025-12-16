# Configuración de Variables de Entorno

## ⚠️ Importante: Protección de Secretos

Los archivos `.env` contienen información sensible y **NUNCA** deben subirse a GitHub. Este proyecto incluye archivos `.env.example` como plantillas.

## 📋 Configuración Inicial

### 1. Backend (Servidor/)

Copia el archivo de ejemplo y configura tus credenciales:

```bash
cd Servidor
cp .env.example .env
```

Luego edita `Servidor/.env` y completa:

- **MONGODB_URI**: Tu conexión a MongoDB Atlas
- **JWT_SECRET**: Genera una clave aleatoria segura
- **EMAIL_USER** y **EMAIL_PASSWORD**: Credenciales de Gmail con App Password
- **GOOGLE_CLIENT_ID** y **GOOGLE_CLIENT_SECRET**: Credenciales de Google OAuth

### 2. Frontend (raíz del proyecto)

```bash
cp .env.example .env
```

Edita `.env` y agrega:

- **VITE_GOOGLE_CLIENT_ID**: Tu Client ID de Google OAuth (el mismo del backend)

## 🔐 Obtener Credenciales de Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a "Credenciales" → "Crear credenciales" → "ID de cliente de OAuth 2.0"
4. Configura:
   - **Tipo de aplicación**: Aplicación web
   - **Orígenes autorizados**: 
     - `http://localhost:3000`
     - `http://localhost:3001`
   - **URIs de redirección**:
     - `http://localhost:3000/auth/google/callback`
     - `http://localhost:3001/auth/google/callback`
5. Copia el **Client ID** y **Client Secret** a tus archivos `.env`

## 📁 Archivos Sensibles que NO se suben

Estos archivos están en `.gitignore` y deben permanecer locales:

- `.env`
- `client_secret_*.json` (archivo de credenciales de Google)
- Cualquier archivo con contraseñas, tokens o API keys

## ✅ Verificación

Si intentas hacer push y Git bloquea por "secret detected", significa que accidentalmente agregaste un archivo sensible. Usa:

```bash
git rm --cached archivo_sensible
git commit --amend
```

---

**Nota**: Los archivos `.env.example` SÍ se suben al repositorio como referencia, pero con valores de ejemplo (no reales).
