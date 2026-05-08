/* =============================================
   BARBER BAD BOYS — script.js
   ============================================= */

'use strict';

/* ---- Navbar scroll ---- */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ---- Hamburger / Mobile Menu ---- */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---- Reveal on scroll ---- */
const reveals = document.querySelectorAll('.reveal');

if (reveals.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children
        entry.target.style.transitionDelay = `${(entry.target.dataset.delay || 0)}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach((el, i) => {
    el.dataset.delay = el.dataset.delay || (i % 4) * 80;
    revealObserver.observe(el);
  });
}

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

if (sections.length && navLinks.length) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}` || link.getAttribute('href') === `./${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ---- galeria lightbox (simple) ---- */
const galeriaItems = document.querySelectorAll('.galeria-item');

if (galeriaItems.length) {
  // Create lightbox
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.style.cssText = `
    position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,0.95);
    display:none; align-items:center; justify-content:center;
    cursor:zoom-out;
  `;

  const lbImg = document.createElement('img');
  lbImg.style.cssText = `
    max-width:90vw; max-height:90vh;
    border-radius:8px;
    box-shadow: 0 0 60px rgba(255,187,0,0.2);
    object-fit:contain;
  `;

  const lbClose = document.createElement('button');
  lbClose.innerHTML = '&times;';
  lbClose.style.cssText = `
    position:absolute; top:1.5rem; right:2rem;
    background:none; border:none;
    font-size:2.5rem; color:#fff; cursor:pointer;
    line-height:1; opacity:0.7; transition:opacity 0.2s;
  `;
  lbClose.onmouseenter = () => lbClose.style.opacity = '1';
  lbClose.onmouseleave = () => lbClose.style.opacity = '0.7';

  lb.appendChild(lbImg);
  lb.appendChild(lbClose);
  document.body.appendChild(lb);

  const openLb = (src) => {
    lbImg.src = src;
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeLb = () => {
    lb.style.display = 'none';
    document.body.style.overflow = '';
  };

  galeriaItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLb(img.src);
    });
  });

  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  lbClose.addEventListener('click', closeLb);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLb();
  });
}

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 68; // navbar height
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  });
});

/* ---- Contact Form Validation (contacto.html) ---- */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const fields = {
    nombre:  { el: document.getElementById('nombre'),  min: 2,  msg: 'Ingresá tu nombre completo.' },
    email:   { el: document.getElementById('email'),   regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Email inválido.' },
    telefono:{ el: document.getElementById('telefono'),regex: /^[\d\s\+\-]{7,}$/, msg: 'Ingresá un teléfono válido.' },
    servicio:{ el: document.getElementById('servicio'),required: true, msg: 'Elegí un servicio.' },
    mensaje: { el: document.getElementById('mensaje'), min: 10, msg: 'El mensaje debe tener al menos 10 caracteres.' },
  };

  const validateField = (key) => {
    const f = fields[key];
    if (!f.el) return true;

    const val = f.el.value.trim();
    const group = f.el.closest('.form-group');
    let valid = true;

    if (f.required && !val) valid = false;
    if (f.min && val.length < f.min) valid = false;
    if (f.regex && val && !f.regex.test(val)) valid = false;

    if (!valid) {
      group.classList.add('has-error');
      f.el.classList.add('error');
    } else {
      group.classList.remove('has-error');
      f.el.classList.remove('error');
    }

    return valid;
  };

  // Live validation on blur
  Object.keys(fields).forEach(key => {
    const el = fields[key].el;
    if (el) {
      el.addEventListener('blur', () => validateField(key));
      el.addEventListener('input', () => {
        if (el.classList.contains('error')) validateField(key);
      });
    }
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    Object.keys(fields).forEach(key => {
      if (!validateField(key)) allValid = false;
    });

    if (!allValid) return;

    // Show success
    contactForm.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';

    // Optional: redirect to WhatsApp with pre-filled message
    const nombre  = fields.nombre.el.value.trim();
    const servicio = fields.servicio.el.value;
    const mensaje  = fields.mensaje.el.value.trim();

    const waText = encodeURIComponent(
      `Hola! Soy ${nombre}. Quiero consultar sobre: ${servicio}.\n${mensaje}`
    );

    setTimeout(() => {
      window.open(`https://wa.me/5491150000000?text=${waText}`, '_blank');
    }, 1500);
  });
}

/* ---- Neon hover glow on cards ---- */
document.querySelectorAll('.producto-card, .sucursal-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
});

/* ---- Year in footer ---- */
document.querySelectorAll('.current-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});


// ---  VIAJESS CARRUSEL AUTOMÁTICO ---
const track = document.querySelector('.carrusel-track');
let isPaused = false;

function startAutoScroll() {
    setInterval(() => {
        if (!isPaused && track) {
            
            if (track.scrollLeft + track.offsetWidth >= track.scrollWidth - 10) {
                
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                const step = track.querySelector('.viaje-item').offsetWidth + 20;
                track.scrollBy({ left: step, behavior: 'smooth' });
            }
        }
    }, 3000); 
}

const revealSection = () => {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            reveal.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealSection);
window.addEventListener('load', () => {
    startAutoScroll();
    revealSection();
});




