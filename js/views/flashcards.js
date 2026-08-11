// Karteikarten: Deckliste + Lernmodus (Karte drehen, Gewusst / Nicht gewusst).
(function () {

  function deckListe(el) {
    Router.setTitle('Karteikarten');
    var html = '<div class="list">';
    APP_DATA.decks.forEach(function (d) {
      var v = SRS.verteilung(d.id);
      var gesamt = d.karten.length;
      var due = SRS.faellig(d.id).length;
      html += '<div class="rowcard" data-deck="' + d.id + '">' +
        '<span class="emoji">' + d.emoji + '</span>' +
        '<div class="grow"><h3>' + d.titel + '</h3>' +
        '<small>' + gesamt + ' Karten · ' + due + ' fällig</small>' +
        balken(v, gesamt) + '</div><span class="chev">›</span></div>';
    });
    html += '</div>';
    el.innerHTML = html;
    el.querySelectorAll('[data-deck]').forEach(function (r) {
      r.addEventListener('click', function () {
        location.hash = '#/karten/' + r.getAttribute('data-deck');
      });
    });
  }

  function balken(v, gesamt) {
    if (!gesamt) return '';
    var farben = ['var(--box1)', 'var(--box2)', 'var(--box3)', 'var(--box4)', 'var(--box5)'];
    var html = '<div class="progressbar">';
    for (var i = 0; i < 5; i++) {
      var w = Math.round(100 * v.boxen[i] / gesamt);
      if (w) html += '<i style="width:' + w + '%;background:' + farben[i] + '"></i>';
    }
    var wneu = Math.round(100 * v.neu / gesamt);
    if (wneu) html += '<i style="width:' + wneu + '%;background:var(--line)"></i>';
    return html + '</div>';
  }

  function lernen(el, deckId) {
    var deck = APP_DATA.decks.filter(function (d) { return d.id === deckId; })[0];
    if (!deck) { location.hash = '#/karten'; return; }
    Router.setTitle(deck.emoji + ' ' + deck.titel);

    var stapel = SRS.faellig(deckId, 20);
    if (!stapel.length) {
      el.innerHTML = '<div class="banner done"><h2>✅ Alles gelernt!</h2>' +
        '<p>In diesem Deck ist gerade keine Karte fällig. Schau später wieder vorbei ' +
        'oder wiederhole trotzdem ein paar Karten.</p>' +
        '<button class="btn light" id="extra">20 Karten wiederholen</button></div>';
      el.querySelector('#extra').addEventListener('click', function () {
        stapel = Quiz.mischen(deck.karten).slice(0, 20).map(function (k) {
          return { deck: deckId, karte: k };
        });
        starte(el, deck, stapel);
      });
      return;
    }
    starte(el, deck, stapel);
  }

  function starte(el, deck, stapel) {
    var idx = 0, umgedreht = false, richtig = 0;

    function zeige() {
      if (idx >= stapel.length) {
        el.innerHTML = '<div class="center statcard"><div class="result-big">🎉</div>' +
          '<h2>Runde geschafft!</h2><p>' + richtig + ' von ' + stapel.length + ' gewusst.</p>' +
          '<button class="btn big" id="again">Weiterlernen</button>' +
          '<button class="btn ghost big" id="back">Zur Deckliste</button></div>';
        el.querySelector('#again').addEventListener('click', function () { Router.render(); });
        el.querySelector('#back').addEventListener('click', function () { location.hash = '#/karten'; });
        return;
      }
      var k = stapel[idx].karte;
      var e = Store.load().srs[k.id];
      var boxInfo = e ? 'Box ' + e.box + '/5' : 'Neu';
      var vorder = !umgedreht;
      el.innerHTML =
        '<div class="qmeta">Karte ' + (idx + 1) + ' / ' + stapel.length + ' · ' + boxInfo + '</div>' +
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

      var card = el.querySelector('#card');
      function flip() { umgedreht = true; zeige(); }
      if (!umgedreht) {
        card.addEventListener('click', flip);
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
  }

  Views.flashcards = function (el, arg) {
    if (arg) lernen(el, arg); else deckListe(el);
  };
  Router.register('karten', Views.flashcards);
})();
