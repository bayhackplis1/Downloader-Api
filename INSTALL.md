# Guía de Instalación - Video Downloader (TikTok + YouTube)

Una aplicación web para descargar videos, audio e imágenes de TikTok y YouTube con interfaz cyberpunk/synthwave.

## Contenido
1. [Requisitos Previos](#requisitos-previos)
2. [Instalación Rápida](#instalación-rápida)
3. [Configuración Detallada](#configuración-detallada)
4. [Secrets y Variables de Entorno](#secrets-y-variables-de-entorno)
5. [Uso de la Aplicación](#uso-de-la-aplicación)
6. [Solución de Problemas](#solución-de-problemas)

---

## Requisitos Previos

**Replit (Recomendado - Requiere Cuenta)**
- Cuenta gratuita en [replit.com](https://replit.com)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

**Local (Opcional - Para Desarrollo)**
- Node.js 18+
- npm o yarn
- PostgreSQL 12+
- yt-dlp instalado

---

## Instalación Rápida

### En Replit (Recomendado - 3 minutos)

1. **Clona el proyecto**
   - Ve a [replit.com](https://replit.com)
   - Click en "Create" → "Import from GitHub"
   - Pega: `https://github.com/tu-usuario/video-downloader` (o crea un fork)
   - Click "Import from GitHub"

2. **Espera a que instale dependencias**
   - Replit instalará automáticamente Node.js, npm y dependencias
   - Toma 2-5 minutos la primera vez

3. **Configura secrets (Opcional pero Recomendado)**
   - Click en "Secrets" en la parte izquierda
   - Agrega `TIKTOK_COOKIE` si quieres usar búsqueda de palabras clave
   - Agrega `DATABASE_URL` si usas una BD externa

4. **Inicia la aplicación**
   - La aplicación inicia automáticamente
   - Ve a la URL preview o click "Open Site"
   - ¡Listo! Accede a http://localhost:5000

---

## Configuración Detallada

### Opción A: En Replit (Recomendado)

#### 1. Crear el Proyecto

```bash
# En Replit, click en "Create" y selecciona "Node.js"
# O importa desde GitHub
```

#### 2. Instalar Dependencias

Las dependencias se instalan automáticamente. Si necesitas hacerlo manualmente:

```bash
npm install
```

#### 3. Configurar Base de Datos

Replit proporciona PostgreSQL automáticamente:

```bash
# En Replit, la BD ya está configurada
# DATABASE_URL se configura automáticamente
```

#### 4. Iniciar el Servidor

```bash
npm run dev
```

Verás:
```
12:43:39 AM [express] serving on port 5000
```

Accede a: http://localhost:5000

---

### Opción B: Instalación Local

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/video-downloader
cd video-downloader
```

#### 2. Instalar Dependencias

```bash
npm install
```

#### 3. Instalar yt-dlp

**Windows (PowerShell como Admin):**
```powershell
pip install yt-dlp
```

**macOS/Linux:**
```bash
pip3 install yt-dlp
# O si usas Homebrew (macOS)
brew install yt-dlp
```

#### 4. Configurar Base de Datos

**Local con PostgreSQL:**

```bash
# 1. Instala PostgreSQL
# Windows: https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql

# 2. Crea la BD
createdb video_downloader

# 3. Configura la conexión
# Crea archivo .env.local en la raíz:
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/video_downloader"
```

**O usa Neon (Cloud - Recomendado):**
- Ve a https://neon.tech
- Crea cuenta gratuita
- Copia el CONNECTION STRING
- Pega en `.env.local`:
```
DATABASE_URL="postgresql://usuario:contraseña@host.neon.tech/database?sslmode=require"
```

#### 5. Inicializar BD (Drizzle)

```bash
npm run db:push
```

#### 6. Iniciar el Servidor

```bash
npm run dev
```

Verás:
```
12:43:39 AM [express] serving on port 5000
Abre http://localhost:5000
```

---

## Secrets y Variables de Entorno

### Para TikTok - Búsqueda Avanzada

**¿Necesitas esto?** Solo si quieres búsqueda por palabras clave

**Cómo obtener la cookie de TikTok:**

1. Abre TikTok.com en tu navegador
2. Inicia sesión en tu cuenta
3. Presiona `F12` (Abre Developer Tools)
4. Ve a "Application" (Chrome) o "Storage" (Firefox)
5. Click en "Cookies" → "tiktok.com"
6. Busca la cookie completa (copia TODO el valor)
7. En Replit:
   - Click "Secrets" en la izquierda
   - Nombre: `TIKTOK_COOKIE`
   - Valor: Pega toda la cookie
   - Click "Save"

**O en local (.env.local):**
```
TIKTOK_COOKIE="tu_cookie_completa_aqui"
```

### Para YouTube (Opcional)

Para descargas de videos privados o con restricciones:

1. Obtén cookies de YouTube igual que TikTok
2. Crea archivo `data/youtube_cookies.txt`
3. En Replit: Crea el archivo en la carpeta "data"
4. Pega el contenido de las cookies

```
# Estructura del archivo data/youtube_cookies.txt:
__Secure-1PSID=valor1; __Secure-1PSIDTS=valor2; ...
```

### Variables de Entorno Automáticas

En Replit se configuran automáticamente:
- `DATABASE_URL` - Conexión a PostgreSQL
- `VITE_API_URL` - URL del backend (automática)

---

## Uso de la Aplicación

### Interfaz Principal

**Secciones:**
1. **Inicio** - Descarga individual de videos
2. **Buscar** - Búsqueda por usuario (TikTok) o palabras clave
3. **Descarga Múltiple** - Descargar varios videos a la vez
4. **Análisis** - Obtener metadata de hasta 50 videos
5. **Palabras Clave** - Búsqueda avanzada por keyword
6. **Chat Global** - Chat en tiempo real

### Descarga de un Video

1. **Pega la URL**
   - TikTok: `https://www.tiktok.com/@usuario/video/123456`
   - YouTube: `https://youtu.be/dQw4w9WgXcQ`
   - URLs cortas funcionan automáticamente

2. **Click en "GET DOWNLOAD LINKS"**
   - Espera 2-5 segundos
   - Se mostrarán opciones de descarga

3. **Selecciona qué descargar**
   - **Video**: El archivo completo MP4
   - **Audio**: MP3 solo del audio
   - **Imágenes** (TikTok): ZIP con todas las imágenes del slideshow

4. **Historial**
   - Se guarda automáticamente en tu navegador
   - Filtrable y exportable a JSON/CSV

### Descarga de TikTok

**Videos Normales:**
- Descarga completa con audio
- Resolucionaudio 1080x1920p automático

**Slideshows:**
- Todas las imágenes en un ZIP
- O descarga el audio del slideshow

**Audio Directo:**
- URLs de /music/ soportadas
- Busca videos que usen ese audio

### Descarga de YouTube

**Videos:**
- Selecciona calidad (360p, 480p, 720p, 1080p)
- Se descarga con audio automáticamente

**Audio:**
- MP3 de alta calidad (192K)
- Perfecto para música

**Búsqueda:**
- Busca videos por palabra clave
- Resultados clickeables para descargar directo

### Chat Global

1. Click en "Chat Global"
2. Ingresa tu nombre y edad
3. Comienza a chatear
4. Ver otros usuarios online en tiempo real

---

## Solución de Problemas

### "Failed to process URL"

**Causa:** Generalmente URL inválida o video privado

**Solución:**
1. Verifica que la URL es correcta
2. Asegúrate que el video es público
3. Intenta otro video

### "Cookie not configured" (Búsqueda TikTok)

**Causa:** No agregaste la cookie de TikTok

**Solución:**
1. Abre TikTok en tu navegador
2. Inicia sesión
3. Presiona F12 → Application → Cookies → tiktok.com
4. En Replit: Secrets → Agrega TIKTOK_COOKIE

### YouTube no funciona

**Solución Automática:**
- La aplicación usa yt-dlp 2025.11.12
- Ya tiene soporte para YouTube SABR
- No necesitas hacer nada

**Si persiste:**
```bash
# Actualiza yt-dlp (solo local)
pip install --upgrade yt-dlp
```

### Base de datos no conecta

**En Replit:**
- Automática, no necesita configuración

**Local:**
```bash
# Verifica que PostgreSQL está corriendo
psql -U postgres

# Si necesitas reiniciar (macOS)
brew services restart postgresql
```

### Descarga muy lenta

- Depende de tu conexión a internet
- Videos 4K pueden tardar 5-10 minutos
- Formato 720p es más rápido

### Chat no funciona

**Solución:**
1. Recarga la página (F5)
2. Abre DevTools (F12)
3. Verifica que no hay errores en Console
4. Intenta incógnito si es un problema de caché

---

## Arquitectura Técnica

### Frontend
- React + TypeScript + Vite
- Tailwind CSS + Radix UI
- Tema cyberpunk/synthwave personalizado

### Backend
- Node.js + Express
- yt-dlp 2025.11.12 (con soporte YouTube SABR)
- PostgreSQL + Drizzle ORM

### Características Incluidas
- ✅ Descargas TikTok (video, audio, slideshows)
- ✅ Descargas YouTube (video, audio, búsqueda)
- ✅ Chat global en tiempo real
- ✅ Historial de descargas (local)
- ✅ Análisis de metadata
- ✅ Búsqueda avanzada
- ✅ Tema oscuro automático

---

## Próximos Pasos

1. **Personaliza los Colores** (opcional)
   - Archivo: `client/src/index.css`
   - Busca variables CSS y edita los colores

2. **Agrega tu Logo** (opcional)
   - Reemplaza imagen en `client/src/components/header.tsx`

3. **Publica tu Sitio** (en Replit)
   - Click "Publish" en la esquina superior
   - Obtén URL pública para compartir

4. **Dominio Personalizado** (Replit Paid)
   - Ve a "Publish" → "Custom Domain"
   - Conecta tu propio dominio

---

## Soporte

**Documentación:**
- Backend: `server/routes.ts`
- Frontend: `client/src/pages/`
- Base de datos: `shared/schema.ts`

**Cambios Recientes:**
- YouTube SABR fix (Nov 30, 2025)
- yt-dlp 2025.11.12 con Deno support
- Chat global con WebSocket
- Búsqueda avanzada por palabras clave

---

## Licencia

MIT - Libre para usar, modificar y distribuir

---

**¿Preguntas?** Consulta el archivo `replit.md` para detalles técnicos completos.
