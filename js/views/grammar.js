// Grammatik: Lektionsliste, Lektionstext, Übungen (MC + Lückentext).
(function () {

  function liste(el) {
    Router.setTitle('Grammatik & Zeitformen');
    var s = Store.load();
    var html = '<div class="list">';
    APP_DATA.lessons.forEach(function (l) {
      var g = s.grammatik[l.id] || { geloest: {} };
      var geloest = Object.keys(g.geloest || {}).length;
      var quote = Pensum.fehlerquote(l.id);
      var schwer = geloest > 2 && quote > 0.35;
      html += '<div class="rowcard' + (schwer ? ' difficult' : '') + '" data-lektion="' + l.id + '">' +
        '<span class="emoji">' + (g.fertig ? '✅' : '📖') + '</span>' +
        '<div class="grow"><h3>' + l.reihenfolge + '. ' + l.titel + '</h3>' +
        '<small>' + geloest + ' / ' + l.uebungen.length + ' Übungen gelöst' +
        (schwer ? ' · noch schwierig' : '') + '</small>' +
        '<div class="progressbar"><i style="width:' + Math.round(100 * geloest / l.uebungen.length) +
        '%;background:' + (schwer ? 'var(--bad)' : 'var(--ok)') + '"></i></div>' +
        '</div><span class="chev">›</span></div>';
    });
    html += '</div>';
    el.innerHTML = html;
    el.querySelectorAll('[data-lektion]').forEach(function (r) {
      r.addEventListener('click', function () {
        location.hash = '#/grammatik/' + r.getAttribute('data-lektion');
      });
    });
  }

  function lektion(el, id) {
    var l = APP_DATA.lessons.filter(function (x) { return x.id === id; })[0];
    if (!l) { location.hash = '#/grammatik'; return; }
    Router.setTitle('📖 ' + l.titel);
    var html = '';
    l.lektion.forEach(function (abschnitt) {
      html += '<div class="lesson-section"><h3>' + abschnitt.ueberschrift + '</h3>' +
        '<p>' + abschnitt.text + '</p>';
      (abschnitt.beispiele || []).forEach(function (b) {
        html += '<div class="example"><span class="en">' + b.en +
          ' <button class="iconbtn" style="color:var(--accent2);min-height:24px" data-speak="' +
          b.en.replace(/"/g, '&quot;') + '">🔊</button></span>' +
          '<span class="de">' + b.de + '</span></div>';
      });
      html += '</div>';
    });
    html += '<button class="btn big" id="ueben">Übungen starten (' + l.uebungen.length + ')</button>';
    el.innerHTML = html;
    el.querySelectorAll('[data-speak]').forEach(function (b) {
      b.addEventListener('click', function () { Speech.speak(b.getAttribute('data-speak')); });
    });
    el.querySelector('#ueben').addEventListener('click', function () {
      uebungen(el, l);
    });
  }

  // Übungsrunde einer Lektion; nutzt GrammarUI.frage für die Einzelübung.
  function uebungen(el, l) {
    var liste = Quiz.mischen(l.uebungen);
    var idx = 0, richtig = 0;

    function zeige() {
      if (idx >= liste.length) {
        var s = Store.load();
        if (!s.grammatik[l.id]) s.grammatik[l.id] = { geloest: {}, fehler: {}, fertig: false };
        if (Object.keys(s.grammatik[l.id].geloest).length >= l.uebungen.length) {
          s.grammatik[l.id].fertig = true;
        }
        Store.save();
        var prozent = Math.round(100 * richtig / liste.length);
        el.innerHTML = '<div class="center statcard"><div class="result-big">' +
          (prozent >= 80 ? '🏆' : '💪') + '</div>' +
          '<h2>' + richtig + ' von ' + liste.length + ' richtig</h2>' +
          '<button class="btn big" id="again">Nochmal üben</button>' +
          '<button class="btn ghost big" id="back">Zur Lektion</button></div>';
        el.querySelector('#again').addEventListener('click', function () { uebungen(el, l); });
        el.querySelector('#back').addEventListener('click', function () { Router.render(); });
        return;
      }
      GrammarUI.frage(el, l, liste[idx],
        'Übung ' + (idx + 1) + ' / ' + liste.length,
        function (erg) { if (erg === 'richtig' || erg === 'teil') richtig++; idx++; zeige(); });
    }
    zeige();
  }

  // Wiederverwendbare Einzelübung (auch für Pensum-Session genutzt)
  window.GrammarUI = {
    frage: function (el, l, u, meta, done) {
      var html = '<div class="qmeta">' + meta + ' · ' + l.titel + '</div>' +
        '<h2 style="font-size:19px">' + u.frage + '</h2>';
      if (u.typ === 'mc') {
        u.optionen.forEach(function (o, i) {
          html += '<button class="q-option" data-i="' + i + '">' + o + '</button>';
        });
      } else {
        html += '<input class="gap" id="gap" autocapitalize="off" autocorrect="off" ' +
          'autocomplete="off" placeholder="Antwort eintippen …">' +
          '<button class="btn big" id="check">Prüfen</button>';
      }
      html += '<div id="feedback"></div>';
      el.innerHTML = html;

      function verbuchen(erg) {
        var s = Store.load();
        if (!s.grammatik[l.id]) s.grammatik[l.id] = { geloest: {}, fehler: {}, fertig: false };
        if (erg === 'richtig' || erg === 'teil') s.grammatik[l.id].geloest[u.id] = true;
        else s.grammatik[l.id].fehler[u.id] = (s.grammatik[l.id].fehler[u.id] || 0) + 1;
        Store.save();
      }
      function feedback(erg, richtigText) {
        verbuchen(erg);
        var text;
        if (erg === 'richtig') text = '✅ Richtig! ';
        else if (erg === 'teil') text = '🟡 Fast! Kleiner Rechtschreibfehler – richtig: „' + richtigText + '“. ';
        else text = '❌ Richtig wäre: „' + richtigText + '“. ';
        el.querySelector('#feedback').innerHTML =
          '<div class="explain">' + text + (u.erklaerung || '') + '</div>' +
          '<button class="btn big" id="next">Weiter →</button>';
        el.querySelector('#next').addEventListener('click', function () { done(erg); });
      }

      if (u.typ === 'mc') {
        var beantwortet = false;
        el.querySelectorAll('.q-option').forEach(function (b) {
          b.addEventListener('click', function () {
            if (beantwortet) return;
            beantwortet = true;
            var i = parseInt(b.getAttribute('data-i'), 10);
            var ok = i === u.richtig;
            el.querySelectorAll('.q-option')[u.richtig].classList.add('correct');
            if (!ok) b.classList.add('wrong');
            feedback(ok ? 'richtig' : 'falsch', u.optionen[u.richtig]);
          });
        });
      } else {
        var input = el.querySelector('#gap');
        function pruefe() {
          var stufe = Grading.bewerte(input.value, u.antwort[0], u.antwort.slice(1));
          // Bei Lückentexten zählt „sinngemäß" nicht – nur exakt oder Tippfehler.
          var erg = stufe === 'richtig' ? 'richtig' : stufe === 'schreib' ? 'teil' : 'falsch';
          feedback(erg, u.antwort[0]);
        }
        el.querySelector('#check').addEventListener('click', pruefe);
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') pruefe(); });
        input.focus();
      }
    }
  };

  Views.grammar = function (el, arg) {
    if (arg) lektion(el, arg); else liste(el);
  };
  Router.register('grammatik', Views.grammar);
})();
