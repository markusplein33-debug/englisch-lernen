// Quiz-Logik: handgeschriebene Fragen + automatisch generierte Fragen aus den Decks.
window.Quiz = (function () {

  function mischen(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Generiert eine MC-Frage zu einer Karte: DE -> richtige EN-Antwort + 3 Distraktoren.
  function generiereFrage(deck, karte) {
    var pool = deck.karten.filter(function (k) {
      return k.id !== karte.id && k.typ === karte.typ;
    });
    if (pool.length < 3) {
      pool = deck.karten.filter(function (k) { return k.id !== karte.id; });
    }
    var distraktoren = mischen(pool).slice(0, 3).map(function (k) { return k.en; });
    var optionen = mischen([karte.en].concat(distraktoren));
    return {
      id: 'gen-' + karte.id,
      frage: 'Was heißt auf Englisch: „' + karte.de + '“?',
      optionen: optionen,
      richtig: optionen.indexOf(karte.en),
      erklaerung: karte.en + ' = ' + karte.de + (karte.hinweis ? ' (' + karte.hinweis + ')' : ''),
      kartenId: karte.id,
      sprich: karte.en
    };
  }

  // Runde aus einem Deck (n generierte Fragen)
  function deckRunde(deckId, n) {
    var deck = APP_DATA.decks.filter(function (d) { return d.id === deckId; })[0];
    if (!deck) return [];
    return mischen(deck.karten).slice(0, n || 10).map(function (k) {
      return generiereFrage(deck, k);
    });
  }

  // Runde aus handgeschriebenem Quiz
  function themenRunde(quizId, n) {
    var q = APP_DATA.quizzes.filter(function (x) { return x.id === quizId; })[0];
    if (!q) return [];
    return mischen(q.fragen).slice(0, n || 10);
  }

  // Ergebnis eines Themas speichern
  function ergebnis(themaId, richtig, gesamt, falscheIds) {
    var s = Store.load();
    if (!s.quiz[themaId]) s.quiz[themaId] = { gespielt: 0, beste: 0, letzte: 0, fragenFalsch: {} };
    var st = s.quiz[themaId];
    st.gespielt++;
    var prozent = Math.round(100 * richtig / gesamt);
    st.letzte = prozent;
    if (prozent > st.beste) st.beste = prozent;
    (falscheIds || []).forEach(function (id) {
      st.fragenFalsch[id] = (st.fragenFalsch[id] || 0) + 1;
    });
    Store.save();
    return st;
  }

  return { deckRunde: deckRunde, themenRunde: themenRunde, ergebnis: ergebnis,
           generiereFrage: generiereFrage, mischen: mischen };
})();
