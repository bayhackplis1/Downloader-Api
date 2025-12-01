# Inicio Rápido - 5 Minutos

## En Replit (Lo más fácil)

```bash
# 1. Importa el proyecto en replit.com
# Click: Create → Import from GitHub → Pega el URL → Import

# 2. Espera 2-3 minutos
# Replit instala automáticamente todo

# 3. Click "Open Site" o va a http://localhost:5000
# ¡Listo!
```

## Local (Con Node.js instalado)

```bash
# 1. Clona
git clone https://tu-repo
cd video-downloader

# 2. Instala
npm install

# 3. Instala yt-dlp
pip install yt-dlp

# 4. Configura BD (crear .env.local)
DATABASE_URL="postgresql://usuario:pass@localhost/video_downloader"

# 5. Crea la BD
npm run db:push

# 6. Inicia
npm run dev

# 7. Abre http://localhost:5000
```

---

## Comandos Principales

```bash
# Desarrollo (con hot reload)
npm run dev

# Build para producción
npm build

# Actualizar BD después de cambios de schema
npm run db:push

# Ver logs
npm run logs
```

---

## Configurar TikTok (Búsqueda)

**Solo si necesitas búsqueda avanzada por palabras clave**

```bash
# 1. En Replit: Secrets → Agregar nuevo
# Nombre: TIKTOK_COOKIE
# Valor: (Ver instrucciones en INSTALL.md)

# 2. Local: Crear .env.local
TIKTOK_COOKIE="tu_cookie_aqui"
```

---

## URLs de Ejemplo

```
TikTok:
- https://www.tiktok.com/@usuario/video/123456
- https://vm.tiktok.com/ZMJxxx (corta)

YouTube:
- https://youtu.be/dQw4w9WgXcQ
- https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

---

## Estructura de Carpetas

```
video-downloader/
├── client/               # Frontend React
│   └── src/
│       ├── pages/       # Páginas principales
│       ├── components/  # Componentes reutilizables
│       └── lib/         # Utilidades
├── server/              # Backend Express
│   ├── routes.ts        # Todos los endpoints
│   └── index.ts         # Punto de entrada
├── shared/              # Código compartido
│   └── schema.ts        # Tipos de datos
└── INSTALL.md           # Documentación completa
```

---

## ¿Qué Puedes Descargar?

✅ TikTok:
- Videos completos
- Audio
- Todos los slideshows como ZIP
- Audio directo de /music/

✅ YouTube:
- Videos (360p, 480p, 720p, 1080p)
- Audio en MP3

---

## Features Incluidos

- 🎨 Tema cyberpunk/synthwave oscuro
- 📱 Responsive (móvil + desktop)
- 💾 Historial local (JSON/CSV export)
- 🔍 Búsqueda avanzada
- 👥 Chat global tiempo real
- 📊 Análisis de metadata
- ⚡ Descargas rápidas

---

## Errores Comunes

| Error | Solución |
|-------|----------|
| "Failed to process URL" | Verifica que la URL es correcta y el video es público |
| "Cookie not configured" | Agrega TIKTOK_COOKIE en Secrets (ver INSTALL.md) |
| "DB connection error" | En local, asegúrate que PostgreSQL está corriendo |
| YouTube no funciona | Ya está soportado, intenta recargar la página |

---

## Siguiente Paso

Lee `INSTALL.md` para:
- Instalación detallada
- Configuración de secrets
- Solución de problemas completa

---

**Listo para comenzar? ¡Abre http://localhost:5000!**
