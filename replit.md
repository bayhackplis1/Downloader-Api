# Overview

This project is a multi-platform web application designed for downloading videos, slideshow previews, and audio from **TikTok and YouTube**. It features a modern, responsive, cyberpunk/synthwave-themed user interface with neon effects, holographic animations, and scan line effects. The application aims to provide a stylish and functional tool for content archival by offering comprehensive video information extraction, diverse download capabilities, and robust download history tracking. It supports various download types, including videos, slideshow preview/thumbnail images, and audio, along with advanced features like batch downloads, user profile statistics, and metadata extraction for multiple URLs.

## Recent Improvements (November 2025)

### Chat Global Removed (November 30, 2025)
- **REMOVED**: Global chat system completely removed per user request
  - Deleted chat page and components
  - Removed WebSocket server (/ws endpoint)
  - Removed chat API endpoints (/api/chat/messages)
  - Removed from navigation menu
  - Cleaned up all chat-related files and dependencies

### Mobile Navigation Redesign (November 30, 2025)
- **Mobile Menu**: Added hamburger menu (3 dots) for mobile devices
  - Opens left sidebar with all navigation items
  - Closes automatically when navigating
  - Background button ("Fondo") always visible at top-right
- **Performance**: Removed Fireworks rain effect for faster load times and smoother performance
  - Maintains clean cyberpunk aesthetic without visual overhead
- **Responsive Design**: Desktop shows full horizontal menu bar, mobile shows hamburger menu

### YouTube SABR Fix (November 30, 2025)
- **CRITICAL FIX**: Fixed YouTube downloads failing due to SABR streaming enforcement
- **yt-dlp 2025.11.12**: Downloaded latest binary with JavaScript signature extraction support
- **Remote Components**: Added `--remote-components ejs:github` flag to enable Deno-based decryption
- **Binary Path**: Uses `/home/runner/workspace/yt-dlp-latest` to bypass Nix's older version (2025.06.30)
- All YouTube endpoints now work correctly with the latest yt-dlp version

### YouTube Support (November 30, 2025)
- **Multi-Platform Support**: Application now supports both TikTok and YouTube URLs
- **Automatic Platform Detection**: URLs are automatically detected and routed to appropriate endpoints
- **YouTube Endpoints**:
  - `POST /api/youtube/info`: Get metadata for a YouTube video
  - `GET /api/youtube/download/video`: Download YouTube video (supports quality selection: 360p, 480p, 720p, 1080p)
  - `GET /api/youtube/download/audio`: Download YouTube video as MP3
  - `POST /api/youtube/search`: Search YouTube for videos by keyword
- **Platform-Specific Styling**: Red/orange theme for YouTube, cyan/purple theme for TikTok
- **YouTube Shorts Support**: Properly detects and handles YouTube Shorts URLs
- **Quality Selector**: UI allows selecting video quality for YouTube downloads
- **YouTube cookies file**: Optional cookies file at `data/youtube_cookies.txt` for authenticated downloads

## Previous Improvements (Octubre 2025)

### Seguridad y Código Limpio
- **CRÍTICO**: Eliminada vulnerabilidad de inyección de comandos - todas las llamadas a yt-dlp ahora usan `spawn()` con arrays de argumentos
- Funciones helper reutilizables para formateo (duración, tamaños, números, fechas, hashtags) - código DRY
- **URLs de audio implementadas**: Extrae ID de música → busca videos con ese audio vía API → descarga audio del primer video
- Imports optimizados y código duplicado eliminado

### Chat Global en Tiempo Real (Octubre 28, 2025)
- ✅ **Chat Global**: Sistema de chat en tiempo real con WebSocket para comunicación instantánea entre usuarios
  - Modal de ingreso que solicita nombre y edad antes de acceder al chat
  - Interfaz similar a WhatsApp con burbujas de mensajes diferenciadas
  - Contador de usuarios online en tiempo real
  - Diseño responsive con el mismo tema cyberpunk/synthwave del resto de la aplicación
  - Mensajes persistentes almacenados en base de datos PostgreSQL
  - Validación de conexión WebSocket antes de enviar mensajes
  - Feedback visual cuando la conexión no está lista

### Funcionalidades Estables
- ✅ Descargas de videos, audio y slideshows
  - **Slideshows**: Descarga ZIP con TODAS las imágenes individuales (no solo preview)
  - **Video de slideshow**: Descarga el audio del slideshow
