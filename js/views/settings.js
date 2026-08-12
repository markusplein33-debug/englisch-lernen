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
      '<div class="statcard"><p class="note"><b>Empfohlen – automatisch per Kalender (auch stündlich):</b> ' +
      'Ich baue dir aus deinen Einstellungen oben fertige Kalender-Erinnerungen ' +
      '<b>nur für heute</b> (<span id="zeiten-vorschau"></span>). ' +
      'Nach dem Tipp auf den Button öffnet iOS die Datei – dort nur noch ' +
      '<b>„Zum Kalender hinzufügen“</b> bestätigen. So bleibt dein Kalender aufgeräumt – ' +
      'morgen einfach neu tippen, oder dich nach jeder Lern-Einheit einzeln erinnern lassen.</p>' +
      '<div class="spacer"></div>' +
      '<button class="btn" id="ics-btn">📅 Erinnerungen in den Kalender legen</button> ' +
      '<button class="btn ghost" id="ics-del-btn">🗑 Wieder entfernen</button>' +
      '<p class="note" id="ics-status" style="margin-top:10px"></p></div>' +
      '<div class="statcard"><p class="note">' +
      '<b>Alternative: Kurzbefehle</b> (öffnet die App automatisch zur Lernzeit). ' +
      '⚠️ Apple erlaubt dort <b>kein „stündlich“</b> – nur feste Uhrzeiten, und für ' +
      '<b>jede Uhrzeit eine eigene Automation</b>. Das lohnt sich also nur bei wenigen ' +
      'Zeiten am Tag (z. B. 3× täglich). Für stündliche Erinnerungen nimm den ' +
      'Kalender-Button oben – der legt automatisch alle Zeiten auf einmal an.<br><br>' +
      'So geht es (einmal <b>pro Uhrzeit</b>):<br>' +
      '1. Kurzbefehle-App öffnen → Tab <b>Automation</b> → <b>+</b><br>' +
      '2. <b>Tageszeit</b> wählen, eine Uhrzeit einstellen, <b>Sofort ausführen</b> aktivieren<br>' +
      '3. Als Aktion <b>App öffnen</b> → „Englisch lernen“ wählen (oder Aktion „URL öffnen“ mit der App-Adresse)<br>' +
      '4. Für jede weitere Uhrzeit wiederholen.<br><br>' +
      'Deine Zeiten laut Einstellungen: <b><span id="zeiten-vorschau2"></span></b><br>' +
      '<i>Hinweis: Apple erlaubt Apps nicht, Kurzbefehle vollautomatisch zu installieren – ' +
      'darum diese Schritte von Hand. Die Kalender-Lösung oben geht ohne.</i></p>' +
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
    // Nur die Zeiten, die heute noch vor uns liegen.
    function heutigeZeiten() {
      var jetzt = new Date();
      var jetztHm = Ics.pad(jetzt.getHours()) + ':' + Ics.pad(jetzt.getMinutes());
      return erinnerungsZeiten().filter(function (z) { return z > jetztHm; });
    }
    function zeigeZeiten() {
      var heute = heutigeZeiten();
      var a = el.querySelector('#zeiten-vorschau');
      if (a) a.textContent = heute.length
        ? 'heute noch ' + heute.join(', ') + ' Uhr'
        : 'für heute sind alle Zeiten schon vorbei';
      var b = el.querySelector('#zeiten-vorschau2');
      if (b) b.textContent = erinnerungsZeiten().join(', ') + ' Uhr';
    }
    zeigeZeiten();
    ['intervall', 'ruheVon', 'ruheBis'].forEach(function (id) {
      el.querySelector('#' + id).addEventListener('change', zeigeZeiten);
    });

    // Baut die Terminliste für die Kalenderdatei (nur Einzeltermine, nur heute).
    // Feste UIDs + steigende SEQUENCE: ein neuer Export ERSETZT die alten Termine
    // im Kalender (bzw. verschiebt sie auf heute), statt Duplikate anzulegen.
    function baueTermine(zeiten, datum, seq) {
      var appUrl = location.origin + location.pathname;
      return zeiten.map(function (z, i) {
        return {
          uid: 'englisch-lernen-slot-' + i + '@markusplein33-debug.github.io',
          datum: datum,
          zeit: z.replace(':', ''),
          titel: '📚 Englisch lernen (' + p.vokabeln + ' Vokabeln + ' + p.grammatik + ' Grammatik)',
          beschreibung: 'Lern-Einheit starten: ' + appUrl,
          url: appUrl,
          seq: seq
        };
      });
    }

    el.querySelector('#ics-btn').addEventListener('click', function () {
      var zeiten = heutigeZeiten();
      if (!zeiten.length) {
        el.querySelector('#ics-status').textContent =
          'Für heute sind alle Erinnerungszeiten schon vorbei – versuche es morgen wieder, ' +
          'oder lass dich am Ende deiner nächsten Lern-Einheit einzeln erinnern.';
        return;
      }
      var datum = Ics.datumStempel(new Date());
      s.pensum.icsSeq = (s.pensum.icsSeq || 0) + 2;
      // Merken, was angelegt wurde – damit „Entfernen" exakt dieselben Termine storniert.
      s.pensum.kalender = { zeiten: zeiten, datum: datum, seq: s.pensum.icsSeq };
      Store.save();
      Ics.lade(Ics.erzeuge(baueTermine(zeiten, datum, s.pensum.icsSeq), false), 'englisch-erinnerungen.ics');
      el.querySelector('#ics-status').innerHTML =
        '📅 ' + zeiten.length + ' Erinnerung' + (zeiten.length === 1 ? '' : 'en') +
        ' für heute erstellt. 💡 Tipp: Beim Hinzufügen als Kalender am besten einen eigenen ' +
        '(z. B. „Englisch") wählen – dann lassen sich die Erinnerungen später auch komplett ' +
        'über die Kalender-App entfernen.';
    });

    el.querySelector('#ics-del-btn').addEventListener('click', function () {
      var k = s.pensum.kalender;
      if (!k || !k.zeiten || !k.zeiten.length) {
        el.querySelector('#ics-status').textContent =
          'Über diesen Button wurden noch keine Erinnerungen angelegt.';
        return;
      }
      Ics.lade(Ics.erzeuge(baueTermine(k.zeiten, k.datum, (k.seq || 0) + 1), true), 'englisch-erinnerungen-entfernen.ics');
      el.querySelector('#ics-status').innerHTML =
        '🗑 Absage-Datei erstellt – öffnen und bestätigen, dann verschwinden die Termine. ' +
        '<b>Falls dein iPhone die Absage nicht anbietet</b> (Apple unterstützt das nicht auf jedem Gerät): ' +
        'Kalender-App → jeden „📚 Englisch lernen"-Termin antippen → <b>Löschen</b> (' +
        k.zeiten.length + ' Termin' + (k.zeiten.length === 1 ? '' : 'e') + ', nur heute). ' +
        'Oder – falls du beim Anlegen einen eigenen Kalender gewählt hast – Kalender-App → ' +
        '„Kalender" → ⓘ neben „Englisch" → <b>Kalender löschen</b> (alles auf einmal).';
    });

    el.querySelector('#shortcut-btn').addEventListener('click', function () {
      location.href = 'shortcuts://create-shortcut';
    });
  };
  Router.register('einstellungen', Views.settings);
})();
