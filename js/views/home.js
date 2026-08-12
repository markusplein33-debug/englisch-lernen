// Startbildschirm: Pensum-Banner + Kacheln + Tagesübersicht.
function letzteLektionText(ts) {
  if (!ts) return 'Noch keine Lern-Einheit gemacht – leg gleich los!';
  var d = new Date(ts), jetzt = new Date();
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var hm = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ' Uhr';
  var gestern = new Date(jetzt.getTime() - 24 * 3600 * 1000);
  var tag;
  if (d.toDateString() === jetzt.toDateString()) tag = 'heute';
  else if (d.toDateString() === gestern.toDateString()) tag = 'gestern';
  else tag = 'am ' + pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear();
  return 'Letzte Lern-Einheit: ' + tag + ' um ' + hm;
}

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

  html += '<div class="center"><p class="note">🕐 ' + letzteLektionText(s.letzteLektion) + '</p></div>';

  if (Backup.istFaellig()) {
    html += '<div class="statcard" id="backup-card"><p class="note">💾 <b>Sicherung fällig:</b> ' +
      Backup.letzteText() + ' Dein Lernstand liegt nur auf diesem Gerät – ' +
      'einmal tippen und er ist als Datei gesichert.</p>' +
      '<button class="btn" id="backup-jetzt">💾 Jetzt als Datei sichern</button>' +
      '<p class="note" id="backup-status" style="margin-top:8px"></p></div>';
  }

  html += '<div class="tile-grid">' +
    '<div class="tile" data-go="#/karten"><span class="big">🃏</span>Karteikarten' +
      '<small>' + faelligKarten + ' fällig</small></div>' +
    '<div class="tile" data-go="#/quiz"><span class="big">❓</span>Quiz<small>Multiple Choice</small></div>' +
    '<div class="tile" data-go="#/grammatik"><span class="big">📖</span>Grammatik<small>' + APP_DATA.lessons.length + ' Lektionen</small></div>' +
    '<div class="tile" data-go="#/statistik"><span class="big">📊</span>Statistik<small>Dein Fortschritt</small></div>' +
    '</div>';

  var stand = (window.APP_INFO && APP_INFO.stand) || '';
  var standDe = stand ? stand.split('-').reverse().join('.') : '?';
  html += '<div class="center" style="margin-top:22px">' +
    '<p class="note">Letzte Aktualisierung: ' + standDe +
    ' · Version ' + ((window.APP_INFO && APP_INFO.version) || '?') + '</p>' +
    '<button class="btn ghost" id="refresh">🔄 Nach Update suchen</button>' +
    '<p class="note" id="refresh-status" style="margin-top:8px"></p></div>';

  el.innerHTML = html;
  var refreshBtn = el.querySelector('#refresh');
  refreshBtn.addEventListener('click', function () {
    var status = el.querySelector('#refresh-status');
    if (!navigator.onLine) { status.textContent = 'Dafür brauchst du kurz Internet.'; return; }
    if (!('serviceWorker' in navigator)) { location.reload(); return; }
    status.textContent = 'Suche nach Update …';
    navigator.serviceWorker.getRegistration().then(function (reg) {
      if (!reg) { location.reload(); return; }
      function aktiviereWartenden() {
        if (reg.waiting) {
          navigator.serviceWorker.addEventListener('controllerchange', function () {
            location.reload();
          });
          reg.waiting.postMessage({ typ: 'skipWaiting' });
          status.textContent = 'Update wird installiert …';
          return true;
        }
        return false;
      }
      if (aktiviereWartenden()) return;
      reg.update().then(function () {
        if (aktiviereWartenden()) return;
        if (reg.installing) {
          status.textContent = 'Update gefunden, lädt …';
          reg.installing.addEventListener('statechange', function () {
            aktiviereWartenden();
          });
        } else {
          status.textContent = '✅ Die App ist auf dem neuesten Stand.';
        }
      }).catch(function () {
        status.textContent = 'Update-Suche fehlgeschlagen – bist du online?';
      });
    });
  });
  el.querySelectorAll('[data-go]').forEach(function (t) {
    t.addEventListener('click', function () { location.hash = t.getAttribute('data-go'); });
  });
  var btn = el.querySelector('#start-session');
  if (btn) btn.addEventListener('click', function () { location.hash = '#/einheit'; });
  var bkBtn = el.querySelector('#backup-jetzt');
  if (bkBtn) bkBtn.addEventListener('click', function () {
    Backup.exportDatei();
    el.querySelector('#backup-status').textContent =
      '✅ Datei erstellt – im Teilen-Dialog „In Dateien sichern" wählen.';
    setTimeout(function () { Router.render(); }, 1500);
  });
};
Router.register('home', Views.home);
