/**
 * VideosView — dibuja la tarjeta de YouTube y la grilla de reels con sus portadas.
 */
window.BH = window.BH || { models: {}, views: {}, controllers: {} };

BH.views.Videos = {
  playIcon: '<svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg>',
  igLogo: '<span class="logo-ig"><svg><use href="#ig"/></svg></span>',

  renderYouTube(container, video, url) {
    container.innerHTML = `
      <a class="yt rv" href="${url}" target="_blank" rel="noopener" data-video="yt:${video.id}">
        <div class="screen">
          <img src="${video.cover}" width="420" height="224" alt="Portada: ${video.title}" loading="lazy" decoding="async">
          <span class="chan"><span class="logo-yt"><svg style="width:26px;height:18px;display:block" viewBox="0 0 68 48"><use href="#yt"/></svg></span>${video.channel}</span>
          <svg class="ytbtn" viewBox="0 0 68 48"><use href="#yt"/></svg>
        </div>
        <div class="info">
          <span class="src"><svg viewBox="0 0 68 48"><use href="#yt"/></svg>YouTube</span>
          <h4>${video.title}</h4>
          <span class="by">${video.channel}</span>
          <span class="go">Ver video ▶</span>
        </div>
      </a>`;
  },

  renderReels(container, reels, visible, urlFor) {
    const pad = n => String(n).padStart(2, '0');
    container.innerHTML = reels.map((r, i) => {
      const ig = r.igLink !== false;   // igLink: false → solo el video, sin Instagram
      return `
      <a class="reel${i >= visible ? ' extra' : ''}" href="${ig ? urlFor(r) : r.src}" target="_blank" rel="noopener" data-video="ig:${r.id}" aria-label="Ver reel: ${r.title}">
        <img class="cover" src="${r.cover}" width="280" height="340" alt="${r.alt || r.title}" loading="lazy" decoding="async">
        <span class="shade"></span>
        <span class="num">${pad(i + 1)}</span>
        ${ig ? '<span class="logo-ig badge-ig"><svg><use href="#ig"/></svg></span>' : ''}
        <span class="play">${this.playIcon}</span>
        <span class="foot">
          <span class="meta"><b>${r.title}</b><span class="plat">${ig ? this.igLogo + 'Instagram' : 'Video'}</span></span>
          <span class="go">Ver ▶</span>
        </span>
      </a>`;
    }).join('');
  },

  setExpanded(container, button, expanded, total) {
    container.classList.toggle('all', expanded);
    button.setAttribute('aria-expanded', String(expanded));
    button.innerHTML = expanded
      ? 'Ver menos <span class="arr">↑</span>'
      : `Ver todos los reels (${total}) <span class="arr">↓</span>`;
  }
};
