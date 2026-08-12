// Quiz: Themenliste (handgeschriebene Quizze + pro Deck generiert) und 10-Fragen-Runde.
(function () {

  function themen(el) {
    Router.setTitle('Quiz');
    var s = Store.load();
    var alle = APP_DATA.sichtbareDecks();
    var basis = alle.filter(function (d) { return APP_DATA.istBasis(d); });
    var erweiterungen = alle.filter(function (d) { return !APP_DATA.istBasis(d); });
    var getrennt = APP_DATA.paketModus() === 'einzeln' && erweiterungen.length > 0;
    var html = '<div class="list">';
    APP_DATA.sichtbareQuizzes().forEach(function (q) {
      var st = s.quiz['thema-' + q.id];
      html += zeile('thema-' + q.id, q.emoji || '🧳', q.titel, q.fragen.length + ' Fragen', st);
    });
    (getrennt ? basis : alle).forEach(function (d) {
      var st = s.quiz['deck-' + d.id];
      html += zeile('deck-' + d.id, d.emoji, d.titel, 'Vokabel-Quiz', st);
    });
    html += '</div>';
    if (getrennt) {
      html += '<h2 class="sect">🧩 Erweiterungen</h2><div class="list">';
      erweiterungen.forEach(function (d) {
        var st = s.quiz['deck-' + d.id];
        html += zeile('deck-' + d.id, d.emoji, d.titel, 'Vokabel-Quiz', st);
      });
      html += '</div>';
    }
    el.innerHTML = html;
    el.querySelectorAll('[data-quiz]').forEach(function (r) {
      r.addEventListener('click', function () {
        location.hash = '#/quiz/' + r.getAttribute('data-quiz');
      });
    });
  }

  function zeile(id, emoji, titel, sub, st) {
    var extra = st ? ' · Beste: ' + st.beste + '% · Zuletzt: ' + st.letzte + '%' : '';
    return '<div class="rowcard" data-quiz="' + id + '"><span class="emoji">' + emoji + '</span>' +
      '<div class="grow"><h3>' + titel + '</h3><small>' + sub + extra + '</small></div>' +
      '<span class="chev">›</span></div>';
  }

  function runde(el, themaId) {
    var fragen;
    var titel = 'Quiz';
    if (themaId.indexOf('thema-') === 0) {
      var qid = themaId.slice(6);
      fragen = Quiz.themenRunde(qid, 10);
      var q = APP_DATA.quizzes.filter(function (x) { return x.id === qid; })[0];
      if (q) titel = q.titel;
    } else {
      var deckId = themaId.slice(5);
      fragen = Quiz.deckRunde(deckId, 10);
      var d = APP_DATA.decks.filter(function (x) { return x.id === deckId; })[0];
      if (d) titel = d.titel;
    }
    Router.setTitle('❓ ' + titel);
    if (!fragen.length) { location.hash = '#/quiz'; return; }

    var idx = 0, richtig = 0, falsche = [];

    function zeige() {
      if (idx >= fragen.length) {
        var prozent = Math.round(100 * richtig / fragen.length);
        Quiz.ergebnis(themaId, richtig, fragen.length, falsche.map(function (f) { return f.id; }));
        var emoji = prozent >= 90 ? '🏆' : prozent >= 70 ? '🎉' : prozent >= 50 ? '💪' : '📚';
        el.innerHTML = '<div class="center statcard"><div class="result-big">' + emoji + '</div>' +
          '<h2>' + richtig + ' von ' + fragen.length + ' richtig (' + prozent + '%)</h2>' +
          '<button class="btn big" id="again">Noch eine Runde</button>' +
          '<button class="btn ghost big" id="back">Zur Themenliste</button></div>';
        el.querySelector('#again').addEventListener('click', function () { Router.render(); });
        el.querySelector('#back').addEventListener('click', function () { location.hash = '#/quiz'; });
        return;
      }
      var f = fragen[idx];
      var html = '<div class="qmeta">Frage ' + (idx + 1) + ' / ' + fragen.length +
        ' · Richtig: ' + richtig + '</div>' +
        '<h2 style="font-size:18px">' + f.frage + '</h2>';
      f.optionen.forEach(function (o, i) {
        html += '<button class="q-option" data-i="' + i + '">' + o + '</button>';
      });
      html += '<div id="feedback"></div>';
      el.innerHTML = html;
      var beantwortet = false;
      el.querySelectorAll('.q-option').forEach(function (b) {
        b.addEventListener('click', function () {
          if (beantwortet) return;
          beantwortet = true;
          var i = parseInt(b.getAttribute('data-i'), 10);
          var ok = i === f.richtig;
          el.querySelectorAll('.q-option')[f.richtig].classList.add('correct');
          if (!ok) b.classList.add('wrong');
          if (ok) richtig++; else falsche.push(f);
          if (f.kartenId) SRS.bewerten(f.kartenId, ok);
          if (f.sprich) Speech.speak(f.sprich);
          var fb = '<div class="explain">' + (ok ? '✅ Richtig! ' : '❌ ') +
            (f.erklaerung || '') + '</div>' +
            '<button class="btn big" id="next">Weiter →</button>';
          el.querySelector('#feedback').innerHTML = fb;
          el.querySelector('#next').addEventListener('click', function () { idx++; zeige(); });
        });
      });
    }
    zeige();
  }

  Views.quizview = function (el, arg) {
    if (arg) runde(el, arg); else themen(el);
  };
  Router.register('quiz', Views.quizview);
})();
