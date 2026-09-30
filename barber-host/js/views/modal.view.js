/**
 * ModalView — reproductor de videos encima de la página (YouTube e Instagram).
 */
window.BH = window.BH || { models: {}, views: {}, controllers: {} };

BH.views.Modal = {
  el: null,
  lastFocus: null,

  mount(onClose) {
    const el = document.createElement('div');
    el.className = 'modal';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Reproductor de video');
    el.innerHTML = `
      <div class="modal__box">
        <button class="modal__close" type="button" aria-label="Cerrar video">×</button>
        <div class="modal__frame"></div>
        <div class="modal__bar">
          <span class="modal__title"></span>
          <a class="modal__ext" href="https://www.instagram.com/" target="_blank" rel="noopener"></a>
        </div>
      </div>`;
    document.body.appendChild(el);
    this.el = el;

    el.addEventListener('click', e => { if (e.target === el) onClose(); });
    el.querySelector('.modal__close').addEventListener('click', onClose);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && this.isOpen()) onClose(); });
  },

  isOpen() { return this.el && this.el.classList.contains('open'); },

  open({ type, title, embedUrl, externalUrl, src, poster, blocked }) {
    this.lastFocus = document.activeElement;
    const box = this.el.querySelector('.modal__box');
    box.classList.toggle('is-vertical', type === 'ig');
    let html;
    if (src) {
      // video propio: se reproduce siempre acá
      html = `<video src="${src}" poster="${poster || ''}" controls autoplay playsinline preload="metadata"></video>`;
    } else if (blocked) {
      // index.html abierto con doble clic (file://): YouTube no reproduce sin dirección web (Error 153)
      html = `<div class="modal__note" style="background-image:url('${poster || ''}')">
          <p><b>El video se reproduce acá cuando la página está online.</b>
          Abriendo el archivo con doble clic, YouTube no lo permite. Probalo con Live Server o ya subido.</p>
        </div>`;
    } else {
      html = `<iframe src="${embedUrl}" title="${title}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    }
    this.el.querySelector('.modal__frame').innerHTML = html;
    this.el.querySelector('.modal__title').textContent = title;
    const ext = this.el.querySelector('.modal__ext');
    ext.hidden = !externalUrl;   // sin link externo (ej. video propio sin Instagram)
    ext.href = externalUrl || '#';
    ext.textContent = type === 'yt' ? 'Abrir en YouTube ↗' : 'Abrir en Instagram ↗';
    this.el.classList.add('open');
    document.body.classList.add('modal-open');
    this.el.querySelector('.modal__close').focus();
  },

  close() {
    if (!this.el) return;
    this.el.classList.remove('open');
    document.body.classList.remove('modal-open');
    // se vacía el reproductor para cortar el audio
    setTimeout(() => { if (!this.isOpen()) this.el.querySelector('.modal__frame').innerHTML = ''; }, 350);
    if (this.lastFocus) this.lastFocus.focus();
  }
};
