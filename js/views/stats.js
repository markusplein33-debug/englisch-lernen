// Statistik: Boxen-Verteilung pro Deck, Grammatik-Fortschritt, schwierigste Karten, Streak.
(function () {
  var FARBEN = ['var(--box1)', 'var(--box2)', 'var(--box3)', 'var(--box4)', 'var(--box5)'];

  Views.stats = function (el) {
    Router.setTitle('Statistik');
    var s = Store.load();
    var html = '';

    // Wochen-Streak
    var tage = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    var now = new Date();
    var wtag = (now.getDay() + 6) % 7; // Mo=0
    html += '<div class="statcard"><h3>🔥 Diese Woche</h3><div class="streakrow">';
    for (var i = 0; i < 7; i++) {
      var d = new Date(now); d.setDate(now.getDate() - wtag + i);
      var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
      var n = s.streak[key] || 0;
      html += '<div class="streakday"><div class="dot' + (n ? ' hit' : '') + '">' +
        (n || '') + '</div>' + tage[i] + '</div>';
    }
    html += '</div><p class="note" style="margin-bottom:0;margin-top:8px">Zahl = erledigte Lern-Einheiten pro Tag</p></div>';

    // Vokabel-Fortschritt pro Deck
    html += '<h2 class="sect">Vokabeln (Karteikarten-Boxen)</h2>';
    var gesamtGelernt = 0, gesamtKarten = 0;
    APP_DATA.sichtbareDecks().forEach(function (d) {
      var v = SRS.verteilung(d.id);
      var gesamt = d.karten.length;
      gesamtKarten += gesamt;
      gesamtGelernt += v.boxen[3] + v.boxen[4];
      var bar = '<div class="progressbar">';
      for (var b = 0; b < 5; b++) {
        var w = 100 * v.boxen[b] / gesamt;
        if (w) bar += '<i style="width:' + w + '%;background:' + FARBEN[b] + '"></i>';
      }
      var wneu = 100 * v.neu / gesamt;
      if (wneu) bar += '<i style="width:' + wneu + '%;background:var(--line)"></i>';
      bar += '</div>';
      html += '<div class="statcard"><h3>' + d.emoji + ' ' + d.titel +
        ' <small style="color:var(--muted);font-weight:400">· ' + (v.boxen[3] + v.boxen[4]) +
        ' / ' + gesamt + ' sitzen</small></h3>' + bar + '</div>';
    });
    html += '<div class="legend"><span><i style="background:var(--line)"></i>Neu</span>' +
      '<span><i style="background:var(--box1)"></i>Box 1 (schwer)</span>' +
      '<span><i style="background:var(--box3)"></i>Box 3</span>' +
      '<span><i style="background:var(--box5)"></i>Box 5 (sitzt)</span></div>';

    // Grammatik
    html += '<h2 class="sect">Grammatik-Lektionen</h2>';
    var sortiert = APP_DATA.sichtbareLessons().slice().sort(function (a, b) {
      return Pensum.fehlerquote(b.id) - Pensum.fehlerquote(a.id);
    });
    sortiert.forEach(function (l) {
      var g = s.grammatik[l.id] || { geloest: {} };
      var geloest = Object.keys(g.geloest || {}).length;
      var quote = Pensum.fehlerquote(l.id);
      var begonnen = geloest > 0 || Object.keys(g.fehler || {}).length > 0;
      var schwer = begonnen && quote > 0.35;
      html += '<div class="statcard' + '"><h3>' + (schwer ? '🔴' : g.fertig ? '✅' : '📖') + ' ' +
        l.titel + ' <small style="color:var(--muted);font-weight:400">· ' + geloest + ' / ' +
        l.uebungen.length + (begonnen ? ' · Fehlerquote ' + Math.round(quote * 100) + '%' : '') +
        '</small></h3>' +
        '<div class="progressbar"><i style="width:' + Math.round(100 * geloest / l.uebungen.length) +
        '%;background:' + (schwer ? 'var(--bad)' : 'var(--ok)') + '"></i></div></div>';
    });

    // Schwierigste Karten
    var schwer = SRS.schwerste(10);
    if (schwer.length) {
      html += '<h2 class="sect">Deine schwierigsten Vokabeln</h2><div class="list">';
      schwer.forEach(function (x) {
        var f = APP_DATA.findeKarte(x.id);
        if (!f) return;
        html += '<div class="rowcard difficult"><span class="emoji">' + f.deck.emoji + '</span>' +
          '<div class="grow"><h3 style="font-size:15px">' + f.karte.en + '</h3>' +
          '<small>' + f.karte.de + ' · ' + x.fehler + '× falsch</small></div></div>';
      });
      html += '</div><button class="btn big" id="drill">Schwierige jetzt üben</button>';
    }

    // Backup
    html += '<h2 class="sect">Backup</h2>' +
      '<div class="statcard"><p class="note">Dein Fortschritt liegt nur auf diesem Gerät. ' +
      'Sichere ihn als Datei (z. B. in „Dateien" oder iCloud Drive) und stelle ihn ' +
      'später – auch auf einem neuen iPhone – per Import wieder her.</p>' +
      '<div class="spacer"></div>' +
      '<button class="btn" id="export">💾 Als Datei sichern</button> ' +
      '<button class="btn ghost" id="import">📂 Aus Datei wiederherstellen</button>' +
      '<input type="file" id="import-file" accept=".json,application/json" style="display:none">' +
      '<p class="note" id="backup-status" style="margin-top:8px"></p></div>';

    el.innerHTML = html;

    var drill = el.querySelector('#drill');
    if (drill) drill.addEventListener('click', function () { location.hash = '#/einheit'; });
    el.querySelector('#export').addEventListener('click', function () {
      var text = Store.exportJson();
      var blob = new Blob([text], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'englisch-backup-' + Store.heute() + '.json';
      document.body.appendChild(a); a.click();
      setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 2000);
      el.querySelector('#backup-status').textContent =
        '💾 Backup-Datei erstellt – beim iPhone im Teilen-Dialog „In Dateien sichern" wählen.';
    });
    var dateiFeld = el.querySelector('#import-file');
    el.querySelector('#import').addEventListener('click', function () { dateiFeld.click(); });
    dateiFeld.addEventListener('change', function () {
      var datei = dateiFeld.files && dateiFeld.files[0];
      if (!datei) return;
      var leser = new FileReader();
      leser.onload = function () {
        try {
          Store.importJson(String(leser.result));
          alert('Import erfolgreich – dein Lernstand ist wiederhergestellt!');
          Router.render();
        } catch (e) { alert('Import fehlgeschlagen: ' + e.message); }
      };
      leser.onerror = function () { alert('Datei konnte nicht gelesen werden.'); };
      leser.readAsText(datei);
    });
  };
  Router.register('statistik', Views.stats);
})();
