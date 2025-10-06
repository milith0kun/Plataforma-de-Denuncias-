# ✅ HU-04: Recuperación de Contraseña - IMPLEMENTACIÓN COMPLETA

## 📊 Estado de Implementación

### ✅ Tareas Completadas:
- [x] Tabla de tokens de recuperación en BD
- [x] Modelo PasswordResetToken con métodos completos
- [x] Servicio de emails simplificado (consola para desarrollo)
- [x] Endpoint de solicitud de recuperación
- [x] Endpoint de restablecimiento de contraseña
- [x] Endpoint de verificación de token
- [x] Validaciones específicas
- [x] Expiración automática de tokens (1 hora)
- [x] Prevención de spam (límite de 5 minutos)
- [x] Seguridad: no revelar si el email existe

---

## 🗂️ Archivos Creados

### 1. **Base de Datos**
- `src/database/migration_password_reset.sql` - Tabla de tokens

### 2. **Modelos**
- `src/models/PasswordResetToken.js` - Gestión de tokens

### 3. **Servicios**
- `src/services/emailService.js` - Envío de emails (modo desarrollo)

### 4. **Validaciones**
- `src/middlewares/validators/passwordResetValidator.js` - Validaciones

### 5. **Controladores**
- Métodos agregados a `authController.js`:
  - `solicitarRecuperacion()`
  - `restablecerPassword()`
  - `verificarTokenRecuperacion()`

### 6. **Rutas**
- Rutas agregadas a `authRoutes.js`

---

## 🔧 PASO 1: Ejecutar Migración SQL

```bash
mysql -u root -p plataforma_denuncias_urbanas < src/database/migration_password_reset.sql
```

**Tabla creada:** `password_reset_token`

**Campos:**
- `id_token` - ID único
- `id_usuario` - Referencia al usuario
- `token` - Token único de 64 caracteres
- `fecha_creacion` - Timestamp de creación
- `fecha_expiracion` - Expira en 1 hora
- `usado` - Indica si ya fue utilizado
- `ip_solicitud` - IP desde donde se solicitó

---

## 🚀 PASO 2: Flujo Completo de Recuperación

### **Flujo del Usuario:**

1. **Usuario olvida su contraseña** → Hace clic en "Olvidé mi contraseña"
2. **Ingresa su email** → Sistema genera token
3. **Recibe enlace** (en consola en desarrollo)
4. **Hace clic en el enlace** → Verifica token
5. **Ingresa nueva contraseña** → Token se marca como usado
6. **Contraseña actualizada** → Puede iniciar sesión

---

## 🧪 PASO 3: Pruebas con Postman

### 3.1 Solicitar Recuperación de Contraseña

**Endpoint:** `POST http://localhost:5000/api/v1/auth/forgot-password`

**Body (JSON):**
```json
{
  "email": "juan.perez@email.com"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Si el email existe en nuestro sistema, recibirás un enlace de recuperación",
  "token": "a1b2c3d4e5f6..." // Solo en desarrollo
}
```

**En Consola del Servidor (Desarrollo):**
```
========================================
📧 EMAIL DE RECUPERACIÓN DE CONTRASEÑA
========================================
Para: juan.perez@email.com
Nombre: Juan
Token: a1b2c3d4e5f6789012345678901234567890123456789012345678901234
URL de recuperación: http://localhost:5173/reset-password?token=a1b2c3d4e5f6...
========================================
```

---

### 3.2 Verificar Token (Opcional)

**Endpoint:** `GET http://localhost:5000/api/v1/auth/verify-reset-token/{TOKEN}`

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "email": "juan.perez@email.com",
    "nombres": "Juan"
  }
}
```

**Token Inválido/Expirado (400):**
```json
{
  "success": false,
  "message": "Token inválido o expirado"
}
```

---

### 3.3 Restablecer Contraseña

**Endpoint:** `POST http://localhost:5000/api/v1/auth/reset-password`

**Body (JSON):**
```json
{
  "token": "a1b2c3d4e5f6789012345678901234567890123456789012345678901234",
  "nueva_password": "NuevaPassword123",
  "confirmar_password": "NuevaPassword123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Contraseña restablecida exitosamente"
}
```

**En Consola del Servidor:**
```
========================================
📧 CONFIRMACIÓN DE CAMBIO DE CONTRASEÑA
========================================
Para: juan.perez@email.com
Nombre: Juan
Tu contraseña ha sido cambiada exitosamente.
========================================
```

---

## 🛡️ Características de Seguridad Implementadas

### 1. **No Revelar Información**
- Siempre devuelve el mismo mensaje, exista o no el email
- Previene enumeración de usuarios

### 2. **Prevención de Spam**
- Solo 1 solicitud cada 5 minutos por usuario
- Código HTTP 429 (Too Many Requests)

### 3. **Tokens Seguros**
- Generados con `crypto.randomBytes(32)`
- 64 caracteres hexadecimales
- Únicos e impredecibles

### 4. **Expiración Automática**
- Tokens válidos por 1 hora
- Después se consideran inválidos

### 5. **Uso Único**
- Token se marca como usado después de restablecer
- No se puede reutilizar

### 6. **Invalidación de Tokens Anteriores**
- Al solicitar nuevo token, se invalidan los anteriores
- Solo el más reciente es válido

### 7. **Registro de IP**
- Se guarda la IP desde donde se solicitó
- Útil para auditoría

---

## 🔄 Integración con Frontend

### Servicio de Recuperación

