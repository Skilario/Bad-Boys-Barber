/**
 * AnalyticsController — carga GA4 (si hay ID) y registra lo que importa para el negocio:
 * visitas por sección y consultas por WhatsApp. Ver js/models/analytics.model.js.
 * El script de Google se carga después de que la página terminó de cargar,
 * así no le resta velocidad.
 */
window.BH = window.BH || { models: {}, views: {}, controllers: {} };

BH.controllers.Analytics = {
  ready: false,
  queue: [],
  lastView: null,

  init() {
    const M = BH.models.Analytics;
    if (!M.enabled()) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    // las vistas se mandan a mano (una por sección), por eso send_page_view: false
    gtag('config', M.measurementId, { send_page_view: false });
    this.ready = true;

    const load = () => {
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + M.measurementId;
      document.head.appendChild(s);
    };
    if (document.readyState === 'complete') load();
    else addEventListener('load', load, { once: true });

    this.queue.forEach(([name, params]) => gtag('event', name, params));
    this.queue = [];

    this.bindClicks();
  },

  /** Manda un evento (si GA4 está activo). */
  track(name, params = {}) {
    if (!BH.models.Analytics.enabled()) return;
    if (!this.ready) { this.queue.push([name, params]); return; }
    gtag('event', name, params);
  },

  /** Una "página vista" por cada sección que se abre. */
  pageView(view) {
    // no contar dos veces la misma sección (links internos, atrás/adelante)
    if (this.lastView === view.id) return;
    this.lastView = view.id;
    const section = BH.models.Site.sectionById(view.id);
    this.track('page_view', {
      page_title: document.title,
      page_location: location.origin + location.pathname + '#' + view.id,
      seccion: section ? section.label : view.id
    });
  },

  /** Dónde estaba el botón: flotante, barra inferior, o la sección/bloque que lo contiene. */
  placeOf(el) {
    if (el.closest('.wa-float')) return 'boton_flotante';
    if (el.closest('.bottombar')) return 'barra_inferior';
    if (el.closest('.nav')) return 'menu';
    if (el.closest('footer')) return 'footer';
    if (el.closest('.final')) return 'cierre';
    const block = el.closest('section[id], header[id], .view');
    return block ? block.id : 'otro';
  },

  bindClicks() {
    document.addEventListener('click', e => {
      const el = e.target.closest('a, [data-video]');
      if (!el) return;
      const href = el.getAttribute('href') || '';

      if (el.dataset.video) {
        const v = BH.models.Videos.find(el.dataset.video);
        this.track('video_open', { video_id: v.id, video_title: v.title, plataforma: v.type === 'yt' ? 'youtube' : 'instagram', ubicacion: this.placeOf(el) });
        return;
      }
      if (href.includes('wa.me/')) {
        this.track('whatsapp_click', { ubicacion: this.placeOf(el) });
      } else if (el.hasAttribute('data-badboys') || href.includes('badboysbarber.com.ar')) {
        this.track('click_badboys', { ubicacion: this.placeOf(el) });
      } else if (/instagram\.com|youtube\.com|youtu\.be/.test(href)) {
        this.track('social_click', { red: href.includes('instagram') ? 'instagram' : 'youtube', ubicacion: this.placeOf(el) });
      }
    }, { capture: true });
  }
};
