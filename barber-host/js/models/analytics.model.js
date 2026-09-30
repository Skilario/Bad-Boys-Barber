/**
 * AnalyticsModel — configuración de la medición (Google Analytics 4).
 *
 * Para activarla:
 *   1. Crear una propiedad GA4 en analytics.google.com (flujo de datos "Web").
 *   2. Copiar el "ID de medición" (empieza con G-) y pegarlo en measurementId.
 * Mientras esté vacío no se carga nada (el sitio anda igual, sin medir).
 *
 * Eventos que se mandan (para ver en GA4 → Informes → Interacción → Eventos):
 *   page_view        cada sección que se abre (Inicio, Servicios, …)
 *   whatsapp_click   cualquier botón de WhatsApp (con dónde estaba: flotante, contacto, cierre…)
 *   video_open       se abrió un reel o el video de YouTube
 *   click_badboys    fue a la web de la barbería
 *   social_click     fue a Instagram o YouTube
 * En GA4 marcá whatsapp_click como "evento clave" (conversión): es cada consulta.
 */
window.BH = window.BH || { models: {}, views: {}, controllers: {} };

BH.models.Analytics = {
  measurementId: 'G-0SPDDTK2P1',   // ej: 'G-AB12CD34EF'

  enabled() { return /^G-[A-Z0-9]+$/.test(this.measurementId); }
};