```javascript
// src/services/authService.js

export const authService = {
  // Solicitar recuperación
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Verificar token
  verifyResetToken: async (token) => {
    const response = await api.get(`/auth/verify-reset-token/${token}`);
    return response.data;
  },

  // Restablecer contraseña
  resetPassword: async (token, nueva_password, confirmar_password) => {
    const response = await api.post('/auth/reset-password', {
      token,
      nueva_password,
      confirmar_password
    });
    return response.data;
  }
};
```

### Componente de Solicitud

```javascript
// ForgotPasswordPage.jsx
import { useState } from 'react';
import { authService } from '../services/authService';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.forgotPassword(email);
      setMensaje(response.message);
    } catch (error) {
      setMensaje('Error al procesar solicitud');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Tu email"
        required
      />
      <button type="submit">Enviar enlace</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}
```

### Componente de Restablecimiento

```javascript
// ResetPasswordPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [passwords, setPasswords] = useState({
    nueva_password: '',
    confirmar_password: ''
  });
  const [tokenValido, setTokenValido] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Verificar token al cargar
    const verificarToken = async () => {
      try {
        const response = await authService.verifyResetToken(token);
        setTokenValido(true);
        setUsuario(response.data);
      } catch (error) {
        setTokenValido(false);
      }
    };
    
    if (token) verificarToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.resetPassword(
        token,
        passwords.nueva_password,
        passwords.confirmar_password
      );
      alert('Contraseña restablecida exitosamente');
      navigate('/login');
    } catch (error) {
      alert('Error al restablecer contraseña');
    }
  };

  if (!tokenValido) {
    return <div>Token inválido o expirado</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Restablecer Contraseña</h2>
      <p>Usuario: {usuario?.email}</p>
      
      <input 
        type="password"
        value={passwords.nueva_password}
        onChange={(e) => setPasswords({...passwords, nueva_password: e.target.value})}
        placeholder="Nueva contraseña"
        required
      />
      
      <input 
        type="password"
        value={passwords.confirmar_password}
        onChange={(e) => setPasswords({...passwords, confirmar_password: e.target.value})}
        placeholder="Confirmar contraseña"
        required
      />
      
      <button type="submit">Restablecer Contraseña</button>
    </form>
  );
}
```

---

## 📝 Validaciones Implementadas

### Solicitud de Recuperación:
- ✅ Email obligatorio
- ✅ Formato de email válido

### Restablecimiento:
- ✅ Token obligatorio (64 caracteres)
- ✅ Nueva contraseña obligatoria
- ✅ Mínimo 8 caracteres
- ✅ Al menos una mayúscula
- ✅ Al menos una minúscula
- ✅ Al menos un número
- ✅ Confirmación debe coincidir

---

## 🔍 Mantenimiento de la Base de Datos

### Limpiar Tokens Expirados

**Opción 1: Manualmente**
```sql
CALL limpiar_tokens_expirados();
```

**Opción 2: Programáticamente**
```javascript
// Ejecutar periódicamente (ej: cada hora)
import PasswordResetToken from './models/PasswordResetToken.js';

setInterval(async () => {
  const eliminados = await PasswordResetToken.limpiarTokensExpirados();
  console.log(`Tokens expirados eliminados: ${eliminados}`);
}, 60 * 60 * 1000); // Cada hora
```

---

## ⚙️ Configuración de Variables de Entorno

Agregar al archivo `.env`:

```env
# Frontend URL (para enlaces de recuperación)
FRONTEND_URL=http://localhost:5173

# Email (opcional, para producción)
EMAIL_ENABLED=false
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password
EMAIL_FROM=noreply@plataforma.com

# Modo de desarrollo
NODE_ENV=development
```

---

## 🐛 Troubleshooting

### Error: "Unknown table 'password_reset_token'"
**Solución:** Ejecutar `migration_password_reset.sql`

### Error: "Ya se envió un enlace recientemente"
**Solución:** Esperar 5 minutos o limpiar tokens en BD

### Token no aparece en consola
**Solución:** Verificar que `NODE_ENV=development` en `.env`

### Token inválido al restablecer
**Solución:** Verificar que el token no haya expirado (1 hora)

---

## ✅ Checklist de Verificación

### Base de Datos
- [ ] Tabla `password_reset_token` creada
- [ ] Procedimiento `limpiar_tokens_expirados` creado
- [ ] Índices funcionando

### Endpoints
- [ ] POST `/forgot-password` funciona
- [ ] POST `/reset-password` funciona
- [ ] GET `/verify-reset-token/:token` funciona

### Seguridad
- [ ] Tokens generados con crypto
- [ ] Expiración de 1 hora funciona
- [ ] Prevención de spam (5 min) funciona
- [ ] No revela si email existe
- [ ] Token se marca como usado

### Validaciones
- [ ] Email válido requerido
- [ ] Contraseña fuerte requerida
- [ ] Confirmación coincide

### Desarrollo
- [ ] Token se muestra en consola
- [ ] Email simulado en consola
- [ ] Logs claros y útiles

---

## 🎉 Conclusión

**HU-04 está 100% implementada y lista para usar:**

✅ **Sistema completo de recuperación** - Solicitud, verificación y restablecimiento  
✅ **Seguro** - Tokens únicos, expiración, prevención de spam  
✅ **Simple para desarrollo** - No requiere configurar email real  
✅ **Listo para producción** - Fácil cambiar a servicio de email real  
✅ **Bien documentado** - Ejemplos completos de uso  
✅ **Integrable con frontend** - Servicios y componentes de ejemplo

El sistema está listo para que los usuarios puedan recuperar sus contraseñas de forma segura.
