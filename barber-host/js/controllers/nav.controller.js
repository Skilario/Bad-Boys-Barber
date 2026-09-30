/**
 * NavController — menú superior, barra inferior (se esconde al bajar) e ítem "Bad Boys"
 * (link directo de vuelta a la web de la barbería).
 */
window.BH = window.BH || { models: {}, views: {}, controllers: {} };

BH.controllers.Nav = {
  init() {
    const M = BH.models.Site, V = BH.views.Nav;

    V.render(M.sections, M.icons);
    V.renderBadBoys(M.links.badboys, M.icons.pole);
    V.setLinks(M.links);
    this.autoHideBar();
  },

  /**
   * Barra inferior (celular): se esconde al bajar y vuelve al subir.
   * Pone la clase "bar-hidden" en <body>; los botones flotantes bajan con ella.
   */
  autoHideBar() {
    let last = scrollY, ticking = false;
    const update = () => {
      const y = scrollY, dy = y - last;
      if (y < 80) document.body.classList.remove('bar-hidden');          // arriba de todo: siempre visible
      else if (dy > 6) document.body.classList.add('bar-hidden');        // bajando
      else if (dy < -6) document.body.classList.remove('bar-hidden');    // subiendo
      if (Math.abs(dy) > 6 || y < 80) last = y;
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    // al cambiar de sección vuelve a mostrarse
    BH.controllers.Router.onChange(() => { document.body.classList.remove('bar-hidden'); last = 0; });
  }
};
