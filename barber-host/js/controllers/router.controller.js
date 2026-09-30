/**
 * RouterController — muestra una sección por vez según el #hash de la URL.
 * Links como #contacto o #historia abren la sección que los contiene y bajan hasta ahí.
 */
window.BH = window.BH || { models: {}, views: {}, controllers: {} };

BH.controllers.Router = {
  views: [],
  current: null,
  listeners: [],

  init() {
    this.views = [...document.querySelectorAll('.view')];

    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      this.go(id);
      try { history.pushState(null, '', '#' + id); } catch (err) { /* sandbox */ }
    });

    addEventListener('popstate', () => this.go(location.hash.slice(1) || 'inicio'));
    addEventListener('hashchange', () => this.go(location.hash.slice(1) || 'inicio'));

    this.go((location.hash || '#inicio').slice(1));
  },

  /** Registra una función que se ejecuta al cambiar de sección. */
  onChange(fn) { this.listeners.push(fn); },

  viewOf(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    return el.classList.contains('view') ? el : el.closest('.view');
  },

  go(id) {
    const view = this.viewOf(id) || this.views[0];
    const target = document.getElementById(id);

    if (this.current !== view) {
      const first = !this.current;
      this.views.forEach(v => {
        v.classList.toggle('active', v === view);
        // primera carga: sin animación de entrada (mejora el LCP)
        v.classList.toggle('no-anim', first && v === view);
      });
      this.current = view;
    }

    BH.views.Nav.setActive(view.id);

    const nav = document.querySelector('.nav');
    if (target && target !== view) {
      const y = target.getBoundingClientRect().top + scrollY - (nav.offsetHeight + 8);
      scrollTo({ top: y, behavior: 'instant' });
    } else {
      scrollTo({ top: 0, behavior: 'instant' });
    }

    const section = BH.models.Site.sectionById(view.id);
    const Site = BH.models.Site;
    document.title = (view.id === 'inicio' || !section) ? Site.homeTitle : section.label + ' · ' + Site.titleSuffix;

    this.listeners.forEach(fn => fn(view));
  }
};