- ✅ Expansión automática de URLs cortas (vm.tiktok.com)
- ✅ Batch downloads (hasta 20 URLs simultáneas)
- ✅ Análisis masivo de metadata (hasta 50 URLs)
- ✅ Búsqueda por usuario
- ✅ **URLs de audio directas (/music/)** - ahora soportadas usando @tobyg74/tiktok-api-dl
- ✅ **Búsqueda por palabras clave** - funcionalidad que permite buscar:
  - Videos por palabra clave (hasta 15 resultados)
  - Usuarios por nombre (hasta 15 resultados)
  - Requiere cookie de TikTok configurada en secrets (TIKTOK_COOKIE)
  - **Click-to-download en videos**: Los videos son clickeables y te llevan al inicio con la URL pre-cargada y auto-submit
  - **Click-to-search en usuarios**: Los usuarios son clickeables y te llevan a la búsqueda por @ con su username pre-cargado y auto-submit
  - **API de descarga directa**: GET `/api/tiktok/searchkeyword/:keyword` - busca y descarga automáticamente un video ALEATORIO de los resultados encontrados, con metadata detallada en headers HTTP

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript, using Vite.
- **UI Framework**: Radix UI components integrated with shadcn/ui, styled with Tailwind CSS.
- **Theming**: Custom cyberpunk/synthwave theme with a purple gradient background, neon accents, and subtle animations.
- **State Management**: React Hook Form for forms, TanStack React Query for server state.
- **Local Storage**: Used for download history and favorites.
- **Routing**: Wouter for client-side routing.
- **Form Validation**: Zod.
- **Key Features**:
    - **Download Options**: Standard videos, **slideshow preview/thumbnail (single high-quality image)**, combined slideshow video-with-music, and standalone audio.
    - **Metadata Display**: Creator info, engagement stats, audio details, technical specs, hashtags, upload dates.
    - **User Interface**: Responsive design optimized for mobile and desktop, featuring holographic cards and floating icons.
    - **TikTok Search**: Real-time search by username using `yt-dlp` returning up to 15 videos with metadata.
    - **Keyword Search**: Nueva página dedicada para búsqueda por palabras clave con tabs para videos/usuarios. Muestra tarjetas visuales con preview, estadísticas y metadata.
    - **Global Chat**: Real-time chat system with WebSocket integration, user authentication via name/age modal, online user counter, and WhatsApp-like interface design.
    - **Download History**: Local storage-based, searchable, filterable, sortable, with JSON/CSV export.
    - **URL Input**: Real-time validation, recent URLs dropdown.
    - **Batch Operations**: Dedicated pages for batch downloading multiple URLs and mass metadata analysis.
    - **Engagement Analytics**: Real-time rate calculation (viral/excellent/good/average).
    - **Animations**: `fade-in-up`, `floating`, `pulse-border`, `stat-shine`, `hologram-sweep`, `neon-flicker`, `glitch`.

## Backend Architecture
- **Runtime**: Node.js with Express.js, TypeScript.
- **External Tool Integration**: `yt-dlp` for TikTok and YouTube processing, metadata extraction, search, and slideshow thumbnail extraction. `curl` for expanding short TikTok URLs (vm.tiktok.com). `@tobyg74/tiktok-api-dl` for keyword search and music URL support.
- **API Design**: RESTful endpoints under `/api` for:
  - **YouTube Endpoints**:
  - `POST /api/youtube/info`: Get metadata for a YouTube video (title, description, stats, thumbnail, duration, etc.)
  - `GET /api/youtube/download/video?url=...&quality=720`: Download video with quality selection (360, 480, 720, 1080)
  - `GET /api/youtube/download/audio?url=...`: Download audio as MP3
  - `POST /api/youtube/search`: Search YouTube videos by keyword
  - **TikTok Endpoints**:
  - `/api/tiktok/info`: Get metadata for a single video.
  - `/api/tiktok/download/:type`: Download video, audio, or slideshow images.
  - `/api/tiktok/search`: POST endpoint for searching by username (for UI display).
  - `GET /api/tiktok/search/:username`: Download 5 latest videos as ZIP.
  - `GET /api/tiktok/hashtag/:tag`: (Currently unavailable, returns 501).
  - `POST /api/tiktok/batch`: Batch download multiple URLs (max 20) as ZIP.
  - `GET /api/tiktok/user/:username/stats`: Get user profile statistics (JSON).
  - `POST /api/tiktok/metadata/batch`: Extract metadata from multiple URLs (max 50) as JSON.
  - `POST /api/tiktok/search/keyword`: Search videos or users by keyword (max 15 results). Requires TIKTOK_COOKIE secret.
  - `GET /api/tiktok/searchkeyword/:keyword`: Search videos by keyword and automatically download a RANDOM result with detailed metadata in HTTP headers. Requires TIKTOK_COOKIE secret.
    - Returns: MP4 file
    - Headers include: Video ID, Author, Username, Description, Likes, Views, Comments, Shares, Duration, Upload Date, URL, Search info
    - Example: `curl -i http://localhost:5000/api/tiktok/searchkeyword/dance` (use -i to see metadata headers)
  - `GET /api/chat/messages`: Get the latest 100 chat messages (JSON).
  - `POST /api/chat/messages`: Create a new chat message (JSON).
- **WebSocket Server**: Real-time communication on `/ws` path for:
  - User join/leave events with username and age
  - Live message broadcasting to all connected clients
  - Online user count updates
  - Persistent message storage in PostgreSQL
- **Slideshow Support**: Robust detection and handling for TikTok slideshows. For video downloads, returns MP3 audio. For image downloads, returns the **preview/thumbnail** extracted directly from yt-dlp metadata (reliable, no web scraping issues).
- **Short URL Support**: Automatically expands short TikTok URLs (vm.tiktok.com, vt.tiktok.com) to full URLs and cleans query parameters before processing.
- **Security**: Input validation, error handling, and use of `spawn()` for external commands to prevent command injection.
- **File Management**: Automatic temporary file cleanup after downloads.

## Database Architecture
- **ORM**: Drizzle ORM with TypeScript.
- **Database**: PostgreSQL (configured for Neon serverless).
- **Schema Management**: Drizzle Kit.
- **Connection**: Connection pooling with `@neondatabase/serverless`.

# External Dependencies

- **Neon Database**: Serverless PostgreSQL hosting.
- **yt-dlp**: Command-line tool for TikTok video processing, metadata extraction, and search.
- **Radix UI**: Headless UI component library.
- **Tailwind CSS**: Utility-first CSS framework.
- **TanStack React Query**: Data fetching and caching.
- **Vite**: Build tool and development server.
- **Drizzle ORM**: TypeScript ORM for PostgreSQL.
- **Lucide React**: Icon library.