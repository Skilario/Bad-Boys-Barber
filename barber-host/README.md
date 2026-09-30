# Barber Host — Ezequiel Farias

Sitio de Barber Host dentro del ecosistema Bad Boys. HTML + CSS + JavaScript puro (sin frameworks ni build), organizado en **MVC**.

## Estructura

```
barber-host/
├── index.html                  ← estructura, textos, metadatos SEO y datos estructurados (JSON-LD)
├── site.webmanifest            ← nombre e íconos al "agregar a pantalla de inicio"
├── favicon.ico
├── assets/
│   ├── fonts/                  Anton, Manrope (variable) y DM Mono en woff2, servidas desde el sitio
│   ├── css/                    ← se cargan en este orden (cada uno pisa al anterior)
│   │   ├── fonts.css           @font-face de las tipografías locales
│   │   ├── tokens.css          colores, tipografías, medidas
│   │   ├── base.css            reset y utilidades
│   │   ├── components.css      barra de progreso, nav, botones
│   │   ├── sections.css        hero, historia, servicios, experiencia, eventos, contratar…
│   │   ├── media.css           fotos, logos IG/YT, portadas, bloque Mi historia, WhatsApp
│   │   ├── navigation.css      vistas por sección, encabezados, paginador, barra inferior
│   │   ├── theme-electric.css  estilo minimalista + neón
│   │   ├── modal.css           reproductor de videos
│   │   ├── responsive.css      escala tipográfica y ajustes de celular
│   │   ├── badboys.css         ítem "Bad Boys" (vuelve a la web de la barbería)
│   │   └── perf.css            ajustes de velocidad (va último)
│   ├── img/
│   │   ├── brand/              logo-badboys.webp, og-barber-host.jpg (imagen al compartir), barberhost*.webp, icons/ (favicon e íconos de celu)
│   │   ├── eze/                fotos de Ezequiel: eze-hero, eze-hero-mobile (recorte para celu), eze-en-vivo, eze-silla-escenario, eze-trofeos (*-600.webp = versión chica para celu)
│   │   ├── fondos/             fondo-contrato(.webp / -600.webp)
│   │   ├── eventos/            flyers de eventos (reyes-del-filo, etc.)
│   │   └── covers/             portadas de reels y YouTube (.webp; .jpg de original)
│   └── video/                  MP4 propios de los reels (ver LEEME.txt)
└── js/
    ├── models/                 DATOS
    │   ├── site.model.js       secciones del menú, links (Bad Boys, redes), íconos
    │   ├── videos.model.js     reels de Instagram y videos de YouTube
    │   ├── contact.model.js    número de WhatsApp y mensaje que aparece escrito
    │   └── analytics.model.js  ID de Google Analytics 4 (vacío = no mide)
    ├── views/                  TODO LO QUE TOCA EL DOM
    │   ├── nav.view.js         menú superior y barra inferior
    │   ├── videos.view.js      tarjetas de videos
    │   ├── modal.view.js       reproductor
    │   ├── contact.view.js     links de los botones de WhatsApp
    │   └── effects.view.js     animaciones (scroll, neón, contador, onda, etc.)
    ├── controllers/            LÓGICA
    │   ├── nav.controller.js       menú, barra inferior e ítem "Bad Boys" (vuelve a ../index.html)
    │   ├── router.controller.js    muestra una sección por vez según el #hash
    │   ├── videos.controller.js    dibuja videos y abre el reproductor
    │   ├── contact.controller.js   botones de WhatsApp (flotante, Contratar, cierre)
    │   └── analytics.controller.js visitas por sección, clics a WhatsApp, videos
    └── app.js                  arranque
```

## Cómo verlo

- Abrir `index.html` con doble clic funciona.
- Recomendado: VS Code + extensión **Live Server** (clic derecho → *Open with Live Server*). Los videos de Instagram/YouTube se reproducen mejor servidos por http.

## Cómo subirlo

- **Netlify:** entrar a app.netlify.com/drop y arrastrar la carpeta `barber-host`. Queda online con link propio.
- **Dentro de Bad Boys:** se sube como la carpeta `barber-host/` al lado del `index.html` de Bad Boys (así está armado).

### Dónde vive (importante para SEO)

Barber Host está **dentro de la web de Bad Boys**, en la carpeta `barber-host/`:
**https://badboysbarber.com.ar/barber-host/**. Se sube junto con Bad Boys, sin tocar nada.

- El `sitemap.xml` y el `robots.txt` están en la **raíz de Bad Boys** (incluyen esta página).
- Bad Boys la enlaza desde el menú ("Barber Host"), la sección "Novedad" y el footer.
- Si algún día pasa a un dominio propio, buscar y reemplazar `https://badboysbarber.com.ar/barber-host/`
  en `index.html` (canonical, og:*, twitter:*, JSON-LD) y en el sitemap.

### Después de publicar (una sola vez)

1. **Google Search Console**: Bad Boys ya está verificado (archivo `google….html`). En *Sitemaps* reenviar `https://badboysbarber.com.ar/sitemap.xml`, que ahora incluye Barber Host. Después, *Inspección de URL* → *Solicitar indexación*.
2. **Google Analytics 4**: crear la propiedad, pegar el ID `G-…` en `js/models/analytics.model.js` y en GA4 marcar `whatsapp_click` como **evento clave** (cada consulta).
3. **Probar la vista previa al compartir**: pegar el link en WhatsApp o en developers.facebook.com/tools/debug.
4. **Probar los datos estructurados**: search.google.com/test/rich-results.
5. **Links con UTM** en la bio de Instagram y en historias, para saber de dónde viene cada visita. Ej:
   `https://badboysbarber.com.ar/barber-host/?utm_source=instagram&utm_medium=bio&utm_campaign=barber_host`

