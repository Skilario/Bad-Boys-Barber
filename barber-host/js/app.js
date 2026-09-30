/**
 * app.js — arranque de la aplicación.
 * Orden: medición → navegación → efectos → videos → contacto → router (muestra la sección inicial).
 */
(function () {
  const { views, controllers } = window.BH;

  controllers.Analytics.init();
  controllers.Nav.init();
  views.Effects.init();
  controllers.Videos.init();
  views.Effects.observeNew(document.getElementById('eventos'));
  controllers.Contact.init();

  controllers.Router.onChange(view => views.Effects.onViewChange(view));
  controllers.Router.onChange(view => controllers.Analytics.pageView(view));
  controllers.Router.init();
})();
