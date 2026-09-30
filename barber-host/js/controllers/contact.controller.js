/**
 * ContactController — botones de WhatsApp (flotante, Contratar y cierre).
 * El número y el mensaje se cambian en js/models/contact.model.js.
 */
window.BH = window.BH || { models: {}, views: {}, controllers: {} };

BH.controllers.Contact = {
  init() {
    const M = BH.models.Contact;
    BH.views.Contact.setWhatsappLinks(M.whatsappUrl(), M.whatsappUrl(M.whatsapp.defaultText), M.whatsapp.display);
  }
};
