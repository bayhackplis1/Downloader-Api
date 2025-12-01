# Guía Completa: Instalar Video Downloader en tu VPS

Una aplicación web para descargar videos de TikTok y YouTube. Funciona en cualquier VPS Linux con Node.js y PostgreSQL.

---

## Tabla de Contenidos
1. [Requisitos](#requisitos)
2. [Obtener las Cookies](#obtener-las-cookies)
3. [Instalación Paso a Paso](#instalación-paso-a-paso)
4. [Configuración .env](#configuración-env)
5. [Iniciar la Aplicación](#iniciar-la-aplicación)
6. [Ponerlo en Producción (Nginx + PM2)](#ponerlo-en-producción)
7. [Solución de Problemas](#solución-de-problemas)

---

## Requisitos

**VPS con acceso SSH (Ubuntu/Debian 20.04+)**

Que tengas acceso SSH:
```bash
ssh usuario@tu-vps.com
```

Si no tienes VPS:
- **DigitalOcean**: $5/mes (droplet básico)
- **Linode**: $5/mes
- **Vultr**: $2.50/mes
- **Hetzner**: muy barato en EU

---

## Obtener las Cookies

### Cookie de TikTok (SOLO si quieres búsqueda avanzada)

**Paso 1: Abre TikTok**
- Ve a https://www.tiktok.com
- Inicia sesión

**Paso 2: Abre Developer Tools**
- Presiona `F12`
- Ve a **Application** (Chrome) o **Storage** (Firefox)

**Paso 3: Copia la Cookie**
- Click en **Cookies** → **tiktok.com**
- Busca cualquier cookie (cualquiera sirve)
- O más fácil: copia TODO el header `Cookie` que ves en Network

**Resultado:** Una cadena larga como:
```
tt_chain_token=ABC123; sessionid=XYZ789; uid_tt=...
```

**Guarda esta cadena, la necesitarás en .env**

---

## Instalación Paso a Paso

### 1. Conecta a tu VPS

```bash
ssh usuario@tu-vps.com
```

### 2. Actualiza el Sistema

```bash
sudo apt update
sudo apt upgrade -y
```

### 3. Instala Dependencias Principales

```bash
# Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# yt-dlp y dependencias
sudo apt install -y python3 python3-pip ffmpeg
pip3 install yt-dlp

# Nginx (reverse proxy)
sudo apt install -y nginx

# PM2 (gestor de procesos)
sudo npm install -g pm2
```

**Verifica las instalaciones:**
```bash
node --version      # v20.x.x
npm --version       # 10.x.x
psql --version      # 14+
yt-dlp --version    # 2025.x.x
```

### 4. Crea la Base de Datos

```bash
# Conecta a PostgreSQL
sudo su - postgres

# Crea usuario para la BD
createuser video_user -P
# Te pide una contraseña, usa algo fuerte: MiPass123Seguro!

# Crea la base de datos
createdb -O video_user video_downloader

# Sale de postgres
exit
```

**Verifica que funcionó:**
```bash
psql -U video_user -d video_downloader -h localhost
```

Deberías ver:
```
video_downloader=>
```

Sale con: `\q`

### 5. Clona el Proyecto

```bash
# Navega a una carpeta (recomendado /home/usuario o /opt)
cd /home/$(whoami)

# Clona el repositorio (reemplaza con tu repo)
git clone https://github.com/tu-usuario/video-downloader.git
cd video-downloader
```

### 6. Instala Dependencias de la App

```bash
npm install
```

Toma 2-3 minutos.

---

## Configuración .env

### 1. Crea el archivo .env

```bash
# En la carpeta video-downloader
nano .env
```

### 2. Rellena con tus valores

```bash
# BASE DE DATOS (REQUERIDO)
DATABASE_URL=postgresql://video_user:MiPass123Seguro!@localhost:5432/video_downloader

# SERVIDOR
PORT=5000
NODE_ENV=production
VITE_API_URL=https://tudominio.com

# TIKTOK (OPCIONAL - solo si tienes la cookie)
TIKTOK_COOKIE=tt_chain_token=ABC123; sessionid=XYZ789; uid_tt=... (tu cookie aqui)

# SEGURIDAD
SESSION_SECRET=algo_super_aleatorio_y_seguro_$(openssl rand -base64 32)
```

**Importante:**
- Reemplaza `MiPass123Seguro!` con la contraseña que creaste para postgres
- Reemplaza `https://tudominio.com` con tu dominio o IP pública
- Si no tienes dominio, usa: `http://tu-ip-publica:5000`

### 3. Guarda el archivo

- Presiona `Ctrl + X`
- Presiona `Y`
- Presiona `Enter`

### 4. Verifica el archivo

```bash
cat .env
```

Deberías ver tus valores.

---

## Iniciar la Aplicación

### Opción 1: Desarrollo (para probar)

```bash
npm run dev
```

Verás:
```
12:43:39 AM [express] serving on port 5000
```

**Prueba en otro terminal:**
```bash
curl http://localhost:5000
```

Deberías ver HTML de la app.

**Detén con:** `Ctrl + C`

### Opción 2: Build para Producción

```bash
npm run build
```

Genera archivos optimizados en `dist/`.

---

## Ponerlo en Producción

### 1. Inicializa la BD (primera vez)

```bash
npm run db:push
```

Crea las tablas automáticamente.

### 2. Inicia con PM2 (gestor de procesos)

```bash
# Inicia la app
pm2 start ecosystem.config.js --env production

# Verifica que está corriendo
pm2 status

# Ver logs
pm2 logs
```

Deberías ver:
```
[ID] [online] video-downloader    # verde = corriendo
```

### 3. Configura Nginx (reverse proxy)

```bash
# Crea archivo de configuración
sudo nano /etc/nginx/sites-available/video-downloader
```

**Pega esto:**

```nginx
upstream app {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name tudominio.com;  # Reemplaza con tu dominio
    
    client_max_body_size 100M;  # Para descargas grandes
    
    location / {
        proxy_pass http://app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket
        proxy_read_timeout 86400;
    }
}
```

**Guarda:**
- `Ctrl + X`, `Y`, `Enter`

**Habilita el sitio:**

```bash
sudo ln -s /etc/nginx/sites-available/video-downloader \
           /etc/nginx/sites-enabled/

# Prueba configuración
sudo nginx -t

# Reinicia nginx
sudo systemctl restart nginx
```

Deberías ver:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 4. SSL Gratis con Let's Encrypt (HTTPS)

```bash
# Instala Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtén certificado
sudo certbot --nginx -d tudominio.com
```

Sigue los pasos. Te preguntará por email.

**Verifica HTTPS:**
- Abre https://tudominio.com
- Deberías ver un candadito verde

### 5. Auto-restart en caso de crash

```bash
# PM2 guarda estado
pm2 startup

# Auto-reinicia en reboot
pm2 save
```

---

## Configuración de YouTube Cookies (Opcional)

**Solo si descargas están fallando en YouTube:**

```bash
# Crea carpeta
mkdir -p data

# Crea archivo
nano data/youtube_cookies.txt

# Pega las cookies de YouTube (igual que TikTok)
# Ctrl + X, Y, Enter

# En .env agrega:
YOUTUBE_COOKIES_FILE=/home/tu-usuario/video-downloader/data/youtube_cookies.txt
```

Reinicia la app:
```bash
pm2 restart video-downloader
```

---

## Monitoreo

### Ver estado

```bash
# Ver procesos
pm2 status

# Ver logs en tiempo real
pm2 logs video-downloader

# Ver CPU/Memoria
pm2 monit
```

### Actualizar la App

```bash
cd /home/usuario/video-downloader

# Descargar cambios
git pull origin main

# Instalar nuevas dependencias
npm install

# Rebuild
npm run build

# Reinicia
pm2 restart video-downloader
```

---

## Solución de Problemas

### "Connection refused" o "Cannot connect to localhost:5000"

**Causa:** PM2 no está corriendo

**Solución:**
```bash
pm2 status  # Ver si está online
pm2 start ecosystem.config.js --env production
pm2 logs
```

### "Database connection error"

**Causa:** PostgreSQL no está corriendo o credenciales incorrectas

**Solución:**
```bash
# Verifica que postgres está corriendo
sudo systemctl status postgresql

# Si no, reinicia
sudo systemctl restart postgresql

# Verifica la conexión
psql -U video_user -d video_downloader -h localhost
```

**Si aún no funciona:**
```bash
# Revisa .env
cat .env | grep DATABASE_URL

# Prueba manual
psql postgresql://video_user:TU_PASSWORD@localhost:5432/video_downloader
```

### "YouTube descargas no funcionan"

**Solución:**
```bash
# Verifica que yt-dlp está instalado
yt-dlp --version

# Actualiza yt-dlp
pip3 install --upgrade yt-dlp

# Reinicia app
pm2 restart video-downloader
```

### "TikTok búsqueda dice 'Cookie not configured'"

**Causa:** TIKTOK_COOKIE vacío o no está en .env

**Solución:**
```bash
# Verifica que está configurado
grep TIKTOK_COOKIE .env

# Si está vacío, obtén la cookie (ver sección "Obtener las Cookies")
# Y actualiza .env con tu cookie

# Reinicia
pm2 restart video-downloader
```

### "Nginx devuelve 502 Bad Gateway"

**Causa:** La app no está corriendo o PM2 la apagó

**Solución:**
```bash
# Verifica logs
pm2 logs video-downloader

# Reinicia
pm2 restart video-downloader

# Verifica que puerto 5000 está abierto
lsof -i :5000
```

### "Descargas muy lentas"

**Solución:**
```bash
# Aumenta límites de conexión en .env
MAX_CONCURRENT_DOWNLOADS=10

# Reinicia
pm2 restart video-downloader
```

---

## Comandos Útiles

```bash
# VER ESTADO
pm2 status
pm2 logs video-downloader
pm2 monit

# REINICIAR
pm2 restart video-downloader
pm2 reload video-downloader  # Sin downtime

# PARAR/INICIAR
pm2 stop video-downloader
pm2 start video-downloader

# ACTUALIZAR
cd /home/tu-usuario/video-downloader
git pull
npm install
npm run build
pm2 restart video-downloader

# EDITAR CONFIGURACIÓN
nano .env
pm2 restart video-downloader

# VER BASE DE DATOS
psql -U video_user -d video_downloader -h localhost
```

---

## Información de tu Instalación

Después de seguir esta guía, tendrás:

✅ **Frontend**: Disponible en https://tudominio.com
✅ **Backend**: Corre en http://localhost:5000 (detrás de Nginx)
✅ **BD**: PostgreSQL corriendo en localhost:5432
✅ **Descargas**: Guardadas en `/tmp/` (se limpian automáticamente)
✅ **Logs**: Accesibles con `pm2 logs video-downloader`
✅ **Auto-restart**: Si falla, se reinicia automáticamente
✅ **SSL**: HTTPS con certificado gratis de Let's Encrypt

---

## Estructura de Directorios

```
/home/tu-usuario/
└── video-downloader/
    ├── .env                 # Tu configuración (SECRETO)
    ├── .env.example         # Template
    ├── server/              # Backend
    ├── client/              # Frontend
    ├── dist/                # Generado (build)
    ├── data/
    │   └── youtube_cookies.txt  # Opcional
    ├── node_modules/        # Dependencias
    └── package.json
```

---

## Soporte y Actualizaciones

**Ver versión de yt-dlp:**
```bash
yt-dlp --version
```

**Última versión soportada:** 2025.11.12+

**Actualizar (importante para YouTube):**
```bash
pip3 install --upgrade yt-dlp
```

---

## Siguientes Pasos

1. ✅ Instala todo con esta guía
2. ✅ Verifica que https://tudominio.com funciona
3. ✅ Prueba con una URL de TikTok
4. ✅ Prueba con una URL de YouTube
5. ✅ Agrega TIKTOK_COOKIE si quieres búsqueda avanzada

**¡Listo! Tu VPS está corriendo Video Downloader profesionalmente.**
