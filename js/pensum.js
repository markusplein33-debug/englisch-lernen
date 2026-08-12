// Lernpensum: berechnet fällige Einheiten und stellt gemischte Sessions zusammen.
window.Pensum = (function () {

  function inRuhezeit(d) {
    var p = Store.load().pensum;
    var h = d.getHours();
    if (p.ruheVon === p.ruheBis) return false;
    if (p.ruheVon < p.ruheBis) return h >= p.ruheVon && h < p.ruheBis;
    return h >= p.ruheVon || h < p.ruheBis; // über Mitternacht, z. B. 21–8
  }

  // Wie viele Einheiten sind seit letzteEinheit fällig? (max. 5 angezeigt)
  function faelligeEinheiten() {
    var p = Store.load().pensum;
    if (!p.intervallMin) return 0;
    var basis = p.letzteEinheit || (Date.now() - p.intervallMin * 60000);
    var n = 0;
    var t = basis + p.intervallMin * 60000;
    while (t <= Date.now() && n < 5) {
      if (!inRuhezeit(new Date(t))) n++;
      t += p.intervallMin * 60000;
    }
    return n;
  }

  function naechsteFaelligkeit() {
    var p = Store.load().pensum;
    if (!p.intervallMin) return null;
    var basis = p.letzteEinheit || Date.now();
    return new Date(basis + p.intervallMin * 60000);
  }

  // Deck-Auswahl laut Einstellung pensum.themen und Paket-Modus:
  // 'ergaenzen' -> Basis + aktivierte Erweiterungen im Pool,
  // 'einzeln'   -> automatischer Pool nur Basis (explizite Themenwahl darf mehr).
  function poolDecks() {
    var sichtbar = APP_DATA.sichtbareDecks();
    if (APP_DATA.paketModus() === 'einzeln') {
      sichtbar = sichtbar.filter(function (d) { return APP_DATA.istBasis(d); });
    }
    return sichtbar.map(function (d) { return d.id; });
  }
  function aktiveDecks() {
    var t = Store.load().pensum.themen || 'zufall';
    var pool = poolDecks();
    var sichtbar = APP_DATA.sichtbareDecks().map(function (d) { return d.id; });
    if (t === 'zufall') return pool;
    if (t === 'zufallsdeck') {
      return [pool[Math.floor(Math.random() * pool.length)]];
    }
    if (Array.isArray(t) && t.length) {
      var gewaehlt = t.filter(function (id) { return sichtbar.indexOf(id) >= 0; });
      return gewaehlt.length ? gewaehlt : pool;
    }
    return pool;
  }

  // Gemischte Session: fällige Karten (bevorzugt) + Grammatikübungen aus schwachen Lektionen.
  function baueSession() {
    var p = Store.load().pensum;
    var s = Store.load();
    var decks = aktiveDecks();
    var imThema = function (k) { return decks.indexOf(k.deck) >= 0; };

    var karten = SRS.faellig(null).filter(imThema).slice(0, p.vokabeln);
    if (karten.length < p.vokabeln) {
      // Auffüllen mit zufälligen weiteren Karten aus den gewählten Themen
      var vorhandene = {};
      karten.forEach(function (k) { vorhandene[k.karte.id] = true; });
      var rest = Quiz.mischen(APP_DATA.alleKarten().filter(function (k) {
        return imThema(k) && !vorhandene[k.karte.id];
      })).slice(0, p.vokabeln - karten.length);
      karten = karten.concat(rest);
    }
    karten = Quiz.mischen(karten);

    // Grammatik: Übungen aus Lektionen mit höchster Fehlerquote, sonst zufällig.
    var uebungen = [];
    var lektionen = APP_DATA.sichtbareLessons().slice();
    if (APP_DATA.paketModus() === 'einzeln') {
      lektionen = lektionen.filter(function (l) { return APP_DATA.istBasis(l); });
    }
    lektionen.sort(function (a, b) {
      return fehlerquote(b.id) - fehlerquote(a.id);
    });
    for (var i = 0; i < lektionen.length && uebungen.length < p.grammatik; i++) {
      var l = lektionen[i];
      var kandidaten = Quiz.mischen(l.uebungen);
      for (var j = 0; j < kandidaten.length && uebungen.length < p.grammatik; j++) {
        uebungen.push({ lektion: l, uebung: kandidaten[j] });
      }
    }
    return { karten: karten, uebungen: uebungen };
  }

  function fehlerquote(lektionId) {
    var g = Store.load().grammatik[lektionId];
    if (!g) return 0.5; // unbekannt = mittel, damit Neues drankommt
    var fehler = 0, versuche = 0;
    Object.keys(g.fehler || {}).forEach(function (k) { fehler += g.fehler[k]; });
    versuche = Object.keys(g.geloest || {}).length + fehler;
    if (!versuche) return 0.5;
    return fehler / versuche;
  }

  // Einheit als erledigt verbuchen (Streak + Zeitstempel)
  function einheitErledigt() {
    var s = Store.load();
    s.pensum.letzteEinheit = Date.now();
    var tag = Store.heute();
    s.streak[tag] = (s.streak[tag] || 0) + 1;
    Store.save();
  }

  return { faelligeEinheiten: faelligeEinheiten, baueSession: baueSession, aktiveDecks: aktiveDecks,
           einheitErledigt: einheitErledigt, naechsteFaelligkeit: naechsteFaelligkeit,
           fehlerquote: fehlerquote };
})();
