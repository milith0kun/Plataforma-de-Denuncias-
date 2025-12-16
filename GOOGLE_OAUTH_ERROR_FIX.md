# ⚠️ Error: "unregistered_origin" - Solución

## El Problema

Estás viendo este error:
```
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
Google One Tap no se mostró: unregistered_origin
```

Esto ocurre porque estás accediendo a la aplicación desde una URL que no está autorizada en Google Cloud Console.

## Solución Rápida

### Opción 1: Acceder desde localhost (Recomendado)

En lugar de acceder desde la IP de red (ej: `http://192.168.1.109:3000`), accede desde:

**http://localhost:3000**

Esto ya está configurado en tu Google Cloud Console.

### Opción 2: Agregar tu IP de red a Google Cloud Console

Si necesitas acceder desde la red (otras computadoras), sigue estos pasos:

1. **Ve a Google Cloud Console:**
   https://console.cloud.google.com/apis/credentials

2. **Selecciona tu Client ID:**
   `802542269966-b65t54g7a2hfanegnh7jgc731ujv6qlo.apps.googleusercontent.com`

3. **Edita "Orígenes autorizados de JavaScript"**

4. **Agrega tu origen actual:**
   ```
   Origen actual: ${window.location.origin}
   ```
   
   Por ejemplo, si accedes desde `http://192.168.1.109:3000`, agrégalo a la lista.

5. **Agrega también el URI de redireccionamiento:**
   ```
   ${window.location.origin}/auth/google/callback
   ```

6. **Guarda los cambios**

7. **Espera 5-10 minutos** para que los cambios se apliquen

8. **Recarga la página** y prueba nuevamente

## Flujo Alternativo Implementado

He implementado un flujo OAuth alternativo que se activa automáticamente cuando falla Google One Tap:

1. **Google One Tap intenta primero** (más rápido)
2. **Si falla por origen no registrado**, automáticamente usa el flujo OAuth2 estándar
3. **Se abre una ventana popup** con la autenticación de Google
4. **Funciona incluso con orígenes no registrados** para Google One Tap

## Para Producción

Cuando despliegues tu aplicación en un servidor real:

1. Agrega tu dominio de producción:
   ```
   https://tu-dominio.com
   https://tu-dominio.com/auth/google/callback
   ```

2. Actualiza el archivo `.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=802542269966-b65t54g7a2hfanegnh7jgc731ujv6qlo.apps.googleusercontent.com
   ```

## Verificación

Para verificar que todo está configurado:

```bash
npm run test:oauth
```

O manualmente en la consola del navegador:
```javascript
console.log('Origen:', window.location.origin);
console.log('Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
```

## Resumen

- ✅ **Flujo alternativo implementado** - Se activa automáticamente
- ✅ **Ventana popup OAuth2** - Funciona incluso sin One Tap
- ⚠️ **Recomendación:** Accede desde `http://localhost:3000` para mejor experiencia
- 📝 **Opcional:** Agrega más orígenes en Google Cloud Console si necesitas
