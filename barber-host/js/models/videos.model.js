/**
 * VideosModel — reels de Instagram y videos de YouTube.
 * Para sumar un video: agregar un objeto a la lista y su portada en assets/img/covers/.
 *
 * IMPORTANTE (Instagram): Instagram no deja reproducir todos los reels dentro de otra web.
 * Los que tienen música con derechos, o según el celular, mandan a la app de Instagram.
 * Para que SIEMPRE se reproduzcan en la página, subí el video original a assets/video/
 * y completá "src" en ese reel (ej: src: 'assets/video/reel-el-barber-host.mp4').
 * Si un reel tiene "src", se usa el video propio; si no, se intenta con Instagram.
 * igLink: false → no muestra nada de Instagram (ni logo ni "Abrir en Instagram"): solo el video.
 */
window.BH = window.BH || { models: {}, views: {}, controllers: {} };

BH.models.Videos = {
  /** Cantidad de reels visibles antes de "Ver todos". */
  visibleReels: 3,

  youtube: [
    {
      id: 'XPkty7YQVmQ',
      title: 'Entramos a la fábrica de Opción con Facu Navajas',
      channel: 'Ezequiel Farias',
      src: '',   // opcional: MP4 propio (assets/video/…) para que se vea sí o sí, incluso sin internet a YouTube
      cover: 'assets/img/covers/yt-fabrica-opcion.webp'
    }
  ],

  reels: [
    { id: 'Dd2aSxax1hA', title: 'El Barber Host',          src: 'assets/video/REEL1.mp4', cover: 'assets/img/covers/reel-el-barber-host.webp',          alt: 'Portada: El Barber Host' },
    { id: 'DdU86JtR4Dw', title: 'Barber vs Barber',        src: 'assets/video/REEL2.mp4', cover: 'assets/img/covers/reel-barber-vs-barber.webp',        alt: 'Portada: Eze conduciendo Barber vs Barber' },
    { id: 'DcCj8ehxcgs', title: 'Un día siendo el dueño',  src: '', cover: 'assets/img/covers/reel-un-dia-siendo-el-dueno.webp',  alt: 'Portada: Eze con gorra roja' },
    { id: 'DcTnmP2RE_p', title: 'Con Facu Navajas',        src: '', cover: 'assets/img/covers/reel-con-facu-navajas.webp',        alt: 'Portada: Eze entrevistando a Facu Navajas en Bad Boys' },
    { id: 'DXekfkyER9F', title: 'Nos visitó Facu Navajas', src: '', cover: 'assets/img/covers/reel-nos-visito-facu-navajas.webp', alt: 'Portada: selfie de Eze con Facu Navajas' },
    { id: 'DcXJl1axS0Y', title: 'Siempre tuve algo',       src: 'assets/video/siempretuvealgo.mp4', igLink: false, cover: 'assets/img/covers/reel-mi-historia.webp',             alt: 'Portada: Eze en Bad Boys' }
  ],

  /** Busca un video a partir de una clave "yt:ID" o "ig:ID". */
  find(key) {
    const [type, id] = String(key).split(':');
    if (type === 'yt') {
      const v = this.youtube.find(x => x.id === id) || { id, title: 'Video' };
      return Object.assign({ type: 'yt' }, v);
    }
    const v = this.reels.find(x => x.id === id) || { id, title: 'Reel' };
    return Object.assign({ type: 'ig' }, v);
  },

  /** Link a YouTube/Instagram. Vacío si el video tiene igLink: false (solo MP4 propio). */
  externalUrl(video) {
    if (video.igLink === false) return '';
    return video.type === 'yt'
      ? `https://youtu.be/${video.id}`
      : `https://www.instagram.com/reel/${video.id}/`;
  },

  /** true si el reel tiene su video propio subido al sitio. */
  isSelfHosted(video) { return !!(video && video.src); },

  embedUrl(video) {
    if (video.type !== 'yt') return `https://www.instagram.com/reel/${video.id}/embed/`;
    // YouTube necesita saber desde qué web se reproduce (si no, da "Error 153")
    const origin = /^https?:$/.test(location.protocol) ? `&origin=${encodeURIComponent(location.origin)}` : '';
    return `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1${origin}`;
  },

  /**
   * YouTube no deja reproducir dentro de la página cuando se abre el index.html
   * con doble clic (file://): no hay dirección web y tira "Error 153".
   * En ese caso el video se abre directo en YouTube. Online funciona adentro.
   */
  canEmbed(video) {
    return video.type !== 'yt' || /^https?:$/.test(location.protocol);
  }
};