## Velocidad (WPO)

- Fotos en **WebP** (−48 % de peso) con `srcset`: el celu baja la versión justa. Los `.jpg` quedan de respaldo.
- Tipografías **propias** en woff2 y precargadas (antes: Google Fonts, 2 conexiones extra y CSS bloqueante).
- Hero con `fetchpriority="high"`; el resto de las fotos con `loading="lazy"` y medidas fijas (sin saltos).
- **Inicio visible desde el HTML** (`class="view active"`): se pinta antes de que corra el JS. Antes la página arrancaba vacía y el footer saltaba (CLS 0,24 → 0,004).
- Google Analytics se carga recién cuando la página terminó de cargar.
- Lighthouse celular: rendimiento 82 → 92, SEO 91 → 92 (el resto es la etiqueta `h4`/contraste de algunos textos de diseño).

**Si cambian una foto:** reemplazar el `.jpg` y generar el `.webp` (y el `-600.webp` en las fotos grandes) con el mismo nombre — por ejemplo en squoosh.app, calidad 75–80.

## Cambios comunes (sin tocar el HTML)

| Qué cambiar | Dónde |
|---|---|
| Número de WhatsApp o texto por defecto | `js/models/contact.model.js` → `whatsapp` |
| Sumar/quitar un reel o video de YouTube | `js/models/videos.model.js` + portada en `assets/img/covers/` |
| Cuántos reels se ven antes de "Ver todos" | `js/models/videos.model.js` → `visibleReels` |
| Mensaje que aparece escrito en WhatsApp | `js/models/contact.model.js` → `defaultText` |
| Nombres de secciones del menú | `js/models/site.model.js` → `sections` |
| Links de Instagram / YouTube / Bad Boys (vuelta a ../index.html) | `js/models/site.model.js` → `links` |
| Colores | `assets/css/tokens.css` |
| ID de Google Analytics | `js/models/analytics.model.js` → `measurementId` |
| Título de Inicio (lo que muestra Google) | `<title>` en `index.html` **y** `js/models/site.model.js` → `homeTitle` |

## Contratar

Sin formulario (versión acordada): las consultas llegan por WhatsApp. Todos los botones abren el chat de Eze con un mensaje
ya escrito que pide fecha, ciudad, tipo de evento y público, así la primera respuesta ya tiene los datos.
La sección tiene: tarjetas "Para quién" (organizadores, marcas, barberos) que bajan al contacto, el cierre con botón
directo a WhatsApp y el bloque de contacto con la lista de datos a enviar.

## Eventos

Están en `index.html` (sección `#portfolio`), en este orden, todos con foto en `assets/img/eventos/`:
1. **Bienvenido al We$t Side ⚡** — Cruce Castelar (`west-side.webp`).
2. **Liga de Barberos** — Merlo · Zona Oeste (`liga-de-barberos.webp`).
3. **Barber vs Barber 8** — Hurlingham (`barber-vs-barber-8.webp`, solo foto).
4. **Reyes del Filo** (`reyes-del-filo.webp`).

Para sumar un evento: copiar un `<article class="ev">` y cambiar foto y textos.

## Imágenes

Todas las fotos de la página están en **WebP** (con versión `-600` para celular). Solo quedan en otro formato,
a propósito: `brand/og-barber-host.jpg` (vista previa al compartir: WhatsApp/Facebook la leen mejor en JPG),
los íconos `.png` (`brand/icons/`) y `favicon.ico` (formatos que piden los navegadores y el celular).
Para una foto nueva: pasarla a WebP (squoosh.app, calidad 75–80) y subir solo el `.webp`.

## Navegación

Cada sección es un `<div class="view" id="...">` en `index.html`. El router muestra una por vez.
Links internos (`#contacto`, `#historia`, `#videos`…) abren la sección que los contiene y bajan hasta ese bloque.

## Videos

Cualquier elemento con `data-video="ig:ID_DEL_REEL"` o `data-video="yt:ID_DE_YOUTUBE"` abre el reproductor en la misma página. Ctrl/Cmd + clic abre el video en una pestaña nueva.

- **YouTube** se reproduce siempre dentro de la página (ir a YouTube es opcional, con el link de abajo del video). Ojo: si abrís `index.html` con doble clic (file://), YouTube bloquea la reproducción (Error 153) y el reproductor muestra un aviso; con **Live Server** o ya online se ve normal. Para que se vea sí o sí en cualquier caso, subí el MP4 y completá `src` del video de YouTube en `js/models/videos.model.js`.
- **Instagram** no deja reproducir todos los reels en otras webs (sobre todo los que tienen música con derechos, y en celular suele abrir la app).
  Para que se vean SIEMPRE en la página: subí el MP4 original a `assets/video/` y completá `src` del reel en `js/models/videos.model.js`
  (MP4 H.264, vertical, menos de 15 MB). Si un reel tiene `src`, se usa el video propio; si no, se intenta con Instagram.

## Hero en celular

En celular se usa `assets/img/eze/eze-hero-mobile.webp` (recorte con la cara arriba) mediante `<picture>` en el hero (`#hero-img`).
En compu se usa `assets/img/eze/eze-hero.webp`. Si cambian la foto, reemplazá los `.jpg` y generá sus `.webp` y `-600.webp` con el mismo nombre.

## Pendiente
- ID de Google Analytics 4 y alta en Search Console (ver *Después de publicar*).

- Portadas en alta resolución (reemplazar los archivos en `assets/img/covers/` con el mismo nombre).
