// Gemischte Pensum-Einheit: X Vokabeln (Karteikarten-Stil) + Y Grammatikfragen.
(function () {
  Views.session = function (el) {
    Router.setTitle('📚 Lern-Einheit');
    var sess = Pensum.baueSession();
    var schritte = sess.karten.map(function (k) { return { art: 'karte', k: k }; })
      .concat(sess.uebungen.map(function (u) { return { art: 'grammatik', u: u }; }));
    if (!schritte.length) { location.hash = '#/'; return; }

    var idx = 0, richtig = 0, umgedreht = false;

    function zeige() {
      if (idx >= schritte.length) {
        Pensum.einheitErledigt();
        var uebrig = Pensum.faelligeEinheiten();
        el.innerHTML = '<div class="center statcard"><div class="result-big">🎉</div>' +
          '<h2>Einheit geschafft!</h2>' +
          '<p>' + richtig + ' von ' + schritte.length + ' richtig.</p>' +
          (uebrig > 0
            ? '<p class="note">Noch ' + uebrig + ' Einheit' + (uebrig === 1 ? '' : 'en') + ' fällig.</p>' +
              '<button class="btn big" id="more">Nächste Einheit →</button>'
            : '<p class="note">Pensum erfüllt – stark! 💪</p>') +
          '<button class="btn ghost big" id="home">Zum Start</button></div>';
        var more = el.querySelector('#more');
        if (more) more.addEventListener('click', function () { Router.render(); });
        el.querySelector('#home').addEventListener('click', function () { location.hash = '#/'; });
        return;
      }
      var schritt = schritte[idx];
      var meta = 'Schritt ' + (idx + 1) + ' / ' + schritte.length;

      if (schritt.art === 'grammatik') {
        GrammarUI.frage(el, schritt.u.lektion, schritt.u.uebung, meta,
          function (ok) { if (ok) richtig++; idx++; zeige(); });
        return;
      }

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
        function flip() { umgedreht = true; zeige(); }
        el.querySelector('#card').addEventListener('click', flip);
        el.querySelector('#flip').addEventListener('click', flip);
      } else {
        var sp = el.querySelector('#speak');
        if (sp) sp.addEventListener('click', function (ev) { ev.stopPropagation(); Speech.speak(k.en); });
        el.querySelector('#yes').addEventListener('click', function () {
          SRS.bewerten(k.id, true); richtig++; idx++; umgedreht = false; zeige();
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
