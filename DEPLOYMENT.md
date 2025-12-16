# Instrucciones de Despliegue en AWS EC2

## Información del Servidor
- **Dominio:** plataformadenuncias.myvnc.com
- **IP:** 3.143.51.210
- **Puerto Backend:** 5000
- **Puerto Frontend:** 3000 (en producción se sirve desde Nginx)

## Pre-requisitos en EC2

### 1. Instalar Node.js (v18 o superior)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Instalar PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 3. Instalar Nginx
```bash
sudo apt update
sudo apt install nginx -y
```

### 4. Instalar Git
```bash
sudo apt install git -y
```

## Configuración del Proyecto

### 1. Clonar el repositorio
```bash
cd /var/www
sudo git clone https://github.com/TU_USUARIO/PlataaformaWebParaDenuncias.git
cd PlataaformaWebParaDenuncias
```

### 2. Configurar Backend
```bash
cd Servidor
cp .env.production .env
npm install --production
```

**IMPORTANTE:** Editar `.env` con datos reales:
- `JWT_SECRET` - Generar una clave segura
- `EMAIL_USER` y `EMAIL_PASSWORD` - Configurar Gmail App Password
- Verificar credenciales de MongoDB
- Verificar credenciales de Google OAuth

### 3. Configurar Frontend
```bash
cd ..
cp .env.production .env
npm install
npm run build
```

### 4. Iniciar Backend con PM2
```bash
cd Servidor
pm2 start src/server.js --name "denuncias-backend" --env production
pm2 save
pm2 startup
```

### 5. Configurar Nginx

Crear archivo: `/etc/nginx/sites-available/denuncias`

```nginx
server {
    listen 80;
    server_name plataformadenuncias.myvnc.com;

    # Frontend - Archivos estáticos
    location / {
        root /var/www/PlataaformaWebParaDenuncias/dist;
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Archivos subidos
    location /uploads/ {
        alias /var/www/PlataaformaWebParaDenuncias/Servidor/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Logs
    access_log /var/log/nginx/denuncias_access.log;
    error_log /var/log/nginx/denuncias_error.log;
}
```

Activar configuración:
```bash
sudo ln -s /etc/nginx/sites-available/denuncias /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Configurar SSL con Certbot (Opcional pero recomendado)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d plataformadenuncias.myvnc.com
```

### 7. Configurar Firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Actualización del Código

Para actualizar la aplicación después de hacer cambios:

```bash
cd /var/www/PlataaformaWebParaDenuncias
git pull origin main

# Backend
cd Servidor
npm install --production
pm2 restart denuncias-backend

# Frontend
cd ..
npm install
npm run build
```

## Comandos Útiles PM2

```bash
pm2 status                 # Ver estado de procesos
pm2 logs denuncias-backend # Ver logs en tiempo real
pm2 restart denuncias-backend  # Reiniciar
pm2 stop denuncias-backend     # Detener
pm2 delete denuncias-backend   # Eliminar
pm2 monit                  # Monitor en tiempo real
```

## Verificación

1. **Backend:** http://3.143.51.210:5000/api/v1
2. **Frontend:** http://plataformadenuncias.myvnc.com
3. **API a través de Nginx:** http://plataformadenuncias.myvnc.com/api/v1

## Configuración de Google OAuth

En Google Cloud Console, añadir los siguientes URIs:

**URIs de redireccionamiento autorizados:**
- https://plataformadenuncias.myvnc.com
- https://plataformadenuncias.myvnc.com/auth/google/callback

**Orígenes de JavaScript autorizados:**
- https://plataformadenuncias.myvnc.com

## Variables de Entorno Críticas

Asegurarse de configurar correctamente:

1. **JWT_SECRET** - Clave única y segura
2. **MONGODB_URI** - URL de MongoDB Atlas
3. **GOOGLE_CLIENT_ID** y **GOOGLE_CLIENT_SECRET** - Credenciales OAuth
4. **EMAIL_USER** y **EMAIL_PASSWORD** - Gmail con App Password
5. **FRONTEND_URL** - https://plataformadenuncias.myvnc.com
6. **CORS_ORIGINS** - Dominios permitidos

## Permisos de Archivos

```bash
sudo chown -R $USER:$USER /var/www/PlataaformaWebParaDenuncias
sudo chmod -R 755 /var/www/PlataaformaWebParaDenuncias
sudo chmod -R 775 /var/www/PlataaformaWebParaDenuncias/Servidor/uploads
```

## Monitoreo y Logs

```bash
# Logs de PM2
pm2 logs

# Logs de Nginx
sudo tail -f /var/log/nginx/denuncias_error.log
sudo tail -f /var/log/nginx/denuncias_access.log

# Logs del sistema
journalctl -u nginx -f
```

## Troubleshooting

1. **Error de CORS:** Verificar CORS_ORIGINS en .env
2. **Error 502 Bad Gateway:** Verificar que PM2 esté corriendo
3. **Archivos no cargan:** Verificar permisos en /uploads
4. **OAuth no funciona:** Actualizar URIs en Google Cloud Console
5. **Base de datos no conecta:** Verificar MongoDB Atlas whitelist (añadir IP de EC2)

## Backup

```bash
# Backup de base de datos (desde servidor)
cd /var/www/PlataaformaWebParaDenuncias/Servidor
node backup-simple.cjs

# Los backups se guardan en Servidor/backups/
```
