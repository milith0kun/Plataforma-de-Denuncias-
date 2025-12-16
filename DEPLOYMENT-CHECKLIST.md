# Lista de Configuraciones para Despliegue

## ✅ Archivos Creados

1. **Servidor/.env.production** - Variables de entorno para producción (backend)
2. **.env.production** - Variables de entorno para producción (frontend)
3. **DEPLOYMENT.md** - Guía completa de despliegue paso a paso
4. **nginx.conf** - Configuración de Nginx para el servidor
5. **Servidor/ecosystem.config.json** - Configuración de PM2

## ⚠️ ACCIONES REQUERIDAS ANTES DEL DESPLIEGUE

### 1. Actualizar Google Cloud Console

**URL:** https://console.cloud.google.com/apis/credentials

Añadir estos URIs autorizados:

**Orígenes de JavaScript autorizados:**
- `https://plataformadenuncias.myvnc.com`
- `http://plataformadenuncias.myvnc.com`

**URIs de redireccionamiento autorizados:**
- `https://plataformadenuncias.myvnc.com/auth/google/callback`
- `http://plataformadenuncias.myvnc.com/auth/google/callback`

### 2. Configurar MongoDB Atlas

**Whitelist de IPs:**
- Añadir IP del servidor EC2: `3.143.51.210`
- Opcional: Permitir desde cualquier lugar: `0.0.0.0/0` (menos seguro)

**Pasos:**
1. Ir a MongoDB Atlas → Network Access
2. Click en "Add IP Address"
3. Añadir `3.143.51.210`

### 3. Configurar Email (Gmail)

**Generar App Password:**
1. Ir a: https://myaccount.google.com/apppasswords
2. Generar contraseña de aplicación
3. Actualizar en `.env.production`:
   - `EMAIL_USER=tu_email@gmail.com`
   - `EMAIL_PASSWORD=la_app_password_generada`

### 4. Generar JWT Secret Seguro

**En servidor EC2, generar clave aleatoria:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Actualizar en `Servidor/.env.production`:
```
JWT_SECRET=tu_clave_generada_aqui
```

### 5. Configurar DNS

**Proveedor de DNS (MyVNC o similar):**
- Tipo: A Record
- Nombre: `@` o `plataformadenuncias`
- Valor: `3.143.51.210`
- TTL: 300 (5 minutos)

Verificar propagación:
```bash
nslookup plataformadenuncias.myvnc.com
```

## 📋 Checklist de Verificación

### Antes de Desplegar:
- [ ] Variables de entorno configuradas (.env.production)
- [ ] Google OAuth URIs actualizados
- [ ] MongoDB Atlas IP whitelisted
- [ ] Email configurado con App Password
- [ ] JWT_SECRET generado y actualizado
- [ ] DNS configurado y propagado
- [ ] `.gitignore` actualizado (no subir .env)

### Archivos a NO Subir a Git:
- [ ] `.env`
- [ ] `.env.production` (con credenciales reales)
- [ ] `node_modules/`
- [ ] `dist/`
- [ ] `uploads/`
- [ ] `Servidor/uploads/`

### En el Servidor EC2:
- [ ] Node.js instalado (v18+)
- [ ] PM2 instalado globalmente
- [ ] Nginx instalado y configurado
- [ ] Firewall configurado (puertos 22, 80, 443)
- [ ] Proyecto clonado desde GitHub
- [ ] Dependencias instaladas
- [ ] Variables de entorno configuradas
- [ ] Backend iniciado con PM2
- [ ] Frontend compilado
- [ ] Nginx funcionando

## 🚀 Comandos Rápidos para Desplegar

### En Local (antes de subir a GitHub):
```bash
# Verificar que todo esté en .gitignore
git status

# Commit y push
git add .
git commit -m "Configuración para despliegue en producción"
git push origin main
```

### En EC2:
```bash
# Clonar o actualizar
cd /var/www
sudo git clone https://github.com/TU_USUARIO/PlataaformaWebParaDenuncias.git
# O si ya existe: cd PlataaformaWebParaDenuncias && git pull

# Setup completo
npm run setup:production

# Configurar archivos .env con credenciales reales
cd Servidor
nano .env  # Copiar de .env.production y actualizar valores

# Iniciar con PM2
npm run pm2:start

# Configurar Nginx
sudo cp ../nginx.conf /etc/nginx/sites-available/denuncias
sudo ln -s /etc/nginx/sites-available/denuncias /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔍 URLs de Verificación

- **Frontend:** http://plataformadenuncias.myvnc.com
- **API Health:** http://plataformadenuncias.myvnc.com/api/v1
- **Archivos Subidos:** http://plataformadenuncias.myvnc.com/uploads/

## 📱 Contacto y Soporte

Si encuentras problemas:
1. Revisar logs de PM2: `pm2 logs`
2. Revisar logs de Nginx: `sudo tail -f /var/log/nginx/denuncias_error.log`
3. Verificar que el backend esté corriendo: `pm2 status`
4. Verificar conexión a MongoDB: Revisar logs de PM2

## 🔐 Seguridad Post-Despliegue

1. **Instalar SSL/HTTPS:**
```bash
sudo certbot --nginx -d plataformadenuncias.myvnc.com
```

2. **Cambiar JWT_SECRET** después del primer despliegue

3. **Configurar backups automáticos** de MongoDB Atlas

4. **Habilitar 2FA** en cuentas críticas (GitHub, MongoDB Atlas, Google Cloud)

## ✨ Optimizaciones Opcionales

1. **Habilitar compresión Gzip** (ya incluido en nginx.conf)
2. **Configurar CDN** para archivos estáticos
3. **Implementar rate limiting** en Nginx
4. **Configurar monitoreo** con PM2 Plus o similar
5. **Configurar backups automáticos** de uploads/

---

**¡Configuración lista para despliegue!** 🎉
