# Quick Start - Configuración Rápida para Despliegue

## 🎯 Resumen Ejecutivo

**Dominio:** plataformadenuncias.myvnc.com  
**IP EC2:** 3.143.51.210  
**Puerto Backend:** 5000  
**Puerto Frontend:** 80/443 (Nginx)

---

## 📦 Archivos de Configuración Creados

```
├── Servidor/
│   ├── .env.production          # Variables backend producción
│   └── ecosystem.config.json    # Configuración PM2
├── .env.production               # Variables frontend producción
├── nginx.conf                    # Configuración Nginx
├── DEPLOYMENT.md                 # Guía detallada de despliegue
└── DEPLOYMENT-CHECKLIST.md       # Checklist de verificación
```

---

## ⚡ Pasos Rápidos (5 minutos)

### 1️⃣ Configurar Google OAuth
```
URL: https://console.cloud.google.com/apis/credentials

Añadir URIs:
✓ https://plataformadenuncias.myvnc.com
✓ https://plataformadenuncias.myvnc.com/auth/google/callback
```

### 2️⃣ Whitelist IP en MongoDB Atlas
```
MongoDB Atlas → Network Access → Add IP
IP: 3.143.51.210
```

### 3️⃣ Configurar Gmail App Password
```
1. https://myaccount.google.com/apppasswords
2. Generar password
3. Guardar para usar en .env
```

### 4️⃣ En Servidor EC2
```bash
# Instalar dependencias del sistema
sudo apt update && sudo apt install -y nodejs npm nginx git

# Instalar PM2
sudo npm install -g pm2

# Clonar proyecto
cd /var/www
sudo git clone https://github.com/TU_USUARIO/PlataaformaWebParaDenuncias.git
cd PlataaformaWebParaDenuncias

# Setup automático
npm run setup:production

# Configurar .env con valores reales
cd Servidor
sudo nano .env
# Copiar contenido de .env.production y actualizar:
# - JWT_SECRET (generar con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
# - EMAIL_USER y EMAIL_PASSWORD
# Guardar: Ctrl+X, Y, Enter

# Iniciar backend
npm run pm2:start

# Configurar Nginx
cd ..
sudo cp nginx.conf /etc/nginx/sites-available/denuncias
sudo ln -s /etc/nginx/sites-available/denuncias /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Configurar firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### 5️⃣ Verificar
```bash
# Estado del backend
pm2 status

# Logs en tiempo real
pm2 logs

# Probar en navegador
http://plataformadenuncias.myvnc.com
```

---

## 🔧 Variables de Entorno Críticas

### Backend (Servidor/.env)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=tu_mongodb_uri_aqui
JWT_SECRET=[GENERAR_ALEATORIO]
FRONTEND_URL=https://plataformadenuncias.myvnc.com
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
EMAIL_USER=[TU_EMAIL]
EMAIL_PASSWORD=[APP_PASSWORD]
CORS_ORIGINS=https://plataformadenuncias.myvnc.com
```

### Frontend (.env)
```bash
VITE_API_URL=https://plataformadenuncias.myvnc.com/api/v1
VITE_GOOGLE_CLIENT_ID=tu_google_client_id
```

---

## 🚀 Comandos Útiles

```bash
# PM2
pm2 status                    # Ver estado
pm2 logs denuncias-backend    # Ver logs
pm2 restart denuncias-backend # Reiniciar
pm2 stop denuncias-backend    # Detener

# Nginx
sudo systemctl status nginx   # Estado
sudo systemctl restart nginx  # Reiniciar
sudo nginx -t                 # Verificar config

# Actualizar código
cd /var/www/PlataaformaWebParaDenuncias
git pull origin main
npm run setup:production
pm2 restart denuncias-backend
```

---

## ✅ Verificación Post-Despliegue

1. **Backend Health:** http://plataformadenuncias.myvnc.com/health
2. **API:** http://plataformadenuncias.myvnc.com/api/v1
3. **Frontend:** http://plataformadenuncias.myvnc.com
4. **Login:** Probar con usuario de prueba
5. **OAuth Google:** Probar login con Google
6. **Subir Denuncia:** Crear y subir evidencias

---

## 🔒 SSL/HTTPS (Opcional pero Recomendado)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d plataformadenuncias.myvnc.com

# Renovación automática
sudo certbot renew --dry-run
```

---

## 🐛 Troubleshooting

| Error | Solución |
|-------|----------|
| 502 Bad Gateway | `pm2 restart denuncias-backend` |
| CORS Error | Verificar CORS_ORIGINS en .env |
| OAuth no funciona | Actualizar URIs en Google Console |
| DB no conecta | Verificar IP en MongoDB Atlas whitelist |
| Archivos no cargan | `sudo chmod -R 775 Servidor/uploads` |

---

## 📞 Soporte

**Logs importantes:**
```bash
pm2 logs                                          # Backend
sudo tail -f /var/log/nginx/denuncias_error.log  # Nginx
```

---

**¡Todo listo para producción!** 🎉
