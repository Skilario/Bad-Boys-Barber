/**
 * ContactView — pone el link de WhatsApp en los botones y muestra el número.
 */
window.BH = window.BH || { models: {}, views: {}, controllers: {} };

BH.views.Contact = {
  /** Pone el link de WhatsApp en todos los botones marcados con data-wa. */
  setWhatsappLinks(plainUrl, defaultUrl, display) {
    document.querySelectorAll('[data-wa]').forEach(a => {
      a.href = a.dataset.wa === 'default' ? defaultUrl : plainUrl;
    });
    const num = document.getElementById('wa-num');
    if (num) num.textContent = display;
  }
};
