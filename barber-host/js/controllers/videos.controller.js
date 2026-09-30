/**
 * VideosController — dibuja los videos desde el modelo y los abre en el reproductor.
 * Cualquier elemento con data-video="yt:ID" o data-video="ig:ID" abre el modal.
 */
window.BH = window.BH || { models: {}, views: {}, controllers: {} };

BH.controllers.Videos = {
  init() {
    const M = BH.models.Videos, V = BH.views.Videos;

    const yt = document.getElementById('yt-featured');
    if (yt && M.youtube[0]) V.renderYouTube(yt, M.youtube[0], M.externalUrl({ type: 'yt', id: M.youtube[0].id }));

    const grid = document.getElementById('reels');
    const more = document.getElementById('more-reels');
    if (grid) {
      V.renderReels(grid, M.reels, M.visibleReels, r => M.externalUrl({ type: 'ig', id: r.id }));
      BH.views.Effects.bindTilt(grid);
    }
    if (more) {
      const total = M.reels.length;
      if (total <= M.visibleReels) more.parentElement.hidden = true;
      let expanded = false;
      V.setExpanded(grid, more, false, total);
      more.addEventListener('click', () => {
        expanded = !expanded;
        V.setExpanded(grid, more, expanded, total);
        if (!expanded) grid.scrollIntoView({ block: 'center' });
      });
    }

    BH.views.Modal.mount(() => BH.views.Modal.close());

    document.addEventListener('click', e => {
      const el = e.target.closest('[data-video]');
      if (!el) return;
      // Ctrl/Cmd + clic abre en pestaña nueva como un link normal
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      const video = M.find(el.dataset.video);
      // Siempre se abre acá, en la página. Ir a YouTube/Instagram es opcional (link abajo del video).
      BH.views.Modal.open({
        type: video.type,
        title: video.title,
        embedUrl: M.embedUrl(video),
        externalUrl: M.externalUrl(video),
        src: M.isSelfHosted(video) ? video.src : '',
        poster: video.cover,
        blocked: !M.isSelfHosted(video) && !M.canEmbed(video)
      });
    });
  }
};
