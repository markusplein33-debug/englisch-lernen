// Zentraler App-Zustand in localStorage (ein Schlüssel), mit Debounce-Speichern.
window.Store = (function () {
  var KEY = 'englisch-app-v1';
  var saveTimer = null;

  var defaults = function () {
    return {
      version: 1,
      srs: {},          // kartenId -> { box: 1..5, due: ts, fehler: n, richtig: n }
      quiz: {},         // themaId -> { gespielt: n, beste: n, letzte: n, fragenFalsch: {frageId: n} }
      grammatik: {},    // lektionId -> { geloest: {uebungId: true}, fehler: {uebungId: n}, fertig: bool }
      streak: {},       // 'YYYY-MM-DD' -> Anzahl erledigter Einheiten
      letzteLektion: 0, // Timestamp der zuletzt abgeschlossenen Lern-Einheit
      pensum: {
        intervallMin: 120,   // 0 = aus
        vokabeln: 10,
        grammatik: 2,
        ruheVon: 21,         // Stunde
        ruheBis: 8,
        letzteEinheit: 0,    // Timestamp
        themen: 'zufall',    // 'zufall' | 'zufallsdeck' | Array von Deck-IDs
        icsSeq: 0            // steigende SEQUENCE, damit neue Exporte alte Termine ersetzen
      },
      einstellungen: { stimme: 'auto', tempo: 0.9, antwortmodus: 'tippen' },
      pakete: { aktiv: [], modus: 'ergaenzen' }
    };
  };

  var state = null;

  function load() {
    if (state) return state;
    try {
      var raw = localStorage.getItem(KEY);
      state = raw ? JSON.parse(raw) : defaults();
    } catch (e) { state = defaults(); }
    // fehlende Felder ergänzen (Migrationen)
    var d = defaults();
    Object.keys(d).forEach(function (k) { if (state[k] === undefined) state[k] = d[k]; });
    Object.keys(d.pensum).forEach(function (k) {
      if (state.pensum[k] === undefined) state.pensum[k] = d.pensum[k];
    });
    Object.keys(d.einstellungen).forEach(function (k) {
      if (state.einstellungen[k] === undefined) state.einstellungen[k] = d.einstellungen[k];
    });
    if (!state.pakete) state.pakete = d.pakete;
    if (!Array.isArray(state.pakete.aktiv)) state.pakete.aktiv = [];
    if (!state.pakete.modus) state.pakete.modus = 'ergaenzen';
    return state;
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    }, 150);
  }

  function heute() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function exportJson() { return JSON.stringify(load()); }
  function importJson(text) {
    var obj = JSON.parse(text);
    if (!obj || obj.version !== 1) throw new Error('Ungültiges Backup');
    state = obj; save();
  }

  return { load: load, save: save, heute: heute, exportJson: exportJson, importJson: importJson, KEY: KEY };
})();
