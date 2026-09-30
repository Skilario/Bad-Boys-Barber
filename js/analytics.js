/* ============================================================
   BAD BOYS — js/analytics.js
   Google Analytics 4. Queda apagado hasta que pegues el ID.

   Cómo activarlo:
     1. analytics.google.com → Administrar → Flujos de datos → Web.
     2. Copiá el "ID de medición" (empieza con G-) y pegalo abajo.
        Usá el MISMO ID que en Barber Host
        (barber-host/js/models/analytics.model.js): así ves las dos páginas juntas.

   Eventos que se miden solos:
     sacar_turno      → clic en "Sacar turno" (Turnito)
     whatsapp_click   → clic en cualquier WhatsApp (destino: turnos / insumos / curso)
     instagram_click  → clic en Instagram
     catalogo_click   → clic en "Ver catálogo completo"
     como_llegar      → clic en "Cómo llegar" (Google Maps)
   En GA4 marcá "sacar_turno" y "whatsapp_click" como eventos clave (conversiones).
   ============================================================ */
(function () {
  'use strict';

  var GA4_ID = '';   // ej: 'G-AB12CD34EF'

  if (!/^G-[A-Z0-9]+$/.test(GA4_ID)) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID);

  function evento(nombre, datos) { window.gtag('event', nombre, datos || {}); }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    var donde = a.closest('section, footer') ? (a.closest('section, footer').id || 'otro') : 'flotante';

    if (href.indexOf('turnito.app') > -1) {
      evento('sacar_turno', { ubicacion: donde });
    } else if (href.indexOf('wa.me/') > -1) {
      var destino = href.indexOf('5491128179235') > -1 ? 'insumos'
                  : /curso/i.test(decodeURIComponent(href)) ? 'curso' : 'turnos';
      evento('whatsapp_click', { destino: destino, ubicacion: donde });
    } else if (href.indexOf('instagram.com') > -1) {
      evento('instagram_click', { cuenta: href.split('instagram.com/')[1].replace(/\/$/, ''), ubicacion: donde });
    } else if (/\.pdf$/i.test(href)) {
      evento('catalogo_click', { ubicacion: donde });
    } else if (href.indexOf('google.com/maps') > -1) {
      evento('como_llegar', { ubicacion: donde });
    }
  });
})();
