// Gemischte Pensum-Einheit: X Vokabeln (Eintippen oder Karte) + Y Grammatikfragen.
(function () {
  Views.session = function (el) {
    Router.setTitle('📚 Lern-Einheit');
    var sess = Pensum.baueSession();
    var schritte = sess.karten.map(function (k) { return { art: 'karte', k: k }; })
      .concat(sess.uebungen.map(function (u) { return { art: 'grammatik', u: u }; }));
    if (!schritte.length) { location.hash = '#/'; return; }
    var modus = Store.load().einstellungen.antwortmodus || 'tippen';

    var idx = 0, punkte = 0, voll = 0, teils = 0, umgedreht = false;

    function fertig() {
      Pensum.einheitErledigt();
      var uebrig = Pensum.faelligeEinheiten();
      var pStr = (Math.round(punkte * 10) / 10).toString().replace('.', ',');
      el.innerHTML = '<div class="center statcard"><div class="result-big">🎉</div>' +
        '<h2>Einheit geschafft!</h2>' +
        '<p>' + pStr + ' von ' + schritte.length + ' Punkten' +
        (teils ? ' (' + voll + '× richtig, ' + teils + '× teilweise)' : '') + '</p>' +
        (uebrig > 0
          ? '<p class="note">Noch ' + uebrig + ' Einheit' + (uebrig === 1 ? '' : 'en') + ' fällig.</p>' +
            '<button class="btn big" id="more">Nächste Einheit →</button>'
          : '<p class="note">Pensum erfüllt – stark! 💪</p>') +
        '<button class="btn ghost big" id="home">Zum Start</button></div>';
      var more = el.querySelector('#more');
      if (more) more.addEventListener('click', function () { Router.render(); });
      el.querySelector('#home').addEventListener('click', function () { location.hash = '#/'; });
    }

    function zeige() {
      if (idx >= schritte.length) { fertig(); return; }
      var schritt = schritte[idx];
      var meta = 'Schritt ' + (idx + 1) + ' / ' + schritte.length;

      if (schritt.art === 'grammatik') {
        GrammarUI.frage(el, schritt.u.lektion, schritt.u.uebung, meta,
          function (ergebnis) {
            if (ergebnis === true || ergebnis === 'richtig') { punkte++; voll++; }
            else if (ergebnis === 'teil') { punkte += 0.5; teils++; }
            idx++; zeige();
          });
        return;
      }

      if (modus === 'karte') zeigeKarte(schritt, meta);
      else zeigeTippen(schritt, meta);
    }

    // ---- Eintipp-Modus mit toleranter Bewertung ----
    function zeigeTippen(schritt, meta) {
      var k = schritt.k.karte;
      var deck = APP_DATA.decks.filter(function (d) { return d.id === schritt.k.deck; })[0];
      el.innerHTML =
        '<div class="qmeta">' + meta + ' · Vokabel' + (deck ? ' · ' + deck.emoji + ' ' + deck.titel : '') + '</div>' +
        '<div class="flashcard" style="min-height:150px;cursor:default">' +
          '<div class="side-label">Wie heißt das auf Englisch?</div>' +
          '<div class="word">' + k.de + '</div>' +
          (k.hinweis ? '<div class="hint">💡 ' + k.hinweis + '</div>' : '') +
        '</div>' +
        '<input class="gap" id="antwort" autocapitalize="off" autocorrect="off" ' +
          'autocomplete="off" spellcheck="false" placeholder="Englische Antwort eintippen …">' +
        '<button class="btn big" id="check">Prüfen</button>' +
        '<button class="btn ghost big" id="skip">Weiß ich nicht</button>' +
        '<div id="feedback"></div>';

      var input = el.querySelector('#antwort');
      var beantwortet = false;

      function auswerten(aufgeben) {
        if (beantwortet) return;
        beantwortet = true;
        var stufe = aufgeben ? 'falsch' : Grading.bewerte(input.value, k.en);
        var text, klasse = 'explain';
        if (stufe === 'richtig') {
          punkte++; voll++; SRS.bewerten(k.id, true);
          text = '✅ <b>Richtig!</b> ' + k.en;
        } else if (stufe === 'schreib') {
          punkte += 0.5; teils++; SRS.bewertenTeil(k.id);
          text = '🟡 <b>Fast! Kleiner Rechtschreibfehler.</b><br>Richtig geschrieben: „' + k.en + '“';
        } else if (stufe === 'sinn') {
          punkte += 0.5; teils++; SRS.bewertenTeil(k.id);
          text = '🟡 <b>Sinngemäß richtig – teilweise bestanden!</b><br>Bessere Formulierung: „' + k.en + '“';
        } else {
          SRS.bewerten(k.id, false);
          text = (aufgeben ? '📖 ' : '❌ ') + '<b>Die Lösung:</b> „' + k.en + '“';
        }
        el.querySelector('#feedback').innerHTML =
          '<div class="' + klasse + '">' + text +
          ' <button class="iconbtn" style="color:var(--accent2);min-height:28px;font-size:18px" id="sag">🔊</button></div>' +
          '<button class="btn big" id="next">Weiter →</button>';
        el.querySelector('#sag').addEventListener('click', function () { Speech.speak(k.en); });
        Speech.speak(k.en);
        var nb = el.querySelector('#next');
        nb.addEventListener('click', function () { idx++; umgedreht = false; zeige(); });
        nb.focus();
      }

      el.querySelector('#check').addEventListener('click', function () { auswerten(false); });
      el.querySelector('#skip').addEventListener('click', function () { auswerten(true); });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') auswerten(false); });
      input.focus();
    }

    // ---- Klassischer Karten-Modus (Einstellung „Karteikarte") ----
    function zeigeKarte(schritt, meta) {
      var k = schritt.k.karte;
      var vorder = !umgedreht;
      el.innerHTML =
        '<div class="qmeta">' + meta + ' · Vokabel</div>' +
        '<div class="flashcard" id="card">' +
          '<div class="side-label">' + (vorder ? 'Deutsch – tippen zum Umdrehen' : 'Englisch') + '</div>' +
          '<div class="word">' + (vorder ? k.de : k.en) + '</div>' +
          (!vorder && k.hinweis ? '<div class="hint">💡 ' + k.hinweis + '</div>' : '') +
          (!vorder ? '<button class="speakbtn" id="speak" aria-label="Vorlesen">🔊</button>' : '') +
        '</div>' +
        (umgedreht
          ? '<div class="answerbtns">' +
            '<button class="btn bad" id="no">✗ Nicht gewusst</button>' +
            '<button class="btn ok" id="yes">✓ Gewusst</button></div>'
          : '<button class="btn big ghost" id="flip">Antwort zeigen</button>');

      if (!umgedreht) {
        var flip = function () { umgedreht = true; zeige(); };
        el.querySelector('#card').addEventListener('click', flip);
        el.querySelector('#flip').addEventListener('click', flip);
      } else {
        var sp = el.querySelector('#speak');
        if (sp) sp.addEventListener('click', function (ev) { ev.stopPropagation(); Speech.speak(k.en); });
        el.querySelector('#yes').addEventListener('click', function () {
          SRS.bewerten(k.id, true); punkte++; voll++; idx++; umgedreht = false; zeige();
        });
        el.querySelector('#no').addEventListener('click', function () {
          SRS.bewerten(k.id, false); idx++; umgedreht = false; zeige();
        });
      }
    }

    zeige();
  };
  Router.register('einheit', Views.session);
})();
