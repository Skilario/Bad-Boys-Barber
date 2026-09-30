# Bad Boys Barber — Cruce Castelar, Moreno

Sitio de la barbería (badboysbarber.com.ar) + la página de Barber Host (Ezequiel Farias) en `/barber-host/`.
HTML + CSS + JavaScript puro, sin build. Se publica en Netlify tal cual está la carpeta.

## Estructura

```
/
├── index.html                 Home de Bad Boys
├── 404.html                   Página de error
├── sitemap.xml · robots.txt   SEO (incluyen Barber Host)
├── netlify.toml               Headers y caché de Netlify
├── google54993acc5275bd79.html  Verificación de Search Console (no tocar)
├── assets/
│   ├── css/                   style.css (estilos) · fonts.css (@font-face)
│   ├── js/                    script.js (menú, galería, turnos…) · analytics.js
│   ├── fonts/                 Anton, Manrope, DM Mono (woff2)
│   └── img/
│       ├── brand/             logo, favicon, íconos, imagen al compartir (og), mundo.webp
│       ├── hero/              fondo del inicio (compu y celu)
│       ├── nosotros/          foto de la sección "Quiénes somos"
│       ├── viajes/            fotos del "Cruce pal mundo"
│       ├── cortes/            diseños y cortes
│       ├── academia/          academia
│       ├── insumos/           productos del catálogo
│       └── sucursales/        fotos del local
├── Archivos/                  PDF del catálogo de insumos
└── barber-host/               Página de Barber Host (ver barber-host/README.md)
```

## Reglas para no romper nada

- **Nombres en minúscula y con guiones** (`corte-1520.webp`, no `Corte 1520.WEBP`). Netlify distingue mayúsculas.
- **Fotos siempre en `.webp`** (squoosh.app, calidad 75–80). Excepciones: `og-badboys.jpg` y los íconos `.png`.
- Una foto nueva va en la carpeta de su tema dentro de `assets/img/`; no sueltas en la raíz.
- Cada carpeta de imágenes es de un solo tema: si dudás dónde va, creá una carpeta nueva en vez de mezclar.
- Al mover o renombrar algo, buscá el nombre viejo en `index.html`, `404.html`, `assets/css/style.css`, `sitemap.xml` y `netlify.toml`.

## Cambios comunes

| Qué cambiar | Dónde |
|---|---|
| Textos, precios, links de la home | `index.html` |
| Colores, tamaños, botones | `assets/css/style.css` |
| Menú, galería, formulario de turnos | `assets/js/script.js` |
| Imagen al compartir en WhatsApp | `assets/img/brand/og-badboys.jpg` (1200×630) |
| Agregar una página al buscador | `sitemap.xml` |

## Cómo verlo

Abrir `index.html` con doble clic funciona. Mejor con VS Code + **Live Server**.
