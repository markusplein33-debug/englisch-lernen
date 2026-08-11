// Leitner-System mit 5 Boxen. Intervalle in Tagen pro Box.
window.SRS = (function () {
  var INTERVALLE = [0, 1, 3, 7, 14]; // Box 1..5 -> Tage bis zur nächsten Wiederholung

  function eintrag(id) {
    var s = Store.load();
    if (!s.srs[id]) s.srs[id] = { box: 1, due: 0, fehler: 0, richtig: 0 };
    return s.srs[id];
  }

  // Karte bewerten: ok=true -> Box hoch, sonst zurück in Box 1.
  function bewerten(id, ok) {
    var e = eintrag(id);
    if (ok) {
      e.box = Math.min(5, e.box + 1);
      e.richtig++;
    } else {
      e.box = 1;
      e.fehler++;
    }
    var tage = INTERVALLE[e.box - 1];
    e.due = Date.now() + tage * 24 * 60 * 60 * 1000;
    Store.save();
    return e;
  }

  // Teilweise richtig: Box bleibt, Wiedervorlage in ~4 Stunden.
  function bewertenTeil(id) {
    var e = eintrag(id);
    e.due = Date.now() + 4 * 60 * 60 * 1000;
    Store.save();
    return e;
  }

  // Fällige Karten (optional auf ein Deck begrenzt), schwerste zuerst.
  function faellig(deckId, limit) {
    var s = Store.load();
    var jetzt = Date.now();
    var karten = APP_DATA.alleKarten().filter(function (k) {
      if (deckId && k.deck !== deckId) return false;
      var e = s.srs[k.karte.id];
      return !e || e.due <= jetzt;
    });
    karten.sort(function (a, b) {
      var ea = s.srs[a.karte.id] || { box: 0, fehler: 0 };
      var eb = s.srs[b.karte.id] || { box: 0, fehler: 0 };
      if (ea.box !== eb.box) return ea.box - eb.box;
      return eb.fehler - ea.fehler;
    });
    return limit ? karten.slice(0, limit) : karten;
  }

  // Boxen-Verteilung eines Decks: [neu, box1..box5]-Zähler
  function verteilung(deckId) {
    var s = Store.load();
    var deck = null;
    for (var i = 0; i < APP_DATA.decks.length; i++) {
      if (APP_DATA.decks[i].id === deckId) { deck = APP_DATA.decks[i]; break; }
    }
    var v = { neu: 0, boxen: [0, 0, 0, 0, 0] };
    if (!deck) return v;
    deck.karten.forEach(function (k) {
      var e = s.srs[k.id];
      if (!e) v.neu++;
      else v.boxen[e.box - 1]++;
    });
    return v;
  }

  // Karten mit den meisten Fehlern (global)
  function schwerste(limit) {
    var s = Store.load();
    var list = Object.keys(s.srs).map(function (id) {
      return { id: id, fehler: s.srs[id].fehler, box: s.srs[id].box };
    }).filter(function (x) { return x.fehler > 0; });
    list.sort(function (a, b) { return b.fehler - a.fehler; });
    return list.slice(0, limit || 10);
  }

  return { bewerten: bewerten, bewertenTeil: bewertenTeil, faellig: faellig, verteilung: verteilung, schwerste: schwerste, INTERVALLE: INTERVALLE };
})();
