/**
 * NavView — dibuja el menú superior, la barra inferior (celular) y marca la sección activa.
 */
window.BH = window.BH || { models: {}, views: {}, controllers: {} };

BH.views.Nav = {
  render(sections, icons) {
    const menu = document.getElementById('menu');
    const bottom = document.getElementById('bottombar');
    const items = sections.map(s =>
      `<li><a href="#${s.id}" data-view="${s.id}">${s.label}</a></li>`
    ).join('');
    menu.insertAdjacentHTML('afterbegin', items);

    // "Contratar" va resaltado en amarillo (es la acción principal)
    bottom.innerHTML = sections.map(s =>
      `<a href="#${s.id}" data-view="${s.id}"${s.id === 'contratar' ? ' class="tab-cta"' : ''}>` +
        `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[s.icon]}</svg><span>${s.label}</span>` +
      `</a>`
    ).join('');
  },

  /**
   * Ítem "Bad Boys": link directo de vuelta a la web de la barbería (misma pestaña).
   * En compu va al final del menú. En celular está en el header (arriba a la derecha),
   * así la barra inferior queda con las 5 secciones y respira mejor.
   */
  renderBadBoys(url, icon) {
    document.getElementById('menu').insertAdjacentHTML('beforeend', `
      <li class="bb-item"><a class="bb-link" href="${url}" data-badboys>Bad Boys <span aria-hidden="true">↩</span></a></li>`);
  },

  /** Aplica los links externos del modelo (Bad Boys, Instagram, YouTube). */
  setLinks(links) {
    document.querySelectorAll('[data-social]').forEach(a => {
      const url = links[a.dataset.social];
      if (url) a.href = url;
    });
  },

  setActive(viewId) {
    document.querySelectorAll('[data-view]').forEach(a => {
      a.setAttribute('aria-current', a.dataset.view === viewId ? 'page' : 'false');
    });
  }
};
