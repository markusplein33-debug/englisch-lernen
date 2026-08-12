// Einstellungen: Lernpensum, Ruhezeiten, Sprechtempo + Kurzbefehle-Anleitung.
(function () {
  Views.settings = function (el) {
    Router.setTitle('⚙️ Einstellungen');
    var s = Store.load();
    var p = s.pensum;
    var themenModus = Array.isArray(p.themen) ? 'auswahl' : (p.themen || 'zufall');

    function opt(val, label, cur) {
      return '<option value="' + val + '"' + (String(cur) === String(val) ? ' selected' : '') + '>' +
        label + '</option>';
    }

    var html = '<h2 class="sect">Lernpensum</h2>' +
      '<div class="field"><label>Wie oft möchtest du erinnert werden?</label>' +
      '<select id="intervall">' +
        opt(0, 'Aus – ich lerne, wann ich will', p.intervallMin) +
        opt(30, 'Alle 30 Minuten', p.intervallMin) +
        opt(60, 'Stündlich', p.intervallMin) +
        opt(120, 'Alle 2 Stunden', p.intervallMin) +
        opt(240, 'Alle 4 Stunden', p.intervallMin) +
        opt(480, '3× täglich', p.intervallMin) +
        opt(1440, '1× täglich', p.intervallMin) +
      '</select></div>' +
      '<div class="field"><label>Vokabeln pro Einheit</label>' +
      '<select id="vokabeln">' + [5, 10, 15, 20].map(function (n) {
        return opt(n, n + ' Vokabeln', p.vokabeln);
      }).join('') + '</select></div>' +
      '<div class="field"><label>Grammatikfragen pro Einheit</label>' +
      '<select id="grammatik">' + [0, 1, 2, 3, 5].map(function (n) {
        return opt(n, n + ' Fragen', p.grammatik);
      }).join('') + '</select></div>' +
      '<div class="field"><label>Ruhezeit (keine Erinnerungen)</label>' +
      '<div style="display:flex;gap:10px;align-items:center">' +
      '<select id="ruheVon" style="flex:1">' + stunden(p.ruheVon) + '</select>' +
      '<span>bis</span>' +
      '<select id="ruheBis" style="flex:1">' + stunden(p.ruheBis) + '</select></div></div>' +

      '<div class="field"><label>Antwortmodus in Lern-Einheiten</label>' +
      '<select id="antwortmodus">' +
        opt('tippen', 'Eintippen mit Bewertung (empfohlen)', s.einstellungen.antwortmodus) +
        opt('karte', 'Karteikarte umdrehen (selbst einschätzen)', s.einstellungen.antwortmodus) +
      '</select></div>' +
      '<div class="field"><label>Themen der Lern-Einheiten</label>' +
      '<select id="themenmodus">' +
        opt('zufall', '🎲 Zufällig gemischt (alle Themen)', themenModus) +
        opt('zufallsdeck', '🎯 Ein zufälliges Thema pro Einheit', themenModus) +
        opt('auswahl', '☑️ Nur bestimmte Themen …', themenModus) +
      '</select></div>' +
      '<div id="themen-liste" class="statcard' + (themenModus === 'auswahl' ? '' : ' gone') + '">' +
      APP_DATA.sichtbareDecks().map(function (d) {
        var checked = Array.isArray(p.themen) && p.themen.indexOf(d.id) >= 0;
        return '<label style="display:flex;align-items:center;gap:10px;padding:7px 0;font-size:15px">' +
          '<input type="checkbox" class="themacheck" value="' + d.id + '"' +
          (checked ? ' checked' : '') + ' style="width:20px;height:20px">' +
          d.emoji + ' ' + d.titel + '</label>';
      }).join('') + '</div>' +

      '<h2 class="sect">🧩 Erweiterungen</h2>' +
      '<div class="statcard"><p class="note">Alle Erweiterungen stecken schon in der App (auch offline). ' +
      'Schalte frei, was du lernen möchtest:</p>' +
      APP_DATA.PAKETE.map(function (pk) {
        var an = (s.pakete.aktiv || []).indexOf(pk.id) >= 0;
        var decks = APP_DATA.decks.filter(function (d) { return d.paket === pk.id; });
        var lekt = APP_DATA.lessons.filter(function (l) { return l.paket === pk.id; });
        var umfang = decks.length
          ? decks.reduce(function (n, d) { return n + d.karten.length; }, 0) + ' Karten'
          : lekt.length + ' Lektionen';
        return '<label style="display:flex;align-items:center;gap:12px;padding:10px 0;' +
          'border-top:1px solid var(--line)">' +
          '<input type="checkbox" class="paketcheck" value="' + pk.id + '"' +
          (an ? ' checked' : '') + ' style="width:22px;height:22px;flex-shrink:0">' +
          '<span style="flex:1"><b>' + pk.emoji + ' ' + pk.titel + '</b><br>' +
          '<small style="color:var(--muted)">' + pk.beschreibung + ' · ' + umfang + '</small></span></label>';
      }).join('') + '</div>' +
      '<div class="field"><label>Wie sollen Erweiterungen gelernt werden?</label>' +
      '<select id="paketmodus">' +
        opt('ergaenzen', 'Ergänzen das vorhandene Paket (überall mitgemischt)', s.pakete.modus) +
        opt('einzeln', 'Einzeln lernen (eigene Decks, Lern-Einheiten bleiben beim Basis-Paket)', s.pakete.modus) +
      '</select></div>' +

      '<h2 class="sect">Aussprache</h2>' +
      '<div class="field"><label>Sprechtempo</label>' +
      '<select id="tempo">' +
        opt('0.7', 'Langsam', s.einstellungen.tempo) +
        opt('0.9', 'Normal (empfohlen)', s.einstellungen.tempo) +
        opt('1', 'Schnell', s.einstellungen.tempo) +
      '</select></div>' +
      '<button class="btn ghost" id="test-speech">🔊 Testen („Welcome to London!“)</button>' +

      '<h2 class="sect">Erinnerung bei geschlossener App</h2>' +
      '<div class="statcard"><p class="note"><b>Automatisch per Kalender:</b> Ich baue dir aus deinen ' +
      'Einstellungen oben fertige Kalender-Erinnerungen (<span id="zeiten-vorschau"></span>). ' +
      'Nach dem Tipp auf den Button öffnet iOS die Datei – dort nur noch ' +
      '<b>„Zum Kalender hinzufügen“</b> bestätigen. iOS erinnert dich dann täglich von selbst.</p>' +
      '<div class="spacer"></div>' +
      '<button class="btn" id="ics-btn">📅 Erinnerungen in den Kalender legen</button> ' +
      '<button class="btn ghost" id="ics-del-btn">🗑 Wieder entfernen</button>' +
      '<p class="note" id="ics-status" style="margin-top:10px"></p></div>' +
      '<div class="statcard"><p class="note">' +
      'Die App kann dich nur erinnern, solange sie geöffnet ist. Für Erinnerungen bei ' +
      'geschlossener App nutze die vorinstallierte Apple-App <b>Kurzbefehle</b>:<br><br>' +
      '1. Kurzbefehle-App öffnen → Tab <b>Automation</b> → <b>+</b><br>' +
      '2. <b>Tageszeit</b> wählen, Uhrzeit(en) einstellen (z. B. 9:00, 12:00, 18:00), ' +
      '<b>Sofort ausführen</b> aktivieren<br>' +
      '3. Als Aktion <b>App öffnen</b> → „Englisch lernen“ wählen (oder Aktion „URL öffnen“ mit der App-Adresse)<br>' +
      '4. Fertig – dein iPhone öffnet die App zur Lernzeit automatisch.<br><br>' +
      'Deine Zeiten laut Einstellungen: <b><span id="zeiten-vorschau2"></span></b><br>' +
      '<i>Hinweis: Apple erlaubt Apps nicht, Kurzbefehle vollautomatisch zu installieren – ' +
      'darum diese wenigen Schritte von Hand. Die Kalender-Lösung oben geht ohne.</i></p>' +
      '<div class="spacer"></div>' +
      '<button class="btn ghost" id="shortcut-btn">⚡ Kurzbefehle-App öffnen</button></div>';

    el.innerHTML = html;

    function stunden(cur) {
      var out = '';
      for (var h = 0; h < 24; h++) out += opt(h, h + ' Uhr', cur);
      return out;
    }

    function bind(id, fn) {
      el.querySelector('#' + id).addEventListener('change', function (e) {
        fn(e.target.value); Store.save();
      });
    }
    bind('intervall', function (v) {
      p.intervallMin = parseInt(v, 10);
      if (p.intervallMin && !p.letzteEinheit) p.letzteEinheit = Date.now();
    });
    bind('vokabeln', function (v) { p.vokabeln = parseInt(v, 10); });
    bind('grammatik', function (v) { p.grammatik = parseInt(v, 10); });
    bind('ruheVon', function (v) { p.ruheVon = parseInt(v, 10); });
    bind('ruheBis', function (v) { p.ruheBis = parseInt(v, 10); });
    bind('tempo', function (v) { s.einstellungen.tempo = parseFloat(v); });
    bind('antwortmodus', function (v) { s.einstellungen.antwortmodus = v; });
    function leseThemenAuswahl() {
      var ids = [];
      el.querySelectorAll('.paketcheck').forEach(function (c) {
      c.addEventListener('change', function () {
        var aktiv = [];
        el.querySelectorAll('.paketcheck').forEach(function (x) {
          if (x.checked) aktiv.push(x.value);
        });
        s.pakete.aktiv = aktiv;
        // Themen-Auswahl bereinigen, falls ein abgewähltes Paket dort angehakt war
        if (Array.isArray(p.themen)) {
          var sichtbar = APP_DATA.sichtbareDecks().map(function (d) { return d.id; });
          p.themen = p.themen.filter(function (id) { return sichtbar.indexOf(id) >= 0; });
          if (!p.themen.length) p.themen = 'zufall';
        }
        Store.save();
        Router.render();   // Ansicht neu aufbauen (Themenliste, Umfänge)
      });
    });
    bind('paketmodus', function (v) { s.pakete.modus = v; });
    el.querySelectorAll('.themacheck').forEach(function (c) {
        if (c.checked) ids.push(c.value);
      });
      return ids.length ? ids : 'zufall';
    }
    bind('themenmodus', function (v) {
      el.querySelector('#themen-liste').classList.toggle('gone', v !== 'auswahl');
      p.themen = (v === 'auswahl') ? leseThemenAuswahl() : v;
    });
    el.querySelectorAll('.themacheck').forEach(function (c) {
      c.addEventListener('change', function () {
        p.themen = leseThemenAuswahl(); Store.save();
      });
    });
    el.querySelector('#test-speech').addEventListener('click', function () {
      Speech.speak('Welcome to London!');
    });

    // ---- Erinnerungs-Assistent ----
    function erinnerungsZeiten() {
      var iv = p.intervallMin || 120;
      if (iv < 60) iv = 60;                 // Kalender: minimal stündlich
      var von = p.ruheBis, bis = p.ruheVon; // Wachfenster = Ende Ruhe .. Beginn Ruhe
      if (von === bis) { von = 8; bis = 21; }
      var zeiten = [];
      var h = von;
      while (true) {
        var ende = bis > von ? bis : bis + 24;
        if (h >= ende) break;
        zeiten.push(((h % 24) < 10 ? '0' : '') + (h % 24) + ':00');
        h += Math.max(1, Math.round(iv / 60));
        if (zeiten.length >= 12) break;
      }
      if (!zeiten.length) zeiten = ['09:00', '18:00'];
      return zeiten;
    }
    function zeigeZeiten() {
      var z = erinnerungsZeiten().join(', ') + ' Uhr';
      var a = el.querySelector('#zeiten-vorschau'); if (a) a.textContent = 'täglich ' + z;
      var b = el.querySelector('#zeiten-vorschau2'); if (b) b.textContent = z;
    }
    zeigeZeiten();
    ['intervall', 'ruheVon', 'ruheBis'].forEach(function (id) {
      el.querySelector('#' + id).addEventListener('change', zeigeZeiten);
    });

    function heuteStempel() {
      var d = new Date();
      return String(d.getFullYear()) + String(d.getMonth() + 1).padStart(2, '0') +
        String(d.getDate()).padStart(2, '0');
    }
    // Baut die Kalenderdatei. cancel=true erzeugt eine Storno-Datei mit denselben
    // Termin-IDs (UIDs) – der Kalender erkennt die Termine daran und entfernt sie.
    function baueIcs(zeiten, datum, cancel) {
      var appUrl = location.origin + location.pathname;
      var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Englisch lernen//DE',
        'CALSCALE:GREGORIAN', 'METHOD:' + (cancel ? 'CANCEL' : 'PUBLISH')];
      zeiten.forEach(function (z, i) {
        var hm = z.replace(':', '') + '00';
        ics.push('BEGIN:VEVENT',
          'UID:englisch-lernen-slot-' + i + '@markusplein33-debug.github.io',
          'DTSTAMP:' + heuteStempel() + 'T000000Z',
          'DTSTART:' + datum + 'T' + hm,
          'DURATION:PT5M',
          'RRULE:FREQ=DAILY',
          'SEQUENCE:' + (cancel ? '2' : '0'),
          'SUMMARY:📚 Englisch lernen (' + p.vokabeln + ' Vokabeln + ' + p.grammatik + ' Grammatik)',
          'DESCRIPTION:Lern-Einheit starten: ' + appUrl,
          'URL:' + appUrl);
        if (cancel) ics.push('STATUS:CANCELLED');
        else ics.push('BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Englisch lernen!',
          'TRIGGER:PT0S', 'END:VALARM');
        ics.push('END:VEVENT');
      });
      ics.push('END:VCALENDAR');
      return ics.join('\r\n');
    }
    function ladeHerunter(inhalt, name) {
      var blob = new Blob([inhalt], { type: 'text/calendar' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click();
      setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 2000);
    }

    el.querySelector('#ics-btn').addEventListener('click', function () {
      var zeiten = erinnerungsZeiten();
      var datum = heuteStempel();
      // Merken, was angelegt wurde – damit „Entfernen" exakt dieselben Termine storniert.
      s.pensum.kalender = { zeiten: zeiten, datum: datum };
      Store.save();
      ladeHerunter(baueIcs(zeiten, datum, false), 'englisch-erinnerungen.ics');
      el.querySelector('#ics-status').innerHTML =
        '💡 Tipp: Beim Hinzufügen als Kalender am besten einen eigenen (z. B. „Englisch") wählen – ' +
        'dann lassen sich die Erinnerungen später auch komplett über die Kalender-App entfernen.';
    });

    el.querySelector('#ics-del-btn').addEventListener('click', function () {
      var k = s.pensum.kalender;
      if (!k || !k.zeiten || !k.zeiten.length) {
        el.querySelector('#ics-status').textContent =
          'Über diesen Button wurden noch keine Erinnerungen angelegt.';
        return;
      }
      ladeHerunter(baueIcs(k.zeiten, k.datum, true), 'englisch-erinnerungen-entfernen.ics');
      el.querySelector('#ics-status').innerHTML =
        '🗑 Absage-Datei erstellt – öffnen und bestätigen, dann verschwinden die Termine. ' +
        '<b>Falls dein iPhone die Absage nicht anbietet</b> (Apple unterstützt das nicht auf jedem Gerät): ' +
        'Kalender-App → einen „📚 Englisch lernen"-Termin antippen → <b>Löschen</b> → ' +
        '<b>„Alle zukünftigen Termine löschen"</b> (' + k.zeiten.length + '× wiederholen). ' +
        'Oder – falls du beim Anlegen einen eigenen Kalender gewählt hast – Kalender-App → ' +
        '„Kalender" → ⓘ neben „Englisch" → <b>Kalender löschen</b> (alles auf einmal).';
    });

    el.querySelector('#shortcut-btn').addEventListener('click', function () {
      location.href = 'shortcuts://create-shortcut';
    });
  };
  Router.register('einstellungen', Views.settings);
})();
