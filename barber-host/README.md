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
│   ├── css/                    carpeta estilos
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
│   │   ├── brand/              logo-badboys.webp, og-barber-host.jpg (imagen al compartir), barberhost*.webp, icons
│   │   ├── eze/                fotos de Ezequiel: eze-hero, eze-hero-mobile (recorte para celu), eze-en-vivo, eze-silla-escenario, eze-trofeos 
│   │   ├── fondos/             fondo-contrato
│   │   ├── eventos/            flyers de eventos 
│   │   └── covers/             portadas de reels y YouTube (.webp; .jpg de original)
│   └── video/                  MP4 propios de los reels 
└── js/
    ├── models/                 DATOS
    │   ├── site.model.js       secciones del menú, links (Bad Boys, redes), íconos
    │   ├── videos.model.js     reels de Instagram y videos de YouTube
    │   ├── contact.model.js    número de WhatsApp y mensaje que aparece escrito
    │   └── analytics.model.js  ID de Google Analytics 4 
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


