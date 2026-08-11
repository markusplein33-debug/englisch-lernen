// Startbildschirm: Pensum-Banner + Kacheln + Tagesübersicht.
Views.home = function (el) {
  Router.setTitle('Englisch lernen');
  var s = Store.load();
  var n = Pensum.faelligeEinheiten();
  var p = s.pensum;
  var heute = s.streak[Store.heute()] || 0;
  var faelligKarten = SRS.faellig(null).length;

  var html = '';
  if (p.intervallMin && n > 0) {
    html += '<div class="banner"><h2>📚 Jetzt fällig: ' + p.vokabeln + ' Vokabeln + ' +
      p.grammatik + ' Grammatikfragen</h2>' +
      '<p>' + (n > 1 ? n + ' Einheiten warten auf dich.' : 'Deine nächste Lern-Einheit wartet.') + '</p>' +
      '<button class="btn light" id="start-session">Jetzt lernen →</button></div>';
  } else if (p.intervallMin) {
    var next = Pensum.naechsteFaelligkeit();
    html += '<div class="banner done"><h2>✅ Pensum erfüllt!</h2>' +
      '<p>Heute erledigt: ' + heute + ' Einheit' + (heute === 1 ? '' : 'en') +
      (next ? ' · Nächste: ' + String(next.getHours()).padStart(2, '0') + ':' + String(next.getMinutes()).padStart(2, '0') + ' Uhr' : '') + '</p>' +
      '<button class="btn light" id="start-session">Trotzdem lernen →</button></div>';
  } else {
    html += '<div class="banner"><h2>👋 Willkommen!</h2>' +
      '<p>Stelle unter ⚙️ Einstellungen dein Lernpensum ein – z. B. alle 2 Stunden 10 Vokabeln.</p>' +
      '<button class="btn light" id="start-session">Gemischte Einheit starten →</button></div>';
  }

  html += '<div class="tile-grid">' +
    '<div class="tile" data-go="#/karten"><span class="big">🃏</span>Karteikarten' +
      '<small>' + faelligKarten + ' fällig</small></div>' +
    '<div class="tile" data-go="#/quiz"><span class="big">❓</span>Quiz<small>Multiple Choice</small></div>' +
    '<div class="tile" data-go="#/grammatik"><span class="big">📖</span>Grammatik<small>' + APP_DATA.lessons.length + ' Lektionen</small></div>' +
    '<div class="tile" data-go="#/statistik"><span class="big">📊</span>Statistik<small>Dein Fortschritt</small></div>' +
    '</div>';

  el.innerHTML = html;
  el.querySelectorAll('[data-go]').forEach(function (t) {
    t.addEventListener('click', function () { location.hash = t.getAttribute('data-go'); });
  });
  var btn = el.querySelector('#start-session');
  if (btn) btn.addEventListener('click', function () { location.hash = '#/einheit'; });
};
Router.register('home', Views.home);
