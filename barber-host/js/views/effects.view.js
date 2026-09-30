/**
 * EffectsView — animaciones y efectos visuales (sin lógica de negocio).
 * Aparición al scrollear, barra de progreso, frases que cruzan, línea de tiempo,
 * flujos del "problema", contador, onda de energía, botones magnéticos, etc.
 */
window.BH = window.BH || { models: {}, views: {}, controllers: {} };

BH.views.Effects = {
  reduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
  currentView: 'inicio',

  init() {
    document.documentElement.classList.add('js');
    this.reveal();
    this.scrollLinked();
    this.flows();
    this.counter();
    this.wave();
    this.whatsappFloat();
    if (!this.reduce) this.pointerEffects();
  },

  /* Aparición suave de bloques .rv */
  reveal() {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .12 });
    document.querySelectorAll('.rv').forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      io.observe(el);
    });
    this._io = io;
  },

  /** Observa bloques agregados después (ej. videos renderizados). */
  observeNew(root) {
    root.querySelectorAll('.rv:not(.in)').forEach(el => this._io.observe(el));
  },

  revealVisible(root) {
    root.querySelectorAll('.rv').forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in');
    });
  },

  /* Barra de progreso, "Un evento puede tener…", línea de tiempo y lista "Conozco…".
     (Las frases que cruzan se animan solo con CSS para que el scroll no se trabe.) */
  scrollLinked() {
    const bigLines = [...document.querySelectorAll('.big3 span')];
    const tl = document.getElementById('tl');
    const know = [...document.querySelectorAll('#know li')];
    const prog = document.getElementById('progress');

    this.onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      prog.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
      // "Un evento puede tener…": cada línea se prende al llegar a ella
      bigLines.forEach(el => el.classList.toggle('lit', el.getBoundingClientRect().top < innerHeight * .78));
      if (tl) {
        const r = tl.getBoundingClientRect();
        tl.style.setProperty('--p', Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / r.height)));
        tl.querySelectorAll('li').forEach(li => li.classList.toggle('lit', li.getBoundingClientRect().top < innerHeight * .6));
      }
      know.forEach(li => li.classList.toggle('lit', li.getBoundingClientRect().top < innerHeight * .72));
    };
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { this.onScroll(); ticking = false; });
    }, { passive: true });
    addEventListener('resize', this.onScroll);
    this.onScroll();
  },

  /* Pasos del "problema que resuelve" que se prenden en cadena */
  flows() {
    const flows = [...document.querySelectorAll('.flow .steps')];
    if (!flows.length) return;
    if (this.reduce) { flows.forEach(f => f.querySelectorAll('span').forEach(s => s.classList.add('done'))); return; }
    let fi = 0, si = 0;
    setInterval(() => {
      const steps = flows[fi].querySelectorAll('span'), arrows = flows[fi].querySelectorAll('i');
      steps.forEach((s, k) => { s.classList.toggle('on', k === si); s.classList.toggle('done', k < si); });
      arrows.forEach((a, k) => a.classList.toggle('done', k < si));
      si++;
      if (si > steps.length) {
        steps.forEach(s => s.classList.remove('on', 'done'));
        arrows.forEach(a => a.classList.remove('done'));
        si = 0; fi = (fi + 1) % flows.length;
      }
    }, 650);
  },

  /* Contador "10+" */
  counter() {
    const el = document.querySelector('.decade b');
    if (!el || this.reduce) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = t => {
        const p = Math.min(1, (t - t0) / 1400);
        el.innerHTML = Math.round(10 * (1 - Math.pow(1 - p, 3))) + '<sup>+</sup>';
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: .6 });
    io.observe(el);
  },

  /* Onda de energía (sección "La ciencia detrás de la energía") */
  wave() {
    const wave = document.getElementById('wave');
    if (!wave) return;
    let ph = 0;
    const draw = () => {
      let d = 'M0 70';
      for (let x = 0; x <= 1200; x += 10) {
        const env = Math.sin(x / 1200 * Math.PI);
        const y = 70 + Math.sin(x * .03 + ph) * env * 38 * Math.sin(x * .004 + ph * .3) + Math.sin(x * .11 + ph * 2) * env * 6;
        d += ` L${x} ${y.toFixed(1)}`;
      }
      wave.setAttribute('d', d);
    };
    draw();
    if (this.reduce) return;
    // solo se anima mientras está en pantalla (ahorra batería y evita trabas)
    let running = false;
    const loop = () => { if (!running) return; ph += .04; draw(); requestAnimationFrame(loop); };
    new IntersectionObserver(([e]) => {
      const was = running; running = e.isIntersecting;
      if (running && !was) requestAnimationFrame(loop);
    }).observe(wave.closest('section') || wave);
  },

  /* Botones flotantes (WhatsApp e Instagram): se ven siempre, desde el inicio. */
  whatsappFloat() {
    this.checkWhatsapp = null;
  },

  /* Efectos con el mouse (solo escritorio) */
  pointerEffects() {
    const hero = document.querySelector('.hero');
    if (hero) hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    document.querySelectorAll('.pillar').forEach(c => c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--cx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--cy', (e.clientY - r.top) + 'px');
    }));
    this.bindMagnets(document);
  },

  bindMagnets(root) {
    if (this.reduce) return;
    root.querySelectorAll('.magnet').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--x', ((e.clientX - r.left - r.width / 2) * .22) + 'px');
        b.style.setProperty('--y', ((e.clientY - r.top - r.height / 2) * .32) + 'px');
      });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--x', '0px'); b.style.setProperty('--y', '0px'); });
    });
  },

  bindTilt(root) {
    if (this.reduce) return;
    root.querySelectorAll('.reel').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
      });
      c.addEventListener('pointerleave', () => { c.style.transform = ''; });
    });
  },

  /** Se llama cada vez que cambia la sección visible. */
  onViewChange(viewEl) {
    this.currentView = viewEl.id;
    setTimeout(() => {
      this.revealVisible(viewEl);
      this.onScroll();
      if (this.checkWhatsapp) this.checkWhatsapp();
    }, 60);
  }
};
