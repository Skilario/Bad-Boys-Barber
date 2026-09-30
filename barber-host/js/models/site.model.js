/**
 * SiteModel — datos generales del sitio.
 * Si cambia un link, un número o el nombre de una sección, se cambia acá.
 */
window.BH = window.BH || { models: {}, views: {}, controllers: {} };

BH.models.Site = {
  person: 'Ezequiel Farias',
  role: 'Barber Host',
  titleSuffix: 'Ezequiel Farias · Barber Host',
  /** Título de Inicio (el que ve Google). Mantenerlo igual al <title> del index.html. */
  homeTitle: 'Ezequiel Farias · Barber Host | Conductor de eventos de barbería',


  links: {
    badboys: '../index.html',   // vuelve a la web de Bad Boys (esta página vive en /barber-host/)
    instagram: 'https://www.instagram.com/ezequielfarias15/',   // @ezequielfarias15
    youtube: 'https://www.youtube.com/@ezequielfariasok'       // @ezequielfariasok
  },

  /** Secciones (vistas) del sitio. El orden define el menú, la barra inferior y el paginador. */
  sections: [
    { id: 'inicio',      label: 'Inicio',      icon: 'home'   },
    { id: 'servicios',   label: 'Servicios',   icon: 'mic'    },
    { id: 'experiencia', label: 'Experiencia', icon: 'scissors' },
    { id: 'eventos',     label: 'Eventos',     icon: 'play'   },
    { id: 'contratar',   label: 'Contratar',   icon: 'chat'   }
  ],

  /** Íconos de línea (SVG paths) usados en la navegación. */
  icons: {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>',
    scissors: '<circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8 16L19 4M16 16L5 4"/>',
    play: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9l5 3-5 3z"/>',
    pole: '<rect x="8" y="3" width="8" height="18" rx="2"/><path d="M8 7l8 4M8 12l8 4M8 17l8 3M10 3V1.5h4V3M10 21v1.5h4V21"/>',
    chat: '<path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3 21l1.4-5.4A8.5 8.5 0 1 1 21 12z"/><path d="M9 11h6M9 14h4"/>'
  },

  sectionById(id) {
    return this.sections.find(s => s.id === id) || null;
  }
};
