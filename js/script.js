/* ============================================================
   BARBER BAD BOYS — js/script.js
   Versión optimizada: carruseles manuales con flechas y puntos,
   soporte táctil, reveal en scroll, lightbox de galería.
   ============================================================ */

'use strict';

/* ============================================================
   NAVBAR — agrega clase al hacer scroll
   ============================================================ */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ============================================================
   HAMBURGER — abre/cierra el menú móvil
   ============================================================ */
const hamburger  = document.querySelector('.hamburger');
const menuMovil  = document.querySelector('.mobile-menu');

if (hamburger && menuMovil) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    menuMovil.classList.toggle('open');
    document.body.style.overflow = menuMovil.classList.contains('open') ? 'hidden' : '';
  });

  // Cierra el menú al hacer clic en un enlace
  menuMovil.querySelectorAll('a').forEach(enlace => {
    enlace.addEventListener('click', () => {
      hamburger.classList.remove('open');
      menuMovil.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   REVEAL AL SCROLL — anima elementos con clase .reveal
   ============================================================ */
const elementosReveal = document.querySelectorAll('.reveal');

if (elementosReveal.length) {
  const observador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${entry.target.dataset.delay || 0}ms`;
        entry.target.classList.add('visible');
        observador.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elementosReveal.forEach((el, i) => {
    // Si no tiene delay definido, calculamos uno escalonado
    if (!el.dataset.delay) {
      el.dataset.delay = (i % 4) * 80;
    }
    observador.observe(el);
  });
}

/* ============================================================
   ENLACE ACTIVO EN NAVBAR al hacer scroll
   ============================================================ */
const secciones    = document.querySelectorAll('section[id]');
const enlacesNav   = document.querySelectorAll('.nav-links a');

if (secciones.length && enlacesNav.length) {
  window.addEventListener('scroll', () => {
    let seccionActual = '';
    secciones.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 130) {
        seccionActual = sec.id;
      }
    });
    enlacesNav.forEach(enlace => {
      enlace.classList.remove('active');
      if (enlace.getAttribute('href') === `#${seccionActual}`) {
        enlace.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ============================================================
   SMOOTH SCROLL — suaviza los anclajes internos
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(enlace => {
  enlace.addEventListener('click', (e) => {
    const destino = document.querySelector(enlace.getAttribute('href'));
    if (destino) {
      e.preventDefault();
      const alturaNavbar = 68;
      window.scrollTo({
        top: destino.offsetTop - alturaNavbar,
        behavior: 'smooth'
      });
    }
  });
});

/* ============================================================
   CARRUSEL GENÉRICO
   Maneja la navegación manual (flechas + puntos + swipe táctil)
   para cualquier carrusel con la estructura:
     .carrusel-contenedor
       .carrusel-flecha.carrusel-prev
       .carrusel-viewport > .carrusel-track > [ítems]
       .carrusel-flecha.carrusel-next
       .carrusel-puntos
   ============================================================ */

/**
 * @param {string}  selectorContenedor  Selector CSS del contenedor principal
 * @param {number}  porVistaDesktop     Cantidad de ítems visibles en desktop (≥900px)
 */
function crearCarrusel(selectorContenedor, porVistaDesktop = 3) {
  const contenedor = document.querySelector(selectorContenedor);
  if (!contenedor) return;

  const viewport   = contenedor.querySelector('.carrusel-viewport');
  const track      = contenedor.querySelector('.carrusel-track');
  const items      = Array.from(track.children);
  const btnPrev    = contenedor.querySelector('.carrusel-prev');
  const btnNext    = contenedor.querySelector('.carrusel-next');
  const puntosWrap = contenedor.querySelector('.carrusel-puntos');

  // Debe coincidir con --carrusel-gap en CSS (20px)
  const GAP = 20;

  let indice = 0; // Índice del primer ítem visible

  /* --- Helpers --- */

  /** Cuántos ítems se muestran según el ancho de pantalla */
  function porVista() {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 900) return 2;
    return porVistaDesktop;
  }

  /** Cuántas "páginas" tiene el carrusel */
  function totalPaginas() {
    return Math.ceil(items.length / porVista());
  }

  /** Índice máximo permitido (para no quedar en blanco al final) */
  function indiceMax() {
    return Math.max(0, items.length - porVista());
  }

  /** Ancho de cada ítem según el viewport visible */
  function anchoItem() {
    const anchoViewport = viewport.offsetWidth;
    const n = porVista();
    return (anchoViewport - GAP * (n - 1)) / n;
  }

  /* --- Renderizado --- */

  /** Aplica el desplazamiento al track */
  function deslizar() {
    const offset = indice * (anchoItem() + GAP);
    track.style.transform = `translateX(-${offset}px)`;
  }

  /** Actualiza estado visual de flechas y puntos */
  function actualizarControles() {
    // Flechas
    if (btnPrev) btnPrev.disabled = indice === 0;
    if (btnNext) btnNext.disabled = indice >= indiceMax();

    // Puntos: marcamos el correspondiente a la página actual
    if (puntosWrap) {
      const paginaActual = Math.floor(indice / porVista());
      puntosWrap.querySelectorAll('.carrusel-punto').forEach((punto, i) => {
        punto.classList.toggle('activo', i === paginaActual);
      });
    }
  }

  /** Recalcula tamaños y actualiza todo (se llama en init y en resize) */
  function actualizar() {
    const ancho = anchoItem();

    // Asigna el ancho calculado a cada ítem
    items.forEach(item => {
      item.style.width    = `${ancho}px`;
      item.style.flexShrink = '0';
    });

    // Ajusta el gap del track  JS (refuerza lo del CSS)
    track.style.gap = `${GAP}px`;

    // Clampea el índice por si cambió la cantidad de ítems por vista
    indice = Math.min(indice, indiceMax());

    crearPuntos(); // Recrea puntos porque puede cambiar el total de páginas
    deslizar();
    actualizarControles();
  }

  /** Crea o recrea los botones de puntos de navegación */
  function crearPuntos() {
    if (!puntosWrap) return;
    puntosWrap.innerHTML = '';

    const paginas = totalPaginas();

    for (let i = 0; i < paginas; i++) {
      const btn = document.createElement('button');
      btn.className = 'carrusel-punto';
      btn.setAttribute('aria-label', `Ir a la página ${i + 1} de ${paginas}`);

      btn.addEventListener('click', () => {
        // Cada punto lleva al primer ítem de esa "página"
        indice = Math.min(i * porVista(), indiceMax());
        deslizar();
        actualizarControles();
      });

      puntosWrap.appendChild(btn);
    }
  }

  /* --- Eventos de flechas --- */

  btnPrev?.addEventListener('click', () => {
    if (indice > 0) {
      indice--;
      deslizar();
      actualizarControles();
    }
  });

  btnNext?.addEventListener('click', () => {
    if (indice < indiceMax()) {
      indice++;
      deslizar();
      actualizarControles();
    }
  });

  /* --- Soporte táctil (swipe) --- */
  let inicioToque = 0;

  viewport.addEventListener('touchstart', e => {
    inicioToque = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', e => {
    const diferencia = inicioToque - e.changedTouches[0].clientX;
    const umbral = 40; // píxeles mínimos para considerar swipe

    if (Math.abs(diferencia) >= umbral) {
      if (diferencia > 0 && indice < indiceMax()) {
        // Swipe hacia la izquierda → siguiente
        indice++;
      } else if (diferencia < 0 && indice > 0) {
        // Swipe hacia la derecha → anterior
        indice--;
      }
      deslizar();
      actualizarControles();
    }
  }, { passive: true });

  /* --- Resize: reinicia al inicio y recalcula --- */
  let timerResize;
  window.addEventListener('resize', () => {
    clearTimeout(timerResize);
    timerResize = setTimeout(() => {
      indice = 0;
      actualizar();
    }, 200);
  });

  /* --- Inicialización --- */
  actualizar();
}

/* ============================================================
   INICIALIZAR CARRUSELES
   Viajes: 3 ítems en desktop | Galería: 3 ítems en desktop
   ============================================================ */
crearCarrusel('#carrusel-viajes',  3);
crearCarrusel('#carrusel-galeria', 3);

/* ============================================================
   LIGHTBOX DE GALERÍA — abre la imagen ampliada al hacer clic
   ============================================================ */
const itemsGaleria = document.querySelectorAll('#carrusel-galeria .galeria-item');

if (itemsGaleria.length) {
  // Crear el lightbox en el DOM
  const lightbox    = document.createElement('div');
  lightbox.id       = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Imagen ampliada');
  lightbox.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.96);
    display: none; align-items: center; justify-content: center;
    cursor: zoom-out;
  `;

  const imgLightbox = document.createElement('img');
  imgLightbox.style.cssText = `
    max-width: 90vw; max-height: 90vh;
    border-radius: 10px;
    box-shadow: 0 0 60px rgba(255,187,0,0.15);
    object-fit: contain;
  `;

  const btnCerrar = document.createElement('button');
  btnCerrar.innerHTML = '&times;';
  btnCerrar.setAttribute('aria-label', 'Cerrar');
  btnCerrar.style.cssText = `
    position: absolute; top: 1.5rem; right: 2rem;
    background: none; border: none;
    font-size: 2.8rem; color: #fff; cursor: pointer;
    line-height: 1; opacity: 0.65; transition: opacity 0.2s;
  `;
  btnCerrar.addEventListener('mouseenter', () => btnCerrar.style.opacity = '1');
  btnCerrar.addEventListener('mouseleave', () => btnCerrar.style.opacity = '0.65');

  lightbox.appendChild(imgLightbox);
  lightbox.appendChild(btnCerrar);
  document.body.appendChild(lightbox);

  /** Abre el lightbox con la imagen dada */
  function abrirLightbox(src, alt) {
    imgLightbox.src = src;
    imgLightbox.alt = alt || '';
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  /** Cierra el lightbox */
  function cerrarLightbox() {
    lightbox.style.display = 'none';
    imgLightbox.src = '';
    document.body.style.overflow = '';
  }

  // Clic en cada ítem de galería
  itemsGaleria.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) abrirLightbox(img.src, img.alt);
    });
  });

  // Clic en el fondo o en el botón de cierre
  lightbox.addEventListener('click', e => { if (e.target === lightbox) cerrarLightbox(); });
  btnCerrar.addEventListener('click', cerrarLightbox);

  // Tecla Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarLightbox();
  });
}

/* ============================================================
   EFECTO NEON en tarjetas al mover el mouse
   ============================================================ */
document.querySelectorAll('.producto-card, .sucursal-card').forEach(tarjeta => {
  tarjeta.addEventListener('mousemove', e => {
    const rect = tarjeta.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    tarjeta.style.setProperty('--mx', `${x}%`);
    tarjeta.style.setProperty('--my', `${y}%`);
  });
});

/* ============================================================
   AÑO ACTUAL en el footer
   ============================================================ */
document.querySelectorAll('.current-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* ============================================================
   FORMULARIO DE CONTACTO (contacto.html)
   Validación de campos antes de enviar
   ============================================================ */
const formularioContacto = document.getElementById('contactForm');

if (formularioContacto) {
  const campos = {
    nombre:   { el: document.getElementById('nombre'),   min: 2,   msg: 'Ingresá tu nombre completo.' },
    email:    { el: document.getElementById('email'),    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Email inválido.' },
    telefono: { el: document.getElementById('telefono'), regex: /^[\d\s\+\-]{7,}$/, msg: 'Ingresá un teléfono válido.' },
    servicio: { el: document.getElementById('servicio'), required: true, msg: 'Elegí un servicio.' },
    mensaje:  { el: document.getElementById('mensaje'),  min: 10,  msg: 'El mensaje debe tener al menos 10 caracteres.' },
  };

  function validarCampo(clave) {
    const campo = campos[clave];
    if (!campo.el) return true;

    const valor = campo.el.value.trim();
    const grupo = campo.el.closest('.form-group');
    let esValido = true;

    if (campo.required && !valor)           esValido = false;
    if (campo.min && valor.length < campo.min) esValido = false;
    if (campo.regex && valor && !campo.regex.test(valor)) esValido = false;

    if (grupo) {
      grupo.classList.toggle('has-error', !esValido);
    }
    campo.el.classList.toggle('error', !esValido);
    return esValido;
  }

  // Validación en tiempo real al salir de cada campo
  Object.keys(campos).forEach(clave => {
    const el = campos[clave].el;
    if (el) {
      el.addEventListener('blur',  () => validarCampo(clave));
      el.addEventListener('input', () => { if (el.classList.contains('error')) validarCampo(clave); });
    }
  });

  formularioContacto.addEventListener('submit', e => {
    e.preventDefault();

    const todoValido = Object.keys(campos).map(validarCampo).every(Boolean);
    if (!todoValido) return;

    // Oculta el formulario y muestra mensaje de éxito
    formularioContacto.style.display = 'none';
    const exito = document.getElementById('formSuccess');
    if (exito) exito.style.display = 'block';

    // Redirige a WhatsApp con el mensaje pre-armado
    const nombre   = campos.nombre.el.value.trim();
    const servicio = campos.servicio.el.value;
    const mensaje  = campos.mensaje.el.value.trim();
    const textoWA  = encodeURIComponent(`Hola! Soy ${nombre}. Quiero consultar sobre: ${servicio}.\n${mensaje}`);

    setTimeout(() => {
      window.open(`https://wa.me/5491136596097?text=${textoWA}`, '_blank');
    }, 1500);
  });
}