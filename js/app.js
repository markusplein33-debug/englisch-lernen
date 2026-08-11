// App-Start: Service Worker registrieren, Router starten, Erinnerungs-Timer.
(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }

  Router.init();

  // Erinnerung, solange die App offen ist: prüft jede Minute, ob eine Einheit fällig ist.
  var erinnert = false;
  setInterval(function () {
    var n = Pensum.faelligeEinheiten();
    if (n > 0 && !erinnert) {
      erinnert = true;
      if ((location.hash || '#/') === '#/' || location.hash === '') Router.render();
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('Englisch lernen 📚', {
            body: 'Deine Lern-Einheit ist fällig: ' + Store.load().pensum.vokabeln +
              ' Vokabeln + ' + Store.load().pensum.grammatik + ' Grammatikfragen.'
          });
        } catch (e) {}
      }
    }
    if (n === 0) erinnert = false;
  }, 60000);

  // Bei Rückkehr in die App (Tab sichtbar) Startseite aktualisieren.
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && (location.hash || '#/') === '#/') Router.render();
  });
})();
