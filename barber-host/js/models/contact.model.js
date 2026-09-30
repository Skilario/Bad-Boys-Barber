/**
 * ContactModel — datos de WhatsApp.
 * Todos los botones con data-wa="default" abren WhatsApp con defaultText ya escrito;
 * los que tienen data-wa="plain" abren el chat vacío.
 */
window.BH = window.BH || { models: {}, views: {}, controllers: {} };

BH.models.Contact = {
  whatsapp: {
    number: '5491136596097',            // formato internacional, sin + ni espacios
    display: '+54 9 11 3659-6097',
    // Mensaje que aparece escrito al abrir WhatsApp (los datos que Eze necesita para responder)
    defaultText: [
      'Hola Eze! Quiero consultar por Barber Host para un evento.',
      'Fecha:',
      'Ciudad:',
      'Tipo de evento:',
      'Público estimado:'
    ].join('\n')
  },

  whatsappUrl(text) {
    const base = `https://wa.me/${this.whatsapp.number}`;
    return text ? `${base}?text=${encodeURIComponent(text)}` : base;
  }
};
