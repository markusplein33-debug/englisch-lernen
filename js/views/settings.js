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
      APP_DATA.decks.map(function (d) {
        var checked = Array.isArray(p.themen) && p.themen.indexOf(d.id) >= 0;
        return '<label style="display:flex;align-items:center;gap:10px;padding:7px 0;font-size:15px">' +
          '<input type="checkbox" class="themacheck" value="' + d.id + '"' +
          (checked ? ' checked' : '') + ' style="width:20px;height:20px">' +
          d.emoji + ' ' + d.titel + '</label>';
      }).join('') + '</div>' +

      '<h2 class="sect">Aussprache</h2>' +
      '<div class="field"><label>Sprechtempo</label>' +
      '<select id="tempo">' +
        opt('0.7', 'Langsam', s.einstellungen.tempo) +
        opt('0.9', 'Normal (empfohlen)', s.einstellungen.tempo) +
        opt('1', 'Schnell', s.einstellungen.tempo) +
      '</select></div>' +
      '<button class="btn ghost" id="test-speech">🔊 Testen („Welcome to London!“)</button>' +

      '<h2 class="sect">Erinnerung bei geschlossener App</h2>' +
      '<div class="statcard"><p class="note">' +
      'Die App kann dich nur erinnern, solange sie geöffnet ist. Für Erinnerungen bei ' +
      'geschlossener App nutze die vorinstallierte Apple-App <b>Kurzbefehle</b>:<br><br>' +
      '1. Kurzbefehle-App öffnen → Tab <b>Automation</b> → <b>+</b><br>' +
      '2. <b>Tageszeit</b> wählen, Uhrzeit(en) einstellen (z. B. 9:00, 12:00, 18:00), ' +
      '<b>Sofort ausführen</b> aktivieren<br>' +
      '3. Als Aktion <b>App öffnen</b> → „Englisch lernen“ wählen (oder Aktion „URL öffnen“ mit der App-Adresse)<br>' +
      '4. Fertig – dein iPhone öffnet die App zur Lernzeit automatisch.' +
      '</p></div>';

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
  };
  Router.register('einstellungen', Views.settings);
})();
