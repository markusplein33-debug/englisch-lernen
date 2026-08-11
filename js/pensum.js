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

  // Gemischte Session: fällige Karten (bevorzugt) + Grammatikübungen aus schwachen Lektionen.
  function baueSession() {
    var p = Store.load().pensum;
    var s = Store.load();

    var karten = SRS.faellig(null, p.vokabeln);
    if (karten.length < p.vokabeln) {
      // Auffüllen mit zufälligen neuen Karten
      var vorhandene = {};
      karten.forEach(function (k) { vorhandene[k.karte.id] = true; });
      var rest = Quiz.mischen(APP_DATA.alleKarten().filter(function (k) {
        return !vorhandene[k.karte.id];
      })).slice(0, p.vokabeln - karten.length);
      karten = karten.concat(rest);
    }

    // Grammatik: Übungen aus Lektionen mit höchster Fehlerquote, sonst zufällig.
    var uebungen = [];
    var lektionen = APP_DATA.lessons.slice();
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

  return { faelligeEinheiten: faelligeEinheiten, baueSession: baueSession,
           einheitErledigt: einheitErledigt, naechsteFaelligkeit: naechsteFaelligkeit,
           fehlerquote: fehlerquote };
})();
